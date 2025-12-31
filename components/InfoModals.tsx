import React from 'react';
import { Theme, ModalType } from '../types';

interface InfoModalProps {
  type: ModalType;
  onClose: () => void;
  theme: Theme;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose, theme }) => {
  const isDark = theme === 'dark';

  /* ------------------------------ */
  /* Small primitives */
  /* ------------------------------ */

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section className="space-y-3">
      <h3
        className={`text-sm font-semibold tracking-tight ${
          isDark ? 'text-[#66FCF1]' : 'text-[#007AFF]'
        }`}
      >
        {title}
      </h3>
      {children}
    </section>
  );

  const CodeBlock = ({
    code,
    label,
  }: {
    code: string;
    label: string;
  }) => (
    <div
      className={`rounded-xl border overflow-hidden ${
        isDark
          ? 'bg-black/40 border-white/5'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-2 text-[10px] font-mono border-b ${
          isDark
            ? 'border-white/5 text-white/40'
            : 'border-gray-200 text-gray-500'
        }`}
      >
        <span>{label}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="hover:opacity-100 opacity-60 transition active:scale-95"
        >
          COPY
        </button>
      </div>
      <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  /* ------------------------------ */
  /* Content */
  /* ------------------------------ */
  const PRICING_PLANS = [
      {
        id: 'standard',
        name: 'Standard',
        credits: 1_000,
        price: '$5',
        bonus: 'No bonus',
        highlight: false,
      },
      {
        id: 'tactical',
        name: 'Tactical',
        credits: 3_000,
        price: '$12',
        bonus: '+20% bonus',
        highlight: true,
      },
      {
        id: 'operative',
        name: 'Operative',
        credits: 10_000,
        price: '$35',
        bonus: '+45% bonus',
        highlight: false,
      },
    ];

  const handleBuyCredits = (planId: string) => {
    console.log(`Purchasing plan: ${planId}`);
    // hook Stripe / LemonSqueezy / Paddle here
  };
  
  const content: Record<
    ModalType,
    { title: string; body: React.ReactNode }
  > = {
    SDK: {
      title: 'Developer SDK',
      body: (
        <div className="space-y-8">
          <Section title="Install">
            <p className="text-sm opacity-60">
              Install the VOXPACT SDK via NPM.
            </p>
            <CodeBlock
              label="Terminal"
              code="npm install @voxpact/neural-sdk"
            />
          </Section>

          <Section title="Initialize Session">
            <p className="text-sm opacity-60">
              Create a live multimodal session using your API key.
            </p>
            <CodeBlock
              label="TypeScript"
              code={`import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

const session = await ai.live.connect({
  model: "gemini-2.5-flash-native-audio-preview",
  config: {
    responseModalities: ["AUDIO"],
  },
});`}
            />
          </Section>

          <Section title="Tooling">
            <p className="text-sm opacity-60">
              Define callable tools for structured operations.
            </p>
            <CodeBlock
              label="Tool Definition"
              code={`const tool = {
  name: "deploy_payload",
  parameters: {
    type: "OBJECT",
    properties: {
      sector_id: { type: "STRING" },
      magnitude: { type: "NUMBER" },
    },
    required: ["sector_id"],
  },
};`}
            />
          </Section>

          <Section title="Web Grounding">
            <p className="text-sm opacity-60">
              Enable real-time web verification.
            </p>
            <CodeBlock
              label="Grounded Query"
              code={`await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Paris Olympics 2024 performance",
  config: { tools: [{ googleSearch: {} }] },
});`}
            />
          </Section>
        </div>
      ),
    },

    PRICING: {
      title: 'Credit Packs',
      body: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map(plan => (
              <div
                key={plan.id}
                className={`
                  relative rounded-3xl border p-8 flex flex-col gap-6
                  transition-all duration-300
                  ${plan.highlight ? 'scale-[1.03]' : 'hover:-translate-y-1'}
                  ${
                    isDark
                      ? plan.highlight
                        ? 'bg-gradient-to-b from-[#0B0C10] to-[#1F2833] border-[#66FCF1]/40 shadow-[0_0_40px_rgba(102,252,241,0.15)]'
                        : 'bg-[#0B0C10] border-white/10'
                      : plan.highlight
                        ? 'bg-white border-[#007AFF]/40 shadow-xl'
                        : 'bg-white border-gray-200'
                  }
                `}
              >
                {plan.highlight && (
                  <span
                    className={`
                      absolute -top-3 left-1/2 -translate-x-1/2
                      px-4 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest
                      ${isDark ? 'bg-[#66FCF1] text-black' : 'bg-[#007AFF] text-white'}
                    `}
                  >
                    Most Popular
                  </span>
                )}

                <div className="text-center space-y-2">
                  <div
                    className={`text-[11px] font-mono uppercase tracking-widest ${
                      isDark ? 'text-[#66FCF1]' : 'text-[#007AFF]'
                    }`}
                  >
                    {plan.name}
                  </div>

                  <div className="text-4xl font-black tracking-tight">
                    {plan.credits.toLocaleString()}
                  </div>

                  <div className="text-[11px] opacity-50 uppercase">
                    Credits
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold">{plan.price}</div>
                  <div
                    className={`text-[11px] font-mono ${
                      plan.highlight
                        ? isDark
                          ? 'text-[#66FCF1]'
                          : 'text-[#007AFF]'
                        : 'opacity-50'
                    }`}
                  >
                    {plan.bonus}
                  </div>
                </div>

                <button
                  onClick={() => handleBuyCredits(plan.id)}
                  className={`
                    mt-auto w-full py-3 rounded-xl
                    text-[11px] font-bold uppercase tracking-widest
                    transition-all active:scale-95
                    ${
                      plan.highlight
                        ? isDark
                          ? 'bg-[#66FCF1] text-black hover:bg-[#45A29E]'
                          : 'bg-[#007AFF] text-white hover:bg-[#005FCC]'
                        : isDark
                          ? 'bg-white/10 hover:bg-white/20'
                          : 'bg-gray-100 hover:bg-gray-200'
                    }
                  `}
                >
                  Buy {plan.name}
                </button>
              </div>
            ))}
          </div>

          <div
            className={`
              rounded-xl border px-5 py-4 text-[10px] font-mono leading-relaxed
              ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white/50'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }
            `}
          >
            Credits are consumed by audio synthesis, grounding queries, and asset
            generation. All purchases are final.
          </div>
        </div>
      ),
    },

    ABOUT: {
      title: 'About',
      body: (
        <div className="space-y-4 text-sm leading-relaxed opacity-70">
          <p>
            VOXPACT is a real-time multimodal intelligence platform built
            on Gemini.
          </p>
          <p>
            It combines low-latency audio, grounded web intelligence, and
            high-fidelity visual synthesis into a single neural interface.
          </p>
        </div>
      ),
    },

    PRIVACY: {
      title: 'Privacy',
      body: (
        <ul className="space-y-3 text-sm font-mono opacity-60">
          <li>[01] No long-term audio storage</li>
          <li>[02] Zero-retention grounding queries</li>
          <li>[03] OAuth-secured authentication</li>
          <li>[04] AES-isolated local persistence</li>
        </ul>
      ),
    },

    AFFILIATION: {
      title: 'Partners',
      body: (
        <div className="space-y-4 text-sm opacity-70">
          <p>
            VOXPACT collaborates with select cloud, hardware, and AI
            infrastructure partners.
          </p>
          <p>
            Contact:{' '}
            <span
              className={isDark ? 'text-[#66FCF1]' : 'text-[#007AFF]'}
            >
              partners@voxpact.local
            </span>
          </p>
        </div>
      ),
    },
  };
  


  /* ------------------------------ */
  /* Render */
  /* ------------------------------ */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl">
      <div
        className={`w-full max-w-4xl rounded-[2.5rem] overflow-hidden border shadow-2xl ${
          isDark
            ? 'bg-[#1F2833] border-white/10 text-[#C5C6C7]'
            : 'bg-white border-gray-200 text-[#1F2833]'
        }`}
      >
        <div className="p-10">
          <header className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight uppercase">
              {content[type].title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:opacity-60 transition"
            >
              ✕
            </button>
          </header>

          <div className="max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            {content[type].body}
          </div>
        </div>

        <footer className="border-t p-3 text-center text-[9px] font-mono uppercase tracking-[0.6em] opacity-30">
          VOXPACT
        </footer>
      </div>
    </div>
  );
};
