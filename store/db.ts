
import { User, Project, Theme } from '../types';

const STORAGE_KEYS = {
  USER: 'voxpact_user',
  PROJECTS: 'voxpact_projects',
  THEME: 'voxpact_theme'
};

export const STARTING_CREDITS = 500;

export const db = {
  getTheme: (): Theme => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'dark';
  },
  setTheme: (theme: Theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) return null;
    const user = JSON.parse(data);
    // Ensure credits exist for legacy users
    if (user && typeof user.credits === 'undefined') {
      user.credits = STARTING_CREDITS;
      db.setUser(user);
    }
    return user;
  },
  setUser: (user: User | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.USER);
  },
  updateCredits: (amount: number): number => {
    const user = db.getUser();
    if (!user) return 0;
    user.credits = Math.max(0, user.credits + amount);
    db.setUser(user);
    return user.credits;
  },
  getProjects: (): Project[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  },
  saveProject: (project: Project) => {
    const projects = db.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index > -1) {
      projects[index] = { ...project, updatedAt: Date.now() };
    } else {
      projects.push({ ...project, createdAt: Date.now(), updatedAt: Date.now() });
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },
  deleteProject: (id: string) => {
    const projects = db.getProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }
};
