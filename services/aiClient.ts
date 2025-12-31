import { GoogleGenAI } from '@google/genai';
import { createFileTool, createPdfTool } from '../tools';

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const aiConfig = {
  tools: [{ functionDeclarations: [createFileTool, createPdfTool] }],
  systemInstruction:
    'You are VOXPACT CORE, an elite tactical analyst. Be professional, technical, and high-fidelity.',
};
