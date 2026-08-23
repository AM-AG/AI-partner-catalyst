import React from 'react';
import { Project, Theme } from '../../types/types';
import { View } from '../../services/parameters';

interface AppHeaderProps {
  //activeProject: Project | null;
  currentView: View;
  theme: Theme;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentView,
  theme
}) => {
  const isDark = theme === 'dark';

  return (
    <header className="absolute top-0 left-0 w-full px-6 py-8 z-20 pointer-events-none flex justify-between items-center bg-gradient-to-b from-black/20 to-transparent backdrop-blur-[2px]">
      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="absolute top-6 left-4 z-30 flex flex-row items-center gap-2 mb-4">
            <a
            href="/"
            className="group cursor-pointer select-none transition-transform duration-500 hover:scale-[1.05]"
            >
                <img
                src="/images/logo_test.svg"
                alt="Voxpact Logo"
                className="w-16 h-12 transition-transform duration-300 hover:scale-[1.08] "
                />
            </a>
            <h1
                className={`text-1xl font-black tracking-tighter transition-all hover:tracking-normal ${
                isDark ? 'text-gradient' : 'text-[#007AFF]'
                }`}
            >
                VOXPACT
            </h1>
        </div>
      </div>

      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="flex flex-col items-end">
          <div
            className={`text-[9px] font-mono opacity-40 uppercase tracking-[0.3em] ${
              isDark ? 'text-white' : 'text-gray-600'
            }`}
          >
            Session_Protocol
          </div>

          <div
            className={`text-[10px] font-black uppercase tracking-widest ${
              isDark ? 'text-[#66FCF1]' : 'text-[#007AFF]'
            }`}
          >
            {currentView.replace('_', ' ')} Link Established
          </div>
        </div>
      </div>
    </header>
  );
};
