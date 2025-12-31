import React, {useState,useRef,useEffect,useCallback,useMemo} from 'react';
import { jsPDF } from 'jspdf';
import { GoogleGenAI } from '@google/genai';

import { SmartChatProps, PdfThemeConfig, ChatMessage, Project, Theme, Attachment } from '../../types';
import { db } from '../../store/db';
import { createFileTool, createPdfTool } from '../../tools';
import { createPdf } from '../../services/pdfGenerator';
import {ai, aiConfig} from '../../services/aiClient';

/* ???????????????????????????? Constants ???????????????????????????? */

const COST_PER_CHAT = 5;
const PAGE_MARGIN = 20;
const PAGE_TOP = 30;
const PAGE_BOTTOM = 270;

/* ???????????????????????????? Component ???????????????????????????? */

export const SmartChat: React.FC<SmartChatProps> = ({
  project,
  theme,
  onUpdateCredits
}) => {
  /* ????????? State ????????? */

  const [messages, setMessages] = useState<ChatMessage[]>(
    project?.data?.messages ?? []
  );
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] =
    useState<string | null>(null);
  const [showPdfSettings, setShowPdfSettings] = useState(false);

  const [pdfTheme, setPdfTheme] = useState<PdfThemeConfig>({
    primaryColor: theme === 'dark' ? '#66FCF1' : '#007AFF',
    fontFamily: 'helvetica',
    fontSize: 11
  });

  /* ????????? Refs ????????? */

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const isDark = useMemo(() => theme === 'dark', [theme]);

  /* ???????????????????????????? Effects ???????????????????????????? */

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, isLoading, attachedFiles]);

  // Speech recognition setup
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) return;

    const rec = new SR();
    rec.continuous = false;

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };

    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
  }, []);

  // Throttled persistence
  useEffect(() => {
    if (!project) return;

    const t = setTimeout(() => {
      db.saveProject({
        ...project,
        data: { ...project.data, messages }
      });
    }, 400);

    return () => clearTimeout(t);
  }, [messages, project]);

  /* ???????????????????????????? Helpers ???????????????????????????? */

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    isListening
      ? recognitionRef.current.stop()
      : recognitionRef.current.start();
    setIsListening(v => !v);
  }, [isListening]);

  const toggleSpeak = useCallback((id: string, text: string) => {
    window.speechSynthesis.cancel();

    if (currentlySpeakingId === id) {
      setCurrentlySpeakingId(null);
      return;
    }

    const u = new SpeechSynthesisUtterance(text);
    u.onend = () => setCurrentlySpeakingId(null);
    setCurrentlySpeakingId(id);
    window.speechSynthesis.speak(u);
  }, [currentlySpeakingId]);

  const handleFileChange = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const encoded = await Promise.all(
      files.map(
        file =>
          new Promise<Attachment>(res => {
            const r = new FileReader();
            r.onload = () =>
              res({
                name: file.name,
                mimeType: file.type || 'application/octet-stream',
                data: (r.result as string).split(',')[1]
              });
            r.readAsDataURL(file);
          })
      )
    );

    setAttachedFiles(prev => [...prev, ...encoded]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);


  /* ???????????????????????????? Send Logic ???????????????????????????? */

  const handleSend = useCallback(async () => {
    if (isLoading) return;
    if (!input.trim() && attachedFiles.length === 0) return;

    const user = db.getUser();
    if (!user || user.credits < COST_PER_CHAT) {
      setMessages(p => [
        ...p,
        {
          id: crypto.randomUUID(),
          role: 'model',
          text: 'INSUFFICIENT CREDITS.',
          timestamp: Date.now()
        }
      ]);
      return;
    }

    onUpdateCredits(-COST_PER_CHAT);

    const snapshot = [...messages];
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
      attachments: attachedFiles.length ? attachedFiles : undefined
    };

    setMessages(p => [...p, userMsg]);
    setInput('');
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      const contents = [...snapshot, userMsg].slice(-10).map(m => ({
        role: m.role,
        parts: [
          ...(m.attachments?.map(a => ({
            inlineData: { data: a.data, mimeType: a.mimeType }
          })) ?? []),
          { text: m.text }
        ]
      }));

      let response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents,
        config: aiConfig
      });

      while (response.functionCalls?.length) {
        const toolResponses = [];

        for (const call of response.functionCalls) {
          let result = 'FAILED';

          if (call.name === 'create_pdf') {
            result = await createPdf(
              call.args.filename,
              call.args.content,
              call.args.visual_prompts
            );
          }

          toolResponses.push({
            functionResponse: {
              id: call.id,
              name: call.name,
              response: { result }
            }
          });
        }

        contents.push({ role: 'user', parts: toolResponses });

        response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents,
          config: aiConfig
        });
      }

      setMessages(p => [
        ...p,
        {
          id: crypto.randomUUID(),
          role: 'model',
          text: response.text || 'PROTOCOL COMPLETE.',
          timestamp: Date.now()
        }
      ]);
    } catch (e: any) {
      setMessages(p => [
        ...p,
        {
          id: crypto.randomUUID(),
          role: 'model',
          text: `ERROR: ${e.message}`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [
    messages,
    input,
    attachedFiles,
    isLoading,
    createPdf,
    onUpdateCredits
  ]);

  /* ???????????????????????????? Render UI ???????????????????????????? */
  return (
    <div className={`flex flex-col h-full relative overflow-hidden transition-colors ${isDark ? 'bg-[#0B0C10]' : 'bg-[#F8F9FA]'}`}>
      <div className="flex-1 overflow-y-auto px-6 md:px-12 pt-16 pb-48 space-y-10 custom-scrollbar" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20 text-center animate-pulse">
            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.827-1.24L3 20l1.24-4.827C3.03 13.67 3 12.33 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase">Sector Analysis Awaiting Query</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group/msg animate-in fade-in slide-in-from-bottom-2 duration-400`}>
            <div className={`max-w-[85%] md:max-w-[70%] p-6 rounded-3xl relative transition-all border ${msg.role === 'user' ? (isDark ? 'bg-[#1F2833]/80 text-[#C5C6C7] border-[#45A29E]/20' : 'bg-white border-gray-200 shadow-sm') : (isDark ? 'bg-[#45A29E]/5 text-[#66FCF1] border-[#66FCF1]/20' : 'bg-[#007AFF]/5 text-[#007AFF] border-[#007AFF]/10')}`}>
              <div className="text-[9px] font-mono mb-2 uppercase tracking-widest opacity-40">{msg.role} // {new Date(msg.timestamp).toLocaleTimeString()}</div>
              {msg.role === 'model' && (
                <button onClick={() => toggleSpeak(msg.id, msg.text)} className={`absolute -right-12 top-2 p-3 rounded-2xl transition-all ${currentlySpeakingId === msg.id ? 'bg-red-500 text-white animate-pulse' : `opacity-0 group-hover/msg:opacity-100 ${isDark ? 'bg-[#1F2833] text-[#66FCF1]' : 'bg-white text-[#007AFF] shadow-md'}`}`}>
                  {currentlySpeakingId === msg.id ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                  )}
                </button>
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-light">{msg.text}</div>
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {msg.attachments.map((a, i) => (
                    <div key={i} className="px-2 py-1 rounded bg-black/10 text-[8px] font-mono opacity-60">📎 {a.name}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="p-4 opacity-50 animate-pulse text-[10px] uppercase font-mono tracking-widest">SYNTHESIZING...</div>}
      </div>

      {/* PDF Settings Overlay */}
      {showPdfSettings && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className={`w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl transition-all ${isDark ? 'bg-[#1F2833] border-[#45A29E]/30 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest">PDF_SYNTH_PARAMETERS</h3>
                <button onClick={() => setShowPdfSettings(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="space-y-6">
                 <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono uppercase opacity-50">Strategic Accent Color</label>
                    <div className="flex gap-2">
                       {['#66FCF1', '#45A29E', '#007AFF', '#FF4757', '#F1C40F'].map(c => (
                         <button 
                          key={c} 
                          onClick={() => setPdfTheme(p => ({...p, primaryColor: c}))} 
                          className={`w-8 h-8 rounded-lg border-2 transition-all ${pdfTheme.primaryColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'}`} 
                          style={{backgroundColor: c}} 
                         />
                       ))}
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono uppercase opacity-50">Typographic Profile</label>
                    <select value={pdfTheme.fontFamily} onChange={(e) => setPdfTheme(p => ({...p, fontFamily: e.target.value as any}))} className={`p-3 rounded-xl text-xs outline-none border transition-all ${isDark ? 'bg-black/40 text-[#66FCF1] border-[#45A29E]/30' : 'bg-gray-50 border-gray-200'}`}>
                       <option value="helvetica">HELVETICA_TRIAL</option>
                       <option value="times">TIMES_SERIF</option>
                       <option value="courier">COURIER_MONO</option>
                    </select>
                 </div>
              </div>
              <button 
                onClick={() => setShowPdfSettings(false)} 
                className={`w-full py-4 mt-8 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-[#66FCF1] text-black hover:bg-[#45A29E]' : 'bg-[#007AFF] text-white hover:bg-[#0056B3]'}`}
              >
                Apply Parameters
              </button>
           </div>
        </div>
      )}

      {/* Command Hub */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto space-y-4">
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-6">
              {attachedFiles.map((f, i) => (
                <div key={i} className={`px-3 py-1.5 rounded-xl border text-[9px] font-mono flex items-center gap-2 ${isDark ? 'bg-[#1F2833] border-[#45A29E]/30 text-[#66FCF1]' : 'bg-white border-gray-200 text-[#007AFF]'}`}>
                  {f.name} <button onClick={() => setAttachedFiles(p => p.filter((_, idx) => idx !== i))} className="hover:text-red-500 font-bold ml-1">×</button>
                </div>
              ))}
            </div>
          )}
          <div className={`p-3 rounded-[3rem] border flex items-center gap-2 backdrop-blur-3xl shadow-2xl transition-all ${isDark ? 'bg-[#1F2833]/60 border-[#45A29E]/20' : 'bg-white/90 border-gray-100'}`}>
            <div className="flex gap-1 px-2 border-r border-white/5">
              <button onClick={() => fileInputRef.current?.click()} className={`p-3 rounded-2xl transition-all ${isDark ? 'text-[#45A29E] hover:text-[#66FCF1]' : 'text-gray-400 hover:text-[#007AFF]'}`} title="Attach asset">📎</button>
              <button 
                onClick={() => setShowPdfSettings(true)} 
                className={`p-3 rounded-2xl transition-all ${showPdfSettings ? 'bg-current/10 text-current' : (isDark ? 'text-[#45A29E] hover:text-[#66FCF1]' : 'text-gray-400 hover:text-[#007AFF]')}`}
                title="Document synthesis settings"
              >
                📄
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder="Submit Intelligence Query..." 
              className={`flex-1 bg-transparent py-4 px-2 text-sm focus:outline-none placeholder:opacity-30 ${isDark ? 'text-white' : 'text-gray-900'}`} 
            />
            <button onClick={toggleListening} className={`p-3 rounded-2xl transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : ''}`}>🎙️</button>
            <button 
              onClick={handleSend} 
              disabled={isLoading || (!input.trim() && attachedFiles.length === 0)} 
              className={`p-4 rounded-full transition-all flex items-center justify-center h-12 w-12 flex-shrink-0 ${isDark ? 'bg-[#66FCF1] text-black hover:shadow-[0_0_20px_rgba(102,252,241,0.4)]' : 'bg-[#007AFF] text-white hover:bg-[#0056B3]'} disabled:opacity-20`}
            >
              ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
