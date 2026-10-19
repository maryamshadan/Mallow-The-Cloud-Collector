import React, { createContext, useContext, useEffect, useState } from 'react';
import { VisitorMemory } from '../types';
import { soundFx } from '../utils/soundFx';

interface VisitorContextType {
  visitor: VisitorMemory;
  setNickname: (name: string) => void;
  resetMemories: () => void;
  greetingMessage: string;
  isFirstVisitModalOpen: boolean;
  closeFirstVisitModal: () => void;
  openFirstVisitModal: () => void;
  recordExperience: (experienceName: string) => void;
}

const STORAGE_KEY = 'mallow_visitor_memory';

const defaultMemory: VisitorMemory = {
  nickname: '',
  hasVisitedBefore: false,
  visitCount: 1,
  firstVisitTime: new Date().toISOString(),
  lastVisitTime: new Date().toISOString(),
};

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visitor, setVisitor] = useState<VisitorMemory>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as VisitorMemory;
        return {
          ...parsed,
          hasVisitedBefore: true,
          visitCount: (parsed.visitCount || 1) + 1,
          lastVisitTime: new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('Could not read visitor memory from localStorage', e);
    }
    return defaultMemory;
  });

  const [isFirstVisitModalOpen, setIsFirstVisitModalOpen] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return !stored; // open only on very first visit
    } catch {
      return false;
    }
  });

  // Save to localStorage when visitor changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visitor));
    } catch (e) {
      console.warn('Could not save visitor memory to localStorage', e);
    }
  }, [visitor]);

  const setNickname = (rawName: string) => {
    const cleanName = rawName.trim().slice(0, 30);
    setVisitor((prev) => ({
      ...prev,
      nickname: cleanName,
      hasVisitedBefore: true,
    }));
    soundFx.playChime(659.25);
  };

  const recordExperience = (expName: string) => {
    setVisitor((prev) => ({
      ...prev,
      lastExperience: expName,
    }));
  };

  const resetMemories = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setVisitor({
      ...defaultMemory,
      firstVisitTime: new Date().toISOString(),
      lastVisitTime: new Date().toISOString(),
    });
    soundFx.playPuff();
  };

  // Generate personalized greeting
  const getGreetingMessage = (): string => {
    const name = visitor.nickname;
    if (!visitor.hasVisitedBefore || !name) {
      return "Hello, little dreamer! Welcome to my sky sanctuary.";
    }

    const greetings = [
      `Welcome back, ${name}! Your little corner of the sky missed you.`,
      `Oh look, ${name} is here! Shall we fluff another dream pillow together?`,
      `Good to see you again, ${name}! The rain room is cozy and quiet today.`,
      `Welcome back, ${name}! A few new wishes drifted into the constellation!`,
      `Hello, ${name}! Ready to whisper a little secret dream with Mallow?`,
    ];

    // Pick based on visit count
    return greetings[(visitor.visitCount - 1) % greetings.length];
  };

  return (
    <VisitorContext.Provider
      value={{
        visitor,
        setNickname,
        resetMemories,
        greetingMessage: getGreetingMessage(),
        isFirstVisitModalOpen,
        closeFirstVisitModal: () => setIsFirstVisitModalOpen(false),
        openFirstVisitModal: () => setIsFirstVisitModalOpen(true),
        recordExperience,
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = (): VisitorContextType => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitor must be used within a VisitorProvider');
  }
  return context;
};
