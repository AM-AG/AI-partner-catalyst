import { useCallback, useRef, useState, useEffect } from 'react';
import { LiveServerMessage, Modality } from '@google/genai';
import { Attachment, Message } from '../types/types';
import { createBlob, base64ToUint8Array, decode, decodeAudioData } from '../utils/audio-utils';
import { ai } from '../services/aiClient';
import { useAuth } from './useAuth';
import ChatHistory from '../src/components/ChatHistory';
import type { ElevenLabsWebSocketEvent } from '../types/websocket';

const BILL_INTERVAL_MS = 10 * 60 * 1000;
const COST_AIVoice_PER_INTERVAL = 40;

// ---- Playback tuning ----
const MAX_LOOKAHEAD = 0.06; // 60ms
const RMS_THRESHOLD = 0.004;

// ---- Time formatter ----
function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  }

  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function useLiveSession(onUpdateCredits: (amount: number) => void) {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] =
    useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const [transcripts, setTranscripts] = useState<
    { role: 'user' | 'model'; text: string }[]
  >([]);

  // ---- CHRONOMETER ----
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const sessionStartRef = useRef<number | null>(null);
  const chronoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ---- SESSION ----
  const sessionRef = useRef<any>(null);
  const sessionReadyRef = useRef(false);
  const startingRef = useRef(false);
  const stoppingRef = useRef(false);
  const abortedRef = useRef(false);

  const billingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const auth = useAuth();

  // ---- AUDIO ----
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const nextPlayTimeRef = useRef(0);

  // ---- PCM batching ----
  const pcmQueueRef = useRef<Float32Array[]>([]);

  // ---- TRANSCRIPTS ----
  const inputTextRef = useRef('');
  const outputTextRef = useRef('');

  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const transcriptRef = useRef({ user: '', assistant: '' });
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const WORKLET_CODE = `
  class RecorderProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      if (input && input.length > 0 && input[0].length > 0) {
        const channelData = input[0];
        this.port.postMessage(channelData);
      }
      return true;
    }
  }
  registerProcessor('recorder-worklet', RecorderProcessor);
  `;

  // ============================
  // HANDLE SERVER MESSAGES
  // ============================
  const handleMessage = async (msg: LiveServerMessage) => {
    if (!outputCtxRef.current) return;
    const ctx = outputCtxRef.current;

    // ---- TRANSCRIPTS ----

    if (msg.serverContent?.outputTranscription) {
      transcriptRef.current.assistant += msg.serverContent.outputTranscription.text;
      console.log('Output transcription:', transcriptRef);
    } else if (msg.serverContent?.inputTranscription) {
      transcriptRef.current.user += msg.serverContent.inputTranscription.text;
      console.log('Input transcription:', transcriptRef);
    }
    if (msg.serverContent?.turnComplete) {
      const { user, assistant } = transcriptRef.current;
      const newMsgs: Message[] = [];
      if (user.trim()) {
        newMsgs.push({ id: `u-${Date.now()}`, role: 'user', text: user.trim(), timestamp: Date.now() });
      }
      if (assistant.trim()) {
        newMsgs.push({ id: `a-${Date.now()}`, role: 'assistant', text: assistant.trim(), timestamp: Date.now() });
      }
      if (newMsgs.length > 0) {
        setMessages(prev => [...prev, ...newMsgs]);
      }
      transcriptRef.current = { user: '', assistant: '' };
    }

    // ---- AUDIO PLAYBACK ----
    // if (ctx.state === 'suspended') {
    //   await ctx.resume();
    // }

    // for (const part of msg.serverContent?.modelTurn?.parts || []) {
    //   if (!part.inlineData?.data) continue;

    //   const pcmBytes = base64ToUint8Array(part.inlineData.data);
    //   const pcm16 = new Int16Array(pcmBytes.buffer);
    //   const float32 = new Float32Array(pcm16.length);

    //   for (let i = 0; i < pcm16.length; i++) {
    //     float32[i] = pcm16[i] / 32768;
    //   }

    //   const buffer = ctx.createBuffer(1, float32.length, 24000);
    //   buffer.copyToChannel(float32, 0);

    //   const src = ctx.createBufferSource();
    //   src.buffer = buffer;
    //   src.connect(ctx.destination);

    //   if (nextPlayTimeRef.current < ctx.currentTime) {
    //     nextPlayTimeRef.current = ctx.currentTime;
    //   }

    //   if (nextPlayTimeRef.current - ctx.currentTime > MAX_LOOKAHEAD) {
    //     nextPlayTimeRef.current = ctx.currentTime + 0.01;
    //   }

    //   src.start(nextPlayTimeRef.current);
    //   nextPlayTimeRef.current += buffer.duration;
    // }
    const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (audioData) {
      setIsAssistantSpeaking(true);
      nextPlayTimeRef.current = Math.max(nextPlayTimeRef.current, ctx.currentTime);
      const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => {
        sourcesRef.current.delete(source);
        if (sourcesRef.current.size === 0) setIsAssistantSpeaking(false);
      };

      source.start(nextPlayTimeRef.current);
      nextPlayTimeRef.current += buffer.duration;
      sourcesRef.current.add(source);
    }

    if (msg.serverContent?.interrupted) {
      // stop();
      stop_session();
    }
  };
  // ============================
  // STOP SESSION
  // ============================
  const stop_session = useCallback(() => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    abortedRef.current = true;
    startingRef.current = false;

    billingTimerRef.current && clearInterval(billingTimerRef.current);
    billingTimerRef.current = null;

    chronoIntervalRef.current && clearInterval(chronoIntervalRef.current);
    chronoIntervalRef.current = null;
    sessionStartRef.current = null;
    setElapsedSeconds(0);

    try {
      sessionRef.current?.close();
    } catch {}

    sessionRef.current = null;
    sessionReadyRef.current = false;

    workletRef.current?.disconnect();
    workletRef.current = null;

    micRef.current?.getTracks().forEach(t => t.stop());
    micRef.current = null;

    inputCtxRef.current?.close();
    outputCtxRef.current?.close();
    inputCtxRef.current = null;
    outputCtxRef.current = null;

    pcmQueueRef.current = [];

    if (workletNodeRef.current) {
      workletNodeRef.current.port.onmessage = null;
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    setIsActive(false);
    setStatus('DISCONNECTED');
    setVolume(0);

    stoppingRef.current = false;
  }, []);

  // ============================
  // START SESSION
  // ============================
  const start_session = useCallback(async () => {
    if (startingRef.current || sessionRef.current) return;

    if (auth.user.credits < COST_AIVoice_PER_INTERVAL) {
      window.alert("Please, pop up your credit balance.");
      return;
    }

    startingRef.current = true;
    abortedRef.current = false;

    let workletUrl: string | null = null;

    try {
      setError(null);
      setStatus('CONNECTING');

      /* ------------------ MIC ------------------ */
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micRef.current = stream;

      /* ---------------- AUDIO CONTEXTS ---------------- */
      inputCtxRef.current = new AudioContext({ sampleRate: 16000 });
      outputCtxRef.current = new AudioContext({ sampleRate: 24000 });

      const blob = new Blob([WORKLET_CODE], {
        type: 'application/javascript'
      });

      workletUrl = URL.createObjectURL(blob);
      await inputCtxRef.current.audioWorklet.addModule(workletUrl);

      await Promise.all([
        inputCtxRef.current.resume(),
        outputCtxRef.current.resume()
      ]);

      nextPlayTimeRef.current = 0;

      /* ---------------- LIVE SESSION ---------------- */
      let liveSession: any = null;

      liveSession = await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction:
            "You are VoxPact's AI assistant. Be concise and conversational.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' }
            }
          }
        },
        callbacks: {
          onopen: () => {
            if (abortedRef.current) return;

            sessionRef.current = liveSession;
            sessionReadyRef.current = true;
            startingRef.current = false;

            setIsActive(true);
            setStatus('CONNECTED');

            /* ---------- BILLING ---------- */
            onUpdateCredits(-COST_AIVoice_PER_INTERVAL);
            billingTimerRef.current = setInterval(
              () => onUpdateCredits(-COST_AIVoice_PER_INTERVAL),
              BILL_INTERVAL_MS
            );

            /* ---------- AUDIO GRAPH ---------- */
            const source =
              inputCtxRef.current!.createMediaStreamSource(stream);

            const workletNode = new AudioWorkletNode(
              inputCtxRef.current!,
              'recorder-worklet'
            );

            workletNodeRef.current = workletNode;

            workletNode.port.onmessage = (event) => {
              if (
                abortedRef.current ||
                !sessionRef.current ||
                !sessionReadyRef.current
              ) {
                return;
              }

              sessionRef.current.sendRealtimeInput({
                media: createBlob(event.data)
              });
            };

            source.connect(workletNode);
            workletNode.connect(inputCtxRef.current!.destination);

            /* ---------- CHRONO ---------- */
            sessionStartRef.current = Date.now();
            chronoIntervalRef.current = setInterval(() => {
              if (!sessionStartRef.current) return;
              setElapsedSeconds(
                Math.floor(
                  (Date.now() - sessionStartRef.current) / 1000
                )
              );
            }, 1000);
          },

          onmessage: handleMessage,

          onerror: () => {
            setError("Connection error. Please try again.");
            stop_session();
          },

          onclose: () => {
            stop_session();
          }
        }
      });

    } catch (e: any) {
      console.error('Failed to start live session', e);
      setError(e.message || 'Failed to start session');
      startingRef.current = false;
      stop_session();
    } finally {
      if (workletUrl) {
        URL.revokeObjectURL(workletUrl);
      }
    }
  }, [onUpdateCredits, stop_session]);

  // ============================
  // SEND ASSET
  // ============================
  const sendAsset = useCallback((asset: Attachment) => {
    if (!sessionRef.current) return;
    sessionRef.current.sendRealtimeInput({
      media: { data: asset.data, mimeType: asset.mimeType }
    });
  }, []);

  return {
    isActive,
    status,
    error,
    volume,
    messages,
    elapsedSeconds,
    formattedTime: formatTime(elapsedSeconds),
    start_session,
    stop_session,
    sendAsset
  };
}
// const sendMessage = (websocket: WebSocket, request: object) => {
//   if (websocket.readyState !== WebSocket.OPEN) return;
//   websocket.send(JSON.stringify(request));
// };

