import React from 'react';
import { DarkLight } from '@/services/parameters';
import { Theme, User } from '@/types/types';
import { useAuth } from '@/hooks/useAuth';

export interface SupportProps {
  theme: Theme;
}

export const Support: React.FC<SupportProps> = ({ theme }) => {
  const isDark = DarkLight(theme);
  const { user } = useAuth();

  return (
    <div
      className={`flex flex-col h-full relative overflow-hidden transition-colors ${
        isDark ? 'bg-[#0B0C10] text-[#C5C6C7]' : 'bg-[#F8F9FA] text-[#1F2833]'
      }`}
    >
      {/* Header */}
      <div className="px-6 md:px-12 pt-14 pb-10">
        <h1 className="text-[14px] font-black uppercase tracking-[0.5em] opacity-80">
          Support
        </h1>
        <p className="mt-2 text-[10px] font-mono opacity-40 uppercase tracking-[0.3em]">
          Help & Assistance
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-32 space-y-10 custom-scrollbar">

        {/* Intro Card */}
        <div
          className={`rounded-[2rem] border p-8 text-center transition-all ${
            isDark
              ? 'bg-[#1F2833]/40 border-white/5'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.4em] opacity-50">
            Need Assistance?
          </p>
          <p className="mt-4 text-[13px] leading-relaxed opacity-80 max-w-xl mx-auto">
            If something feels off, unclear, or broken, this is the right place.
            We keep support simple, human, and fast.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Documentation */}
          <div
            className={`rounded-[2rem] border p-6 transition-all cursor-pointer hover:scale-[1.02] ${
              isDark
                ? 'bg-[#1F2833]/30 border-white/5 hover:bg-[#1F2833]/50'
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <p className="text-[9px] font-mono uppercase tracking-[0.4em] opacity-50">
              Documentation
            </p>
            <p className="mt-4 text-[12px] opacity-70 leading-relaxed">
              Learn how things work, explore features, and understand the system
              at your own pace.
            </p>
          </div>

          {/* Contact Support */}
          <div
            className={`rounded-[2rem] border p-6 transition-all cursor-pointer hover:scale-[1.02] ${
              isDark
                ? 'bg-[#1F2833]/30 border-[#66FCF1]/20 hover:bg-[#1F2833]/50'
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <p className="text-[9px] font-mono uppercase tracking-[0.4em] opacity-50">
              Contact Support
            </p>
            <p className="mt-4 text-[12px] opacity-70 leading-relaxed">
              Reach out directly for help with your account, billing, or technical
              issues.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center opacity-30 pt-12">
          <p className="text-[9px] font-mono uppercase tracking-[0.4em]">
            Response time may vary depending on request complexity
          </p>
        </div>

      </div>
    </div>
  );
};
