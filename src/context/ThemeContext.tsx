import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types';
import { soundFx } from '../utils/soundFx';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  soundMuted: boolean;
  toggleSound: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('mallow-theme') as ThemeMode;
    if (saved === 'night' || saved === 'sunset') return saved;
    return 'day';
  });

  const [soundMuted, setSoundMuted] = useState<boolean>(() => soundFx.isMuted());

  useEffect(() => {
    localStorage.setItem('mallow-theme', theme);
    const root = document.documentElement;
    root.classList.remove('day-theme', 'sunset-theme', 'night-theme');
    root.classList.add(`${theme}-theme`);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = soundFx.subscribe((muted) => {
      setSoundMuted(muted);
    });
    return unsubscribe;
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'day') return 'sunset';
      if (prev === 'sunset') return 'night';
      return 'day';
    });
    soundFx.playChime(659.25);
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const toggleSound = () => {
    const newMuted = soundFx.toggleMute();
    setSoundMuted(newMuted);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, soundMuted, toggleSound }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
