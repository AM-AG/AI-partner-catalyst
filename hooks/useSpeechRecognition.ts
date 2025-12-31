import { useEffect, useRef, useState } from 'react';

export function useSpeechRecognition(onResult: (text: string) => void) {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) return;

    const rec = new SR();
    rec.continuous = false;

    rec.onresult = (e: any) => {
      onResult(e.results[0][0].transcript);
      setListening(false);
    };

    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
  }, [onResult]);

  const toggle = () => {
    if (!recognitionRef.current) return;
    listening ? recognitionRef.current.stop() : recognitionRef.current.start();
    setListening(l => !l);
  };

  return { listening, toggle };
}
