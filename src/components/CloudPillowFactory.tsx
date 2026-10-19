import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Feather, Sparkles, RefreshCw, BookmarkCheck, Heart, Scissors, Cloud } from 'lucide-react';
import { DreamPillow } from '../types';
import { soundFx } from '../utils/soundFx';

export const CloudPillowFactory: React.FC = () => {
  const [density, setDensity] = useState('Marshmallow Soft');
  const [selectedEssence, setSelectedEssence] = useState({
    title: 'Floating over strawberry fields',
    icon: '🍓',
    tag: 'Sweet Berry',
  });
  const [customTheme, setCustomTheme] = useState('');
  const [fabric, setFabric] = useState('Starlight Silk');
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftProgress, setCraftProgress] = useState(0);
  const [isSquashing, setIsSquashing] = useState(false);
  const [essenceAnimClass, setEssenceAnimClass] = useState('animate-essence-strawberry');
  const [latestPillow, setLatestPillow] = useState<DreamPillow | null>(null);

  // Initial pillow sanctuary state
  const [pillowTray, setPillowTray] = useState<DreamPillow[]>([
    {
      id: 'pillow-seed-1',
      name: 'Lavender Dusk Dreamer',
      density: 'Sunset Nimbus',
      theme: 'Drinking warm chamomile under violet twilight',
      fabric: 'Moonbeam Cotton',
      softness: 99.4,
      fragrance: 'Chamomile & Stardust',
      createdAt: 'Just now',
      color: '#E9D5FF',
      essenceIcon: '🍵',
    },
    {
      id: 'pillow-seed-2',
      name: 'Strawberry Cloud Puff',
      density: 'Marshmallow Soft',
      theme: 'Floating over strawberry fields',
      fabric: 'Starlight Silk',
      softness: 99.8,
      fragrance: 'Fresh Wild Strawberry & Sweet Cream',
      createdAt: 'Earlier today',
      color: '#FECDD3',
      essenceIcon: '🍓',
    },
  ]);

  // Illustrated Dream Essences
  const essences = [
    { title: 'Floating over strawberry fields', icon: '🍓', tag: 'Sweet Berry', anim: 'animate-essence-strawberry' },
    { title: 'Warm cocoa beside a crackling hearth', icon: '☕', tag: 'Warm & Cozy', anim: 'animate-essence-cocoa' },
    { title: 'Reading fairy tales by a rainy window', icon: '📖', tag: 'Quiet Magic', anim: 'animate-essence-book' },
    { title: 'Secret garden glowing with fireflies', icon: '🪲', tag: 'Enchanted Night', anim: 'animate-essence-firefly' },
    { title: 'Sleeping in sun-warmed cotton blankets', icon: '🛏️', tag: 'Fresh Warmth', anim: 'animate-essence-blanket' },
    { title: 'Dancing under lavender shooting stars', icon: '⭐', tag: 'Starlight Dream', anim: 'animate-essence-star' },
    { title: 'Sipping chamomile tea with moon bunnies', icon: '🍵', tag: 'Gentle Peace', anim: 'animate-essence-tea' },
  ];

  // Cloud Lofts
  const densities = [
    { id: 'Marshmallow Soft', label: 'Marshmallow Soft', puff: '☁️ Extra Plump', scaleClass: 'scale-105' },
    { id: 'Fluffy Cumulus', label: 'Fluffy Cumulus', puff: '☁️ Triple Loft', scaleClass: 'scale-100' },
    { id: 'Sunset Nimbus', label: 'Sunset Nimbus', puff: '☁️ Cozy Heavy', scaleClass: 'scale-95' },
    { id: 'Starlight Wisp', label: 'Starlight Wisp', puff: '☁️ Ultra Light', scaleClass: 'scale-90' },
  ];

  // Tactile Fabric Swatches
  const fabrics = [
    {
      id: 'Starlight Silk',
      name: 'Starlight Silk',
      desc: 'Cool with golden shimmer',
      color: '#E9D5FF',
      textColor: 'text-purple-700',
      pattern: '✦ ✦ ✦',
    },
    {
      id: 'Moonbeam Cotton',
      name: 'Moonbeam Cotton',
      desc: 'Breathable & sun-washed',
      color: '#FEF08A',
      textColor: 'text-amber-700',
      pattern: '≈ ≈ ≈',
    },
    {
      id: 'Raindrop Velour',
      name: 'Raindrop Velour',
      desc: 'Deep plush velvet blue',
      color: '#BAE6FD',
      textColor: 'text-sky-700',
      pattern: '• • •',
    },
  ];

  const activeThemeString = customTheme.trim() ? customTheme.trim() : selectedEssence.title;
  const activeIcon = customTheme.trim() ? '✨' : selectedEssence.icon;

  // Distinct Pillow Visuals & Shapes for Each Dream Essence
  const getEssenceVisualTheme = (icon: string) => {
    switch (icon) {
      case '🍓':
        return {
          bgGradient: 'from-rose-100 via-pink-200 to-red-100',
          borderColor: 'border-rose-300 dark:border-rose-400',
          shadowColor: 'rgba(244, 63, 94, 0.45)',
          shapeClass: 'rounded-[48px]',
          cornerIcon1: '🍓',
          cornerIcon2: '🌸',
          centerTuft: '🍓',
          tuftDesc: 'Strawberry Blossom Tuft',
          patternText: 'strawberry seeds & sugar',
          ribbonColor: 'bg-rose-400 text-white',
        };
      case '☕':
        return {
          bgGradient: 'from-amber-100 via-orange-100 to-stone-200',
          borderColor: 'border-amber-400 dark:border-amber-500',
          shadowColor: 'rgba(217, 119, 6, 0.4)',
          shapeClass: 'rounded-[32px]',
          cornerIcon1: '☕',
          cornerIcon2: '🪵',
          centerTuft: '♨️',
          tuftDesc: 'Warm Cinnamon Swirl Tuft',
          patternText: 'hot cocoa steam & toasted cream',
          ribbonColor: 'bg-amber-600 text-white',
        };
      case '📖':
        return {
          bgGradient: 'from-indigo-100 via-purple-100 to-sky-100',
          borderColor: 'border-indigo-400 dark:border-indigo-400',
          shadowColor: 'rgba(99, 102, 241, 0.4)',
          shapeClass: 'rounded-[22px]',
          cornerIcon1: '📖',
          cornerIcon2: '🪄',
          centerTuft: '🔖',
          tuftDesc: 'Fairy Bookmark Tuft',
          patternText: 'gilded star-parchment stitches',
          ribbonColor: 'bg-indigo-600 text-white',
        };
      case '🪲':
        return {
          bgGradient: 'from-emerald-100 via-teal-100 to-amber-100',
          borderColor: 'border-emerald-400 dark:border-emerald-400',
          shadowColor: 'rgba(16, 185, 129, 0.4)',
          shapeClass: 'rounded-[42px]',
          cornerIcon1: '🌿',
          cornerIcon2: '🪲',
          centerTuft: '✨',
          tuftDesc: 'Lantern Firefly Glow Tuft',
          patternText: 'luminescent night garden weave',
          ribbonColor: 'bg-emerald-600 text-white',
        };
      case '🛏️':
        return {
          bgGradient: 'from-yellow-100 via-amber-100 to-orange-100',
          borderColor: 'border-yellow-400 dark:border-yellow-400',
          shadowColor: 'rgba(234, 179, 8, 0.4)',
          shapeClass: 'rounded-3xl',
          cornerIcon1: '☀️',
          cornerIcon2: '🪶',
          centerTuft: '🌼',
          tuftDesc: 'Sunbeam Diamond Tuft',
          patternText: 'sun-baked honey cotton stitches',
          ribbonColor: 'bg-yellow-500 text-slate-900',
        };
      case '⭐':
        return {
          bgGradient: 'from-purple-200 via-pink-200 to-indigo-200',
          borderColor: 'border-purple-400 dark:border-purple-400',
          shadowColor: 'rgba(168, 85, 247, 0.45)',
          shapeClass: 'rounded-[44px]',
          cornerIcon1: '⭐',
          cornerIcon2: '💫',
          centerTuft: '✦',
          tuftDesc: 'North Star Charm Tuft',
          patternText: 'celestial constellation stitches',
          ribbonColor: 'bg-purple-600 text-white',
        };
      case '🍵':
        return {
          bgGradient: 'from-teal-50 via-emerald-100 to-purple-100',
          borderColor: 'border-teal-400 dark:border-teal-400',
          shadowColor: 'rgba(20, 184, 166, 0.4)',
          shapeClass: 'rounded-full',
          cornerIcon1: '🍵',
          cornerIcon2: '🐰',
          centerTuft: '🌙',
          tuftDesc: 'Moon Rabbit Silver Tuft',
          patternText: 'chamomile dewdrop weave',
          ribbonColor: 'bg-teal-600 text-white',
        };
      default:
        return {
          bgGradient: 'from-pink-100 via-purple-100 to-sky-100',
          borderColor: 'border-pink-300 dark:border-pink-400',
          shadowColor: 'rgba(236, 72, 153, 0.35)',
          shapeClass: 'rounded-3xl',
          cornerIcon1: '✨',
          cornerIcon2: '☁️',
          centerTuft: '💖',
          tuftDesc: 'Heartfelt Cloud Tuft',
          patternText: 'custom daydream stitches',
          ribbonColor: 'bg-pink-500 text-white',
        };
    }
  };

  const visual = getEssenceVisualTheme(activeIcon);

  // Trigger unique essence animation when an essence is chosen
  const handleSelectEssence = (e: typeof essences[0]) => {
    setSelectedEssence(e);
    setCustomTheme('');
    setEssenceAnimClass('');
    soundFx.playPluck(3);

    // Apply specific essence animation
    setTimeout(() => {
      setEssenceAnimClass(e.anim);
    }, 20);
  };

  // 'Fluff & Stitch' button action: Squash-and-stretch with celebratory confetti!
  const handleFluffAndStitch = () => {
    if (isCrafting) return;

    // Trigger instant squash & stretch animation on preview pillow!
    setIsSquashing(true);
    soundFx.playPuff();

    // Shoot confetti burst immediately!
    confetti({
      particleCount: 85,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#BAE6FD', '#E9D5FF', '#FBCFE8', '#FEF08A', '#FDE047', '#FDA4AF'],
      disableForReducedMotion: true,
    });

    // Reset squashing after animation finishes
    setTimeout(() => {
      setIsSquashing(false);
      soundFx.playFlourish();
      window.dispatchEvent(new CustomEvent('mallow-celebrate-pillow'));
    }, 850);

    // Save newly fluffed pillow to the sanctuary tray
    const randomSoftness = Number((98.8 + Math.random() * 1.1).toFixed(1));
    const fragrances = [
      'Sweet Vanilla Clouds & Lavender',
      'Warm Rain & Crisp Cotton Linen',
      'Wild Honey & Starlight Dewdrops',
      'Toasted Marshmallow & Cinnamon',
      'Fresh Garden Strawberry & Jasmine',
      'Chamomile Petals & Moon Water',
    ];
    const randomFragrance = fragrances[Math.floor(Math.random() * fragrances.length)];

    const newPillow: DreamPillow = {
      id: `pillow-${Date.now()}`,
      name: `${density.split(' ')[0]} ${activeThemeString.slice(0, 16)} Pillow`,
      density,
      theme: activeThemeString,
      fabric,
      softness: randomSoftness,
      fragrance: randomFragrance,
      createdAt: 'Just stitched',
      color: visual.bgGradient,
      essenceIcon: activeIcon,
    };

    setLatestPillow(newPillow);
    setPillowTray((prev) => [newPillow, ...prev.slice(0, 5)]);
  };

  return (
    <section id="pillows" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
      {/* Light Floating Clouds in the Background */}
      <div className="absolute top-8 left-4 opacity-35 animate-drift-layer-1 pointer-events-none">
        <svg width="180" height="90" viewBox="0 0 180 90" fill="none">
          <path
            d="M30 65C15 65 0 50 10 35C18 20 45 18 60 30C75 15 110 12 130 28C150 15 175 30 175 50C190 65 180 85 150 85C140 92 110 95 95 85C80 92 50 88 30 65Z"
            fill="currentColor"
            className="text-white/80 dark:text-purple-300/15"
          />
        </svg>
      </div>

      <div className="absolute top-1/2 right-4 opacity-30 animate-drift-layer-2 pointer-events-none" style={{ animationDirection: 'reverse' }}>
        <svg width="220" height="110" viewBox="0 0 220 110" fill="none">
          <path
            d="M40 78C20 78 0 60 12 42C22 24 55 22 72 36C90 18 132 15 156 34C180 18 210 36 210 60C228 78 216 102 180 102C168 110 132 114 114 102C96 110 60 105 40 78Z"
            fill="currentColor"
            className="text-pink-100/70 dark:text-pink-400/15"
          />
        </svg>
      </div>

      <div className="absolute bottom-12 left-1/3 opacity-25 animate-drift-layer-3 pointer-events-none">
        <svg width="160" height="80" viewBox="0 0 160 80" fill="none">
          <path
            d="M25 55C12 55 0 42 8 30C15 16 38 14 50 24C62 12 92 10 108 22C122 12 144 24 144 42C156 55 148 72 124 72C116 78 92 80 80 72C68 78 42 74 25 55Z"
            fill="currentColor"
            className="text-sky-100/70 dark:text-indigo-400/15"
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/90 dark:bg-pink-950/80 border border-pink-200/80 dark:border-pink-800 text-xs font-bold text-pink-700 dark:text-pink-300 mb-3 animate-float-bob">
            <Feather className="w-4 h-4 text-pink-500" />
            Interactive Toy Workshop
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Cloud Pillow Toy Factory
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Select different dream essences to watch the pillow transform with unique animations, then press
            <strong> 'Fluff & Stitch'</strong> to watch it squash, stretch, and pop with stardust!
          </p>
        </div>

        {/* Workshop Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 sky-card rounded-3xl p-6 sm:p-8 space-y-7">
            {/* 1. Cloud Density */}
            <div>
              <label className="block text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-2.5">
                ☁️ 1. Choose Cloud Loft (How fluffy?)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {densities.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setDensity(d.id);
                      soundFx.playPuff();
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all toy-button ${
                      density === d.id
                        ? 'bg-purple-100/90 dark:bg-purple-900/60 border-purple-400 text-purple-950 dark:text-purple-100 shadow-md ring-2 ring-purple-300'
                        : 'bg-white/70 dark:bg-slate-800/70 border-purple-100 dark:border-purple-800 text-slate-600 dark:text-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold">{d.label}</div>
                    <div className="text-[11px] opacity-80">{d.puff}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Dream Essence Toys */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
                  ✨ 2. Choose Dream Essence (Triggers Unique Pillow Animation)
                </label>
                <span className="text-[11px] text-pink-600 dark:text-pink-400 font-bold">
                  Tap to animate!
                </span>
              </div>

              {/* Dream essence toy buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {essences.map((e) => (
                  <button
                    key={e.title}
                    type="button"
                    onClick={() => handleSelectEssence(e)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2 transition-all toy-button ${
                      selectedEssence.title === e.title && !customTheme
                        ? 'bg-pink-100/90 dark:bg-pink-950/70 border-pink-400 text-pink-900 dark:text-pink-100 shadow-sm ring-2 ring-pink-300 scale-102'
                        : 'bg-white/70 dark:bg-slate-800/70 border-pink-100 dark:border-pink-900/50 text-slate-600 dark:text-slate-300 hover:bg-white'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl animate-float-bob">{e.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold truncate leading-tight">{e.tag}</div>
                      <div className="text-[10px] opacity-75 truncate">{e.title.slice(0, 15)}...</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Optional Custom Dream Input */}
              <div className="mt-3">
                <input
                  type="text"
                  value={customTheme}
                  onChange={(e) => {
                    setCustomTheme(e.target.value);
                    setEssenceAnimClass('animate-essence-star');
                  }}
                  placeholder="Or type a custom dream (e.g. napping on a rainbow)..."
                  maxLength={65}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-purple-200/80 dark:border-purple-700/80 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner"
                />
              </div>
            </div>

            {/* 3. Tactile Fabric Swatches */}
            <div>
              <label className="block text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-2">
                🧵 3. Pick Tactile Casing Fabric
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {fabrics.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFabric(f.id);
                      soundFx.playChime(659.25);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all toy-button relative overflow-hidden ${
                      fabric === f.id
                        ? 'border-purple-500 shadow-md ring-2 ring-purple-300'
                        : 'border-purple-100 dark:border-purple-800/80 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: f.color }}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-black ${f.textColor}`}>{f.name}</span>
                      <span className="text-[11px] opacity-60 font-mono">{f.pattern}</span>
                    </div>
                    <div className={`text-[10px] font-medium opacity-80 ${f.textColor}`}>
                      {f.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prominent 'Fluff & Stitch' Button with Squash-and-Stretch Animation & Confetti */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFluffAndStitch}
                className="w-full py-4 px-6 rounded-2xl text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl transition-all toy-button bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:shadow-purple-300/60 active:scale-95"
              >
                <Scissors className="w-5 h-5 text-yellow-300 rotate-90" />
                Fluff & Stitch! ☁️🎉
              </button>
              <span className="block text-center text-[11px] text-purple-600 dark:text-purple-300 mt-2 font-semibold">
                ✨ Tap 'Fluff & Stitch' to squish, puff, and shower stardust confetti!
              </span>
            </div>
          </div>

          {/* Central Dynamic Preview Area Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sky-card rounded-3xl p-6 sm:p-7 relative overflow-hidden text-center">
              {/* Dynamic Preview Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-300 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-purple-500" />
                  Dynamic Pillow Preview
                </span>
                <span className="text-[11px] text-pink-600 dark:text-pink-400 font-bold bg-pink-100/70 dark:bg-pink-950/60 px-2 py-0.5 rounded-full">
                  {selectedEssence.tag}
                </span>
              </div>

              {/* Dynamic Preview Stage */}
              <div className="relative py-6 flex flex-col items-center justify-center min-h-[220px]">
                {/* Floating Light Ambient Cloud Puffs */}
                <div className="absolute -top-1 left-4 text-xl opacity-40 animate-float-gentle pointer-events-none">☁️</div>
                <div className="absolute bottom-2 right-4 text-xl opacity-40 animate-float-bob pointer-events-none">☁️</div>

                {/* Orbiting Dream Essence Badge */}
                <div
                  className="absolute -top-1 right-6 z-20 w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-white animate-float-bob"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  title={`Infused with ${activeThemeString}`}
                >
                  {activeIcon}
                </div>

                {/* The Dynamic Pillow Preview with Squash-and-Stretch & Essence Animation */}
                <div
                  className={`w-56 h-36 ${visual.shapeClass} shadow-xl border-4 ${visual.borderColor} relative flex flex-col items-center justify-center bg-gradient-to-tr ${visual.bgGradient} transition-all duration-300 ${
                    isSquashing ? 'animate-pillow-squash' : essenceAnimClass
                  }`}
                  style={{
                    boxShadow: `0 14px 34px -6px ${visual.shadowColor}`,
                    transformOrigin: 'center center',
                  }}
                >
                  {/* Corner Dream Emblems */}
                  <div className="absolute top-2.5 left-3 text-sm">{visual.cornerIcon1}</div>
                  <div className="absolute bottom-2.5 right-3 text-sm">{visual.cornerIcon2}</div>
                  <div className="absolute top-2.5 right-3 text-[10px] font-mono font-bold text-slate-700/70">
                    {fabric.split(' ')[0]}
                  </div>

                  {/* Center Dream Tuft */}
                  <div className="w-10 h-10 rounded-full bg-white/90 shadow-md border border-purple-200/60 flex items-center justify-center text-lg animate-pulse">
                    {visual.centerTuft}
                  </div>

                  {/* Essence Tag Ribbon */}
                  <span className={`mt-2 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs ${visual.ribbonColor}`}>
                    {selectedEssence.tag}
                  </span>
                </div>

                {/* Current Pillow Title */}
                <h4 className="mt-4 text-base sm:text-lg font-black text-slate-800 dark:text-white">
                  {latestPillow ? latestPillow.name : `${density.split(' ')[0]} ${activeThemeString.slice(0, 16)} Pillow`}
                </h4>

                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 italic px-4">
                  "{activeThemeString}"
                </p>

                {/* Live Pillow Specs Badges */}
                <div className="mt-4 grid grid-cols-2 gap-2 w-full text-left">
                  <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-purple-100 dark:border-purple-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Softness Rating
                    </span>
                    <span className="text-xs font-extrabold text-purple-600 dark:text-purple-300">
                      {latestPillow ? `${latestPillow.softness}% Fluff` : '99.6% Cloud Fluff'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-purple-100 dark:border-purple-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Embroidery Style
                    </span>
                    <span className="text-xs font-extrabold text-pink-600 dark:text-pink-300 truncate block">
                      {visual.tuftDesc}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-purple-100 dark:border-purple-800 col-span-2">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Dream Fragrance
                    </span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      🌸 {latestPillow ? latestPillow.fragrance : 'Sweet Vanilla Clouds & Lavender'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillow Sanctuary Collection Tray */}
            {pillowTray.length > 0 && (
              <div className="sky-card rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                    Mallow's Pillow Sanctuary ({pillowTray.length})
                  </span>
                  <span className="text-[10px] text-purple-500 font-semibold">Tucked in sky</span>
                </div>
                <div className="space-y-2">
                  {pillowTray.map((p) => {
                    const itemVisual = getEssenceVisualTheme(p.essenceIcon || '✨');
                    return (
                      <div
                        key={p.id}
                        onClick={() => soundFx.playChime(600)}
                        className="p-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-purple-100 dark:border-purple-800/60 flex items-center justify-between text-xs toy-button cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{p.essenceIcon || '☁️'}</span>
                          <div
                            className={`w-6 h-4 rounded-md shadow-xs border border-white bg-gradient-to-r ${itemVisual.bgGradient}`}
                          />
                          <span className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[170px]">
                            {p.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-purple-600 dark:text-purple-400 font-mono font-bold">
                          {p.softness}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
