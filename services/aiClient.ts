import { GoogleGenAI } from '@google/genai';
import { createFileTool, createPdfTool } from '../tools';

export const VITE_AGENT_ID_ELEVENLABS = import.meta.env.VITE_AGENT_ID_ELEVENLABS;

export const AI_model_chat = 'gemini-3-flash-preview';
export const AI_model_image_gen = 'gemini-3.1-flash-image-preview'
export const AI_model_video_gen ='veo-3.1-fast-generate-preview'
export const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
export const ai = new GoogleGenAI({apiKey});

export const aiConfig = {
  tools: [
    {google_search: {}}, 
    { functionDeclarations: [createFileTool, createPdfTool] }
  ],
  systemInstruction:
    'You are VOXPACT CORE, an elite tactical analyst. Be professional, technical, and high-fidelity. Use Google Search when information may be recent, factual, or uncertain.',
};
