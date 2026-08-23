import React, { useEffect, useRef, useState, useCallback  } from 'react';
import { Theme, Project, Attachment } from '../../types/types';
import { useLiveSession } from '../../hooks/useLiveSession';
import {VITE_AGENT_ID_ELEVENLABS} from '../../services/aiClient';
import { ChatHistory } from './ChatHistory';
import { Clock2 } from 'lucide-react';
  


export const LiveSession: React.FC<{
  project: Project | null;
  theme: Theme;
  onUpdateCredits: (amount: number) => void;}> = ({ project, theme, onUpdateCredits }) => {
  const isDark = theme === 'dark';
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);


  const { isActive,
    status,
    error,
    volume,
    messages,
    elapsedSeconds,
    formattedTime,
    start_session,
    stop_session,
    sendAsset } = useLiveSession(onUpdateCredits);

  // const handleStart = useCallback(async () => {
  //   try {
  //     await navigator.mediaDevices.getUserMedia({ audio: true });
  //     await startConversation();
  //   } catch (error) {
  //     console.error('Failed to start conversation:', error);
  //   }
  // }, [startConversation]);

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center opacity-40">
        <p className="font-mono text-xs uppercase tracking-widest">
          No active project
        </p>
      </div>
    );
  }

  // const {
  //   isActive,
  //   status,
  //   error,
  //   volume,
  //   messages,
  //   start_session,
  //   stop_session,
  //   formattedTime,
  //   sendAsset
  // } = useLiveSession(onUpdateCredits);

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    for (const file of Array.from(e.target.files)) {
      const base64 = await new Promise<string>(res => {
        const r = new FileReader();
        r.onload = () => res((r.result as string).split(',')[1]);
       // r.readAsDataURL(file);
      });

      // sendAsset({
      //   name: file.name,
      //   mimeType: file.type || 'application/octet-stream',
      //   data: base64
      // });
    }
  };

  return (
    <div className={`h-full flex flex-col p-6 ${isDark ? 'bg-black text-white' : 'bg-gray-50'}`}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-4">
          <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur border border-white/10 text-xs font-mono">
            <Clock2 size={12} /> {formattedTime}
          </div>
        </div>
        <div
          className={`w-72 h-72 rounded-full border-[10px] flex items-center justify-center transition-all
          ${isActive ? 'border-cyan-400' : 'border-gray-600 opacity-30'}`}
          // style={{ transform: `scale(${1 + volume * 8})` }}
        >
          <span className="text-xs tracking-widest">{status}</span>
        </div>

        <div className="mt-8 flex gap-4">
          <button onClick={() => fileRef.current?.click()} className="px-4 py-2 border rounded-xl">
            Attach
          </button>

          <button
            onClick={isActive ? start_session : stop_session}
            disabled={status === 'CONNECTING'}
            className={`px-6 py-2 rounded-xl font-bold ${
              isActive ? 'bg-red-500 text-white' : 'bg-cyan-500 text-black'
            }`}
          >
            {isActive ? 'STOP' : 'START'}
          </button>
        </div>
{/* 
        {error && <div className="mt-4 text-red-500 text-xs">{error}</div>} */}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col px-6 pb-6 relative z-10">
           <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
              {/* <ChatHistory messages={messages} /> */}
           </div>
      </div>

      <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
      {/* <div className={`h-full flex flex-col p-6 ${isDark ? 'bg-black text-white' : 'bg-gray-50'}`}>
        <elevenlabs-convai agent-id={VITE_AGENT_ID_ELEVENLABS}></elevenlabs-convai>
      </div> */}
    </div>
  );
  
  // <div className={`h-full flex flex-col p-6 ${isDark ? 'bg-black text-white' : 'bg-gray-50'}`}>
  //      <div className="flex-1 flex flex-col items-center justify-center">
  //        <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-4">
  //         <div className="flex gap-2">
  //           <button
  //             onClick={handleStart}
  //             disabled={isConnected}
  //             className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
  //           >
  //             Start Conversation
  //           </button>
  //           <button
  //             onClick={stopConversation}
  //             disabled={!isConnected}
  //             className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
  //           >
  //             Stop Conversation
  //           </button>
  //         </div>
  //         <div className="flex flex-col items-center">
  //           <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}