import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, RefreshCw, Moon, Wind, Thermometer, ShieldAlert, Heart, Star, Volume2 } from 'lucide-react';
import { DreamForecast } from '../types';
import { soundFx } from '../utils/soundFx';

export const DreamForecastStation: React.FC = () => {
  const allForecasts: DreamForecast[] = [
    {
      id: 'df-1',
      title: 'The Stardust Shower & Marshmallow Valley',
      description:
        'Expect heavy precipitation of shimmering gold star-flecks followed by soft, zero-gravity drifting over fluffy strawberry marshmallow ridges. Perfect for waking up refreshed and smiling.',
      probability: '97% Chance of Sweet Dreams',
      cloudCover: '88% Cotton Fluff Nimbus',
      temperature: 'Cozy 22°C (Warm Blanket Index)',
      windSpeed: '2 knots Lavender Breeze',
      recommendedActivity: 'Sip warm chamomile tea and tuck toes inside fuzzy socks',
      luckyToken: '✨ Silver Star Hairpin',
      accentColor: '#E9D5FF',
      iconName: 'Stars',
    },
    {
      id: 'df-2',
      title: 'The Great Flying Feather Highway',
      description:
        'A warm thermal updraft will grant you effortless flight alongside friendly migrating sky geese. You will glide gently over neon pastel mountain ranges without ever feeling tired.',
      probability: '94% Chance of Euphoric Floating',
      cloudCover: '62% High Altitude Silk Stratus',
      temperature: 'Crisp & Refreshing 19°C',
      windSpeed: '4 knots Uplifting Dream Gust',
      recommendedActivity: 'Imagine yourself leaping gently into a sea of soft feathers',
      luckyToken: '🪶 Iridescent Cloud Feather',
      accentColor: '#BAE6FD',
      iconName: 'Wind',
    },
    {
      id: 'df-3',
      title: 'The Giggle Cloud Front & Dandelion Meadow',
      description:
        'A light pressure system bringing spontaneous gentle chuckles, nostalgic memories of playground laughter, and endless fields of glowing giant dandelions ready to make wishes upon.',
      probability: '99% Chance of Deep Contentment',
      cloudCover: '92% Bouncy Cumulus Meadows',
      temperature: 'Sunny-warm 24°C Under Covers',
      windSpeed: 'Calm 1 knot Honey Dewdrift',
      recommendedActivity: 'Recall your funniest childhood moment right before closing eyes',
      luckyToken: '🌼 Luminous Dandelion Fluff',
      accentColor: '#FEF08A',
      iconName: 'Sun',
    },
    {
      id: 'df-4',
      title: 'Midnight Attic Window & Raindrop Symphony',
      description:
        'Deep rhythmic rainfall tapping softly on a slanted wooden rooftop skylight. Surrounded by dry cedar scent, an infinite stack of cozy fantasy novels, and purring sleepy cats.',
      probability: '98% Chance of Sound Slumber',
      cloudCover: '95% Velvet Rain Fog',
      temperature: 'Snug 20°C with Hot Mug',
      windSpeed: '3 knots Autumn Whispers',
      recommendedActivity: 'Take three slow deep breaths and listen to the rain sound machine',
      luckyToken: '🌧️ Polished Rain Crystal',
      accentColor: '#A5F3FC',
      iconName: 'Droplets',
    },
    {
      id: 'df-5',
      title: 'The Secret Starlit Tea Room',
      description:
        'A clandestine floating tea pavilion manned by friendly moon rabbits serving honeyed cinnamon tea. Quiet acoustic harp melodies drifting over silver clouds.',
      probability: '92% Chance of Peaceful Introspection',
      cloudCover: '70% Silver Moonveil',
      temperature: 'Mild 21°C Starlit Glow',
      windSpeed: 'Calm 0 knots Still Sky',
      recommendedActivity: 'Write down one worry on paper, crumple it up, and let it go',
      luckyToken: '🍵 Porcelain Moon Teacup',
      accentColor: '#FBCFE8',
      iconName: 'Moon',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwirling, setIsSwirling] = useState(false);

  const current = allForecasts[currentIndex];

  const handleShuffleForecast = () => {
    setIsSwirling(true);
    soundFx.playTwinkle();

    setTimeout(() => {
      let nextIdx = Math.floor(Math.random() * allForecasts.length);
      if (nextIdx === currentIndex) {
        nextIdx = (nextIdx + 1) % allForecasts.length;
      }
      setCurrentIndex(nextIdx);
      setIsSwirling(false);
      // Play the dream's custom sound effect!
      soundFx.playDreamSound(allForecasts[nextIdx].id);
    }, 650);
  };

  const handlePlayCurrentDreamSound = () => {
    soundFx.playDreamSound(current.id);
  };

  // Render Cute Animated Scene for each specific dream
  const renderCuteDreamAnimation = (id: string) => {
    switch (id) {
      case 'df-1':
        // The Stardust Shower & Marshmallow Valley
        return (
          <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-purple-900 via-indigo-900 to-pink-950 p-4 overflow-hidden border border-purple-400/50 shadow-inner flex flex-col items-center justify-between">
            {/* Cascading Golden Stardust Shower */}
            <div className="absolute inset-0 pointer-events-none">
              {[15, 30, 45, 60, 75, 90].map((left, idx) => (
                <div
                  key={idx}
                  className="absolute text-yellow-300 animate-twinkle"
                  style={{
                    left: `${left}%`,
                    top: `${10 + (idx % 3) * 15}%`,
                    animationDelay: `${idx * 0.25}s`,
                    fontSize: `${12 + (idx % 3) * 4}px`,
                  }}
                >
                  ✨
                </div>
              ))}
            </div>

            {/* Little smiling sleepy cloud with starry eyes */}
            <div className="relative z-10 mt-2 animate-float-gentle flex flex-col items-center">
              <div className="w-20 h-14 rounded-full bg-gradient-to-b from-white to-pink-100 shadow-md border border-white flex items-center justify-center relative">
                <span className="text-xs">⭐ ‿ ⭐</span>
                <div className="absolute -bottom-1 -left-1 w-2.5 h-1.5 rounded-full bg-pink-400" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-1.5 rounded-full bg-pink-400" />
              </div>
              <span className="text-[10px] text-yellow-200 font-bold mt-1 bg-black/40 px-2 py-0.5 rounded-full">
                Drifting over sweet marshmallow peaks
              </span>
            </div>

            {/* Fluffy Marshmallow Hills */}
            <div className="relative w-full flex items-end justify-center gap-2 z-10">
              <div className="w-24 h-12 rounded-t-3xl bg-pink-200/90 shadow-sm animate-float-bob" />
              <div className="w-28 h-16 rounded-t-3xl bg-white/90 shadow-md animate-float-bob" style={{ animationDelay: '0.4s' }} />
              <div className="w-24 h-12 rounded-t-3xl bg-purple-200/90 shadow-sm animate-float-bob" style={{ animationDelay: '0.8s' }} />
            </div>
          </div>
        );

      case 'df-2':
        // The Great Flying Feather Highway
        return (
          <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-sky-400 via-indigo-400 to-purple-500 p-4 overflow-hidden border border-sky-300/60 shadow-inner flex flex-col items-center justify-center">
            {/* Friendly migrating sky geese */}
            <div className="absolute top-4 left-6 text-xl animate-float-gentle flex items-center gap-1">
              <span>🪿</span>
              <span className="text-xs">🪿</span>
            </div>

            {/* Wind drift lines */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute top-10 left-10 w-32 h-0.5 bg-white rounded-full animate-drift-layer-1" />
              <div className="absolute top-24 right-12 w-44 h-0.5 bg-white rounded-full animate-drift-layer-2" />
            </div>

            {/* Giant glowing iridescent feather gliding */}
            <div className="relative z-10 animate-float-gentle flex flex-col items-center">
              <div className="text-5xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] rotate-12 transform hover:rotate-45 transition-transform cursor-pointer">
                🪶
              </div>
              <span className="text-[10px] text-white font-extrabold mt-1 bg-black/30 px-3 py-0.5 rounded-full shadow-xs">
                Gliding weightlessly over sunset skies
              </span>
            </div>
          </div>
        );

      case 'df-3':
        // The Giggle Cloud Front & Dandelion Meadow
        return (
          <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-amber-200 via-yellow-100 to-emerald-200 dark:from-amber-950 dark:via-yellow-900 dark:to-emerald-950 p-4 overflow-hidden border border-yellow-300 shadow-inner flex flex-col items-center justify-between">
            {/* Giggling Baby Cloud */}
            <div className="relative z-10 mt-2 animate-float-bob flex flex-col items-center">
              <div className="w-22 h-14 rounded-full bg-white shadow-md border-2 border-yellow-200 flex flex-col items-center justify-center relative">
                <span className="text-xs font-bold text-slate-700">😆</span>
                <div className="flex gap-4 -mt-1">
                  <span className="w-2 h-1.5 rounded-full bg-pink-400" />
                  <span className="w-2 h-1.5 rounded-full bg-pink-400" />
                </div>
              </div>
              <span className="text-[10px] text-amber-900 dark:text-yellow-200 font-bold mt-1 bg-white/70 dark:bg-black/50 px-2 py-0.5 rounded-full">
                Giggles rippling across the meadow
              </span>
            </div>

            {/* Floating Dandelion Fluff seeds */}
            <div className="relative w-full flex items-center justify-around z-10">
              {['🌼', '🌾', '🌼', '🌾'].map((fluff, idx) => (
                <div
                  key={idx}
                  className="text-2xl animate-float-gentle"
                  style={{ animationDelay: `${idx * 0.3}s` }}
                >
                  {fluff}
                </div>
              ))}
            </div>
          </div>
        );

      case 'df-4':
        // Midnight Attic Window & Raindrop Symphony
        return (
          <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 p-4 overflow-hidden border border-blue-400/50 shadow-inner flex flex-col items-center justify-between">
            {/* Window pane with raindrops */}
            <div className="absolute inset-x-8 inset-y-2 border-2 border-white/40 rounded-xl grid grid-cols-2 grid-rows-2 pointer-events-none">
              <div className="border-r border-b border-white/30 relative">
                <span className="absolute top-2 left-3 text-[10px] text-sky-300 animate-pulse">💧</span>
              </div>
              <div className="border-b border-white/30 relative">
                <span className="absolute top-5 right-4 text-[10px] text-sky-300 animate-pulse" style={{ animationDelay: '0.4s' }}>💧</span>
              </div>
              <div className="border-r border-white/30 relative">
                <span className="absolute bottom-2 left-6 text-[10px] text-sky-300 animate-pulse" style={{ animationDelay: '0.8s' }}>💧</span>
              </div>
              <div />
            </div>

            {/* Candle & Snoozing Cat */}
            <div className="relative z-10 flex items-center justify-center gap-6 mt-4">
              <div className="flex flex-col items-center">
                <div className="text-xl animate-bounce">🕯️</div>
                <div className="w-8 h-1 bg-amber-400/50 rounded-full blur-xs" />
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl animate-float-bob">🐱💤</div>
                <span className="text-[10px] text-slate-300 font-mono mt-0.5">purr... purr...</span>
              </div>
            </div>

            <span className="text-[10px] text-sky-200 font-bold bg-black/50 px-3 py-0.5 rounded-full z-10">
              Cozy attic roof softly tapping rain notes
            </span>
          </div>
        );

      case 'df-5':
      default:
        // The Secret Starlit Tea Room
        return (
          <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-indigo-950 via-purple-900 to-pink-950 p-4 overflow-hidden border border-pink-400/50 shadow-inner flex flex-col items-center justify-between">
            {/* Silver moon and starry ceiling */}
            <div className="absolute top-2 right-4 text-xl animate-float-bob">🌙</div>

            {/* Moon Bunny & Teapot Scene */}
            <div className="relative z-10 mt-3 flex items-center justify-center gap-4">
              <div className="text-3xl animate-float-bob">🐰</div>
              <div className="text-2xl animate-float-gentle">🫖</div>
              <div className="flex flex-col items-center">
                <span className="text-xs animate-bounce text-pink-300">💕</span>
                <div className="text-2xl">🍵</div>
              </div>
            </div>

            <span className="text-[10px] text-pink-200 font-bold bg-black/40 px-3 py-0.5 rounded-full z-10">
              Moon rabbit pouring starlit chamomile tea
            </span>
          </div>
        );
    }
  };

  return (
    <section id="forecast" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/90 dark:bg-purple-950/80 border border-purple-200/80 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 mb-3">
            <Compass className="w-4 h-4 text-purple-500" />
            Magical Dream Portal
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Dream Forecast Station
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Peek into tonight's starry skies! Mallow reads the nocturnal winds to predict tonight’s sweetest dreams.
          </p>
        </div>

        {/* Forecast Card Stage */}
        <div className="sky-card rounded-3xl p-6 sm:p-9 relative overflow-hidden shadow-2xl border border-white/80 dark:border-purple-800/60">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-purple-100/60 dark:border-purple-900/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-400 via-pink-400 to-amber-300 flex items-center justify-center text-white shadow-md">
                <Moon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-purple-600 dark:text-purple-400 font-extrabold block">
                  Official Nocturnal Outlook
                </span>
                <span className="text-base font-extrabold text-slate-800 dark:text-white">
                  Tonight's Dream Weather
                </span>
              </div>
            </div>

            {/* Actions: Sound Replay & Forecast Shuffle */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayCurrentDreamSound}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 text-xs font-bold hover:bg-white transition-all toy-button"
                title="Listen to this dream's magic sound"
              >
                <Volume2 className="w-4 h-4 text-purple-500" />
                <span className="hidden sm:inline">Dream Melody</span>
              </button>

              <button
                onClick={handleShuffleForecast}
                disabled={isSwirling}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all toy-button"
              >
                <RefreshCw className={`w-4 h-4 ${isSwirling ? 'animate-spin' : ''}`} />
                {isSwirling ? 'Swirling Sky...' : 'Peek Tonight’s Dream! 🔮'}
              </button>
            </div>
          </div>

          {/* Dream Portal Animation & Reveal Body */}
          <div className="mt-6 relative">
            {isSwirling ? (
              // Swirling Dream Portal
              <div className="py-16 flex flex-col items-center justify-center text-center animate-fadeIn">
                <div className="w-28 h-28 rounded-full border-4 border-dashed border-purple-400 animate-portal flex items-center justify-center bg-gradient-to-tr from-purple-200/40 via-pink-200/40 to-sky-200/40 blur-xs">
                  <Sparkles className="w-10 h-10 text-yellow-400 animate-spin" />
                </div>
                <p className="mt-4 text-sm font-bold text-purple-700 dark:text-purple-300 animate-pulse">
                  Gathering stardust & consulting the moon rabbits... ✨
                </p>
              </div>
            ) : (
              // Revealed Forecast with Cute Animation Centerpiece!
              <div className="animate-fadeIn space-y-6">
                {/* Cute Animated Scene for this specific dream */}
                <div className="cursor-pointer" onClick={handlePlayCurrentDreamSound} title="Click to hear dream sound!">
                  {renderCuteDreamAnimation(current.id)}
                </div>

                <div>
                  {/* Probability Pill */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/70 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-black mb-3 shadow-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {current.probability}
                  </div>

                  {/* Centerpiece Dream Title */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2">
                    {current.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {current.description}
                  </p>
                </div>

                {/* Telemetry Objects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-purple-100 dark:border-purple-800 flex items-center gap-3 toy-button">
                    <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">
                        Warm Blanket Index
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {current.temperature}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-purple-100 dark:border-purple-800 flex items-center gap-3 toy-button">
                    <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600">
                      <Wind className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">
                        Cloud Cover & Wind
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {current.cloudCover}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-purple-100 dark:border-purple-800 flex items-center gap-3 toy-button">
                    <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">
                        Lucky Star Token
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {current.luckyToken}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Illustrated Bedtime Ritual */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/40 border border-purple-200/70 dark:border-purple-800/60 flex items-start gap-3.5">
                  <Heart className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-extrabold text-purple-950 dark:text-purple-200 block mb-0.5">
                      Mallow's Recommended Bedtime Ritual:
                    </span>
                    <span className="text-slate-600 dark:text-purple-300">
                      {current.recommendedActivity}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fictional Disclaimer */}
          <div className="mt-8 pt-4 border-t border-purple-100/50 dark:border-purple-900/50 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldAlert className="w-4 h-4 shrink-0 text-slate-400" />
            <span>
              Disclaimer: Dream forecasts are 100% fictional, safe, and created purely for bedtime amusement and sweet peace of mind.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