// export function useLiveSession(onUpdateCredits: (amount: number) => void) {

//   const websocketRef = useRef<WebSocket | null>(null);

//   const [isConnected, setIsConnected] = useState(false);
//   const [isActive, setIsActive] = useState(false);

//   const [status, setStatus] =
//     useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');

//   const [elapsedSeconds, setElapsedSeconds] = useState(0);

//   const sessionStartRef = useRef<number | null>(null);
//   const chronoIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   const handleAudioChunk = useCallback((audioData: string) => {
//     if (!websocketRef.current) return;

//     sendMessage(websocketRef.current, {
//       user_audio_chunk: audioData,
//     });
//   }, []);

//   const { startStreaming, stopStreaming } = useVoiceStream({
//     onAudioChunked: handleAudioChunk,
//   });

//   const startConversation = useCallback(async () => {
//     if (isConnected) return;

//     const websocket = new WebSocket(
//       "wss://api.elevenlabs.io/v1/convai/conversation"
//     );

//     websocket.onopen = async () => {

//       setIsActive(true);
//       setStatus('CONNECTED');
//       setIsConnected(true);

//       sessionStartRef.current = Date.now();

//       chronoIntervalRef.current = setInterval(() => {
//         if (!sessionStartRef.current) return;

//         setElapsedSeconds(
//           Math.floor((Date.now() - sessionStartRef.current) / 1000)
//         );

