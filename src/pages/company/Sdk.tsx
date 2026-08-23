
import { useState, type ReactNode } from 'react';
import {Check, ChevronRight, Clipboard, Code2, Cpu, Globe2, Terminal, Wrench, Zap} from 'lucide-react';
import { Theme } from '@/types/types';

type Language = | 'bash' | 'typescript' | 'javascript' | 'python' | 'json';

type CodeBlockProps = {
  code: string;
  label: string;
  language: Language;
};

/* ---------------------------------
   Language colors
--------------------------------- */

const LANGUAGE_STYLES: Record<
  Language,
  {
    badge: string;
    accent: string;
    icon: ReactNode;
  }
> = {
  bash: {
    badge:
      'border-[#66FCF1]/20 bg-[#66FCF1]/10 text-[#66FCF1]',
    accent: 'bg-[#66FCF1]',
    icon: <Terminal size={13} />,
  },

  typescript: {
    badge:
      'border-[#007ACC]/30 bg-[#007ACC]/10 text-[#4DA3FF]',
    accent: 'bg-[#007ACC]',
    icon: <Code2 size={13} />,
  },

  javascript: {
    badge:
      'border-[#F7DF1E]/30 bg-[#F7DF1E]/10 text-[#F7DF1E]',
    accent: 'bg-[#F7DF1E]',
    icon: <Code2 size={13} />,
  },

  python: {
    badge:
      'border-[#3776AB]/30 bg-[#3776AB]/10 text-[#4DA3FF]',
    accent: 'bg-[#3776AB]',
    icon: <Code2 size={13} />,
  },

  json: {
    badge:
      'border-[#A855F7]/30 bg-[#A855F7]/10 text-[#C084FC]',
    accent: 'bg-[#A855F7]',
    icon: <Code2 size={13} />,
  },
};

/* ---------------------------------
   Lightweight syntax highlighting
--------------------------------- */

function highlightCode(
  code: string,
  language: Language
) {
  const tokens = code.split(
    /(\b(?:const|let|var|import|from|export|async|await|new|return|function|class|def|if|else|elif|for|while|in|True|False|None|try|except|with|as|print)\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?\b|\/\/.*|#.*)/g
  );

  return tokens.map((token, index) => {
    if (!token) return null;

    /* Comments */
    if (
      token.startsWith('//') ||
      (language === 'python' && token.startsWith('#'))
    ) {
      return (
        <span
          key={index}
          className="text-[#C5C6C7]/35 italic"
        >
          {token}
        </span>
      );
    }

    /* Strings */
    if (
      token.startsWith('"') ||
      token.startsWith("'") ||
      token.startsWith('`')
    ) {
      return (
        <span
          key={index}
          className="text-[#A8FF78]"
        >
          {token}
        </span>
      );
    }

    /* Numbers */
    if (/^\d/.test(token)) {
      return (
        <span
          key={index}
          className="text-[#FF9D6E]"
        >
          {token}
        </span>
      );
    }

    /* Keywords */
    if (
      /^(const|let|var|import|from|export|async|await|new|return|function|class|def|if|else|elif|for|while|in|True|False|None|try|except|with|as|print)$/.test(
        token
      )
    ) {
      return (
        <span
          key={index}
          className="font-semibold text-[#C792EA]"
        >
          {token}
        </span>
      );
    }

    return (
      <span key={index}>
        {token}
      </span>
    );
  });
}

/* ---------------------------------
   Code block
--------------------------------- */

function CodeBlock({code, label, language}: CodeBlockProps) {

  const [copied, setCopied] = useState(false);
  const languageStyle = LANGUAGE_STYLES[language];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      window.setTimeout(
        () => setCopied(false),
        1800
      );
    } catch (error) {
      console.error(
        'Unable to copy code:',
        error
      );
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080A0D]/95 shadow-2xl transition-all duration-300 hover:border-white/20">
      {/* Language accent */}
      <div
        className={`absolute left-0 top-0 h-[2px] w-full ${languageStyle.accent}`}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.025] px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Terminal dots */}
          <div className="hidden gap-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          </div>

          {/* Language badge */}
          <span
            className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-black uppercase tracking-[0.15em] ${languageStyle.badge}`}
          >
            {languageStyle.icon}
            {label}
          </span>
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label} code`}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#C5C6C7]/45 transition-all duration-200 hover:bg-white/10 hover:text-[#66FCF1] active:scale-95"
        >
          {copied ? (
            <>
              <Check size={13} />
              Copied
            </>
          ) : (
            <>
              <Clipboard size={13} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="max-h-[520px] overflow-auto p-5 font-mono text-[12px] leading-7 text-[#C5C6C7]">
        <code>
          {highlightCode(
            code,
            language
          )}
        </code>
      </pre>
    </div>
  );
}

/* ---------------------------------
   SDK data
--------------------------------- */

type SdkStep = {
  number: string;
  title: string;
  description: string;
  label: string;
  language: Language;
  code: string;
  icon: ReactNode;
};

