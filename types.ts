
export type Theme = 'dark' | 'light';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  credits: number;
}

export interface SmartChatProps {
  project: Project | null;
  theme: Theme;
  onUpdateCredits: (amount: number) => void;
}

export interface PdfThemeConfig {
  primaryColor: string;
  fontFamily: 'helvetica' | 'times' | 'courier';
  fontSize: number;
}

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // base64
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  attachments?: Attachment[];
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}

export interface Project {
  id: string;
  name: string;
  viewType: 'LIVE' | 'CHAT' | 'IMAGE';
  createdAt: number;
  updatedAt: number;
  data: {
    messages?: ChatMessage[];
    images?: GeneratedImage[];
    transcripts?: Array<{ role: 'user' | 'model' | 'system', text: string }>;
  };
}

export enum ImageResolution {
  RES_1K = '1K',
  RES_2K = '2K',
  RES_4K = '4K',
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  resolution: string;
  timestamp: number;
}

// Modal Types
export type ModalType = 'PRICING' | 'ABOUT' | 'PRIVACY' | 'AFFILIATION' | 'SDK';

// Audio Types for Live API
export type PCMFloat32Data = Float32Array;
export type PCMInt16Data = Int16Array;