//       }, 1000);

//       sendMessage(websocket, {
//         type: "conversation_initiation_client_data",
//       });

//       await startStreaming();
//     };

//     websocket.onmessage = async (event) => {

//       const data = JSON.parse(event.data) as ElevenLabsWebSocketEvent;

//       if (data.type === "ping") {
//         setTimeout(() => {
//           sendMessage(websocket, {
//             type: "pong",
//             event_id: data.ping_event.event_id,
//           });
//         }, data.ping_event.ping_ms);
//       }

//       if (data.type === "user_transcript") {
//         console.log("User transcript",
//           data.user_transcription_event.user_transcript
//         );
//       }

//       if (data.type === "agent_response") {
//         console.log("Agent response",
//           data.agent_response_event.agent_response
//         );
//       }

//       if (data.type === "agent_response_correction") {
//         console.log("Agent response correction",
//           data.agent_response_correction_event.corrected_agent_response
//         );
//       }

//       if (data.type === "audio") {
//         const { audio_event } = data;
//         // audio playback system here
//       }
//     };

//     websocket.onclose = async () => {

//       websocketRef.current = null;

//       setIsConnected(false);
//       setIsActive(false);
//       setStatus('DISCONNECTED');

//       stopStreaming();

//       if (chronoIntervalRef.current) {
//         clearInterval(chronoIntervalRef.current);
//       }

//     };

//     websocketRef.current = websocket;

//   }, [isConnected, startStreaming, stopStreaming]);

//   const stopConversation = useCallback(() => {

//     if (!websocketRef.current) return;

//     websocketRef.current.close();

//   }, []);

//   useEffect(() => {

//     return () => {

//       if (websocketRef.current) {
//         websocketRef.current.close();
//       }

//       if (chronoIntervalRef.current) {
//         clearInterval(chronoIntervalRef.current);
//       }

//     };

//   }, []);

//   return {
//     isActive,
//     status,
//     isConnected,
//     startConversation,
//     stopConversation,
//     elapsedSeconds,
//     formattedTime: formatTime(elapsedSeconds),
//   };
// }