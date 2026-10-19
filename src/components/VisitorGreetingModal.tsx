import React, { useState } from 'react';
import { Sparkles, Heart, User, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useVisitor } from '../context/VisitorContext';
import { soundFx } from '../utils/soundFx';

export const VisitorGreetingModal: React.FC = () => {
  const { visitor, setNickname, isFirstVisitModalOpen, closeFirstVisitModal } = useVisitor();
  const [nameInput, setNameInput] = useState('');

  if (!isFirstVisitModalOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setNickname(nameInput.trim());
      soundFx.playChime(783.99);
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FDE047', '#C084FC', '#F472B6', '#BAE6FD'],
      });
    }
    closeFirstVisitModal();
  };

  const handleSkip = () => {
    soundFx.playPuff();
    closeFirstVisitModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md sky-card rounded-3xl p-6 sm:p-8 border-2 border-purple-300 dark:border-purple-700 shadow-2xl text-center animate-scaleUp">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Skip naming"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mallow Cloud Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-200 via-purple-200 to-sky-200 flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm animate-float-bob">
          ☁️
        </div>

        <h3 className="font-extrabold text-xl text-slate-800 dark:text-white mb-2">
          Hello, little dreamer!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          I'm <strong>Mallow</strong>, your sky companion. What should I call you when you visit my cloud world?
        </p>

        <form onSubmit={handleSaveName} className="space-y-4">
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your nickname (e.g. Luna, Pip, Maya)..."
              maxLength={25}
              autoFocus
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Just call me Dreamer
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all toy-button"
            >
              Remember Me ✨
            </button>
          </div>
        </form>

        <p className="mt-4 text-[11px] text-slate-400">
          🔒 Private & local to your browser. You can reset or change this anytime.
        </p>
      </div>
    </div>
  );
};
