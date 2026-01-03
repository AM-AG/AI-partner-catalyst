
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { GeneratedImage, ImageResolution, Project, Theme } from '../../types';
import { db } from '../../store/db';
import { ai } from '../../services/aiClient';

interface VisualStudioProps {
  project: Project | null;
  theme: Theme;
  onUpdateCredits: (amount: number) => void;
}

const COST_PER_IMAGE = 30;

//   const [prompt, setPrompt] = useState('');
//   const [resolution, setResolution] = useState<ImageResolution>(ImageResolution.RES_1K);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [history, setHistory] = useState<GeneratedImage[]>(project?.data?.images || []);
//   const [error, setError] = useState<string | null>(null);
//   const [hasAuth, setHasAuth] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       // @ts-ignore
//       const authed = await window.aistudio.hasSelectedApiKey();
//       setHasAuth(authed);
//     };
//     checkAuth();
//   }, []);

//   useEffect(() => {
//     if (project) {
//       db.saveProject({
//         ...project,
//         data: { ...project.data, images: history }
//       });
//     }
//   }, [history, project]);

//   const handleOpenKeyDialog = async () => {
//     // @ts-ignore
//     await window.aistudio.openSelectKey();
//     setHasAuth(true);
//   };

//   const handleGenerate = async () => {
//     if (!prompt) return;
//     const user = db.getUser();
//     if (!user || user.credits < COST_PER_IMAGE) {
//       setError("Insufficient tactical credits. Synthesis requires 30 CR.");
//       return;
//     }

//     setIsGenerating(true);
//     setError(null);

//     try {
//       onUpdateCredits(-COST_PER_IMAGE);
//       const response = await ai.models.generateContent({
//         model: 'gemini-3-pro-image-preview',
//         contents: { parts: [{ text: prompt }] },
//         config: { imageConfig: { aspectRatio: "16:9", imageSize: resolution } }
//       });
      
//       let found = false;
//       if (response.candidates?.[0]?.content?.parts) {
//         for (const part of response.candidates[0].content.parts) {
//           if (part.inlineData?.data) {
//             const url = `data:image/png;base64,${part.inlineData.data}`;
//             const newImg: GeneratedImage = {
//               id: Date.now().toString(),
//               url, prompt, resolution, timestamp: Date.now()
//             };
//             setHistory(prev => [newImg, ...prev]);
//             found = true;
//             break;
//           }
//         }
//       }
//       if (!found) throw new Error("Neural node returned null data. Content filtered or server overload.");
//     } catch (err: any) {
//       setError(err.message || "Synthesis Failure. Uplink unstable.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const isDark = theme === 'dark';

//   if (!hasAuth) {
//     return (
//       <div className={`h-full flex flex-col items-center justify-center p-12 text-center transition-all duration-700 ${isDark ? 'bg-[#0B0C10]' : 'bg-[#F8F9FA]'}`}>
//         <div className={`w-32 h-32 mb-8 rounded-[2.5rem] border-2 flex items-center justify-center animate-pulse ${isDark ? 'border-[#66FCF1]/20 text-[#66FCF1]' : 'border-[#007AFF]/20 text-[#007AFF]'}`}>
//           <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
//         </div>
//         <h2 className="text-2xl font-black uppercase tracking-[0.5em] mb-4">Vision_Auth_Locked</h2>
//         <p className={`max-w-md mx-auto text-sm font-light leading-relaxed mb-12 opacity-50 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//           Engaging visual synthesis protocols requires a secure neural key. Deploy your Google Cloud credentials to continue.
//         </p>
//         <button 
//           onClick={handleOpenKeyDialog}
//           className={`px-16 py-6 font-black rounded-[3rem] uppercase text-[11px] tracking-[0.4em] transition-all border shadow-2xl ${isDark ? 'bg-gradient-to-r from-[#66FCF1] to-[#45A29E] text-black hover:shadow-[0_0_40px_rgba(102,252,241,0.5)]' : 'bg-[#007AFF] text-white'}`}
//         >
//           Initialize Vision Core
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className={`h-full p-8 md:p-16 overflow-y-auto transition-all duration-700 custom-scrollbar ${isDark ? 'bg-[#0B0C10]' : 'bg-[#F8F9FA]'}`}>
//       <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
//         {/* Synthesis Hub */}
//         <div className={`p-12 rounded-[3.5rem] glass border shadow-2xl relative overflow-hidden transition-all duration-700 animate-in slide-in-from-top-12 ${isDark ? 'border-white/5' : 'bg-white border-gray-100'}`}>
//           <div className="absolute top-0 right-0 p-8 flex items-center gap-6">
//              {['1K', '2K', '4K'].map(res => (
//                 <button 
//                   key={res} 
//                   onClick={() => setResolution(res as ImageResolution)}
//                   className={`
//                     px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
//                     ${resolution === res 
//                         ? (isDark ? 'bg-[#66FCF1] text-black shadow-lg shadow-[#66FCF1]/20' : 'bg-[#007AFF] text-white') 
//                         : (isDark ? 'text-[#66FCF1]/30 hover:text-[#66FCF1]' : 'text-gray-300 hover:text-[#007AFF]')}
//                   `}
//                 >
//                   {res}
//                 </button>
//              ))}
//           </div>
          
