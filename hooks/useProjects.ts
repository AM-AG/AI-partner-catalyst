import { useEffect, useState } from 'react';
import { Project, User } from '../types/types';
import { View } from '../services/parameters';
import { db } from '../store/db';

export function useProjects(user: User | null, currentView: View) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!user) return;

    const projects = db.getProjects();
    const filtered = projects.filter(
      p => p.id.startsWith(user.id) || !p.id.includes('-')
    );

    if (activeProject && !filtered.find(p => p.id === activeProject.id)) {
      setActiveProject(null);
    }

    if (!activeProject) {
      const last = filtered.find(p => p.viewType === currentView);
      if (last) setActiveProject(last);
    }
  }, [user, currentView]);

  const createProject = (viewType: View, name: string) => {
    const prefix = user ? `${user.id}-` : '';
    const project: Project = {
      id: `${prefix}${Date.now()}`,
      name: name.toUpperCase(),
      viewType,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: {}
    };

    db.saveProject(project);
    setActiveProject(project);
    return project;
  };

  const deleteProject = (id: string) => {
    db.deleteProject(id);
    if (activeProject?.id === id) setActiveProject(null);
  };

  return {
    activeProject,
    setActiveProject,
    createProject,
    deleteProject
  };
}
