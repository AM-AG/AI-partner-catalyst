import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';

import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { LiveSession } from './LiveSession';
import { SmartChat } from './SmartChat';
import { VisualStudio } from './VisualStudio';

import { View } from '../../services/parameters';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useProjects } from '../../hooks/useProjects';
import { Theme, User } from '@/types/types';

interface DashboardProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onupdateUser: (user: User) => void;
  login: () => any;
  logout: () => void;
  projects: any;
  theme: Theme;
  onThemeToggle: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  currentView, onViewChange,  onupdateUser, 
  login, logout, projects, theme, onThemeToggle, isCollapsed, onToggleCollapse 
}) => {
    const isDark = theme === 'dark';

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden transition-all duration-400 ${
        isDark
          ? 'bg-[#0B0C10] text-[#C5C6C7]'
          : 'bg-[#F8F9FA] text-gray-900'
      }`}
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[160px] opacity-[0.03] bg-animate ${
            isDark ? 'bg-[#66FCF1]' : 'bg-[#007AFF]'
          }`}
        />
        <div
          className={`absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.02] bg-animate ${
            isDark ? 'bg-[#45A29E]' : 'bg-[#5856D6]'
          }`}
          style={{ animationDelay: '2s' }}
        />
      </div>

      <Sidebar
        currentView={currentView}
        onViewChange={onViewChange}
        onLogin={login}
        onLogout={logout}
        onUpdateUser={onupdateUser}
        activeProject={projects.activeProject}
        onSelectProject={projects.setActiveProject}
        onNewProject={(viewType, name) => {
          const project = projects.createProject(viewType, name);
          onViewChange(viewType);
          projects.setActiveProject(project);
        }}
        onDeleteProject={projects.deleteProject}
        theme={theme}
        onThemeToggle={onThemeToggle}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />

      <main className="flex-1 relative flex flex-col h-full overflow-hidden z-10">
        <AppHeader currentView={currentView} theme={theme}  />

        <div className="flex-1 flex flex-col h-full pt-20">
           <div className="flex-1 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full px-6 py-8 z-20 flex flex-row h-12">
                    {projects.activeProject && currentView === projects.activeProject.viewType && ( 
                      <div
                          className={`px-2 py-2 glass rounded-full text-[8px] font-mono uppercase tracking-widest flex items-center gap-1 animate-in fade-in slide-in-from-left-4 duration-500 ${
                          isDark
                              ? 'text-[#66FCF1] neon-border neon-glow'
                              : 'text-gray-600 border-gray-200 shadow-sm'
                          }`}
                      >
                          <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span>
                          {projects.activeProject.name}
                      </div>
                    )}
                </div>
                
                <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
};


