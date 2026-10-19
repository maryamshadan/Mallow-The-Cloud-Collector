import React, { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { RainPreset } from '../types';

interface SkyBackdropProps {
  isRaining?: boolean;
  rainPreset?: RainPreset;
}

export const SkyBackdrop: React.FC<SkyBackdropProps> = ({ isRaining = false, rainPreset = 'gentle' }) => {
  const { theme } = useTheme();

  // Deterministic stars
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${(i * 19) % 94}%`,
      left: `${(i * 23) % 97}%`,
      size: (i % 3) + 2,
      delay: `${(i * 0.35) % 4}s`,
      opacity: theme === 'night' ? 0.9 : theme === 'sunset' ? 0.45 : 0.2,
    }));
  }, [theme]);

  // Floating stardust glowing particles
  const stardust = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      top: `${20 + ((i * 13) % 65)}%`,
      left: `${(i * 17) % 92}%`,
      delay: `${(i * 0.6) % 5}s`,
      duration: `${4 + (i % 3)}s`,
    }));
  }, []);

  // Rain drops for visual rain overlay based on preset
  const rainDrops = useMemo(() => {
    if (!isRaining) return [];
    const count = rainPreset === 'downpour' ? 45 : rainPreset === 'window' ? 32 : rainPreset === 'mist' ? 18 : 28;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * (100 / count)) % 100}%`,
      duration:
        rainPreset === 'downpour'
          ? `${0.45 + ((i % 4) * 0.08)}s`
          : rainPreset === 'mist'
          ? `${1.2 + ((i % 4) * 0.15)}s`
          : `${0.7 + ((i % 5) * 0.1)}s`,
      delay: `${(i * 0.07) % 1}s`,
      height: rainPreset === 'downpour' ? `${35 + (i % 25)}px` : `${20 + (i % 16)}px`,
      opacity: rainPreset === 'mist' ? 0.4 : 0.85,
    }));
  }, [isRaining, rainPreset]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Celestial Body: Sun (Day), Sunset Orb (Sunset), or Crescent Moon (Night) */}
      <div className="absolute top-10 sm:top-14 right-6 sm:right-20 transition-all duration-1000 ease-in-out">
        {theme === 'day' ? (
          // Radiant Morning Sunshine
          <div className="relative animate-pulse-glow">
            <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-100 shadow-[0_0_60px_rgba(253,224,71,0.65)]" />
            <div className="absolute inset-0 rounded-full border border-yellow-200/60 animate-ping opacity-20" />
            {/* Soft sunbeam spikes */}
            <div className="absolute -inset-2 rounded-full bg-yellow-200/20 blur-sm animate-pulse" />
          </div>
        ) : theme === 'sunset' ? (
          // Warm Golden Sunset Sun sinking softly
          <div className="relative animate-float-bob">
            <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-400 via-amber-300 to-yellow-100 shadow-[0_0_65px_rgba(251,146,60,0.7)]" />
            <div className="absolute -bottom-2 -left-3 -right-3 h-5 bg-gradient-to-t from-purple-300/40 to-transparent blur-xs rounded-full" />
          </div>
        ) : (
          // Glowing Moon in Twilight Sky
          <div className="relative animate-float-gentle">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900 overflow-hidden shadow-[0_0_45px_rgba(192,132,252,0.6)]">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-200 via-indigo-100 to-amber-100 shadow-inner" />
              {/* Moon shadow cut for crescent */}
              <div className="absolute -top-1 -right-1 w-14 h-14 rounded-full bg-slate-900" />
            </div>
            <div className="absolute -bottom-2 -left-2 text-xs text-purple-200 font-mono tracking-widest animate-pulse">
              ✦
            </div>
          </div>
        )}
      </div>

      {/* Occasional Shooting Star Streak */}
      <div className="absolute top-16 right-1/4 w-32 h-0.5 bg-gradient-to-l from-white via-amber-200 to-transparent rounded-full transform -rotate-30 animate-shooting-star opacity-0 pointer-events-none filter drop-shadow-[0_0_6px_rgba(254,240,138,0.9)]" />

      {/* Twinkling Starfield */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white transition-opacity duration-1000 animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            opacity: star.opacity,
            boxShadow:
              theme === 'night'
                ? '0 0 7px rgba(254, 240, 138, 0.95)'
                : theme === 'sunset'
                ? '0 0 5px rgba(254, 215, 170, 0.8)'
                : 'none',
          }}
        />
      ))}

      {/* Floating Stardust / Sparkle Dust Particles */}
      {stardust.map((p) => (
        <div
          key={p.id}
          className="absolute w-1.5 h-1.5 rounded-full animate-stardust"
          style={{
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            background:
              theme === 'sunset'
                ? 'radial-gradient(circle, #fde047 0%, rgba(251,146,60,0) 70%)'
                : 'radial-gradient(circle, #ffffff 0%, rgba(192,132,252,0) 70%)',
          }}
        />
      ))}

      {/* Layer 1: Highest altitude, slowest wispy cirrus clouds */}
      <div className="absolute top-24 -left-32 opacity-25 sm:opacity-35 animate-drift-layer-1">
        <svg width="280" height="130" viewBox="0 0 280 130" fill="none">
          <path
            d="M50 90C25 90 0 75 12 50C22 28 60 22 78 38C95 18 145 12 175 35C200 18 245 35 245 65C270 82 258 110 220 110C205 122 155 128 130 110C105 122 70 115 50 90Z"
            fill="currentColor"
            className={
              theme === 'day'
                ? 'text-white/70'
                : theme === 'sunset'
                ? 'text-amber-100/50'
                : 'text-purple-300/15'
            }
          />
        </svg>
      </div>

      {/* Layer 2: Mid-altitude fluffy drifting clouds */}
      <div
        className="absolute top-1/3 -right-24 opacity-30 sm:opacity-40 animate-drift-layer-2"
        style={{ animationDirection: 'reverse' }}
      >
        <svg width="320" height="150" viewBox="0 0 320 150" fill="none">
          <path
            d="M60 110C30 110 0 88 18 60C30 32 78 28 102 50C125 22 185 18 222 45C252 22 300 45 300 80C324 102 312 135 264 135C246 148 192 152 162 135C132 148 90 140 60 110Z"
            fill="currentColor"
            className={
              theme === 'day'
                ? 'text-blue-100/60'
                : theme === 'sunset'
                ? 'text-rose-200/50'
                : 'text-indigo-400/15'
            }
          />
        </svg>
      </div>

      {/* Layer 3: Lower-altitude soft pastel cumulus drifting forward */}
      <div className="absolute bottom-32 left-1/5 opacity-20 sm:opacity-30 animate-drift-layer-3">
        <svg width="240" height="110" viewBox="0 0 240 110" fill="none">
          <path
            d="M40 78C20 78 0 60 12 42C22 24 55 22 72 36C90 18 132 15 156 34C180 18 210 36 210 60C228 78 216 102 180 102C168 110 132 114 114 102C96 110 60 105 40 78Z"
            fill="currentColor"
            className={
              theme === 'day'
                ? 'text-purple-100/60'
                : theme === 'sunset'
                ? 'text-orange-200/40'
                : 'text-purple-400/15'
            }
          />
        </svg>
      </div>

      {/* Layer 4: Upper-right light floating puff cloud */}
      <div className="absolute top-16 right-1/3 opacity-25 sm:opacity-35 animate-drift-layer-1" style={{ animationDuration: '44s', animationDirection: 'reverse' }}>
        <svg width="190" height="90" viewBox="0 0 190 90" fill="none">
          <path
            d="M30 65C15 65 0 50 10 35C18 20 45 18 60 30C75 15 110 12 130 28C150 15 175 30 175 50C190 65 180 85 150 85C140 92 110 95 95 85C80 92 50 88 30 65Z"
            fill="currentColor"
            className={
              theme === 'day'
                ? 'text-white/60'
                : theme === 'sunset'
                ? 'text-pink-100/50'
                : 'text-purple-300/10'
            }
          />
        </svg>
      </div>

      {/* Layer 5: Mid-left light dreamy cloud */}
      <div className="absolute top-2/3 -left-12 opacity-20 sm:opacity-30 animate-drift-layer-2" style={{ animationDuration: '52s' }}>
        <svg width="220" height="105" viewBox="0 0 220 105" fill="none">
          <path
            d="M35 75C18 75 0 58 10 38C20 20 52 18 68 32C84 14 125 12 148 30C168 14 200 30 200 52C216 70 205 92 170 92C160 100 125 102 108 92C90 100 55 95 35 75Z"
            fill="currentColor"
            className={
              theme === 'day'
                ? 'text-sky-100/60'
                : theme === 'sunset'
                ? 'text-amber-100/40'
                : 'text-indigo-400/10'
            }
          />
        </svg>
      </div>

      {/* Visual Rainfall Stream Overlay */}
      {isRaining && (
        <div className="absolute inset-0 pointer-events-none">
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="rain-stream"
              style={{
                left: drop.left,
                height: drop.height,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
                opacity: drop.opacity,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
