import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { VisitorProvider } from './context/VisitorContext';
import { SkyBackdrop } from './components/SkyBackdrop';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StorySection } from './components/StorySection';
import { CloudPillowFactory } from './components/CloudPillowFactory';
import { DreamJournal } from './components/DreamJournal';
import { DreamGuestbook } from './components/DreamGuestbook';
import { RainySoundMachine } from './components/RainySoundMachine';
import { DreamForecastStation } from './components/DreamForecastStation';
import { EasterEggCloud } from './components/EasterEggCloud';
import { MallowChat } from './components/MallowChat';
import { VisitorGreetingModal } from './components/VisitorGreetingModal';
import { Footer } from './components/Footer';
import { RainPreset } from './types';

export function MallowSkyApp() {
  const [isRaining, setIsRaining] = useState(false);
  const [rainPreset, setRainPreset] = useState<RainPreset>('gentle');

  const handleOpenSoundMachine = () => {
    const el = document.getElementById('sound-machine');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen text-slate-800 dark:text-slate-100 flex flex-col selection:bg-purple-200 selection:text-purple-900">
      {/* Living Sky Background with Parallax Clouds, Stars, Sun/Sunset/Moon, and Rain overlay */}
      <SkyBackdrop isRaining={isRaining} rainPreset={rainPreset} />

      {/* Floating Top Navigation with Sound Toggle, Theme Cycle, and Links */}
      <Navbar isRaining={isRaining} onOpenSoundMachine={handleOpenSoundMachine} />

      {/* Main Sky Playground Sections */}
      <main className="flex-1 w-full">
        <Hero />
        <StorySection />
        <CloudPillowFactory />
        <DreamJournal />
        <DreamGuestbook />
        <RainySoundMachine
          isRaining={isRaining}
          setIsRaining={setIsRaining}
          preset={rainPreset}
          setPreset={setRainPreset}
        />
        <DreamForecastStation />
        <EasterEggCloud />
      </main>

      {/* Floating Character Conversation Assistant */}
      <MallowChat />

      {/* First Visit Welcoming Modal */}
      <VisitorGreetingModal />

      {/* Cozy Sky Sanctuary Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <VisitorProvider>
        <MallowSkyApp />
      </VisitorProvider>
    </ThemeProvider>
  );
}
