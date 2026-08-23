
import React, { useRef, useState, useEffect } from 'react';
import { View, navItems, DarkLight } from '@/services/parameters';
import { User, Project, Theme } from '@/types/types';
import { db } from '@/store/db';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';


interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onLogin: () => void;
  onLogout: () => void;
  activeProject: Project | null;
  onSelectProject: (p: Project) => void;
  onNewProject: (view: View, name: string) => void;
  onDeleteProject: (id: string) => void;
  onUpdateUser: (user: User) => void;
  theme: Theme;
  onThemeToggle: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
   currentView, onViewChange, onLogin, onLogout, activeProject, onSelectProject, 
   onNewProject, onDeleteProject, onUpdateUser, theme, onThemeToggle, isCollapsed, 
   onToggleCollapse 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [namingView, setNamingView] = useState<View | null>(null);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();
  const {user, refreshUser, getProjects} = useAuth();


  const isDark = DarkLight(theme);
  const projects = user ? db.getProjects().filter(p => p.id.startsWith(user.user_id) || !p.id.includes('-')) : [];

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
  
  const NavigateViews = (view: View, user: User | null) => {
    switch(view) {
      case View.Settings:
        navigate(`/dashboard/User/${user?.user_id}/Settings`);
        onViewChange(View.Settings);
        break;
      case View.Account:
        navigate(`/dashboard/User/${user?.user_id}/Account`);
        onViewChange(View.Account);
        break;
      case View.Support:
        navigate(`/dashboard/User/${user?.user_id}/Support`);
        onViewChange(View.Support);
        break;
      case View.LIVE:
        navigate(`/dashboard/User/${user?.user_id}/Live`);
        onViewChange(View.LIVE);
        break;
      case View.CHAT:
        navigate(`/dashboard/User/${user?.user_id}/Chat`);
        onViewChange(View.CHAT);
        break;
      case View.IMAGE:
        navigate(`/dashboard/User/${user?.user_id}/ImageVideo`);
        onViewChange(View.IMAGE);
        break;
      case View.Success_Pay:
        navigate(`/dashboard/User/${user?.user_id}/Payment=Success`);
        onViewChange(View.Success_Pay);
        break;
      case View.Failed_Pay:
        navigate(`/dashboard/User/${user?.user_id}/Payment=Failed`);
        onViewChange(View.Failed_Pay);
        break;
      default:
        break;
    }
  }

  const submitNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namingView || !newName.trim()) return;

    onNewProject(namingView, newName.trim());
    if (currentView !== namingView) {
      // onViewChange(namingView);
      NavigateViews(namingView, user);
    }

    setNamingView(null);
    setNewName('');
  };

  useEffect(() => {
    if (!user?.user_id) return;

    refreshUser();
  }, [user?.credits]);

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-80'} border-r transition-all duration-700 flex flex-col z-40 relative
        ${isDark
          ? 'border-white/5 bg-[#0B0C10] shadow-[0_20px_60px_-15px_rgba(100,116,139,0.25)]'
          : 'border-gray-200 bg-white shadow-2xl'}
      `}
    >
      
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
      <div className="p-4 mb-3">
        {user ? (
          <div className={`px-1 py-4 rounded-[1.5rem] border transition-all duration-500 ${isDark ? 'bg-[#1F2833]/20 border-white/5 hover:bg-white/5' : 'bg-gray-50 border-gray-100 hover:bg-gray-100/50'}`}>
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
                    <div className={`text-[8px] font-mono opacity-40 uppercase mt-0.5 ${isDark ? 'text-white' : 'text-gray-500'}`}>{user?.credits ?? 0} CREDITS AVAILABLE</div>
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
                  placeholder="My first project..."
                  className={`w-full text-[10px] font-mono p-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-black/40 border-[#66FCF1]/30 text-[#66FCF1] focus:border-[#66FCF1]' : 'bg-gray-50 border-gray-200 focus:border-[#007AFF]'}`}
                />
              </form>
            )}

            <div className="space-y-1.5 px-1">
              {projects.filter(p => p.viewType === category.id).map(p => (
                <div 
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);

                    if (currentView !== p.viewType) {
                      onViewChange(category.id);
                      navigate(`/dashboard/User/${user?.user_id}/${category.link_path}`)
                    }
                  }}
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
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onDeleteProject(p.id);
                      navigate(`/dashboard/User/${user?.id}`);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-500 transition-all transform hover:rotate-90"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.244 2.244 0 0 1-2.244 2.077H8.084a2.244 2.244 0 0 1-2.244-2.077L4.772 5.79" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interface Controls */}
      <div className="p-1 border-t border-white/5">
        <div className="grid grid-cols-2 gap-1">

          {/* Theme Toggle */}
          <button 
            onClick={onThemeToggle}
            className={`w-full flex items-center justify-center gap-2 p-2 rounded-2xl border transition-all transform active:scale-95 ${
              isDark
                ? 'border-white/5 bg-white/5 text-[#66FCF1] hover:bg-white/10'
                : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            title={"Dark/Light"}
          >
            {isDark ? (
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21" />
              </svg>
            ) : (
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752" />
              </svg>
            )}
            {!isCollapsed && (
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {isDark ? 'LIGHT_UI' : 'DARK_UI'}
              </span>
            )}
            <span
              className={`overflow-hidden whitespace-nowrap
                          text-[9px] font-black uppercase tracking-[0.35em]
                          max-w-0 opacity-0
                          group-hover:max-w-[120px] group-hover:opacity-100
                          transition-all duration-200`}
            >
              Light/Night
            </span>
          </button>

          {/* Settings */}
          <button className={`w-full flex items-center justify-center gap-2 p-2 rounded-2xl border transition-all transform active:scale-95 ${
              isDark
                ? 'border-white/5 bg-white/5 text-[#66FCF1] hover:bg-white/10'
                : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            title={"Settings"}
            onClick = {() => NavigateViews(View.Settings, user)}
          >
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M10.325 4.317a1.724 1.724 0 013.35 0 1.724 1.724 0 002.573 1.066 1.724 1.724 0 012.37 2.37 1.724 1.724 0 001.065 2.572 1.724 1.724 0 010 3.35 1.724 1.724 0 00-1.066 2.573 1.724 1.724 0 01-2.37 2.37 1.724 1.724 0 00-2.572 1.065 1.724 1.724 0 01-3.35 0 1.724 1.724 0 00-2.573-1.066 1.724 1.724 0 01-2.37-2.37 1.724 1.724 0 00-1.065-2.572 1.724 1.724 0 010-3.35 1.724 1.724 0 001.066-2.573 1.724 1.724 0 012.37-2.37 1.724 1.724 0 002.572-1.065z" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {!isCollapsed && (
              <span className="text-[9px] font-black uppercase tracking-[0.35em]">
                Settings
              </span>
            )}
          </button>

          {/* Account */}
          {user && (
            <button className={`w-full flex items-center justify-center gap-2 p-2 rounded-2xl border transition-all transform active:scale-95 ${
              isDark
                ? 'border-white/5 bg-white/5 text-[#66FCF1] hover:bg-white/10'
                : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            title={"Account"}
            onClick = {() => NavigateViews(View.Account, user)}
            >
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                <path d="M4.5 20.25a7.5 7.5 0 0115 0" />
              </svg>
              {!isCollapsed && (
                <span className="text-[9px] font-black uppercase tracking-[0.35em]">
                  Account
                </span>
              )}
            </button>
          )}

          {/* Help / Support */}
          <button className={`w-full flex items-center justify-center gap-2 p-2 rounded-2xl border transition-all transform active:scale-95 ${
              isDark
                ? 'border-white/5 bg-white/5 text-[#66FCF1] hover:bg-white/10'
                : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            title={"Support"}
            onClick = {() => NavigateViews(View.Support, user)}
          >
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
              <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4" />
              <path d="M12 17h.01" />
            </svg>
            {!isCollapsed && (
              <span className="text-[9px] font-black uppercase tracking-[0.35em]">
                Support
              </span>
            )}
          </button>
        </div>

        {/* Logout */}
        <button
            onClick={() => {
              onLogout();
              navigate('/')
            }}
            className="w-full flex flex-row items-center justify-center p-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all text-center"
            title="Logout"
          >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
              <path d="M18 12H9m0 0l3-3m-3 3l3 3" />
          </svg>
          {!isCollapsed && user && (
              <span className="text-[9px] font-black uppercase tracking-[0.35em]">
                 Protocol_Disconnect </span>
          )}
        </button>
        
      </div>


    </aside>
  );
};
