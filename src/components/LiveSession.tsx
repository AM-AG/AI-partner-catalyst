import React, { useEffect, useRef, useState } from 'react';
import { Theme, Project, Attachment } from '../../types';
import { useLiveSession } from '../../hooks/useLiveSession';

export const LiveSession: React.FC<{
  project: Project | null;
  theme: Theme;
  onUpdateCredits: (amount: number) => void;
}> = ({ theme, onUpdateCredits }) => {
  const isDark = theme === 'dark';
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    isActive,
    status,
    error,
    volume,
    transcripts,
    start,
    stop,
    sendAsset
  } = useLiveSession(onUpdateCredits);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    for (const file of Array.from(e.target.files)) {
      const base64 = await new Promise<string>(res => {
        const r = new FileReader();
        r.onload = () => res((r.result as string).split(',')[1]);
        r.readAsDataURL(file);
      });

      sendAsset({
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        data: base64
      });
    }
  };

  return (
    <div className={`h-full flex flex-col p-6 ${isDark ? 'bg-black text-white' : 'bg-gray-50'}`}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          className={`w-72 h-72 rounded-full border-[10px] flex items-center justify-center transition-all
          ${isActive ? 'border-cyan-400' : 'border-gray-600 opacity-30'}`}
          style={{ transform: `scale(${1 + volume * 8})` }}
        >
          <span className="text-xs tracking-widest">{status}</span>
        </div>

        <div className="mt-8 flex gap-4">
          <button onClick={() => fileRef.current?.click()} className="px-4 py-2 border rounded-xl">
            Attach
          </button>

          <button
            onClick={isActive ? stop : start}
            disabled={status === 'CONNECTING'}
            className={`px-6 py-2 rounded-xl font-bold ${
              isActive ? 'bg-red-500 text-white' : 'bg-cyan-500 text-black'
            }`}
          >
            {isActive ? 'STOP' : 'START'}
          </button>
        </div>

        {error && <div className="mt-4 text-red-500 text-xs">{error}</div>}
      </div>

      <div className="mt-6 h-64 overflow-y-auto font-mono text-sm bg-black/30 p-4 rounded-xl">
        {transcripts.map((t, i) => (
          <div key={i} className="mb-2">
            <strong>{t.role.toUpperCase()}:</strong> {t.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
    </div>
  );
};