//           <div className="flex flex-col gap-4 mb-10">
//              <span className={`text-[11px] font-mono uppercase tracking-[0.5em] opacity-30 ${isDark ? 'text-[#66FCF1]' : 'text-gray-500'}`}>Tactical_Asset_Generator</span>
//              <textarea
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 placeholder="Describe the neural visual map to be synthesized..."
//                 className={`w-full bg-transparent border-none outline-none text-2xl md:text-3xl font-light h-32 resize-none placeholder:opacity-10 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
//              />
//           </div>

//           <button
//             onClick={handleGenerate}
//             disabled={isGenerating || !prompt}
//             className={`
//                 w-full py-7 rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.5em] transition-all duration-700 relative overflow-hidden group
//                 ${isGenerating 
//                     ? 'opacity-50 grayscale cursor-wait' 
//                     : (isDark ? 'bg-gradient-to-r from-[#66FCF1] to-[#45A29E] text-[#0B0C10] hover:shadow-[0_0_50px_rgba(102,252,241,0.5)]' : 'bg-[#007AFF] text-white hover:bg-[#0056B3]')}
//             `}
//           >
//             <span className="relative z-10">{isGenerating ? 'Neural Mapping in Progress...' : 'Synthesize Visual Asset (30 CR)'}</span>
//             <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
//           </button>
//         </div>

//         {error && (
//           <div className={`p-6 rounded-3xl glass border-2 text-[11px] font-mono uppercase tracking-[0.3em] text-center animate-bounce ${isDark ? 'border-red-500/30 text-red-400' : 'border-red-200 text-red-600'}`}>
//             [!] {error}
//           </div>
//         )}

