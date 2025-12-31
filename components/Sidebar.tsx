
import React, { useRef, useState } from 'react';
import { View } from '../App';
import { User, SidebarProps, Project, Theme } from '../types';
import { db } from '../store/db';


export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, onViewChange, user, onLogin, onLogout, activeProject, onSelectProject, onNewProject, onDeleteProject, onUpdateUser, theme, onThemeToggle, isCollapsed, onToggleCollapse 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [namingView, setNamingView] = useState<View | null>(null);
  const [newName, setNewName] = useState('');
  
  const isDark = theme === 'dark';
  const projects = user ? db.getProjects().filter(p => p.id.startsWith(user.id) || !p.id.includes('-')) : [];

  const navItems = [
    { id: View.LIVE, label: 'Neural Uplink', sub: 'Tactical Voice', icon: 'M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z' },
    { id: View.CHAT, label: 'Intel Query', sub: 'Grounded Chat', icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227' },
    { id: View.IMAGE, label: 'Vision Synth', sub: 'Asset Gen', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159' },
  ];

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateUser({ ...user, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const startNaming = (view: View) => {
    setNamingView(view);
    setNewName('');
  };

  const submitNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (namingView && newName.trim()) {
      onNewProject(namingView, newName.trim());
      setNamingView(null);
      setNewName('');
    }
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-80'} border-r transition-all duration-700 flex flex-col z-40 relative ${isDark ? 'border-white/5 bg-[#0B0C10]' : 'border-gray-200 bg-white shadow-2xl'}`}>
      
      {/* Dynamic Toggle Control */}
      <button 
        onClick={onToggleCollapse}
        className={`absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-16 rounded-full glass z-50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${isDark ? 'neon-border text-[#66FCF1]' : 'border-gray-200 text-[#007AFF] shadow-lg bg-white'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-3.5 h-3.5 transition-transform duration-700 ${isCollapsed ? 'rotate-180' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Identity Core Terminal */}
      <div className="p-5 mb-4">
        {user ? (
          <div className={`p-4 rounded-[1.5rem] border transition-all duration-500 ${isDark ? 'bg-[#1F2833]/20 border-white/5 hover:bg-white/5' : 'bg-gray-50 border-gray-100 hover:bg-gray-100/50'}`}>
             <div className="flex items-center gap-4">
                <div className="relative group/avatar cursor-pointer shrink-0" onClick={handleAvatarClick}>
                    <img src={user.avatar} className={`w-11 h-11 rounded-full border-2 object-cover transition-all ${isDark ? 'border-[#66FCF1]/40 group-hover/avatar:border-[#66FCF1]' : 'border-[#007AFF]/40 group-hover/avatar:border-[#007AFF]'}`} alt="Operative" />
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                       <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 animate-in slide-in-from-left-2 duration-500">
                    <div className={`text-[11px] font-black truncate uppercase tracking-widest ${isDark ? 'text-[#66FCF1]' : 'text-gray-900'}`}>{user.name}</div>
                    <div className={`text-[8px] font-mono opacity-40 uppercase mt-0.5 ${isDark ? 'text-white' : 'text-gray-500'}`}>{user.credits} CR Tactical_Core</div>
                  </div>
                )}
             </div>
          </div>
        ) : (
          <button onClick={onLogin} className={`w-full p-4 border-2 border-dashed rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${isDark ? 'border-white/10 text-gray-500 hover:border-[#66FCF1]/50 hover:text-[#66FCF1]' : 'border-gray-200 text-gray-400 hover:border-[#007AFF] hover:text-[#007AFF]'}`}>Initialize_Uplink</button>
        )}
      </div>

      {/* Nav Hierarchy */}
      <div className="flex-1 overflow-y-auto px-3 space-y-10 custom-scrollbar pt-2">
        {navItems.map((category) => (
          <div key={category.id} className="space-y-3">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-3 animate-in fade-in duration-700">
                <div className="flex flex-col">
                  <span className={`text-[9px] font-black tracking-[0.4em] uppercase opacity-40 ${isDark ? 'text-[#45A29E]' : 'text-gray-500'}`}>
                    {category.label}
                  </span>
                  <span className="text-[7px] font-mono opacity-20 uppercase tracking-[0.2em]">{category.sub}</span>
                </div>
                <button 
                  onClick={() => startNaming(category.id)}
                  className={`p-1.5 rounded-lg transition-all transform hover:scale-110 active:scale-95 ${isDark ? 'text-[#66FCF1] hover:bg-[#66FCF1]/10' : 'text-[#007AFF] hover:bg-[#007AFF]/10'}`}
                  title={`New ${category.label} Sector`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </button>
              </div>
            )}
            
            {namingView === category.id && !isCollapsed && (
              <form onSubmit={submitNewProject} className="px-3 animate-in slide-in-from-top-3 duration-300">
                <input 
                  autoFocus 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => !newName && setNamingView(null)}
                  placeholder="DESIGNATION..."
                  className={`w-full text-[10px] font-mono p-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-black/40 border-[#66FCF1]/30 text-[#66FCF1] focus:border-[#66FCF1]' : 'bg-gray-50 border-gray-200 focus:border-[#007AFF]'}`}
                />
              </form>
            )}

            <div className="space-y-1.5 px-1">
              {projects.filter(p => p.viewType === category.id).map(p => (
                <div 
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className={`group flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all border transform active:scale-95 ${
                    activeProject?.id === p.id 
                      ? (isDark ? 'bg-[#1F2833] border-[#66FCF1]/40 text-[#66FCF1] shadow-[0_0_20px_rgba(102,252,241,0.1)]' : 'bg-[#007AFF]/10 border-[#007AFF]/20 text-[#007AFF] shadow-sm')
                      : (isDark ? 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50')
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-2 h-2 rounded-full shrink-0 transition-all ${activeProject?.id === p.id ? 'bg-current animate-pulse' : 'bg-gray-800 opacity-20'}`}></div>
                    {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-wider truncate animate-in fade-in duration-500">{p.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteProject(p.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-500 transition-all transform hover:rotate-90"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.244 2.244 0 0 1-2.244 2.077H8.084a2.244 2.244 0 0 1-2.244-2.077L4.772 5.79" /></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interface Controls */}
      <div className="p-5 border-t border-white/5 space-y-4">
        <button 
          onClick={onThemeToggle}
          className={`w-full flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all transform active:scale-95 ${isDark ? 'border-white/5 bg-white/5 text-[#66FCF1] hover:bg-white/10' : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
        >
          {isDark ? (
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21" /></svg>
          ) : (
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752" /></svg>
          )}
          {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.3em]">{isDark ? 'LIGHT_UI' : 'DARK_UI'}</span>}
        </button>
        {!isCollapsed && user && (
          <button onClick={onLogout} className="w-full p-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all text-center">Protocol_Disconnect</button>
        )}
      </div>
    </aside>
  );
};
