import React, { useEffect, useRef, useState } from 'react';
import { InfoModal } from './InfoModals';
import { ModalType } from '../types';

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

interface LandingPageProps {
  onLogin: () => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  isGoogleConfigured: boolean;
}

/* ---------------------------------- */
/* Static Data */
/* ---------------------------------- */

const CORE_FEATURES = [
  {
    title: 'Neural Uplink',
    sub: 'AUDIO_STREAM',
    desc:
      'Bidirectional, ultra-low latency voice streaming with native multimodal fusion. Supports multi-speaker context, interruption handling, and synchronized audio intelligence.',
    icon: 'M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364-2.121 2.121M8.757 15.243l-2.121 2.121m0-11.364 2.121 2.121m9.486 9.486 2.121 2.121',
  },
  {
    title: 'Intel Query',
    sub: 'GROUNDED_SEARCH',
    desc:
      'Real-time web-grounded intelligence with source attribution. Automatically synthesizes structured reports, citations, and exportable PDFs for decision-grade outputs.',
    icon: 'M11 4a7 7 0 1 1-4.95 11.95l-2.55 2.55 1.414 1.414 2.55-2.55A7 7 0 0 1 11 4Zm0 3v4l3 2',
  },
  {
    title: 'Vision Synth',
    sub: 'IMAGE_ENGINE',
    desc:
      'High-fidelity image synthesis up to 4K resolution. Precise aspect control, visual consistency, and asset scaling engineered for professional-grade visual intelligence.',
    icon: 'M3 7.5A2.25 2.25 0 0 1 5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5v9a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 16.5v-9Zm4.5 6 2.25-2.25a1.5 1.5 0 0 1 2.121 0L15 14.25l2.25-2.25',
  },
];


