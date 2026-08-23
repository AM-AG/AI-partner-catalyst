
export type Theme = 'dark' | 'light';

export interface User {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  email: string;
  password?: string;
  credits: number;
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  keyHash: string;
  lastFour: string;
  createdAt: number;
  lastUsedAt?: number;
  revoked: boolean;
}

export interface LandingPageProps {
  theme: 'dark' | 'light';
  isGoogleConfigured: boolean;
}

export interface InfoModalProps {
  type: ModalType;
  onClose: () => void;
  theme: Theme;
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
export type ModalType = 'PRICING' | 'ABOUT' | 'PRIVACY' | 'PARTNERS' | 'TERMS' | 'COOKIES' | 'AFFILIATION' | 'SDK'| 'LOGIN';

// Audio Types for Live API
export type PCMFloat32Data = Float32Array;
export type PCMInt16Data = Int16Array;

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}