import React, { useState, useEffect } from 'react';
import { Stars, Sparkles, Send, Heart, Moon, Cloud, Star, Flower, RefreshCw, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SkyWish } from '../types';
import { soundFx } from '../utils/soundFx';
import { useVisitor } from '../context/VisitorContext';

const TOKEN_ICONS: Record<string, React.ReactNode> = {
  star: <Star className="w-4 h-4 fill-current" />,
  moon: <Moon className="w-4 h-4 fill-current" />,
  heart: <Heart className="w-4 h-4 fill-current" />,
  cloud: <Cloud className="w-4 h-4 fill-current" />,
  flower: <Flower className="w-4 h-4 fill-current" />,
  sparkle: <Sparkles className="w-4 h-4 fill-current" />,
};

const COLOR_OPTIONS = [
  { label: 'Starlight Gold', value: '#FDE047' },
  { label: 'Lavender Mist', value: '#C084FC' },
  { label: 'Rose Blush', value: '#F472B6' },
  { label: 'Sky Blue', value: '#38BDF8' },
  { label: 'Mint Dew', value: '#4ADE80' },
  { label: 'Peach Glow', value: '#FB923C' },
];

export const DreamGuestbook: React.FC = () => {
  const { visitor, recordExperience } = useVisitor();
  const [wishes, setWishes] = useState<SkyWish[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [nickname, setNickname] = useState<string>(visitor.nickname || '');
  const [message, setMessage] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<'star' | 'moon' | 'heart' | 'cloud' | 'flower' | 'sparkle'>('star');
  const [selectedColor, setSelectedColor] = useState<string>('#FDE047');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Selected wish modal for constellation inspection
  const [activeWish, setActiveWish] = useState<SkyWish | null>(null);

  // Fetch real persistent wishes from backend
  const fetchWishes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/wishes');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.wishes)) {
        setWishes(data.wishes);
      } else {
        throw new Error('Invalid wishes response');
      }
    } catch (err: any) {
      console.warn('Could not fetch wishes from backend:', err);
      setError('Unable to connect to the sky constellation right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  // Update nickname if visitor memory changes
  useEffect(() => {
    if (visitor.nickname && !nickname) {
      setNickname(visitor.nickname);
    }
  }, [visitor.nickname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!message.trim() || message.trim().length < 2) {
      setSubmitError('Please write at least 2 characters for your wish.');
      return;
    }

    if (message.length > 200) {
      setSubmitError('Wishes cannot exceed 200 characters.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim() || visitor.nickname || 'Anonymous Dreamer',
          message: message.trim(),
          token: selectedToken,
          color: selectedColor,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.wish) {
        // Prepend new wish
        setWishes((prev) => [data.wish, ...prev]);
        setMessage('');
        setIsFormOpen(false);
        setActiveWish(data.wish);
        recordExperience('Added a wish to Sky Library');

        soundFx.playChime(783.99);
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { y: 0.6 },
          colors: [selectedColor, '#E9D5FF', '#BAE6FD', '#FDE047'],
        });
        window.dispatchEvent(new CustomEvent('mallow-wish-saved'));
      }
    } catch (err: any) {
      console.error('Wish submission error:', err);
      setSubmitError(err.message || 'Could not send wish to the sky. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (wishId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playChime(659.25);

    // Optimistic update
    setWishes((prev) =>
      prev.map((w) => (w.id === wishId ? { ...w, likes: (w.likes || 0) + 1 } : w))
    );
    if (activeWish && activeWish.id === wishId) {
      setActiveWish((prev) => (prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null));
    }

    try {
      await fetch(`/api/wishes/${wishId}/like`, { method: 'POST' });
    } catch (err) {
      console.warn('Could not record like on server', err);
    }
  };

  return (
    <section id="sky-library" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/80 dark:to-pink-950/80 border border-purple-200/80 dark:border-purple-800/80 text-purple-700 dark:text-purple-300 text-xs font-bold mb-3 shadow-sm">
            <Stars className="w-3.5 h-3.5 text-purple-500" />
            <span>Shared Persistent Sky Constellation</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            The Sky Wish Library
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every wish written here is saved in Mallow's sky and shared with travelers around the world.
            Click any glowing star to read a dream, or hang your own wish in the constellation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {wishes.length} Wishes Floating in the Sky
            </span>
            <button
              onClick={fetchWishes}
              disabled={isLoading}
              className="p-1.5 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
              title="Refresh constellation wishes"
              aria-label="Refresh constellation wishes"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => {
              setIsFormOpen(!isFormOpen);
              soundFx.playChime(659.25);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all toy-button"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isFormOpen ? 'Close Pen' : 'Leave a Wish in the Sky'}</span>
          </button>
        </div>

        {/* Wish Submission Form Modal / Box */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 sky-card rounded-3xl p-6 sm:p-8 border-2 border-purple-300/80 dark:border-purple-700/80 shadow-2xl animate-fadeIn"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>Write a Little Wish for the World</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close wish form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs">
                {submitError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Nickname (Optional):
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Dreamer Piper, Starry Eyes, or Anonymous"
                  maxLength={30}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-700 text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Hope, Wish, or Kind Word *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a gentle wish for anyone who visits this sky..."
                  rows={3}
                  required
                  maxLength={200}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-700 text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                  <span>Wishes are publicly visible to other dreamers.</span>
                  <span>{message.length} / 200 characters</span>
                </div>
              </div>

              {/* Token & Color selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Celestial Token:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['star', 'moon', 'heart', 'cloud', 'flower', 'sparkle'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setSelectedToken(t);
                          soundFx.playPuff();
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all toy-button ${
                          selectedToken === t
                            ? 'bg-purple-100 dark:bg-purple-900/80 border-purple-500 scale-110 shadow-sm text-purple-700 dark:text-purple-200'
                            : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                        title={t}
                      >
                        {TOKEN_ICONS[t]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Stardust Glow Color:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((col) => (
                      <button
                        key={col.value}
                        type="button"
                        onClick={() => {
                          setSelectedColor(col.value);
                          soundFx.playPuff();
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === col.value
                            ? 'scale-125 border-purple-600 shadow-md ring-2 ring-purple-300'
                            : 'border-white dark:border-slate-700'
                        }`}
                        style={{ backgroundColor: col.value }}
                        title={col.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100/70 dark:border-purple-900/60">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all toy-button disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Tucking into Sky...' : 'Hang Wish in Constellation'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Constellation Canvas View */}
        <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden sky-card border border-purple-200/80 dark:border-purple-800/60 shadow-xl bg-gradient-to-b from-indigo-950/20 via-purple-950/20 to-slate-900/30 backdrop-blur-md">
          {/* Subtle starry background grid and constellation lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            {wishes.slice(0, 15).map((w, idx) => {
              const next = wishes[(idx + 1) % Math.min(wishes.length, 15)];
              if (!next) return null;
              return (
                <line
                  key={`line-${w.id}-${next.id}`}
                  x1={`${w.x}%`}
                  y1={`${w.y}%`}
                  x2={`${next.x}%`}
                  y2={`${next.y}%`}
                  stroke="#C084FC"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              );
            })}
          </svg>

          {/* Glowing Wish Objects scattered in celestial space */}
          {wishes.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                setActiveWish(w);
                soundFx.playChime(659.25);
              }}
              style={{
                left: `${w.x}%`,
                top: `${w.y}%`,
                color: w.color,
                filter: `drop-shadow(0 0 8px ${w.color})`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full hover:scale-150 active:scale-95 transition-transform toy-button group z-10"
              title={`${w.nickname}: "${w.message}"`}
            >
              <div className="animate-pulse">
                {TOKEN_ICONS[w.token] || TOKEN_ICONS.star}
              </div>
              <span className="absolute left-1/2 -top-6 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {w.nickname}
              </span>
            </button>
          ))}

          {/* Constellation Canvas Guide Overlay */}
          <div className="absolute bottom-3 left-4 text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-200/60 dark:border-purple-800/60 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span>Click any glowing star to reveal its hidden wish</span>
          </div>
        </div>

        {/* Active Wish Storybook Inspection Modal */}
        {activeWish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-md sky-card rounded-3xl p-6 sm:p-8 border border-white/80 dark:border-purple-800/80 shadow-2xl animate-scaleUp">
              <button
                onClick={() => setActiveWish(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close wish card"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md text-white"
                  style={{ backgroundColor: activeWish.color }}
                >
                  {TOKEN_ICONS[activeWish.token] || TOKEN_ICONS.star}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-white">
                    {activeWish.nickname}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Hanged in the sky on {new Date(activeWish.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <blockquote className="my-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-purple-100 dark:border-purple-900/60 text-sm sm:text-base text-slate-700 dark:text-purple-100 italic leading-relaxed">
                "{activeWish.message}"
              </blockquote>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={(e) => handleLike(activeWish.id, e)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60 text-xs font-bold hover:scale-105 active:scale-95 transition-all toy-button"
                >
                  <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                  <span>Send Stardust Warmth ({activeWish.likes || 1})</span>
                </button>

                <button
                  onClick={() => setActiveWish(null)}
                  className="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 text-xs font-bold hover:bg-purple-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