const FOOTER_LINKS: { id: ModalType; label: string }[] = [
  { id: 'ABOUT', label: 'About' },
  { id: 'PRICING', label: 'Pricing' },
  { id: 'PRIVACY', label: 'Privacy' },
  { id: 'AFFILIATION', label: 'Partners' },
];

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  theme,
  onThemeToggle,
  isGoogleConfigured,
}) => {
  const isDark = theme === 'dark';
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const googleBtnRef = useRef<HTMLDivElement | null>(null);

  /* ---------------------------------- */
  /* Google Login Button */
  /* ---------------------------------- */

  useEffect(() => {
    if (!isGoogleConfigured) return;
    if (!(window as any).google?.accounts?.id) return;
    if (!googleBtnRef.current) return;

    googleBtnRef.current.innerHTML = '';

    (window as any).google.accounts.id.renderButton(
      googleBtnRef.current,
      {
        theme: isDark ? 'filled_black' : 'outline',
        size: 'large',
        width: 320,
        shape: 'pill',
        text: 'signin_with',
        logo_alignment: 'left',
      }
    );
  }, [isGoogleConfigured, isDark]);

  /* ---------------------------------- */
  /* Helpers */
  /* ---------------------------------- */

  const t = (dark: string, light: string) => (isDark ? dark : light);

  /* ---------------------------------- */
  /* Render */
  /* ---------------------------------- */

  return (
    <div
      className={`h-screen w-full flex flex-col items-center p-6 relative overflow-y-auto transition-colors duration-700 ${t(
        'bg-[#0B0C10] text-[#C5C6C7]',
        'bg-[#F8F9FA] text-[#1F2833]'
      )}`}
    >
      {/* Theme Toggle */}
      <div className="absolute top-8 right-8 z-30">
        <button
          onClick={onThemeToggle}
          className={`p-4 rounded-full border-2 backdrop-blur-md transition-all duration-500 flex items-center gap-3 shadow-2xl ${t(
            'border-white/5 bg-white/5 text-[#66FCF1]',
            'border-black/5 bg-white text-[#007AFF]'
          )}`}
        >
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            {isDark ? 'Light' : 'Dark'}
          </span>
        </button>
      </div>

      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-1/4 left-1/4 w-[1200px] h-[1200px] rounded-full blur-[180px] opacity-[0.05] ${t(
            'bg-[#66FCF1]',
            'bg-[#007AFF]'
          )}`}
        />
        <div
          className={`absolute -bottom-1/4 -right-1/4 w-[1000px] h-[1000px] rounded-full blur-[180px] opacity-[0.03] ${t(
            'bg-[#45A29E]',
            'bg-[#5856D6]'
          )}`}
        />
      </div>

      <main className="max-w-7xl w-full relative z-10 py-32 space-y-32">
        {/* Hero */}
        <header className="flex flex-col items-center text-center space-y-12">
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter">
            VOXPACT
          </h1>

          <p className="max-w-3xl text-xl opacity-60">
            The elite multimodal nexus. Synthesize intelligence with raw voice uplink,
            4K visual mapping, and grounded web persistence.
          </p>

          <div className="flex gap-6 flex-wrap justify-center">
            <button
              onClick={onLogin}
              className={`px-16 py-6 rounded-full font-black uppercase tracking-[0.5em] shadow-2xl ${t(
                'bg-[#66FCF1] text-black',
                'bg-[#007AFF] text-white'
              )}`}
            >
              Try it Now
            </button>

            <button
              onClick={() => setActiveModal('SDK')}
              className="px-12 py-6 rounded-full border-2 uppercase tracking-[0.5em]"
            >
              Documentation
            </button>
          </div>

          {isGoogleConfigured && (
            <div ref={googleBtnRef} className="pt-4" />
          )}
        </header>

        {/* Core Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {CORE_FEATURES.map(feature => (
            <div key={feature.title}
              className={`
                group relative p-12 rounded-[3.5rem] border
                transition-all duration-700 will-change-transform
                hover:-translate-y-4 hover:scale-[1.01]
                ${t(
                  'border-white/5 bg-black/20 hover:border-[#66FCF1]/30 hover:shadow-[0_40px_120px_rgba(0,0,0,0.6)]',
                  'bg-white border-gray-100 shadow-xl hover:shadow-2xl'
                )}
              `}
            >
              {/* Icon */}
              <div
                className={`
                  w-20 h-20 rounded-[2.5rem] mb-10 flex items-center justify-center
                  transition-all duration-700 group-hover:scale-110
                  ${t(
                    'bg-gradient-to-br from-[#1F2833] to-black text-[#66FCF1] shadow-2xl',
                    'bg-[#007AFF]/10 text-[#007AFF]'
                  )}
                `}
              >
                <svg className="w-8 h-8" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                </svg>
              </div>

              {/* Text */}
              <div className="space-y-4">
                <span
                  className={`
                    text-[9px] font-mono uppercase tracking-[0.4em] opacity-40
                    ${t('text-white', 'text-gray-500')}
                  `}
                >
                  {feature.sub}
                </span>

                <h3
                  className={`
                    text-2xl font-black uppercase tracking-tight
                    ${t('text-white', 'text-[#1F2833]')}
                  `}
                >
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed opacity-60">
                  {feature.desc}
                </p>
              </div>

              {/* Subtle gradient overlay */}
              <div className={`
                    pointer-events-none absolute inset-0 rounded-[3.5rem]
                    opacity-0 group-hover:opacity-100 transition-opacity duration-700
                    ${t(
                      'bg-gradient-to-t from-[#66FCF1]/5 to-transparent',
                      'bg-gradient-to-t from-[#007AFF]/5 to-transparent'
                    )}
                  `}
              />
            </div>
          ))}
        </section>


        {/* Footer */}
        <footer className="pt-20 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <div className="text-2xl font-black">VOXPACT</div>
            <p className="text-[10px] opacity-30 uppercase tracking-widest">
              © 2025 Voxpact Neural Nexus
            </p>
          </div>

          <div className="flex gap-10">
            {FOOTER_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => setActiveModal(link.id)}
                className="text-[10px] uppercase tracking-[0.5em] opacity-40 hover:opacity-100"
              >
                {link.label}
              </button>
            ))}
          </div>
        </footer>
      </main>

      {activeModal && (
        <InfoModal
          type={activeModal}
          theme={theme}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};
