import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Attachment } from '../types';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audio-utils';
import {ai} from '../services/aiClient';

const BILL_INTERVAL_MS = 10 * 60 * 1000;
const COST_PER_INTERVAL = 40;

export function useLiveSession(onUpdateCredits: (amount: number) => void) {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const [transcripts, setTranscripts] = useState<
    { role: 'user' | 'model'; text: string }[]
  >([]);

  const sessionRef = useRef<any>(null);
  const billingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);

  const inputTextRef = useRef('');
  const outputTextRef = useRef('');
  const nextPlayTimeRef = useRef(0);
  const stoppingRef = useRef(false);

  const stop = useCallback(() => {
      if (stoppingRef.current) return;
      stoppingRef.current = true;

      billingTimerRef.current && clearInterval(billingTimerRef.current);
      billingTimerRef.current = null;

      try {
        if (sessionRef.current) {
          sessionRef.current.close();
        }
      } catch {}

      sessionRef.current = null;

      workletRef.current?.disconnect();
      workletRef.current = null;

      micRef.current?.getTracks().forEach(t => t.stop());
      micRef.current = null;

      if (inputCtxRef.current?.state !== 'closed') {
        inputCtxRef.current?.close();
      }
      inputCtxRef.current = null;

      if (outputCtxRef.current?.state !== 'closed') {
        outputCtxRef.current?.close();
      }
      outputCtxRef.current = null;

      setIsActive(false);
      setStatus('DISCONNECTED');
      setVolume(0);

      stoppingRef.current = false;
    }, []);

  const start = useCallback(async () => {
      try {
        setError(null);
        setStatus('CONNECTING');
        console.log('Starting live session connection');

        // --- Create audio contexts FIRST (important for autoplay policies)
        inputCtxRef.current = new AudioContext({ sampleRate: 16000 });
        outputCtxRef.current = new AudioContext({ sampleRate: 24000 });
        nextPlayTimeRef.current = 0;

        // Resume output context explicitly (Safari / Chrome safety)
        if (outputCtxRef.current.state === 'suspended') {
          await outputCtxRef.current.resume();
        }

        const session = await ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview',
          config: {
            responseModalities: [Modality.AUDIO],
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
              setIsActive(true);
              setStatus('CONNECTED');
              onUpdateCredits(-COST_PER_INTERVAL);

              billingTimerRef.current = setInterval(() => {
                onUpdateCredits(-COST_PER_INTERVAL);
              }, BILL_INTERVAL_MS);
            },

            onmessage: async (msg: LiveServerMessage) => {
              // --- transcripts
              if (msg.serverContent?.inputTranscription) {
                inputTextRef.current += msg.serverContent.inputTranscription.text;
              }

              if (msg.serverContent?.outputTranscription) {
                outputTextRef.current += msg.serverContent.outputTranscription.text;
              }

              if (msg.serverContent?.turnComplete) {
                if (inputTextRef.current) {
                  setTranscripts(p => [...p, { role: 'user', text: inputTextRef.current }]);
                }
                if (outputTextRef.current) {
                  setTranscripts(p => [...p, { role: 'model', text: outputTextRef.current }]);
                }
                inputTextRef.current = '';
                outputTextRef.current = '';
              }

              // --- AUDIO PLAYBACK (RAW PCM)
              for (const part of msg.serverContent?.modelTurn?.parts || []) {
                if (!part.inlineData?.data || !outputCtxRef.current) continue;

                const pcmBytes = base64ToUint8Array(part.inlineData.data);

                // PCM16 ? Float32
                const pcm16 = new Int16Array(pcmBytes.buffer);
                const float32 = new Float32Array(pcm16.length);
                for (let i = 0; i < pcm16.length; i++) {
                  float32[i] = pcm16[i] / 32768;
                }

                const ctx = outputCtxRef.current;
                const buffer = ctx.createBuffer(1, float32.length, 24000);
                buffer.copyToChannel(float32, 0);

                const src = ctx.createBufferSource();
                src.buffer = buffer;
                src.connect(ctx.destination);

                // Proper scheduling
                if (nextPlayTimeRef.current < ctx.currentTime) {
                  nextPlayTimeRef.current = ctx.currentTime;
                }

                src.start(nextPlayTimeRef.current);
                nextPlayTimeRef.current += buffer.duration;
              }
            },

            onerror: e => {
              setError(e.message || 'Session error');
              stop();
            }
          }
        });

        sessionRef.current = session;

        // --- MIC SETUP
        await inputCtxRef.current.audioWorklet.addModule('/audio-worklet-processor.js');

        micRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true
          }
        });

        const source = inputCtxRef.current.createMediaStreamSource(micRef.current);
        const worklet = new AudioWorkletNode(inputCtxRef.current, 'mic-processor');
        workletRef.current = worklet;

        worklet.port.onmessage = e => {
          const pcm = e.data as Float32Array;

          // Volume meter
          let sum = 0;
          for (let i = 0; i < pcm.length; i++) sum += pcm[i] ** 2;
          const rms = Math.sqrt(sum / pcm.length);
          setVolume(Math.min(1, rms * 6));

          if (rms < 0.01) return;

          sessionRef.current?.sendRealtimeInput({
            media: createPcmBlob(pcm)
          });
        };

        source.connect(worklet);

        console.log('Live session started');
      } catch (e: any) {
        setError(e.message || 'Failed to start session');
        stop();
      }
    }, [onUpdateCredits, stop]);


  const sendAsset = useCallback((asset: Attachment) => {
    sessionRef.current?.sendRealtimeInput({
      media: { data: asset.data, mimeType: asset.mimeType }
    });
  }, []); 

  useEffect(() => stop, [stop]);

  return {
    isActive,
    status,
    error,
    volume,
    transcripts,
    start,
    stop,
    sendAsset
  };
}