//         {/* Assets Hierarchy */}
//         <div className="space-y-10">
//             <div className="flex items-center gap-6">
//                 <h3 className={`text-xs font-black uppercase tracking-[0.5em] opacity-40 ${isDark ? 'text-[#66FCF1]' : 'text-gray-500'}`}>Synthesized_Registry</h3>
//                 <div className="h-[1px] flex-1 bg-current opacity-10"></div>
//                 <span className="text-[9px] font-mono opacity-30 uppercase">{history.length} Assets Logged</span>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//               {history.length === 0 && (
//                 <div className="col-span-full py-24 text-center opacity-10 italic tracking-widest uppercase text-sm">
//                    Archive empty. Monitoring for new tactical assets...
//                 </div>
//               )}
//               {history.map((img) => (
//                 <div key={img.id} className={`group rounded-[2.5rem] overflow-hidden glass border-2 transition-all duration-700 hover:scale-[1.03] active:scale-95 ${isDark ? 'border-white/5 hover:border-[#66FCF1]/20' : 'bg-white border-gray-100 shadow-xl'}`}>
//                   <div className="relative aspect-video overflow-hidden">
//                     <img src={img.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={img.prompt} />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
//                        <p className="text-[11px] text-white font-mono uppercase tracking-widest line-clamp-3 leading-relaxed opacity-90">{img.prompt}</p>
//                        <div className="mt-4 flex gap-3">
//                           <button className="px-4 py-1.5 glass rounded-full text-[8px] font-mono uppercase hover:bg-white hover:text-black transition-colors">Download</button>
//                           <button className="px-4 py-1.5 glass rounded-full text-[8px] font-mono uppercase hover:bg-white hover:text-black transition-colors">Source_Map</button>
//                        </div>
//                     </div>
//                   </div>
//                   <div className="p-6 flex justify-between items-center bg-black/5">
//                     <div className="flex flex-col">
//                         <span className="text-[9px] font-mono uppercase opacity-40 leading-none">Registered</span>
//                         <span className="text-[10px] font-black uppercase tracking-widest mt-1">{new Date(img.timestamp).toLocaleDateString()}</span>
//                     </div>
//                     <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${isDark ? 'border-white/10 text-[#66FCF1]' : 'border-gray-200 text-gray-500'}`}>
//                         {img.resolution}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export const VisualStudio: React.FC = () => {
  const [genType, setGenType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('16:9');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null);

  const generateImage = async (customPrompt?: string) => {
    try {
      setIsGenerating(true);
      setStatusText('Visualizing your imagination...');
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: customPrompt || prompt }] },
        config: { imageConfig: { aspectRatio } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const url = `data:image/png;base64,${part.inlineData.data}`;
          setResultUrl(url);
          setLastGeneratedImage(part.inlineData.data);
          break;
        }
      }
    } catch (e) {
      console.error(e);
      setStatusText('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateVideo = async (useRefImage = false) => {
    try {
      // Check for Veo API Key Selection requirement
      // @ts-ignore
      if (!(await window.aistudio.hasSelectedApiKey())) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }

      setIsGenerating(true);
      setStatusText('Initializing Veo engine...');

      const videoConfig: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Cinematic cinematic scenery',
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      };

      if (useRefImage && lastGeneratedImage) {
        videoConfig.image = {
          imageBytes: lastGeneratedImage,
          mimeType: 'image/png'
        };
      }

      let operation = await ai.models.generateVideos(videoConfig);
      
      const messages = [
        'Analyzing conceptual layout...',
        'Synthesizing temporal consistency...',
        'Rendering cinematic lighting...',
        'Finalizing neural frames...',
        'Optimizing bitrate...'
      ];
      let msgIdx = 0;

      while (!operation.done) {
        setStatusText(messages[msgIdx % messages.length]);
        msgIdx++;
        await new Promise(r => setTimeout(r, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      setStatusText('Video synthesis failed. Ensure you have a paid project linked.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isDark = 'dark';

  return (
    <div className="h-full flex flex-col items-center justify-start p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl w-full space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 uppercase">
            Creative Engine
          </h2>
          <p className={`text-grey/60 text-xs font-bold tracking-[0.3em] uppercase ${isDark ? 'text-grey-600' : 'text-white/30'}`}>Gemini 2.5 & Veo 3.1 Fast</p>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-xl">
            <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/5 w-fit">
              <button 
                disabled={isGenerating}
                onClick={() => setGenType('IMAGE')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${genType === 'IMAGE' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-white/40 hover:text-white/60'}`}
              >
                Image
              </button>
              <button 
                disabled={isGenerating}
                onClick={() => setGenType('VIDEO')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${genType === 'VIDEO' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'text-white/40 hover:text-white/60'}`}
              >
                Video
              </button>
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-grey-600' : 'text-white/30'}`}>Visual Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your vision..."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all resize-none placeholder:text-white/30"
              />
            </div>

            <div className={`space-y-4 ${isDark ? 'text-grey-600' : 'text-white/30'}`}>
               <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-grey-600' : 'text-white/30'}`}>Aspect Ratio</label>
               <div className="flex gap-3">
                 {['1:1', '16:9', '9:16'].map(ratio => (
                   <button 
                    key={ratio}
                    onClick={() => setAspectRatio(ratio as any)}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black transition-all ${isDark ? 'text-grey-600' : 'text-white/30'} ${aspectRatio === ratio ? 'bg-cyan-500' : ''}`}
                   >
                     {ratio}
                   </button>
                 ))}
               </div>
            </div>

            <button 
              disabled={isGenerating || !prompt}
              onClick={() => genType === 'IMAGE' ? generateImage() : generateVideo()}
              className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-400 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl active:scale-[0.98]"
            >
              {isGenerating ? 'Processing...' : `Generate ${genType}`}
            </button>
          </div>

          {/* Result Area */}
          <div className="relative group aspect-square md:aspect-auto h-full min-h-[400px] bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                  <div className="absolute inset-0 border-2 border-t-cyan-500 rounded-full animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-cyan-400 text-xs font-black tracking-widest uppercase animate-pulse">{statusText}</p>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest max-w-[200px]">This may take a moment for video synthesis</p>
                </div>
              </div>
            ) : resultUrl ? (
              <div className="relative w-full h-full p-4 animate-in fade-in duration-700">
                {genType === 'IMAGE' ? (
                  <img src={resultUrl} className="w-full h-full object-contain rounded-2xl shadow-2xl" alt="Generated" />
                ) : (
                  <video src={resultUrl} controls className="w-full h-full object-contain rounded-2xl shadow-2xl" />
                )}
                
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <a href={resultUrl} download={`gemini-${Date.now()}`} className="px-6 py-2 bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all">
                    Download
                  </a>
                  {genType === 'IMAGE' && (
                    <button 
                      onClick={() => { setGenType('VIDEO'); generateVideo(true); }}
                      className="px-6 py-2 bg-indigo-600/80 backdrop-blur-md border border-indigo-500/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-indigo-500 transition-all"
                    >
                      Animate this
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center p-12 space-y-4">
                <div className="w-12 h-12 border border-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                </div>
                <p className="text-[10px] text-white/20 font-black tracking-[0.4em] uppercase">Canvas Awaiting Input</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

