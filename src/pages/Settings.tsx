import React, { useState } from 'react';
import { DarkLight } from '../../services/parameters';
import { Theme, User } from '../../types/types';
import { db } from '../../store/db';
import { useApiKeys } from '../../hooks/useapikey';
import { useAuth } from '../../hooks/useAuth';

export interface SettingsProps {
  theme: Theme;
}

export const Settings: React.FC<SettingsProps> = ({theme}) => {
  const isDark = DarkLight(theme);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const { user } = useAuth();
  const { keys, setKeys, createKey } = useApiKeys(user?.id ?? '');

  const handleGenerateApiKey = async () => {
    const rawKey = await createKey('Default Key');
    setApiKey(rawKey); 
    alert(`Copy this key now:\n\n${rawKey}`);
  };

  return (
    <div
      className={`flex flex-col h-full relative overflow-hidden transition-colors ${
        isDark ? 'bg-[#0B0C10] text-[#C5C6C7]' : 'bg-[#F8F9FA] text-[#1F2833]'
      }`}
    >
      {/* Header */}
      <div className="px-6 md:px-12 pt-14 pb-10">
        <h1 className="text-[14px] font-black uppercase tracking-[0.5em] opacity-80">
          Settings
        </h1>
        <p className="mt-2 text-[10px] font-mono opacity-40 uppercase tracking-[0.3em]">
          System Configuration
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-32 space-y-10 custom-scrollbar">

        {/* API Keys */}
        <section
          className={`rounded-[2rem] border p-8 transition-all ${
            isDark
              ? 'bg-[#1F2833]/40 border-white/5'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <p className="text-[9px] font-mono uppercase tracking-[0.4em] opacity-50">
            API Access
          </p>

          <p className="mt-4 text-[12px] opacity-70 max-w-xl">
            Use API keys to authenticate external applications and automate
            workflows. Keep them secret.
          </p>

          <div className="mt-6 space-y-4">
            {apiKey ? (
              <>
                <div
                  className={`rounded-xl px-4 py-3 text-[11px] font-mono break-all ${
                    isDark
                      ? 'bg-black/40 border border-white/10'
                      : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  {showKey ? apiKey : '••••••••••••••••••••••••••••'}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-[0.3em] transition-all ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {showKey ? 'Hide' : 'Reveal'}
                  </button>

                  <button
                    onClick={() => {
                      db.revokeApiKey(apiKey);
                      setApiKey(null);
                      setShowKey(false);
                    }}
                    className="px-4 py-2 rounded-xl text-[10px] uppercase tracking-[0.3em] bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                  >
                    Revoke
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={handleGenerateApiKey}
                className={`mt-4 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] transition-all ${
                  isDark
                    ? 'bg-[#66FCF1]/10 text-[#66FCF1] hover:bg-[#66FCF1]/20'
                    : 'bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20'
                }`}
              >
                Generate API Key
              </button>
            )}
          </div>
        </section>

        {/* Preferences */}
        <section
          className={`rounded-[2rem] border p-8 transition-all ${
            isDark
              ? 'bg-[#1F2833]/30 border-white/5'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <p className="text-[9px] font-mono uppercase tracking-[0.4em] opacity-50">
            Preferences
          </p>

          <div className="mt-6 space-y-4 text-[12px] opacity-80">
            <div className="flex items-center justify-between">
              <span>Enable animations</span>
              <input type="checkbox" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <span>Compact layout</span>
              <input type="checkbox" />
            </div>

            <div className="flex items-center justify-between">
              <span>Experimental features</span>
              <input type="checkbox" />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section
          className={`rounded-[2rem] border p-8 transition-all ${
            isDark
              ? 'bg-[#1F2833]/20 border-red-500/20'
              : 'bg-white border-red-200'
          }`}
        >
          <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-red-500">
            Danger Zone
          </p>

          <p className="mt-4 text-[12px] opacity-60 max-w-xl">
            These actions are irreversible. Proceed with caution.
          </p>

          <button className="mt-6 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all">
            Reset Preferences
          </button>
        </section>

      </div>
    </div>
  );
};
