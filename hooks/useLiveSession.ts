import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Attachment } from '../types';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audio-utils';

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

  const stop = useCallback(() => {
    billingTimerRef.current && clearInterval(billingTimerRef.current);

    try { sessionRef.current?.close(); } catch {}
    sessionRef.current = null;

    workletRef.current?.disconnect();
    workletRef.current = null;

    micRef.current?.getTracks().forEach(t => t.stop());
    micRef.current = null;

    inputCtxRef.current?.close();
    outputCtxRef.current?.close();

    setIsActive(false);
    setStatus('DISCONNECTED');
    setVolume(0);
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      setStatus('CONNECTING');

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      inputCtxRef.current = new AudioContext({ sampleRate: 16000 });
      outputCtxRef.current = new AudioContext({ sampleRate: 24000 });

      await inputCtxRef.current.audioWorklet.addModule('/audio-worklet-processor.js');

      micRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const source = inputCtxRef.current.createMediaStreamSource(micRef.current);
      const worklet = new AudioWorkletNode(inputCtxRef.current, 'mic-processor');
      workletRef.current = worklet;

      worklet.port.onmessage = e => {
        const pcm = e.data as Float32Array;
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

      sessionRef.current = await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          tools: [{googleSearch: {}}]
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
            if (msg.serverContent?.inputTranscription)
              inputTextRef.current += msg.serverContent.inputTranscription.text;

            if (msg.serverContent?.outputTranscription)
              outputTextRef.current += msg.serverContent.outputTranscription.text;

            if (msg.serverContent?.turnComplete) {
              inputTextRef.current &&
                setTranscripts(p => [...p, { role: 'user', text: inputTextRef.current }]);
              outputTextRef.current &&
                setTranscripts(p => [...p, { role: 'model', text: outputTextRef.current }]);
              inputTextRef.current = '';
              outputTextRef.current = '';
            }

            for (const part of msg.serverContent?.modelTurn?.parts || []) {
              if (part.inlineData?.data && outputCtxRef.current) {
                const buffer = await decodeAudioData(
                  base64ToUint8Array(part.inlineData.data),
                  outputCtxRef.current,
                  24000,
                  1
                );
                const src = outputCtxRef.current.createBufferSource();
                src.buffer = buffer;
                src.connect(outputCtxRef.current.destination);
                src.start(nextPlayTimeRef.current);
                nextPlayTimeRef.current += buffer.duration;
              }
            }
          },

          onclose: stop,
          onerror: e => {
            setError(e.message || 'Session error');
            stop();
          }
        }
      });
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
