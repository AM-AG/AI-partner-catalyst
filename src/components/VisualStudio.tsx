
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GeneratedImage, ImageResolution, Project, Theme } from '../../types';
import { db } from '../../store/db';

interface VisualStudioProps {
  project: Project | null;
  theme: Theme;
  onUpdateCredits: (amount: number) => void;
}

const COST_PER_IMAGE = 30;

export const VisualStudio: React.FC<VisualStudioProps> = ({ project, theme, onUpdateCredits }) => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<ImageResolution>(ImageResolution.RES_1K);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>(project?.data?.images || []);
  const [error, setError] = useState<string | null>(null);
  const [hasAuth, setHasAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // @ts-ignore
      const authed = await window.aistudio.hasSelectedApiKey();
      setHasAuth(authed);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (project) {
      db.saveProject({
        ...project,
        data: { ...project.data, images: history }
      });
    }
  }, [history, project]);

  const handleOpenKeyDialog = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasAuth(true);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    const user = db.getUser();
    if (!user || user.credits < COST_PER_IMAGE) {
      setError("Insufficient tactical credits. Synthesis requires 30 CR.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      onUpdateCredits(-COST_PER_IMAGE);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9", imageSize: resolution } }
      });
      
      let found = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const url = `data:image/png;base64,${part.inlineData.data}`;
            const newImg: GeneratedImage = {
              id: Date.now().toString(),
              url, prompt, resolution, timestamp: Date.now()
            };
            setHistory(prev => [newImg, ...prev]);
            found = true;
            break;
          }
        }
      }
      if (!found) throw new Error("Neural node returned null data. Content filtered or server overload.");
    } catch (err: any) {
      setError(err.message || "Synthesis Failure. Uplink unstable.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isDark = theme === 'dark';

  if (!hasAuth) {
    return (
      <div className={`h-full flex flex-col items-center justify-center p-12 text-center transition-all duration-700 ${isDark ? 'bg-[#0B0C10]' : 'bg-[#F8F9FA]'}`}>
        <div className={`w-32 h-32 mb-8 rounded-[2.5rem] border-2 flex items-center justify-center animate-pulse ${isDark ? 'border-[#66FCF1]/20 text-[#66FCF1]' : 'border-[#007AFF]/20 text-[#007AFF]'}`}>
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-[0.5em] mb-4">Vision_Auth_Locked</h2>
        <p className={`max-w-md mx-auto text-sm font-light leading-relaxed mb-12 opacity-50 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Engaging visual synthesis protocols requires a secure neural key. Deploy your Google Cloud credentials to continue.
        </p>
        <button 
          onClick={handleOpenKeyDialog}
          className={`px-16 py-6 font-black rounded-[3rem] uppercase text-[11px] tracking-[0.4em] transition-all border shadow-2xl ${isDark ? 'bg-gradient-to-r from-[#66FCF1] to-[#45A29E] text-black hover:shadow-[0_0_40px_rgba(102,252,241,0.5)]' : 'bg-[#007AFF] text-white'}`}
        >
          Initialize Vision Core
        </button>
      </div>
    );
  }

  return (
    <div className={`h-full p-8 md:p-16 overflow-y-auto transition-all duration-700 custom-scrollbar ${isDark ? 'bg-[#0B0C10]' : 'bg-[#F8F9FA]'}`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Synthesis Hub */}
        <div className={`p-12 rounded-[3.5rem] glass border shadow-2xl relative overflow-hidden transition-all duration-700 animate-in slide-in-from-top-12 ${isDark ? 'border-white/5' : 'bg-white border-gray-100'}`}>
          <div className="absolute top-0 right-0 p-8 flex items-center gap-6">
             {['1K', '2K', '4K'].map(res => (
                <button 
                  key={res} 
                  onClick={() => setResolution(res as ImageResolution)}
                  className={`
                    px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${resolution === res 
                        ? (isDark ? 'bg-[#66FCF1] text-black shadow-lg shadow-[#66FCF1]/20' : 'bg-[#007AFF] text-white') 
                        : (isDark ? 'text-[#66FCF1]/30 hover:text-[#66FCF1]' : 'text-gray-300 hover:text-[#007AFF]')}
                  `}
                >
                  {res}
                </button>
             ))}
          </div>
          
          <div className="flex flex-col gap-4 mb-10">
             <span className={`text-[11px] font-mono uppercase tracking-[0.5em] opacity-30 ${isDark ? 'text-[#66FCF1]' : 'text-gray-500'}`}>Tactical_Asset_Generator</span>
             <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the neural visual map to be synthesized..."
                className={`w-full bg-transparent border-none outline-none text-2xl md:text-3xl font-light h-32 resize-none placeholder:opacity-10 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
             />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className={`
                w-full py-7 rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.5em] transition-all duration-700 relative overflow-hidden group
                ${isGenerating 
                    ? 'opacity-50 grayscale cursor-wait' 
                    : (isDark ? 'bg-gradient-to-r from-[#66FCF1] to-[#45A29E] text-[#0B0C10] hover:shadow-[0_0_50px_rgba(102,252,241,0.5)]' : 'bg-[#007AFF] text-white hover:bg-[#0056B3]')}
            `}
          >
            <span className="relative z-10">{isGenerating ? 'Neural Mapping in Progress...' : 'Synthesize Visual Asset (30 CR)'}</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>

        {error && (
          <div className={`p-6 rounded-3xl glass border-2 text-[11px] font-mono uppercase tracking-[0.3em] text-center animate-bounce ${isDark ? 'border-red-500/30 text-red-400' : 'border-red-200 text-red-600'}`}>
            [!] {error}
          </div>
        )}

        {/* Assets Hierarchy */}
        <div className="space-y-10">
            <div className="flex items-center gap-6">
                <h3 className={`text-xs font-black uppercase tracking-[0.5em] opacity-40 ${isDark ? 'text-[#66FCF1]' : 'text-gray-500'}`}>Synthesized_Registry</h3>
                <div className="h-[1px] flex-1 bg-current opacity-10"></div>
                <span className="text-[9px] font-mono opacity-30 uppercase">{history.length} Assets Logged</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {history.length === 0 && (
                <div className="col-span-full py-24 text-center opacity-10 italic tracking-widest uppercase text-sm">
                   Archive empty. Monitoring for new tactical assets...
                </div>
              )}
              {history.map((img) => (
                <div key={img.id} className={`group rounded-[2.5rem] overflow-hidden glass border-2 transition-all duration-700 hover:scale-[1.03] active:scale-95 ${isDark ? 'border-white/5 hover:border-[#66FCF1]/20' : 'bg-white border-gray-100 shadow-xl'}`}>
                  <div className="relative aspect-video overflow-hidden">
                    <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={img.prompt} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                       <p className="text-[11px] text-white font-mono uppercase tracking-widest line-clamp-3 leading-relaxed opacity-90">{img.prompt}</p>
                       <div className="mt-4 flex gap-3">
                          <button className="px-4 py-1.5 glass rounded-full text-[8px] font-mono uppercase hover:bg-white hover:text-black transition-colors">Download</button>
                          <button className="px-4 py-1.5 glass rounded-full text-[8px] font-mono uppercase hover:bg-white hover:text-black transition-colors">Source_Map</button>
                       </div>
                    </div>
                  </div>
                  <div className="p-6 flex justify-between items-center bg-black/5">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono uppercase opacity-40 leading-none">Registered</span>
                        <span className="text-[10px] font-black uppercase tracking-widest mt-1">{new Date(img.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${isDark ? 'border-white/10 text-[#66FCF1]' : 'border-gray-200 text-gray-500'}`}>
                        {img.resolution}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};
