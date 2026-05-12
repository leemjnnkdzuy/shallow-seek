import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) || 'system'
  );

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await window.electron?.db.getSetting('theme');
        if (res?.success && res.value) {
          setThemeState(res.value as Theme);
        }
      } catch (error) {
        console.error('Failed to load theme from DB:', error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = window.electron?.windowControls.onThemeChanged((newTheme: string) => {
      if (newTheme !== theme) {
        setThemeState(newTheme as Theme);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    window.electron?.windowControls.notifyThemeChanged(newTheme);
    try {
      await window.electron?.db.setSetting('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme to DB:', error);
    }
  };

  return { theme, setTheme };
};
