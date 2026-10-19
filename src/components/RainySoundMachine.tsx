import React, { useState, useEffect } from 'react';
import { CloudRain, Volume2, VolumeX, Play, Square, Droplets, Sparkles, Sliders, Wind, Moon, Sun, CloudLightning } from 'lucide-react';
import { rainAudio } from '../utils/rainAudio';
import { soundFx } from '../utils/soundFx';
import { RainPreset } from '../types';

interface RainySoundMachineProps {
  isRaining: boolean;
  setIsRaining: (val: boolean) => void;
  preset: RainPreset;
  setPreset: (preset: RainPreset) => void;
}

export const RainySoundMachine: React.FC<RainySoundMachineProps> = ({
  isRaining,
  setIsRaining,
  preset,
  setPreset,
}) => {
  const [volume, setVolume] = useState<number>(55);

  const presets = [
    {
      id: 'gentle' as RainPreset,
      name: 'Gentle Sky Drizzle',
      subtitle: 'Soft drops whispering on sleepy garden leaves',
      icon: '🌦️',
      color: 'from-sky-300 to-indigo-300',
      bgColor: 'bg-sky-50 dark:bg-sky-950/60',
      tag: 'Soft & Calming',
      visual: (
        <div className="relative w-full h-32 rounded-2xl bg-gradient-to-b from-sky-200/60 to-blue-300/40 dark:from-slate-800 dark:to-sky-950 flex items-center justify-center overflow-hidden">
          {/* Animated gentle ripples */}
          <div className="absolute w-20 h-20 rounded-full border border-sky-400/50 animate-ping opacity-40" />
          <div className="absolute w-32 h-32 rounded-full border border-sky-300/30 animate-pulse" />
          <div className="text-4xl animate-bounce">🌱</div>
          <span className="absolute bottom-2 text-[10px] font-bold text-sky-700 dark:text-sky-300">
            Soft rain dripping on gentle garden sprouts
          </span>
        </div>
      ),
    },
    {
      id: 'window' as RainPreset,
      name: 'Cozy Window Tap',
      subtitle: 'Water drops tapping rhythmic notes on an attic glass pane',
      icon: '🪟',
      color: 'from-amber-200 to-purple-300',
      bgColor: 'bg-purple-50 dark:bg-purple-950/60',
      tag: 'Rhythmic Slumber',
      visual: (
        <div className="relative w-full h-32 rounded-2xl bg-gradient-to-b from-indigo-100/60 to-purple-200/50 dark:from-slate-800 dark:to-purple-950 flex items-center justify-center overflow-hidden border border-purple-200/60">
          {/* Window pane frame */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 border-2 border-white/60 pointer-events-none">
            <div className="border-r border-b border-white/60" />
            <div className="border-b border-white/60" />
            <div className="border-r border-white/60" />
            <div />
          </div>
          <div className="text-4xl animate-float-bob z-10">🕯️</div>
          <span className="absolute bottom-2 text-[10px] font-bold text-purple-700 dark:text-purple-300 z-10">
            Cozy warm candlelight behind rain-streaked glass
          </span>
        </div>
      ),
    },
    {
      id: 'downpour' as RainPreset,
      name: 'Summer Cloudburst',
      subtitle: 'Rich, immersive sky shower washing all worries away',
      icon: '🌧️',
      color: 'from-blue-400 to-cyan-300',
      bgColor: 'bg-blue-50 dark:bg-blue-950/60',
      tag: 'Deep Ambient Wash',
      visual: (
        <div className="relative w-full h-32 rounded-2xl bg-gradient-to-b from-blue-300/60 via-indigo-400/40 to-slate-800/60 flex items-center justify-center overflow-hidden">
          {/* Distant gentle sky flash */}
          <div className="absolute inset-0 bg-yellow-100/20 animate-pulse pointer-events-none" />
          <div className="text-4xl animate-bounce">☔</div>
          <span className="absolute bottom-2 text-[10px] font-bold text-white z-10">
            Happy rain shower bouncing off colorful umbrellas
          </span>
        </div>
      ),
    },
    {
      id: 'mist' as RainPreset,
      name: 'Midnight Mist',
      subtitle: 'Dreamy low-frequency atmospheric drizzle under stars',
      icon: '🌫️',
      color: 'from-purple-300 to-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/60',
      tag: 'Sleepy Twilight',
      visual: (
        <div className="relative w-full h-32 rounded-2xl bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center overflow-hidden">
          <div className="absolute top-3 right-6 text-xl animate-float-gentle">🌙</div>
          <div className="absolute text-3xl animate-float-bob">☁️</div>
          <span className="absolute bottom-2 text-[10px] font-bold text-purple-200">
            Silver moonlight filtering through warm sleepy mist
          </span>
        </div>
      ),
    },
  ];

  const handleToggleSound = () => {
    if (isRaining) {
      rainAudio.stop();
      setIsRaining(false);
      soundFx.playChime(440);
    } else {
      rainAudio.start(preset, volume / 100);
      setIsRaining(true);
      soundFx.playSparkle();
      window.dispatchEvent(new CustomEvent('mallow-rain-started'));
    }
  };

  const handlePresetChange = (newPreset: RainPreset) => {
    setPreset(newPreset);
    soundFx.playPluck(3);
    if (isRaining) {
      rainAudio.setPreset(newPreset);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isRaining) {
      rainAudio.setVolume(newVol / 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      rainAudio.stop();
    };
  }, []);

  const activePresetData = presets.find((p) => p.id === preset) || presets[0];

  return (
    <section id="sound-machine" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100/90 dark:bg-sky-950/80 border border-sky-200/80 dark:border-sky-800 text-xs font-bold text-sky-700 dark:text-sky-300 mb-3">
            <CloudRain className="w-4 h-4 text-sky-500" />
            Sensory Weather Playground
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Rainy-Day Sensory Playground
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Touch and play with the sky’s gentlest rain. Powered 100% by live procedural browser Web Audio—zero
            prerecorded audio files or downloads!
          </p>
        </div>

        {/* Sensory Machine Console Card */}
        <div className="sky-card rounded-3xl p-6 sm:p-9 relative overflow-hidden shadow-2xl border border-white/80 dark:border-purple-800/60">
          {/* Active Weather Visualizer Showcase */}
          <div className="mb-8">
            {activePresetData.visual}
          </div>

          {/* Top Status & Audio Engine Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-purple-100/60 dark:border-purple-900/50">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isRaining
                    ? 'bg-gradient-to-tr from-sky-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.6)] animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-sky-600 dark:text-sky-400 font-extrabold block">
                  Active Weather Atmosphere
                </span>
                <span className="text-base font-extrabold text-slate-800 dark:text-white">
                  {activePresetData.name} {isRaining ? '(Playing Live)' : '(Paused)'}
                </span>
              </div>
            </div>

            {/* Rhythmic Raindrop Equalizer Bars */}
            <div className="flex items-end gap-1.5 h-8 p-1.5 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-purple-100 dark:border-purple-800">
              {[45, 80, 100, 65, 90, 55, 95].map((height, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isRaining
                      ? 'bg-gradient-to-t from-sky-400 to-indigo-400 animate-pulse'
                      : 'bg-slate-300 dark:bg-slate-700 h-1.5'
                  }`}
                  style={{
                    height: isRaining ? `${height}%` : '4px',
                    animationDelay: `${idx * 0.12}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main Controls Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Weather Atmosphere Choices */}
            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-500" />
                Tap a Weather Atmosphere:
              </label>
              <div className="space-y-2.5">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePresetChange(p.id)}
                    className={`w-full p-3.5 rounded-2xl text-left border flex items-center gap-3.5 transition-all toy-button ${
                      preset === p.id
                        ? 'bg-sky-100/90 dark:bg-sky-950/70 border-sky-400 text-sky-950 dark:text-sky-100 shadow-md ring-2 ring-sky-300'
                        : 'bg-white/70 dark:bg-slate-800/70 border-purple-100 dark:border-purple-800/60 text-slate-600 dark:text-slate-300 hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl animate-float-bob">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold">{p.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60 font-semibold text-purple-600 dark:text-purple-300">
                          {p.tag}
                        </span>
                      </div>
                      <div className="text-[11px] opacity-75 truncate mt-0.5">{p.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Master Play/Stop & Volume Slider */}
            <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/50 border border-purple-100/80 dark:border-purple-800/60 flex flex-col items-center text-center space-y-6">
              {/* Play / Stop Master Button */}
              <button
                onClick={handleToggleSound}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 toy-button ${
                  isRaining
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-300/50 animate-pulse-glow'
                    : 'bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 shadow-sky-300/50'
                }`}
                aria-label={isRaining ? 'Stop Rain Sounds' : 'Start Rain Sounds'}
              >
                {isRaining ? (
                  <Square className="w-9 h-9 fill-white" />
                ) : (
                  <Play className="w-10 h-10 fill-white translate-x-1" />
                )}
              </button>

              <div className="text-center">
                <span className="text-base font-black text-slate-800 dark:text-white block">
                  {isRaining ? 'Click to Hush Rain' : 'Click to Listen to Rain'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {isRaining ? 'Procedural drops flowing gently' : 'Audio starts only after your tap'}
                </span>
              </div>

              {/* Volume Slider */}
              <div className="w-full space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-200 font-bold">
                  <span className="flex items-center gap-1.5">
                    {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-purple-500" />}
                    Rainfall Volume
                  </span>
                  <span className="font-mono text-purple-600 dark:text-purple-300">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="mt-8 p-3.5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/50 border border-sky-200/60 dark:border-sky-800/60 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-sky-500" />
              Real procedural DSP white/pink noise synthesis • Zero streaming lag or trackers
            </span>
            <span className="text-[11px] text-sky-600 dark:text-sky-400 font-bold hidden sm:inline">
              100% Client-Side Web Audio
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
