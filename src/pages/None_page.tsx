import React from 'react';
import { DarkLight, handleBuyCredits, PRICING_PLANS } from '../../services/parameters';
import { Theme } from '@/types/types'

export const NonePage = ({ theme }: { theme: Theme }) => {

  const isDark = DarkLight(theme);

    return (
        <div className="flex-1 flex flex-col items-center justify-center h-full opacity-20 text-center animate-pulse">
                        <div
                          className={`w-24 h-24 mb-6 rounded-full border-2 flex items-center justify-center ${
                            isDark
                              ? 'border-[#66FCF1]/30'
                              : 'border-[#007AFF]/30'
                          }`}
                        >
                          <svg
                            className="w-10 h-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1}
                          >
                            <path d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </div>

                        <p className="font-mono text-[11px] tracking-[0.6em] uppercase">
                          Initialize Sector Assignment
                        </p>
                        <p className="font-mono text-[8px] tracking-[0.3em] uppercase mt-2 opacity-50">
                          Sidebar Deployment Required
                        </p>
                      </div>
    )
}