const SDK_STEPS: SdkStep[] = [
  {
    number: '01',
    title: 'Install the SDK',
    description:
      'Install the VOXPACT SDK using npm.',
    label: 'Terminal',
    language: 'bash',
    icon: <Terminal size={18} />,
    code: `npm install @voxpact/neural-sdk`,
  },

  {
    number: '02',
    title: 'Connect with TypeScript',
    description:
      'Create a live multimodal session using your API key.',
    label: 'TypeScript',
    language: 'typescript',
    icon: <Zap size={18} />,
    code: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "YOUR_API_KEY",
});

const session =
  await ai.live.connect({
    model:
      "gemini-2.5-flash-native-audio-preview",

    config: {
      responseModalities: [
        "AUDIO",
      ],
    },
  });`,
  },

  {
    number: '03',
    title: 'Connect with Python',
    description:
      'Initialize the same AI client using the Python SDK.',
    label: 'Python',
    language: 'python',
    icon: <Code2 size={18} />,
    code: `from google import genai

client = genai.Client(
    api_key="YOUR_API_KEY"
)

response = (
    client.models
    .generate_content(
        model="gemini-2.5-flash",
        contents=(
            "Explain how "
            "VOXPACT works."
        ),
    )
)

print(response.text)`,
  },

  {
    number: '04',
    title: 'Add custom tools',
    description:
      'Define structured functions that the AI can call.',
    label: 'Tool definition',
    language: 'typescript',
    icon: <Wrench size={18} />,
    code: `const tool = {
  name: "deploy_payload",

  parameters: {
    type: "OBJECT",

    properties: {
      sector_id: {
        type: "STRING",
      },

      magnitude: {
        type: "NUMBER",
      },
    },

    required: [
      "sector_id",
    ],
  },
};`,
  },

  {
    number: '05',
    title: 'Enable web grounding',
    description:
      'Connect responses to real-time web information.',
    label: 'Grounded query',
    language: 'typescript',
    icon: <Globe2 size={18} />,
    code: `const response =
  await ai.models
    .generateContent({

      model:
        "gemini-3-flash-preview",

      contents:
        "Paris Olympics 2024 performance",

      config: {
        tools: [
          {
            googleSearch: {},
          },
        ],
      },
    });`,
  },
];

/* ---------------------------------
   SDK page
--------------------------------- */

interface SdkProps{
  theme: Theme;
}

export function Sdk ({theme}: SdkProps) {
  const isDark = theme;

  const cardTheme = isDark
    ? 'border-white/10'
    : 'border-black/10';

  const mutedText = isDark
    ? 'text-[#C5C6C7]/90'
    : 'text-[#1F2833]/90';
  
  const spanText = isDark
    ? 'text-[#66FCF1] border-[#66FCF1]/5 bg-[#66FCF1]'
    : 'text-[#66FCF1]/90 border-[#66FCF1] bg-[#66FCF1]/90';

  return (
    <div className={`mx-auto w-full max-w-6xl space-y-16 pb-24 ${mutedText} ${cardTheme}`}>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-white/[0.03] px-6 py-12 shadow-2xl backdrop-blur-xl sm:px-10 sm:py-16">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#66FCF1]/10 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative max-w-3xl">
          <div className={`mb-6 inline-flex items-center gap-2 rounded-full border border-[#66FCF1] bg-[#66FCF1]/20 px-4 py-2`}>
            <Cpu
              size={15}
              className="text-[#66FCF1]"
            />

            <span className={`text-[10px] font-black uppercase tracking-[0.25em] text-[#66FCF1]`}>
              Developer documentation
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Build with the
            <span className="block text-[#66FCF1]">
              VOXPACT SDK.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#C5C6C7]/60 sm:text-lg">
            Integrate multimodal AI,
            custom tools, Python,
            TypeScript, and real-time
            web grounding.
          </p>

          <a
            href="#quick-start"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#66FCF1] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#0B0C10] transition-transform hover:scale-105 active:scale-95"
          >
            Start building
            <ChevronRight size={15} />
          </a>
        </div>
      </section>

      {/* Documentation steps */}
      <section
        id="quick-start"
        className="scroll-mt-10"
      >
        <div className="mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#66FCF1]">
            Quick start
          </p>

          <h2 className="mt-3 text-3xl font-black">
            From zero to connected.
          </h2>
        </div>

        <div className="space-y-10">
          {SDK_STEPS.map(
            (step) => (
              <section
                key={step.number}
                className="grid gap-6 lg:grid-cols-[230px_1fr]"
              >
                {/* Step information */}
                <div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/50 bg-[#66FCF1]/10 text-[#66FCF1]">
                      {step.icon}
                    </div>

                    <span className="text-xs font-black tracking-[0.2em] text-[#66FCF1]">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#C5C6C7]/55">
                    {step.description}
                  </p>
                </div>

                {/* Code */}
                <CodeBlock
                  code={step.code}
                  label={step.label}
                  language={
                    step.language
                  }
                />
              </section>
            )
          )}
        </div>
      </section>
    </div>
  );
}
