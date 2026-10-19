import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Cloud, Sparkles, Heart, Award, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

export const EasterEggCloud: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPuffing, setIsPuffing] = useState(false);

  // Progressive micro-reactions
  const reactions = [
    { hint: 'A tiny puff of lavender mist escapes...', sound: () => soundFx.playPuff() },
    { hint: 'Soft pink blush spreads across its cheeks...', sound: () => soundFx.playPluck(2) },
    { hint: 'A sweet music-box bell chime chimes...', sound: () => soundFx.playChime(659.25) },
    { hint: 'Golden starlight sprinkles begin to glow around the rim...', sound: () => soundFx.playSparkle() },
    { hint: 'The little cloud smiles and wiggles with joy!', sound: () => soundFx.playTwinkle() },
    { hint: 'Almost there! The cloud is glowing with all its heart! ✨', sound: () => soundFx.playPluck(7) },
  ];

  const handleCloudClick = () => {
    if (isUnlocked) return;

    setIsPuffing(true);
    setTimeout(() => setIsPuffing(false), 320);

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount < 7) {
      reactions[nextCount - 1].sound();
    } else {
      setIsUnlocked(true);
      // Play special heartwarming music box melody!
      soundFx.playEasterEggMagic();

      // Celebratory rainbow stardust confetti shower
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.62 },
        colors: ['#FF9A9E', '#FECFEF', '#A1C4FD', '#C2E9FB', '#FDE047', '#C084FC'],
        disableForReducedMotion: true,
      });
      window.dispatchEvent(new CustomEvent('mallow-secret-found'));
    }
  };

  const handleReset = () => {
    setClickCount(0);
    setIsUnlocked(false);
    soundFx.playChime(523.25);
  };

  return (
    <section id="secret-easter-egg" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        {/* Subtle, curiosity-driven Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800 text-xs font-bold text-purple-600 dark:text-purple-300 mb-3 animate-float-bob">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          The Horizon Secret
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
          The Whispering Shy Cloud
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          A quiet little cloud is resting among the starry winds. It seems to have a gentle secret to share...
        </p>

        {/* Shy Cloud Stage */}
        <div className="mt-8 flex flex-col items-center">
          {!isUnlocked ? (
            <div className="flex flex-col items-center">
              {/* Interactive Shy Cloud */}
              <button
                type="button"
                onClick={handleCloudClick}
                className={`group relative p-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 toy-button ${
                  isPuffing ? 'scale-125' : 'hover:scale-110 active:scale-95'
                }`}
                aria-label={`Wake shy cloud, tapped ${clickCount} of 7 times`}
              >
                {/* Progressive Glow Aura */}
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-300 via-amber-200 to-purple-300 blur-xl transition-opacity duration-500"
                  style={{ opacity: 0.2 + (clickCount / 7) * 0.75 }}
                />

                {/* Cloud Graphic with expressive shy face */}
                <div className="relative">
                  <Cloud
                    className={`w-24 h-24 sm:w-32 sm:h-32 transition-colors duration-400 ${
                      clickCount > 0
                        ? 'text-pink-300 fill-pink-100'
                        : 'text-slate-300 fill-white dark:fill-slate-800 dark:text-slate-600'
                    }`}
                  />
                  {/* Shy eyes */}
                  <div className="absolute top-11 sm:top-14 left-7 sm:left-9 w-2 h-2 rounded-full bg-slate-600 opacity-70" />
                  <div className="absolute top-11 sm:top-14 right-7 sm:right-9 w-2 h-2 rounded-full bg-slate-600 opacity-70" />
                  {/* Shy blush cheeks */}
                  <div
                    className="absolute top-13 sm:top-16 left-5 sm:left-7 w-3.5 h-2 rounded-full bg-pink-400 transition-opacity"
                    style={{ opacity: 0.3 + (clickCount / 7) * 0.7 }}
                  />
                  <div
                    className="absolute top-13 sm:top-16 right-5 sm:right-7 w-3.5 h-2 rounded-full bg-pink-400 transition-opacity"
                    style={{ opacity: 0.3 + (clickCount / 7) * 0.7 }}
                  />
                </div>

                {/* Subtle progress stardust dots */}
                <div className="absolute -bottom-2 inset-x-0 flex items-center justify-center gap-1.5">
                  {Array.from({ length: 7 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx < clickCount
                          ? 'bg-gradient-to-r from-pink-400 to-amber-300 scale-125 shadow-xs'
                          : 'bg-slate-300 dark:bg-slate-700 opacity-40'
                      }`}
                    />
                  ))}
                </div>
              </button>

              {/* Gentle Hint Feedback Text */}
              <div className="mt-5 min-h-[28px]">
                {clickCount > 0 ? (
                  <p className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-300 animate-fadeIn">
                    {reactions[clickCount - 1].hint}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 font-medium italic">
                    (Give this shy cloud a gentle tap to see what it remembers...)
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Unlocked Rainbow Fairytale Secret */
            <div className="w-full max-w-xl sky-card rounded-3xl p-6 sm:p-9 relative overflow-hidden border-2 border-pink-300/80 animate-fadeIn shadow-2xl">
              {/* Rainbow Ribbon Banner */}
              <div className="h-3.5 w-full -mt-6 sm:-mt-9 -mx-6 sm:-mx-9 mb-6 rainbow-gradient" />

              {/* Big celebratory rainbow arc SVG */}
              <div className="flex justify-center mb-4">
                <svg viewBox="0 0 160 80" className="w-40 h-22">
                  <path d="M 10 80 A 70 70 0 0 1 150 80" stroke="#FF9A9E" strokeWidth="8" fill="none" />
                  <path d="M 20 80 A 60 60 0 0 1 140 80" stroke="#FDE047" strokeWidth="8" fill="none" />
                  <path d="M 30 80 A 50 50 0 0 1 130 80" stroke="#86EFAC" strokeWidth="8" fill="none" />
                  <path d="M 40 80 A 40 40 0 0 1 120 80" stroke="#93C5FD" strokeWidth="8" fill="none" />
                  <path d="M 50 80 A 30 30 0 0 1 110 80" stroke="#C084FC" strokeWidth="8" fill="none" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 font-extrabold text-xs mb-3 shadow-xs">
                <Award className="w-4 h-4" />
                Secret Easter Egg Unlocked!
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-2">
                🌈 You found a dream Mallow forgot!
              </h3>

              <div className="my-5 p-5 rounded-2xl bg-white/85 dark:bg-slate-800/85 border border-purple-200 dark:border-purple-800 text-left shadow-sm">
                <p className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                  Mallow's Deepest Heartfelt Secret:
                </p>
                <p className="text-sm sm:text-base text-slate-700 dark:text-purple-100 font-serif italic leading-relaxed">
                  "Long before Mallow started collecting pillows or forecasting the winds, Mallow made one
                  tiny wish upon the morning star: to make a kind human friend who would look up at the clouds on
                  weary days and feel comforted. That friend is you. Thank you for visiting Mallow's sky playground."
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    soundFx.playSparkle();
                    confetti({
                      particleCount: 70,
                      spread: 80,
                      origin: { y: 0.7 },
                      colors: ['#FF9A9E', '#FECFEF', '#A1C4FD', '#C2E9FB', '#FDE047', '#C084FC'],
                    });
                  }}
                  className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md toy-button"
                >
                  ✨ Shower More Stardust
                </button>

                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-purple-200 dark:border-purple-700 hover:bg-white transition-all flex items-center gap-1.5 toy-button"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Tuck Secret Away
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
