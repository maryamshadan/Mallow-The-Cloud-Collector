import React from 'react';
import { Cloud, Heart, ArrowUp, Sparkles, Star } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-purple-200/60 dark:border-purple-900/40 bg-white/40 dark:bg-slate-950/60 backdrop-blur-md pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Character Icon & Brand */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-200 via-purple-200 to-sky-200 flex items-center justify-center shadow-sm">
            <Cloud className="w-5 h-5 text-purple-600 fill-white" />
          </div>
          <span className="text-lg font-bold text-slate-800 dark:text-white">
            Mallow — The Cloud Collector
          </span>
        </div>

        {/* Story note */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-6 italic">
          "Whenever you feel tired, glance at the clouds. Mallow is up there, softening a dream for you."
        </p>

        {/* Quick Nav Anchors */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-8">
          <a href="#hero" className="hover:text-purple-600 transition-colors">Meet Mallow</a>
          <span>•</span>
          <a href="#story" className="hover:text-purple-600 transition-colors">Story</a>
          <span>•</span>
          <a href="#pillows" className="hover:text-purple-600 transition-colors">Pillow Factory</a>
          <span>•</span>
          <a href="#dream-journal" className="hover:text-purple-600 transition-colors">Dream Journal</a>
          <span>•</span>
          <a href="#sky-library" className="hover:text-purple-600 transition-colors">Sky Library</a>
          <span>•</span>
          <a href="#sound-machine" className="hover:text-purple-600 transition-colors">Rain Room</a>
          <span>•</span>
          <a href="#forecast" className="hover:text-purple-600 transition-colors">Forecast</a>
          <span>•</span>
          <a href="#secret-easter-egg" className="hover:text-purple-600 transition-colors">Secret Cloud</a>
        </div>

        {/* Back to top button */}
        <div className="flex items-center justify-center mb-8">
          <button
            onClick={() => {
              soundFx.playChime(659.25);
              scrollToTop();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-purple-200 dark:border-purple-700 text-xs font-bold text-slate-700 dark:text-purple-200 shadow-sm hover:scale-105 active:scale-95 transition-all toy-button"
          >
            <ArrowUp className="w-4 h-4" />
            Float to Top of Sky
          </button>
        </div>

        {/* Note */}
        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-pink-400 fill-pink-400 inline" /> and starlight for gentle dreamers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};
