import { ModalType, Theme, User } from '../types/types';


 export enum View {
  LIVE = 'LIVE',
  CHAT = 'CHAT',
  IMAGE = 'IMAGE',
  Account = 'ACCOUNT',
  Settings = 'SETTINGS',
  Support = 'SUPPORT',
  Success_Pay = 'SUCCESS_PAY',
  Failed_Pay = 'FAILED_PAY',
  NONE = 'NONE',
}
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL

export const DarkLight = (theme: Theme) => theme === 'dark';
export const t = (theme: Theme, dark: string, light: string) => (DarkLight(theme) ? dark : light);

export const FOOTER_LINKS: { id: ModalType; label: string; path: string }[] = [
  { id: 'ABOUT', label: 'About', path: '/About' },
  { id: 'PRICING', label: 'Pricing', path: '/Pricing' },
  { id: 'PRIVACY', label: 'Privacy', path: '/Privacy'},
  { id: 'PARTNERS', label: 'Partners', path: '/Partners'},
  { id: 'COOKIES', label: 'Cookies', path: '/Cookies'},
  { id: 'TERMS', label: 'Terms', path: '/Terms'},
  { id: 'AFFILIATION', label: 'Affiliation', path: '/Affiliation'},
];

export const CORE_FEATURES = [
  {
    title: 'Neural Uplink',
    sub: 'Real-time voice chat',
    desc:
      'Bidirectional, ultra-low latency voice streaming with native multimodal fusion. Supports multi-speaker context, interruption handling, and synchronized audio intelligence.',
    icon: 'M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364-2.121 2.121M8.757 15.243l-2.121 2.121m0-11.364 2.121 2.121m9.486 9.486 2.121 2.121',
  },
  {
    title: 'Intel Query',
    sub: 'Smart chat',
    desc:
      'Real-time web-grounded intelligence with source attribution. Automatically synthesizes structured reports, citations, and exportable PDFs for decision-grade outputs.',
    icon: 'M11 4a7 7 0 1 1-4.95 11.95l-2.55 2.55 1.414 1.414 2.55-2.55A7 7 0 0 1 11 4Zm0 3v4l3 2',
  },
  {
    title: 'Vision Synth',
    sub: 'Image/Video generation',
    desc:
      'High-fidelity image synthesis up to 4K resolution. Precise aspect control, visual consistency, and asset scaling engineered for professional-grade visual intelligence.',
    icon: 'M3 7.5A2.25 2.25 0 0 1 5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5v9a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 16.5v-9Zm4.5 6 2.25-2.25a1.5 1.5 0 0 1 2.121 0L15 14.25l2.25-2.25',
  },
];

export const navItems = [
    { 
      id: View.LIVE, 
      link_path:"Live" , 
      label: 'Neural Uplink', 
      sub: 'Tactical Voice',
      icon: 'M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z' 
    },
    { 
      id: View.CHAT, 
      link_path:"Chat", 
      label: 'Intel Query', 
      sub: 'Grounded Chat', 
      icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227' 
    },
    { 
      id: View.IMAGE, 
      link_path:"ImageVideo", 
      label: 'Vision Synth', 
      sub: 'Asset Gen', 
      icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159' 
    }
];

const price_plans = await fetch(`${API_BASE_URL}/api/stripe/get/products`, 
            {credentials: "include"})
export const PRICING_PLANS = await price_plans.json()


export const handleBuyCredits = async (productID: string, User: User, mode: string,
       success_url: string, cancel_url: string, quantity: number) => {

    const stripeMode = mode === "One time" ? "payment" : "subscription"; 

    try {
      const res = await fetch(`${API_BASE_URL}/api/stripe/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            mode : stripeMode,
            quantity : quantity, 
            customer_email : User.email,
            success_url : success_url, 
            cancel_url : cancel_url, 
            priceId: productID,
            User_id: User.user_id
          }
        ),
      });

      const { url, status} = await res.json();

      if (!res.ok) {
        throw new Error(url.error || "Payment failed");
      }

      // Redirect to hosted checkout
      window.location.href = url;
      return true; 

    } catch (err) {
      console.error("Purchase error:", err);
      return false;
    }
  };


/* ---------------------------------- */
/* FAQ */
/* ---------------------------------- */
export const FAQ_ITEMS = [
  {
    question: 'What is VOXPACT?',
    answer:
      'VOXPACT is a multimodal AI platform that combines conversational AI, voice interaction, visual understanding, and web-grounded intelligence in one workspace.',
  },
  {
    question: 'What can I use VOXPACT for?',
    answer:
      'VOXPACT can be used for AI conversations, research, information discovery, voice interaction, visual analysis, brainstorming, and exploring complex topics with multimodal artificial intelligence.',
  },
  {
    question: 'Does VOXPACT support voice AI?',
    answer:
      'Yes. VOXPACT is designed around natural voice interaction, allowing users to communicate with AI using spoken language in addition to traditional text interaction.',
  },
  {
    question: 'Can VOXPACT analyze images?',
    answer:
      'VOXPACT is built around multimodal AI capabilities, allowing visual information to be used alongside natural language to help users understand images and other visual content.',
  },
  {
    question: 'Can VOXPACT search the web?',
    answer:
      'VOXPACT includes web intelligence capabilities designed to help users research topics, discover information, and connect AI conversations with information available on the web.',
  },
  {
    question: 'Is VOXPACT an AI assistant?',
    answer:
      'VOXPACT provides AI assistant capabilities while extending beyond traditional text chat through voice interaction, visual understanding, and web-connected intelligence.',
  },
];

export const Data_numbers_LandingPage = [
            {
              number: '385+',
              label: 'AI Models',
            },
            {
              number: '22K+',
              label: 'Interactions processed',
            },
            {
              number: '1K+',
              label: 'Supported integrations',
            },
            {
              number: '93%',
              label: 'User satisfaction',
            },
]


export const COST_PER_CHAT = 5;
export const PAGE_MARGIN = 20;
export const PAGE_TOP = 30;
export const PAGE_BOTTOM = 270;