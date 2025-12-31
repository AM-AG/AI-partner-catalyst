
import { FunctionDeclaration, Type } from '@google/genai';

/**
 * Tool to create and download a file on the user's machine.
 */
export const createFileTool: FunctionDeclaration = {
  name: 'create_text_file',
  description: 'Creates a downloadable text file. Use this when the user asks to save, write, or create a file.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      filename: { type: Type.STRING, description: 'The name of the file (e.g., "notes.txt").' },
      content: { type: Type.STRING, description: 'The text content.' },
      mimeType: { type: Type.STRING, description: 'MIME type (default: "text/plain").' },
    },
    required: ['filename', 'content'],
  },
};

/**
 * Tool to generate and download a PDF document with advanced visualization.
 */
export const createPdfTool: FunctionDeclaration = {
  name: 'create_pdf',
  description: 'Generates a professional PDF intel report with bold headings and AI-synthesized paragraph visuals.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      filename: { type: Type.STRING, description: 'The name of the PDF (e.g., "intel_report.pdf").' },
      content: { type: Type.STRING, description: 'The report text. Use # for headings.' },
      visual_prompts: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Optional array of image prompts, one for each paragraph, to synthesize visual summaries in the report.'
      }
    },
    required: ['filename', 'content'],
  },
};
