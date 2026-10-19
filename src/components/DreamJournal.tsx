import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Plus, Trash2, Heart, Feather, Calendar, Search, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CollectedDream } from '../types';
import { soundFx } from '../utils/soundFx';
import { useVisitor } from '../context/VisitorContext';

const ESSENCE_PRESETS = [
  { name: 'Lavender Lullaby', color: '#C084FC', icon: '🌙' },
  { name: 'Starlight Honey', color: '#FDE047', icon: '⭐' },
  { name: 'Strawberry Float', color: '#F472B6', icon: '🍓' },
  { name: 'Rainy Window', color: '#38BDF8', icon: '🌧️' },
  { name: 'Mint Breeze', color: '#4ADE80', icon: '🍃' },
  { name: 'Golden Sunrise', color: '#FB923C', icon: '☀️' },
];

const INSPIRATION_IDEAS = [
  'A teacup of starlight that warmed my hands when it was chilly outside.',
  'Floating on a soft cotton cloud with little paper airplanes drifting past.',
  'Walking through a quiet forest where every tree leaf played a soft music box chime.',
  'A bedtime story whispered by the moon through open bedroom blinds.',
  'A rainbow bridge where cats with tiny wings were playing hide-and-seek.',
];

const STORAGE_KEY = 'mallow_collected_dreams';

