import React, { useEffect, useRef, useState } from 'react';
import { InfoModal } from '../../components/InfoModals';
import { ModalType, LandingPageProps } from '@/types/types';
import { CORE_FEATURES, FAQ_ITEMS, DarkLight, Data_numbers_LandingPage } from '@/services/parameters';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '@/store/db';
import { useAuth } from '@/hooks/useAuth';



export const LandingPage: React.FC<LandingPageProps> = ({theme, isGoogleConfigured, }) => {

  const isDark = DarkLight(theme);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const googleBtnRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

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
  const t = (dark: string, light: string) => isDark ? dark : light;

  const goToApp = () => {
    if (user?.user_id && user.user_id !== 'undefined') {
      navigate(`/dashboard/User/${user.user_id}`);
    } else {
      navigate('/Login');
    }
  };
  
  const AI_CAPABILITIES = [
    {
      number: '01',
      label: 'VOICE AI',
      title: 'Natural voice interaction',
      description:
        'Talk naturally with AI using voice interaction designed for fast conversations, questions, brainstorming, research, and everyday productivity.',
      keywords:
        'AI voice assistant, voice AI, conversational artificial intelligence',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 18.5a6.5 6.5 0 0 0 6.5-6.5V7a6.5 6.5 0 0 0-13 0v5a6.5 6.5 0 0 0 6.5 6.5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12a7 7 0 0 1-14 0M12 18.5V22M8 22h8"/>
        </svg>
      ),
    },
    {
      number: '02',
      label: 'VISUAL AI',
      title: 'Understand visual information',
      description:
        'Use multimodal artificial intelligence to analyze images and combine visual information with natural language for deeper understanding.',
      keywords:
        'visual AI, image analysis AI, multimodal AI, computer vision',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/>
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      ),
    },
    {
      number: '03',
      label: 'WEB INTELLIGENCE',
      title: 'Research with connected intelligence',
      description:
        'Explore information from the web and connect research with AI conversations to investigate topics, discover information, and answer complex questions.',
      keywords:
        'AI web search, AI research assistant, web intelligence, AI search',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" 
          d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z"/>
        </svg>
      ),
    },
  ];

  return (
    <main className="w-full">
      {/* =========================================================
          HERO
      ========================================================== */}
      <header className="flex flex-col items-center text-center space-y-10 pb-24">
        <div className="space-y-6">

          <span className={`inline-block text-[10px] font-mono uppercase
              tracking-[0.45em] opacity-50 ${t('text-[#66FCF1]', 'text-[#007AFF]')}`}>
            Multimodal Artificial Intelligence
          </span>

          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none">
            VOXPACT
          </h1>
          <h2 className="max-w-5xl  mx-auto text-3xl md:text-5xl font-black tracking-tight">
            AI Voice, Vision & Web Intelligence
          </h2>

          <p className="max-w-4xl mx-auto text-lg md:text-xl leading-relaxed opacity-60">
            VOXPACT is a multimodal AI platform that brings together
            intelligent voice interaction, visual analysis,
            conversational AI, and web-grounded information in one
            powerful workspace.
          </p>

        </div>

        <div className="flex gap-6 flex-wrap justify-center">
          <button
            onClick={goToApp}
            className={`px-16 py-6 rounded-full font-black uppercase tracking-[0.2em]
              shadow-2xl ${t('bg-[#66FCF1] text-black', 'bg-[#007AFF] text-white')}`}>
            Try VOXPACT Now
          </button>
          <button onClick={() => navigate('/Documentation')}
            className=" px-12 py-6 rounded-full border-2 uppercase tracking-[0.2em]">
            Documentation
          </button>
        </div>
        {isGoogleConfigured && ( <div ref={googleBtnRef} className="pt-4"/> )}
      </header>

      {/* =========================================================
          NUMBERS
      ========================================================== */}
      <section aria-labelledby="vox-pact-numbers" className="py-16">
        <div className="text-center mb-12">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40"> VOXPACT BY THE NUMBERS </span>
          <h2 id="vox-pact-numbers" className=" mt-4 text-4xl md:text-6xl font-black tracking-tighter">
            Built for intelligent interaction.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {Data_numbers_LandingPage.map((stat) => (
            <div key={stat.label} className={`rounded-[2.5rem] p-2 md:p-12 text-center border
                ${t('border-white/5 bg-white/[0.02]', 'border-gray-100 bg-white shadow-lg')}`}>

              <div className={`text-3xl p-3 md:text-3xl font-black tracking-tighter
                  ${t('text-[#66FCF1]', 'text-[#007AFF]')}`}>
                {stat.number}
              </div>
              <p className="mt-3 text-xs md:text-sm uppercase tracking-[0.2em] opacity-50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================== */}
      <section aria-labelledby="about-vox-pact" className="py-24">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40"> ABOUT VOXPACT </span>
          <h2 id="about-vox-pact" className=" mt-4 text-4xl md:text-6xl font-black tracking-tighter">
            One AI workspace.
            <br />
            Multiple ways to think.
          </h2>

          <p className=" mt-8 text-lg md:text-xl leading-relaxed opacity-60">
            VOXPACT connects multimodal artificial intelligence,
            natural voice interaction, visual understanding, and
            web intelligence to create a unified AI experience.
          </p>

          <p className="mt-6 text-lg leading-relaxed opacity-60">
            Instead of switching between separate tools for
            conversations, research, visual analysis, and information
            discovery, VOXPACT brings these capabilities together
            in one intelligent environment.
          </p>
        </div>
      </section>


      {/* =========================================================
          CORE FEATURES
      ========================================================== */}
      <section aria-labelledby="core-features"className="py-24">
        <div className="text-center mb-14">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">
            CORE CAPABILITIES
          </span>

          <h2 id="core-features" className=" mt-4 text-4xl md:text-6xl font-black tracking-tighter">
            Powerful multimodal AI tools
          </h2>

          <p className="max-w-3xl mx-auto mt-6  text-lg opacity-60 ">
            Everything you need to interact with AI through
            conversation, voice, vision, and connected information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {CORE_FEATURES.map((feature) => (
            <article key={feature.title} className={`group relative p-12 rounded-[3.5rem] border 
              transition-all duration-700 will-change-transform hover:-translate-y-4 hover:scale-[1.03]
                ${t(`border-white/5 bg-black/20 hover:border-[#66FCF1]/30 hover:shadow-[0_40px_120px_rgba(0,0,0,0.6)]`,
                  `bg-white border-gray-100 shadow-xl hover:shadow-2xl `)}`}>

              <div className={`w-20 h-20 rounded-[2.5rem] mb-10 flex items-center
                  justify-center transition-all duration-700 group-hover:scale-110
                  ${t(`bg-gradient-to-br from-[#1F2833] to-black text-[#66FCF1] shadow-2xl`, 
                  `bg-[#007AFF]/10 text-[#007AFF] `)}`}>

                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                </svg>
              </div>

              <div className="space-y-4">

                <span className={`text-[9px] font-mono uppercase tracking-[0.4em]
                    opacity-40 ${t('text-white', 'text-gray-500' )}`}>
                  {feature.sub}
                </span>

                <h3 className={`text-2xl font-black uppercase tracking-tight ${t('text-white','text-[#1F2833]')}`}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-60">
                  {feature.desc}
                </p>

              </div>

              <div className={`pointer-events-none absolute inset-0 rounded-[3.5rem] opacity-0
                  group-hover:opacity-100 transition-opacity duration-700
                  ${t('bg-gradient-to-t from-[#66FCF1]/5 to-transparent',
                    'bg-gradient-to-t from-[#007AFF]/5 to-transparent')}`}/>
            </article>
          ))}
        </div>
      </section>


      {/* =========================================================
          AI CAPABILITIES LIST
      ========================================================== */}
      <section aria-labelledby="ai-capabilities" className="py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40"> AI CAPABILITIES </span>
            <h2 id="ai-capabilities" className="mt-4 text-4xl md:text-6xl font-black tracking-tighter">
              Voice. Vision. Web.
            </h2>

            <p className="max-w-3xl mt-6 text-lg opacity-60">
              VOXPACT combines multiple forms of AI interaction
              so you can communicate, understand, and research
              information from one place.
            </p>
          </div>

          <div className="space-y-5">
            {AI_CAPABILITIES.map((capability) => (
              <article key={capability.number} className={` group grid grid-cols-1
                  md:grid-cols-[100px_80px_1fr] gap-6 md:gap-10 items-center rounded-[2.5rem]
                  border p-7 md:p-10 transition-all duration-500 hover:-translate-y-1
                  ${t(`border-white/5 bg-white/[0.02] hover:border-[#66FCF1]/30 `, 
                  `border-gray-100 bg-white shadow-lg hover:shadow-xl`)}`}>

                <div className={`text-3xl font-black tracking-tighter opacity-30
                    ${t('text-[#66FCF1]', 'text-[#007AFF]')}`}>
                  {capability.number}
                </div>

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center
                    ${t(`bg-[#66FCF1]/10 ext-[#66FCF1]`, `bg-[#007AFF]/10 text-[#007AFF]`)}`}>
                  {capability.icon}
                </div>

                <div>
                  <span className={`text-[9px] font-mono uppercase tracking-[0.4em] opacity-40 `}>
                    {capability.label}
                  </span>

                  <h3 className="mt-2 text-2xl md:text-3xl font-black tracking-tight">
                    {capability.title}
                  </h3>

                  <p className="mt-3 max-w-4xl text-sm md:text-base leading-relaxed opacity-60">
                    {capability.description}
                  </p>

                  <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.25em] opacity-30">
                    {capability.keywords}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================
          USE CASES
      ========================================================== */}
      <section
        aria-labelledby="use-cases"
        className="py-24"
      >

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">

            <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">
              WHAT YOU CAN DO
            </span>

            <h2
              id="use-cases"
              className="
                mt-4
                text-4xl
                md:text-6xl
                font-black
                tracking-tighter
              "
            >
              Built for real AI workflows.
            </h2>

          </div>


          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {[
              'Ask complex questions and explore ideas with conversational AI',
              'Use voice interaction for hands-free AI conversations',
              'Analyze images and visual information with multimodal AI',
              'Research topics using web-connected intelligence',
              'Combine text, voice, visual, and web information',
              'Turn complex information into clearer, actionable insights',
            ].map((item, index) => (

              <li
                key={item}
                className={`
                  flex
                  items-start
                  gap-5
                  rounded-3xl
                  border
                  p-7
                  ${t(
                    'border-white/5 bg-white/[0.02]',
                    'border-gray-100 bg-white shadow-sm'
                  )}
                `}
              >

                <span
                  className={`
                    shrink-0
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs
                    font-black
                    ${t(
                      'bg-[#66FCF1] text-black',
                      'bg-[#007AFF] text-white'
                    )}
                  `}
                >
                  {index + 1}
                </span>

                <span className="text-base leading-relaxed opacity-70">
                  {item}
                </span>

              </li>

            ))}

          </ul>

        </div>

      </section>


      {/* =========================================================
          FAQ LIST
      ========================================================== */}
      <section aria-labelledby="faq"  className="py-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">
              FREQUENTLY ASKED QUESTIONS
            </span>

            <h2 id="faq" className="mt-4 text-4xl md:text-6xl font-black tracking-tighter">
              Frequently asked questions
            </h2>

            <p className="max-w-3xl mt-6 text-lg opacity-60">
              Learn more about VOXPACT, its AI capabilities,
              and how the platform can be used.
            </p>
          </div>

          <ol className="space-y-5">
            {FAQ_ITEMS.map((faq, index) => (
              <li key={faq.question} className={`rounded-[2rem] border overflow-hidden
                  ${t('border-white/5 bg-white/[0.02]', 'border-gray-100 bg-white shadow-sm')}`} >

                <details>
                  <summary className="cursor-pointer list-none flex items-center gap-6 p-7 md:p-9">
                    <span className={`shrink-0 text-sm font-mono opacity-30 ${t('text-[#66FCF1]','text-[#007AFF]')}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="text-lg md:text-xl font-black"> {faq.question} </span>
                    <span className="ml-auto text-2xl opacity-40"> + </span>
                  </summary>

                  <div className="px-7 md:px-9 pb-8">
                    <p className="pl-10 md:pl-12 max-w-4xl leading-relaxed opacity-60"> {faq.answer} </p>
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}

      <section
        aria-labelledby="final-cta"
        className="py-28 text-center"
      >

        <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">
          START EXPLORING
        </span>

        <h2
          id="final-cta"
          className="
            mt-4
            text-5xl
            md:text-7xl
            font-black
            tracking-tighter
          "
        >
          Intelligence, connected.
        </h2>

        <p
          className="
            max-w-2xl
            mx-auto
            mt-6
            text-lg
            leading-relaxed
            opacity-60
          "
        >
          Explore voice AI, visual intelligence, conversational AI,
          and web-grounded research in one multimodal AI platform.
        </p>

        <button
          onClick={goToApp}
          className={`
            mt-10
            px-16
            py-6
            rounded-full
            font-black
            uppercase
            tracking-[0.2em]
            shadow-2xl
            ${t(
              'bg-[#66FCF1] text-black',
              'bg-[#007AFF] text-white'
            )}
          `}
        >
          Get Started
        </button>

      </section>


      {/* =========================================================
          MODAL
      ========================================================== */}
      {activeModal && (
        <InfoModal type={activeModal} theme={theme} onClose={() => setActiveModal(null)} />)}

    </main>
  );
};