import React, { useState, Suspense } from 'react';
import { MallowCharacter } from './MallowCharacter';
import { Sparkles, Feather, CloudRain, Compass, Heart, BookOpen, Stars, UserCheck } from 'lucide-react';
import { soundFx } from '../utils/soundFx';
import { useVisitor } from '../context/VisitorContext';
import { MallowMood } from '../types';

const Mallow3D = React.lazy(() => import('./Mallow3D').then((m) => ({ default: m.Mallow3D })));

export const Hero: React.FC = () => {
  const { visitor, greetingMessage, openFirstVisitModal, resetMemories } = useVisitor();
  const [selectedMood, setSelectedMood] = useState<MallowMood>('happy');

  const moods: { id: MallowMood; label: string; desc: string; note: number }[] = [
    { id: 'happy', label: '😊 Smile', desc: 'Sweet baby smile', note: 0 },
    { id: 'excited', label: '✨ Excited', desc: 'Wide sparkling joy', note: 8 },
    { id: 'laughing', label: '😆 Laugh', desc: 'Joyful open laugh', note: 7 },
    { id: 'giggling', label: '🥰 Giggle', desc: 'Bouncy giggles', note: 6 },
    { id: 'winking', label: '😉 Wink', desc: 'Playful wink', note: 3 },
    { id: 'curious', label: '🧐 Curious', desc: 'Inquisitive head tilt', note: 2 },
    { id: 'surprised', label: '😲 Surprised', desc: 'Wide wonder pop', note: 4 },
    { id: 'shy', label: '🌸 Shy', desc: 'Deep rosy blush', note: 5 },
    { id: 'sleepy', label: '😴 Sleepy', desc: 'Soft cozy yawn', note: -2 },
    { id: 'content', label: '🤍 Content', desc: 'Peaceful soothing float', note: 1 },
    { id: 'dreamy', label: '⭐ Dreamy', desc: 'Starry sky gaze', note: 4 },
  ];

  const handleMoodSelect = (moodId: MallowMood, note: number) => {
    setSelectedMood(moodId);
    soundFx.playPluck(note);
  };

  return (
    <section id="hero" className="relative pt-24 pb-14 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Returning Visitor Personalized Greeting Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-purple-950/80 border border-purple-200/90 dark:border-purple-800/80 shadow-sm backdrop-blur-md mb-6 animate-float-bob">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-300" />
          <span className="text-xs sm:text-sm font-bold text-purple-900 dark:text-purple-200">
            {greetingMessage}
          </span>
          {visitor.nickname ? (
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={openFirstVisitModal}
                className="text-[11px] font-semibold text-purple-600 dark:text-purple-300 underline hover:text-purple-800"
                title="Change nickname"
              >
                (Change)
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={resetMemories}
                className="text-[11px] font-semibold text-slate-400 hover:text-rose-500"
                title="Reset visitor memories"
              >
                Forget me
              </button>
            </div>
          ) : (
            <button
              onClick={openFirstVisitModal}
              className="text-xs font-semibold text-pink-600 dark:text-pink-300 underline hover:text-pink-800 ml-1"
            >
              Set nickname
            </button>
          )}
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white max-w-3xl leading-tight sm:leading-tight">
          Hello! I'm{' '}
          <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Mallow
          </span>
          , the Cloud Collector
        </h1>

        {/* Subtitle / Tagline */}
        <p className="mt-4 sm:mt-5 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
          Drifting through the living sky, catching stray daytime wishes, and softening forgotten dreams into
          magical bedtime experiences.
        </p>

        {/* 3D Interactive Mallow Centerpiece */}
        <div className="relative my-6 sm:my-8 flex flex-col items-center">
          {/* Gentle glow aura behind character */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-pink-200/40 via-purple-200/30 to-sky-200/40 blur-3xl -z-10 pointer-events-none" />

          {/* 3D Three.js Mallow with instant 2D fallback */}
          <Suspense fallback={<MallowCharacter size="hero" mood={selectedMood} interactive={true} />}>
            <Mallow3D
              mood={selectedMood}
              interactive={true}
              onTickle={() => handleMoodSelect('laughing', 7)}
            />
          </Suspense>

          {/* Mood Selector Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/80 dark:border-purple-800/60 shadow-sm">
            <span className="text-xs font-bold px-2 text-slate-500 dark:text-slate-400 hidden sm:inline">
              Mallow's Expression:
            </span>
            {moods.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id, m.note)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all toy-button ${
                  selectedMood === m.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm scale-105'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/70'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2">
          <a
            href="#pillows"
            onClick={() => soundFx.playChime(523.25)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg toy-button"
          >
            <Feather className="w-4 h-4" />
            Fluff a Pillow
          </a>

          <a
            href="#dream-journal"
            onClick={() => soundFx.playChime(659.25)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-purple-700 dark:text-purple-200 font-bold text-xs sm:text-sm border border-purple-200 dark:border-purple-800 shadow-sm toy-button"
          >
            <BookOpen className="w-4 h-4 text-purple-500" />
            Dream Journal
          </a>

          <a
            href="#sky-library"
            onClick={() => soundFx.playChime(783.99)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-purple-700 dark:text-purple-200 font-bold text-xs sm:text-sm border border-purple-200 dark:border-purple-800 shadow-sm toy-button"
          >
            <Stars className="w-4 h-4 text-yellow-500" />
            Sky Wish Library
          </a>

          <a
            href="#sound-machine"
            onClick={() => soundFx.playChime(587.33)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 toy-button"
          >
            <CloudRain className="w-4 h-4 text-sky-500" />
            Rain Room
          </a>
        </div>
      </div>
    </section>
  );
};
