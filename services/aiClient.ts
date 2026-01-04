import { GoogleGenAI } from '@google/genai';
import { createFileTool, createPdfTool } from '../tools';

export const VITE_AGENT_ID_ELEVENLABS = import.meta.env.VITE_AGENT_ID_ELEVENLABS;

export const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY});

export const aiConfig = {
  tools: [{ functionDeclarations: [createFileTool, createPdfTool] }],
  systemInstruction:
    'You are VOXPACT CORE, an elite tactical analyst. Be professional, technical, and high-fidelity.',
};
