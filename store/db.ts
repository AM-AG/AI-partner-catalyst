
import { User, Project, Theme, ApiKey } from '../types/types';


export const STARTING_CREDITS = Number.parseInt(import.meta.env.VITE_STARTING_CREDITS);
const API_KEYS_KEY = 'api_keys';
const STORAGE_KEYS = {
  USER: 'voxpact_user',
  PROJECTS: 'voxpact_projects',
  THEME: 'voxpact_theme',
};

const LocalStoragedb = {
  getTheme: (): Theme => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'dark';
  },
  setTheme: (theme: Theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) return null;
      const user = JSON.parse(data);

      if (typeof user.credits === 'undefined') {
        const updatedUser = { ...user, credits: STARTING_CREDITS };
        LocalStoragedb.updateUser(updatedUser);
        return updatedUser;
      }

      return user;
    } catch {
      return null;
    }
  },
  updateUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },
  updateCredits: (amount: number): number => {
    const user = LocalStoragedb.getUser();
    if (!user) return 0;
    user.credits = Math.max(0, user.credits + amount);
    LocalStoragedb.updateUser(user);
    return user.credits;
  },
  getProjects: (): Project[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  },
  saveProject: (project: Project) => {
    const projects = LocalStoragedb.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index > -1) {
      projects[index] = { ...project, updatedAt: Date.now() };
    } else {
      projects.push({ ...project, createdAt: Date.now(), updatedAt: Date.now() });
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },
  deleteProject: (id: string) => {
    const projects = LocalStoragedb.getProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },
  getAllApiKeys(): ApiKey[] {
    return JSON.parse(localStorage.getItem(API_KEYS_KEY) || '[]');
  },
  getUserApiKeys(userId: string): ApiKey[] {
    return LocalStoragedb.getAllApiKeys().filter(k => k.userId === userId && !k.revoked);
  },
  saveApiKey(apiKey: ApiKey) {
    const keys = LocalStoragedb.getAllApiKeys();
    localStorage.setItem(API_KEYS_KEY, JSON.stringify([...keys, apiKey]));
  },
  revokeApiKey(id: string) {
    const keys = LocalStoragedb.getAllApiKeys().map(k =>
      k.id === id ? { ...k, revoked: true } : k
    );
    localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
  },
  deleteapikey(id: string){
    const keys = LocalStoragedb.getAllApiKeys().filter(k => k.id !== id);
    localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
  }
};

export const db = LocalStoragedb;
