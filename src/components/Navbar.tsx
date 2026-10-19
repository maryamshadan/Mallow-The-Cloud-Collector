import React, { useState } from 'react';
import { Sun, Sunset, Moon, Volume2, VolumeX, Menu, X, Cloud, Download, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { soundFx } from '../utils/soundFx';

interface NavbarProps {
  isRaining: boolean;
  onOpenSoundMachine?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isRaining, onOpenSoundMachine }) => {
  const { theme, toggleTheme, soundMuted, toggleSound } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Meet Mallow', href: '#hero' },
    { name: 'Story', href: '#story' },
    { name: 'Pillow Factory', href: '#pillows' },
    { name: 'Dream Journal', href: '#dream-journal' },
    { name: 'Sky Library', href: '#sky-library' },
    { name: 'Rain Room', href: '#sound-machine' },
    { name: 'Forecast', href: '#forecast' },
    { name: 'Secret Cloud', href: '#secret-easter-egg' },
  ];

  const handleLinkClick = () => {
    soundFx.playChime();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500 backdrop-blur-md bg-white/75 dark:bg-slate-900/80 border-b border-white/60 dark:border-purple-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <a
            href="#hero"
            onClick={() => soundFx.playPuff()}
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-xl p-1 toy-button"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-200 via-pink-100 to-purple-200 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all">
              <Cloud className="w-5 h-5 text-sky-600 fill-sky-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-800 dark:text-purple-100 text-base tracking-tight">
                Mallow
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-white/70 dark:hover:bg-purple-900/50 transition-all toy-button"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action controls (Theme switch, Sound FX toggle, Rain Indicator, Mobile toggle) */}
          <div className="flex items-center gap-2">
            {/* Audio Indicator Button if running */}
            {isRaining && (
              <button
                onClick={() => {
                  soundFx.playChime();
                  onOpenSoundMachine?.();
                }}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100/90 dark:bg-sky-950/80 border border-sky-300/80 dark:border-sky-800 rounded-full animate-pulse shadow-sm toy-button"
                title="Rain sounds active! Click to jump to player"
              >
                <Cloud className="w-3.5 h-3.5 fill-sky-400 text-sky-600" />
                <span className="hidden sm:inline">Rain Playing</span>
              </button>
            )}

            {/* Global Sound FX Toggle Button */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl transition-all shadow-sm border focus:outline-none focus:ring-2 focus:ring-purple-400 toy-button ${
                soundMuted
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 border-slate-300 dark:border-slate-700'
                  : 'bg-purple-100/90 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300/70 dark:border-purple-700/80'
              }`}
              aria-label={soundMuted ? 'Unmute magical sounds' : 'Mute magical sounds'}
              title={soundMuted ? 'Sound FX: Muted (Click to enable)' : 'Sound FX: Enabled (Click to mute)'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            </button>

            {/* Day / Sunset / Night Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-amber-100/80 dark:bg-slate-800/90 text-amber-600 dark:text-yellow-300 hover:scale-105 active:scale-95 transition-all shadow-sm border border-amber-200/70 dark:border-purple-800/70 focus:outline-none focus:ring-2 focus:ring-purple-400 toy-button flex items-center gap-1"
              aria-label={`Cycle sky theme (Current: ${theme})`}
              title={`Cycle sky atmosphere: currently ${theme.toUpperCase()} (Day ☀️ -> Sunset 🌅 -> Night 🌙)`}
            >
              {theme === 'day' && <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />}
              {theme === 'sunset' && <Sunset className="w-4 h-4 text-orange-500" />}
              {theme === 'night' && <Moon className="w-4 h-4 text-purple-200" />}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/80 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2 border-t border-purple-100/60 dark:border-purple-900/50 flex flex-col gap-1.5 bg-white/95 dark:bg-slate-900/95 rounded-b-2xl shadow-xl">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-100/70 dark:hover:bg-purple-900/50 transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400 opacity-60" />
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
