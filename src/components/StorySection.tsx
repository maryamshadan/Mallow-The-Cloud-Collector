import React, { useState } from 'react';
import { BookOpen, Sparkles, Wind, Eye, Stars, Heart, ArrowRight, ArrowLeft, RotateCcw, Cloud, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface WishParticle {
  id: string;
  label: string;
  icon: string;
  wish: string;
  x: string;
  y: string;
}

export const StorySection: React.FC = () => {
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [selectedWish, setSelectedWish] = useState<WishParticle | null>(null);
  const [cloudPuffed, setCloudPuffed] = useState<boolean>(false);
  const [connectedStars, setConnectedStars] = useState<number[]>([0, 1]);
  const [showFullLore, setShowFullLore] = useState<boolean>(false);

  // Chapter 1 Wishes
  const wishes: WishParticle[] = [
    {
      id: 'w1',
      label: 'Folded Note',
      icon: '💌',
      wish: '“I wish my pet hamster could learn how to fly a paper airplane.”',
      x: '18%',
      y: '32%',
    },
    {
      id: 'w2',
      label: 'Origami Star',
      icon: '⭐',
      wish: '“I wish the rain smelled like freshly baked sugar cookies.”',
      x: '72%',
      y: '25%',
    },
    {
      id: 'w3',
      label: 'Daydream Bubble',
      icon: '🫧',
      wish: '“I wish trees grew blueberry ice cream pops in summer.”',
      x: '38%',
      y: '68%',
    },
    {
      id: 'w4',
      label: 'Dandelion Fluff',
      icon: '🌼',
      wish: '“I wish grandma’s hug lasted all through school tomorrow.”',
      x: '80%',
      y: '65%',
    },
  ];

  const handleWishClick = (w: WishParticle) => {
    setSelectedWish(w);
    soundFx.playSparkle();
  };

  const handleCloudPuffClick = () => {
    setCloudPuffed(!cloudPuffed);
    if (!cloudPuffed) {
      soundFx.playFlourish();
    } else {
      soundFx.playPuff();
    }
  };

  const handleStarConnect = (starIdx: number) => {
    if (!connectedStars.includes(starIdx)) {
      setConnectedStars((prev) => [...prev, starIdx]);
      soundFx.playPluck(connectedStars.length * 2);
    }
  };

  const handleNext = () => {
    if (currentChapter < 3) {
      setCurrentChapter((prev) => prev + 1);
      soundFx.playChime(600 + currentChapter * 100);
    }
  };

  const handlePrev = () => {
    if (currentChapter > 1) {
      setCurrentChapter((prev) => prev - 1);
      soundFx.playChime(500);
    }
  };

  const handleReset = () => {
    setCurrentChapter(1);
    setSelectedWish(null);
    setCloudPuffed(false);
    setConnectedStars([0, 1]);
    soundFx.playChime(523.25);
  };

  return (
    <section id="story" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/90 dark:bg-purple-950/80 border border-purple-200/80 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 mb-3">
            <BookOpen className="w-4 h-4" />
            Interactive Fairytale Storybook
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            How Mallow Found the Forgotten Dreams
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            A bedtime journey through the clouds. Click and explore each scene to watch Mallow’s story unfold!
          </p>
        </div>

        {/* Chapter Stepper Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
          {[
            { num: 1, title: 'The Drifting Whispers', icon: '💨' },
            { num: 2, title: 'The Soft Discovery', icon: '☁️' },
            { num: 3, title: 'The Sky Sanctuary', icon: '✨' },
          ].map((ch) => (
            <button
              key={ch.num}
              onClick={() => {
                setCurrentChapter(ch.num);
                soundFx.playChime(500 + ch.num * 80);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all toy-button ${
                currentChapter === ch.num
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105'
                  : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-purple-100 dark:border-purple-800 hover:bg-white'
              }`}
            >
              <span>{ch.icon}</span>
              <span className="hidden sm:inline">{ch.title}</span>
              <span className="sm:hidden">Part {ch.num}</span>
            </button>
          ))}
        </div>

        {/* Fairytale Interactive Stage Card */}
        <div className="sky-card rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl border border-white/80 dark:border-purple-800/60 min-h-[460px] flex flex-col justify-between">
          {/* Chapter Content Stage */}
          {currentChapter === 1 && (
            <div className="flex flex-col items-center text-center relative z-10 animate-fadeIn">
              <span className="text-xs uppercase tracking-widest font-extrabold text-sky-500 mb-1">
                Chapter I • The Beginning
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mb-2">
                The Drifting Whispers
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mb-6 leading-relaxed">
                Whenever someone daydreams by a window, a tiny warm wish rises into the sky.
                <br />
                <span className="text-purple-600 dark:text-purple-300 font-semibold">
                  👉 Click a drifting wish-particle below to catch it!
                </span>
              </p>

              {/* Interactive Wish Field */}
              <div className="relative w-full max-w-lg h-56 rounded-3xl bg-gradient-to-b from-sky-100/50 via-purple-100/40 to-pink-100/30 dark:from-slate-900/60 dark:via-purple-950/40 dark:to-slate-900/60 border border-purple-200/50 dark:border-purple-800/40 p-4 overflow-hidden mb-4">
                {/* Background stars */}
                <div className="absolute top-4 left-6 text-xs text-amber-300 animate-twinkle">✦</div>
                <div className="absolute top-12 right-10 text-xs text-amber-300 animate-twinkle">✦</div>
                <div className="absolute bottom-6 left-12 text-xs text-amber-300 animate-twinkle">✦</div>

                {/* Floating Clickable Wishes */}
                {wishes.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleWishClick(w)}
                    className="absolute p-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-md border border-purple-200 dark:border-purple-700 flex items-center gap-1.5 text-base sm:text-lg animate-float-gentle toy-button"
                    style={{
                      left: w.x,
                      top: w.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={w.label}
                  >
                    <span>{w.icon}</span>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">
                      {w.label}
                    </span>
                  </button>
                ))}

                {/* Center floating note reveal */}
                {selectedWish ? (
                  <div className="absolute inset-x-4 bottom-4 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-pink-300 dark:border-pink-800 shadow-lg text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-200 animate-fadeIn">
                    <span className="font-bold text-pink-600 block mb-0.5">
                      ✨ Stray Wish Caught:
                    </span>
                    {selectedWish.wish}
                  </div>
                ) : (
                  <div className="absolute inset-x-4 bottom-4 text-[11px] text-slate-400 italic">
                    Tap a floating wish bubble to discover what a child once dreamed...
                  </div>
                )}
              </div>
            </div>
          )}

          {currentChapter === 2 && (
            <div className="flex flex-col items-center text-center relative z-10 animate-fadeIn">
              <span className="text-xs uppercase tracking-widest font-extrabold text-purple-500 mb-1">
                Chapter II • The Discovery
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mb-2">
                The Soft Discovery
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mb-4 leading-relaxed">
                Mallow bumped into a heavy, grumbling cloud and gently pressed a marshmallow hand inside.
                <br />
                <span className="text-purple-600 dark:text-purple-300 font-semibold">
                  👉 Click the glowing cloud to puff it apart and reveal the dream!
                </span>
              </p>

              {/* The Glowing Cloud Interactive Scene */}
              <div className="relative w-full max-w-lg h-60 rounded-3xl bg-gradient-to-b from-purple-100/50 via-pink-100/40 to-amber-100/30 dark:from-slate-900/60 dark:via-purple-950/40 dark:to-slate-900/60 border border-purple-200/50 dark:border-purple-800/40 flex flex-col items-center justify-center p-4 overflow-hidden mb-4">
                <button
                  type="button"
                  onClick={handleCloudPuffClick}
                  className="relative group p-4 rounded-full transition-transform toy-button"
                  aria-label="Puff cloud apart"
                >
                  {/* Glowing pulse aura */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300 to-pink-300 blur-xl opacity-60 animate-pulse" />

                  <Cloud
                    className={`w-28 h-28 sm:w-32 sm:h-32 transition-all duration-500 ${
                      cloudPuffed
                        ? 'text-amber-200 fill-amber-100 scale-120 rotate-6'
                        : 'text-purple-300 fill-white'
                    }`}
                  />
                  {cloudPuffed && (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">
                      🎶
                    </div>
                  )}
                </button>

                {cloudPuffed ? (
                  <div className="mt-2 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-amber-300 dark:border-amber-700 shadow-md max-w-md text-xs sm:text-sm text-slate-700 dark:text-amber-100 animate-fadeIn">
                    <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                      🌟 Forgotten Dream Released:
                    </span>
                    “A warm bedtime lullaby sung in sweet honey tones, waiting for someone to listen.”
                  </div>
                ) : (
                  <div className="text-xs text-purple-600 dark:text-purple-300 font-medium mt-1">
                    Tap the puffy cloud to unlock its golden heart!
                  </div>
                )}
              </div>
            </div>
          )}

          {currentChapter === 3 && (
            <div className="flex flex-col items-center text-center relative z-10 animate-fadeIn">
              <span className="text-xs uppercase tracking-widest font-extrabold text-pink-500 mb-1">
                Chapter III • The Sanctuary
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mb-2">
                The Sky Sanctuary
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mb-4 leading-relaxed">
                With a golden star hairpin, Mallow began weaving dreams into a luminous sky blanket.
                <br />
                <span className="text-pink-600 dark:text-pink-300 font-semibold">
                  👉 Click any unlinked stars to connect Mallow’s dream constellation!
                </span>
              </p>

              {/* Constellation Grid */}
              <div className="relative w-full max-w-lg h-60 rounded-3xl bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 border border-purple-800/80 p-4 overflow-hidden mb-4 shadow-inner">
                {/* SVG Constellation lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {connectedStars.length > 1 && (
                    <polyline
                      points="80,140 160,60 260,80 340,160 220,190 80,140"
                      stroke="#FDE047"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      fill="rgba(253, 224, 71, 0.08)"
                      className="animate-pulse"
                    />
                  )}
                </svg>

                {/* 5 Constellation Star Points */}
                {[
                  { id: 0, x: '20%', y: '60%', name: 'Pillow Star' },
                  { id: 1, x: '40%', y: '26%', name: 'Lullaby Star' },
                  { id: 2, x: '65%', y: '35%', name: 'Raindrop Star' },
                  { id: 3, x: '85%', y: '70%', name: 'Wish Star' },
                  { id: 4, x: '55%', y: '82%', name: 'Heart Star' },
                ].map((s) => {
                  const isConnected = connectedStars.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleStarConnect(s.id)}
                      className="absolute p-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 toy-button z-10"
                      style={{ left: s.x, top: s.y }}
                      title={s.name}
                    >
                      <Star
                        className={`w-6 h-6 transition-all ${
                          isConnected
                            ? 'text-yellow-300 fill-yellow-300 filter drop-shadow-[0_0_8px_rgba(253,224,71,0.9)] scale-125'
                            : 'text-slate-500 fill-slate-700 opacity-60'
                        }`}
                      />
                      <span className="block text-[9px] text-yellow-200/90 font-mono mt-0.5 whitespace-nowrap">
                        {s.name}
                      </span>
                    </button>
                  );
                })}

                <div className="absolute bottom-2 inset-x-0 text-center text-[11px] text-purple-200">
                  {connectedStars.length >= 5
                    ? '🎉 Constellation Complete! The Sky Sanctuary is warm and glowing.'
                    : `Connected ${connectedStars.length} of 5 constellation stars`}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Stage Navigation Controls */}
          <div className="pt-4 border-t border-purple-100/60 dark:border-purple-900/50 flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentChapter === 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all toy-button ${
                currentChapter === 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                  : 'bg-white/80 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700 hover:bg-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 transition-colors toy-button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Replay Fairytale
            </button>

            {currentChapter < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:scale-105 transition-all toy-button"
              >
                Next Chapter
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <a
                href="#pillows"
                onClick={() => soundFx.playChime(659.25)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-md hover:scale-105 transition-all toy-button"
              >
                Visit Workshop
                <Sparkles className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Collapsible Full Story Lore Accordion */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowFullLore(!showFullLore)}
            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-300 hover:underline py-1"
          >
            <span>{showFullLore ? 'Hide Full Classic Storybook Lore' : 'Read Full Classic Storybook Lore'}</span>
            {showFullLore ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFullLore && (
            <div className="mt-4 sky-card rounded-3xl p-6 sm:p-8 text-left text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 animate-fadeIn">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                  Chapter I: The Drifting Whispers
                </h4>
                <p>
                  Every afternoon, whenever someone daydreams while watching rain on a school bus window, or makes a quiet bedtime wish upon a fuzzy sock, a tiny wisp of warmth separates from earth. It rises gently past chimneys, over tall redwood trees, into the cool blue troposphere. For centuries, these wishes drifted unattended, mixing with ordinary gray storm clouds and losing their colors.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                  Chapter II: The Soft Discovery
                </h4>
                <p>
                  Mallow was smaller than other cumulus clouds—too small to carry thunder, too shy to drop heavy snow. But Mallow had keen, sparkling eyes. One chilly twilight, Mallow bumped into a heavy raincloud that was grumbling sadly. When Mallow pressed a soft marshmallow hand into its folds, a warm golden glow spilled out: a forgotten dream of a lullaby sung in warm honey tones. Mallow realized: clouds aren’t just water vapor. They are the universe’s lost and found.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                  Chapter III: The Sky Sanctuary
                </h4>
                <p>
                  With a shiny star hairpin gifted by the North Star, Mallow decided to gather these wandering dreams. Together with the wind, Mallow spun them into fluffy pillows so tired people could sleep deeply, tuned gentle rainy-day harmonies to hush overthinking minds, and charted playful forecasts to remind humans that the sky is always cheering for them.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