export const DreamJournal: React.FC = () => {
  const { visitor, recordExperience } = useVisitor();
  const [dreams, setDreams] = useState<CollectedDream[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load dreams from localStorage', e);
    }
    // Initial welcome dream
    return [
      {
        id: 'sample-dream-1',
        title: 'Whispers on the Cloud Swing',
        description: 'Swinging back and forth between two puffy sunset clouds while warm evening stars sang in harmony.',
        essence: 'Lavender Lullaby',
        essenceColor: '#C084FC',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        tuckedInPillow: true,
      },
    ];
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEssence, setSelectedEssence] = useState(ESSENCE_PRESETS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
    } catch (e) {
      console.warn('Failed to save dreams to localStorage', e);
    }
  }, [dreams]);

  const handleSaveDream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newDream: CollectedDream = {
      id: `dream-${Date.now()}`,
      title: title.trim() || 'A Quiet Sky Thought',
      description: description.trim(),
      essence: selectedEssence.name,
      essenceColor: selectedEssence.color,
      createdAt: new Date().toISOString(),
      tuckedInPillow: false,
    };

    setDreams((prev) => [newDream, ...prev]);
    setTitle('');
    setDescription('');
    setIsFormOpen(false);
    recordExperience('Collected a dream in Journal');

    soundFx.playChime(783.99);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: [selectedEssence.color, '#FBCFE8', '#E9D5FF', '#BAE6FD'],
    });
  };

  const handleDelete = (id: string) => {
    setDreams((prev) => prev.filter((d) => d.id !== id));
    soundFx.playPuff();
  };

  const handleTuckInPillow = (dream: CollectedDream) => {
    setDreams((prev) =>
      prev.map((d) => (d.id === dream.id ? { ...d, tuckedInPillow: true } : d))
    );
    soundFx.playChime(659.25);
    const pillowElem = document.getElementById('pillows');
    if (pillowElem) {
      pillowElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInspireMe = () => {
    const randomIdea = INSPIRATION_IDEAS[Math.floor(Math.random() * INSPIRATION_IDEAS.length)];
    setDescription(randomIdea);
    setTitle('A Wandering Sky Memory');
    setIsFormOpen(true);
    soundFx.playChime(523.25);
  };

  const filteredDreams = dreams.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.essence.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="dream-journal" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 dark:bg-purple-950/80 border border-purple-200/80 dark:border-purple-800/80 text-purple-700 dark:text-purple-300 text-xs font-bold mb-3 shadow-sm">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Personal Sky Keepsake</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            The Dream Journal
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Collect stray thoughts, bedtime wishes, and morning memories into your private cloud jar.
            {visitor.nickname && ` Saved safely for ${visitor.nickname}.`}
          </p>
        </div>

        {/* Action Bar (Search & New Dream Toggle) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collected dreams..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-purple-200/80 dark:border-purple-800/70 text-xs sm:text-sm text-slate-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleInspireMe}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 text-xs font-bold hover:scale-105 active:scale-95 transition-all toy-button"
              title="Get a whimsical dream prompt"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Inspire Me</span>
            </button>

            <button
              onClick={() => {
                setIsFormOpen(!isFormOpen);
                soundFx.playChime(659.25);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all toy-button"
            >
              <Plus className="w-4 h-4" />
              <span>{isFormOpen ? 'Close Pen' : 'Collect New Dream'}</span>
            </button>
          </div>
        </div>

        {/* New Dream Form Drawer */}
        {isFormOpen && (
          <form
            onSubmit={handleSaveDream}
            className="mb-10 sky-card rounded-3xl p-6 sm:p-8 border border-purple-200/90 dark:border-purple-800/80 shadow-lg animate-fadeIn"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Write Down a Wandering Dream</span>
              </h3>
              <span className="text-xs font-medium text-slate-400">Stored in your browser</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dream Title or Name (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Floating Over Marshmallow Hills"
                  maxLength={50}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-700 text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dream Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What happened in your dream? What colors, sounds, or gentle memories did you notice?"
                  rows={3}
                  required
                  maxLength={300}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-700 text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
                <div className="text-right text-[11px] text-slate-400 mt-1">
                  {description.length} / 300 characters
                </div>
              </div>

              {/* Essence Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Dream Essence Color & Token:
                </label>
                <div className="flex flex-wrap gap-2">
                  {ESSENCE_PRESETS.map((essence) => (
                    <button
                      key={essence.name}
                      type="button"
                      onClick={() => {
                        setSelectedEssence(essence);
                        soundFx.playPuff();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all toy-button ${
                        selectedEssence.name === essence.name
                          ? 'bg-white dark:bg-slate-800 border-purple-500 shadow-sm scale-105'
                          : 'bg-white/60 dark:bg-slate-900/60 border-purple-100 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>{essence.icon}</span>
                      <span>{essence.name}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full ml-1"
                        style={{ backgroundColor: essence.color }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100/70 dark:border-purple-900/60">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all toy-button"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Collect Dream</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Collected Dreams Grid */}
        {filteredDreams.length === 0 ? (
          <div className="sky-card rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center mx-auto mb-3 text-2xl">
              ☁️
            </div>
            <h4 className="font-extrabold text-base text-slate-800 dark:text-white mb-1">
              {searchQuery ? 'No dreams match your search' : 'Your Dream Jar is Empty'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              {searchQuery
                ? 'Try a different keyword or reset the search to view all dreams.'
                : 'Whenever a sweet thought or daytime wish drifts across your mind, capture it here!'}
            </p>
            <button
              onClick={handleInspireMe}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 text-xs font-bold hover:scale-105 transition-all toy-button"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Inspire a Dream</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredDreams.map((dream) => (
              <div
                key={dream.id}
                className="sky-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between border border-white/80 dark:border-purple-800/60 shadow-md hover:shadow-lg transition-all group"
              >
                <div>
                  {/* Card Top: Essence badge and Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-xs"
                      style={{
                        backgroundColor: `${dream.essenceColor}20`,
                        borderColor: `${dream.essenceColor}60`,
                        color: dream.essenceColor,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dream.essenceColor }} />
                      <span>{dream.essence}</span>
                    </span>

                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(dream.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-white mb-1.5 leading-snug">
                    {dream.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    "{dream.description}"
                  </p>
                </div>

                {/* Card Actions Bottom */}
                <div className="mt-5 pt-3 border-t border-purple-100/60 dark:border-purple-900/40 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleTuckInPillow(dream)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all toy-button ${
                      dream.tuckedInPillow
                        ? 'bg-purple-100/80 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                        : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60'
                    }`}
                    title="Tuck this dream inside a Cloud Pillow"
                  >
                    <Feather className="w-3.5 h-3.5 text-purple-500" />
                    <span>{dream.tuckedInPillow ? 'Tucked in Pillow ✨' : 'Tuck into Pillow'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(dream.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Let dream drift away into mist"
                    aria-label="Delete dream"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Counter footer */}
        <div className="mt-6 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>{dreams.length} dream{dreams.length === 1 ? '' : 's'} tucked into your cloud keepsake</span>
        </div>
      </div>
    </section>
  );
};
