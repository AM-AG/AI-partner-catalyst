import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Theme, Attachment } from '../types';
import { jsPDF } from 'jspdf';
import { GoogleGenAI } from '@google/genai';
import { db } from '../store/db';


interface PdfThemeConfig {
  primaryColor: string;
  fontFamily: 'helvetica' | 'times' | 'courier';
  fontSize: number;
}
const [pdfTheme, setPdfTheme] = useState<PdfThemeConfig>({
    primaryColor: theme === 'dark' ? '#66FCF1' : '#007AFF',
    fontFamily: 'helvetica',
    fontSize: 11
});

export const createPdf = async function generatePdf({filename,content,theme,visualPrompts,onImage,}: {
  filename: string;
  content: string;
  theme: PdfThemeConfig;
  visualPrompts?: string[];
  onImage?: () => Promise<string | null>;
}) {
  try {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxLineWidth = pageWidth - margin * 2;
    let yOffset = 30;

    const drawHeader = () => {
        doc.setFillColor(pdfTheme.primaryColor);
        doc.rect(0, 0, pageWidth, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont(pdfTheme.fontFamily, 'bold');
        doc.text('VOXPACT-STRATEGIC REPORT', margin, 10);
    };

    drawHeader();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const paragraphs = content.split('\n').filter(p => p.trim());

    for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i].trim();
        const isHeading = p.startsWith('#');
        const text = isHeading ? p.replace(/^#+\s*/, '') : p;

        if (isHeading) {
        doc.setTextColor(pdfTheme.primaryColor);
        doc.setFont(pdfTheme.fontFamily, 'bold');
        doc.setFontSize(pdfTheme.fontSize + 5);
        yOffset += 12;
        } else {
        doc.setTextColor(30, 30, 30);
        doc.setFont(pdfTheme.fontFamily, 'normal');
        doc.setFontSize(pdfTheme.fontSize);
        }

        const lines = doc.splitTextToSize(text, maxLineWidth);
        const textHeight = lines.length * (pdfTheme.fontSize * 0.6);
        if (yOffset + textHeight > 270) { doc.addPage(); drawHeader(); yOffset = 30; }
        doc.text(lines, margin, yOffset);
        yOffset += textHeight + 8;

        if (visualPrompts && visualPrompts[i] && yOffset < 200) {
        const user = db.getUser();
        if (user && user.credits >= COST_PER_PDF_IMAGE) {
            onUpdateCredits(-COST_PER_PDF_IMAGE);
            const imgResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: `Technical visual for: ${visualPrompts[i]}. Dark tactical aesthetic.` }] }
            });
            const imgData = imgResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
            if (imgData) { doc.addImage(`data:image/png;base64,${imgData}`, 'PNG', margin, yOffset, maxLineWidth, 70); yOffset += 75; }
        }
        }
    }
    doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    return `Success: ${filename} synthesized.`;
    } catch (e: any) { return `Error: ${e.message}`; }
}
