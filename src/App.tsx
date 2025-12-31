
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { LiveSession } from './components/LiveSession';
import { SmartChat } from './components/SmartChat';
import { VisualStudio } from './components/VisualStudio';
import { LandingPage } from './components/LandingPage';
import { User, Project, Theme } from '../types';
import { db, STARTING_CREDITS } from '../store/db';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export enum View {
  LIVE = 'LIVE',
  CHAT = 'CHAT',
  IMAGE = 'IMAGE'
}

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LIVE);
  const [user, setUser] = useState<User | null>(db.getUser());
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [theme, setTheme] = useState<Theme>(db.getTheme());
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleCredentialResponse = useCallback((response: any) => {
    const payload = parseJwt(response.credential);
    if (payload) {
      const googleUser: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        credits: STARTING_CREDITS
      };
      db.setUser(googleUser);
      setUser(googleUser);
    }
  }, []);

  useEffect(() => {
    const isPlaceholder = GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID");
    if (typeof window !== 'undefined' && (window as any).google && !isPlaceholder) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        setIsGoogleConfigured(true);
      } catch (err) {
        setIsGoogleConfigured(false);
      }
    } else {
      setIsGoogleConfigured(false);
    }
  }, [handleCredentialResponse]);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    db.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    const projects = db.getProjects();
    const userFiltered = user ? projects.filter(p => p.id.startsWith(user.id) || !p.id.includes('-')) : [];
    if (activeProject && !userFiltered.find(p => p.id === activeProject.id)) {
      setActiveProject(null);
    }
    if (!activeProject && userFiltered.length > 0) {
        const lastActiveForView = userFiltered.find(p => p.viewType === currentView);
        if (lastActiveForView) setActiveProject(lastActiveForView);
    }
  }, [currentView, user, activeProject]);

  const handleLogin = () => {
    if (isGoogleConfigured && (window as any).google) {
      (window as any).google.accounts.id.prompt();
    } else {
      const guestId = `guest-${Math.random().toString(36).substr(2, 9)}`;
      const mockUser: User = {
        id: guestId,
        name: 'Operative_' + guestId.slice(-4),
        email: 'guest@voxpact.nexus',
        avatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${guestId}`,
        credits: STARTING_CREDITS
      };
      db.setUser(mockUser);
      setUser(mockUser);
    }
  };

  const handleLogout = () => {
    db.setUser(null);
    setUser(null);
    setActiveProject(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    db.setUser(updatedUser);
    setUser(updatedUser);
  };

  const handleUpdateCredits = (amount: number) => {
    const newCredits = db.updateCredits(amount);
    setUser(prev => prev ? { ...prev, credits: newCredits } : null);
  };

  const handleSelectProject = (project: Project) => {
    setCurrentView(project.viewType as View);
    setActiveProject(project);
  };

  const handleNewProject = (viewType: View, name: string) => {
    const userIdPrefix = user ? `${user.id}-` : '';
    const newProject: Project = {
      id: `${userIdPrefix}${Date.now()}`,
      name: name.toUpperCase(),
      viewType,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: {}
    };
    db.saveProject(newProject);
    setActiveProject(newProject);
    setCurrentView(viewType);
  };

  const handleDeleteProject = (id: string) => {
    db.deleteProject(id);
    if (activeProject?.id === id) setActiveProject(null);
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  if (!user) {
    return <LandingPage onLogin={handleLogin} theme={theme} onThemeToggle={toggleTheme} isGoogleConfigured={isGoogleConfigured} />;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`flex h-screen w-screen overflow-hidden transition-all duration-700 ${isDark ? 'bg-[#0B0C10] text-[#C5C6C7]' : 'bg-[#F8F9FA] text-gray-900'}`}>
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className={`absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[160px] opacity-[0.03] bg-animate ${isDark ? 'bg-[#66FCF1]' : 'bg-[#007AFF]'}`}></div>
         <div className={`absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.02] bg-animate ${isDark ? 'bg-[#45A29E]' : 'bg-[#5856D6]'}`} style={{ animationDelay: '2s' }}></div>
      </div>

      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        onDeleteProject={handleDeleteProject}
        theme={theme}
        onThemeToggle={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className="flex-1 relative flex flex-col h-full overflow-hidden z-10">
        <header className="absolute top-0 left-0 w-full px-8 py-6 z-20 pointer-events-none flex justify-between items-center bg-gradient-to-b from-black/20 to-transparent backdrop-blur-[2px]">
            <div className="flex items-center gap-6 pointer-events-auto">
              <div className="flex flex-col">
                <h1 className={`text-2xl font-black tracking-tighter transition-all hover:tracking-normal ${isDark ? 'text-gradient' : 'text-[#007AFF]'}`}>
                  VOXPACT
                </h1>
                <span className={`text-[8px] font-mono tracking-[0.5em] uppercase opacity-40 -mt-1 ${isDark ? 'text-[#66FCF1]' : 'text-gray-500'}`}>
                  Neural_Nexus
                </span>
              </div>
              {activeProject && (
                <div className={`px-4 py-1.5 glass rounded-full text-[10px] font-mono uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500 ${isDark ? 'text-[#66FCF1] neon-border neon-glow' : 'text-gray-600 border-gray-200 shadow-sm'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                  {activeProject.name}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-6 pointer-events-auto">
                <div className="flex flex-col items-end">
                    <div className={`text-[9px] font-mono opacity-40 uppercase tracking-[0.3em] ${isDark ? 'text-white' : 'text-gray-600'}`}>
                      Session_Protocol
                    </div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#66FCF1]' : 'text-[#007AFF]'}`}>
                        {currentView.replace('_', ' ')} Link Established
                    </div>
                </div>
            </div>
        </header>

        <div className="flex-1 flex flex-col h-full pt-20">
          <div className="flex-1 overflow-hidden relative">
            {activeProject ? (
                <div className="h-full animate-in fade-in zoom-in-95 duration-700">
                  {currentView === View.LIVE && <LiveSession key={activeProject.id} project={activeProject} theme={theme} onUpdateCredits={handleUpdateCredits} />}
                  {currentView === View.CHAT && <SmartChat key={activeProject.id} project={activeProject} theme={theme} onUpdateCredits={handleUpdateCredits} />}
                  {currentView === View.IMAGE && <VisualStudio key={activeProject.id} project={activeProject} theme={theme} onUpdateCredits={handleUpdateCredits} />}
                </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center h-full opacity-20 text-center animate-pulse">
                  <div className={`w-24 h-24 mb-6 rounded-full border-2 flex items-center justify-center ${isDark ? 'border-[#66FCF1]/30' : 'border-[#007AFF]/30'}`}>
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                  <p className="font-mono text-[11px] tracking-[0.6em] uppercase">Initialize Sector Assignment</p>
                  <p className="font-mono text-[8px] tracking-[0.3em] uppercase mt-2 opacity-50">Sidebar Deployment Required</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
