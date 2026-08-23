import { useEffect, useState } from 'react';
import { db } from '../store/db';
import { Theme } from '../types/types';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(db.getTheme());

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    db.setTheme(theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
