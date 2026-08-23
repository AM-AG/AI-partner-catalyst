
import React, { useEffect, useRef } from 'react';
import { Message } from '../../types/types';

interface ChatHistoryProps {
  messages: Message[];
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth"
    >
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50 italic">
          <p className="text-sm font-light tracking-wide">Conversation will appear here...</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[90%] rounded-xl px-4 py-2 text-sm leading-relaxed transition-all animate-in fade-in slide-in-from-bottom-1 ${
                msg.role === 'user' 
                  ? 'bg-blue-600/80 text-white rounded-tr-none' 
                  : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
              }`}
            >
              <span className="text-[9px] uppercase tracking-tighter font-bold mb-1 block opacity-50">
                {msg.role === 'user' ? 'You' : 'Agent'}
              </span>
              <p className="font-light">{msg.text}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatHistory;
