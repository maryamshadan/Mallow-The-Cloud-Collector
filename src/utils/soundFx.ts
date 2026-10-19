/**
 * Procedural Sound Effects Engine using the Web Audio API
 * Generates soft, calming, music-box and sky-themed sounds.
 * Zero external audio files required. Safe for all browsers.
 */

class SoundFxEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    const saved = localStorage.getItem('mallow-sound-muted');
    // Default to unmuted or saved setting
    this.muted = saved === 'true';
  }

  private init() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(val: boolean) {
    this.muted = val;
    localStorage.setItem('mallow-sound-muted', String(val));
    this.listeners.forEach((cb) => cb(this.muted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    if (!this.muted) {
      this.playChime();
    }
    return this.muted;
  }

  public subscribe(cb: (muted: boolean) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  /**
   * Delicate glassy chime for button clicks & small interactions
   */
  public playChime(freq: number = 587.33) {
    // D5
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Soft, airy "puff" for clouds and pillow fluffing
   */
  public playPuff() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Filtered noise buffer
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Warm gentle kalimba / music box pluck for item selection
   */
  public playPluck(noteOffset: number = 0) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const baseFreq = 440 * Math.pow(2, noteOffset / 12); // e.g. A4
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Tiny bell sparkle for discoveries & reveals
   */
  public playSparkle() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [784, 988, 1175, 1568]; // G5, B5, D6, G6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.045, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Soft twinkle for stars and weather changes
   */
  public playTwinkle() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [659.25, 880, 1046.5]; // E5, A5, C6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.04, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Harmonious celebration flourish for crafted pillows or forecast reveal
   */
  public playFlourish() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Dreamy pentatonic chord: C5, E5, G5, A5, C6
      const chord = [523.25, 659.25, 783.99, 880.0, 1046.5];

      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.05, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.75);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Special heartwarming music box melody for the 7th-click Easter egg!
   */
  public playEasterEggMagic() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Gentle nursery lullaby phrase
      const melody = [
        { f: 523.25, t: 0 }, // C5
        { f: 659.25, t: 0.16 }, // E5
        { f: 783.99, t: 0.32 }, // G5
        { f: 1046.5, t: 0.48 }, // C6
        { f: 880.0, t: 0.68 }, // A5
        { f: 1046.5, t: 0.9 }, // C6
        { f: 1174.66, t: 1.15 }, // D6
      ];

      melody.forEach(({ f, t }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + t;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.065, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Play bespoke dream animations sound for each specific forecast
   */
  public playDreamSound(dreamId: string) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (dreamId === 'df-1') {
        // Stardust Shower: cascading golden bell sparkles
        const notes = [1046.5, 1318.5, 1567.98, 2093.0, 1567.98, 2093.0];
        notes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const st = now + idx * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, st);
          gain.gain.setValueAtTime(0, st);
          gain.gain.linearRampToValueAtTime(0.045, st + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(st);
          osc.stop(st + 0.36);
        });
      } else if (dreamId === 'df-2') {
        // Flying Feather Highway: gentle soaring breeze + soft glide chord
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const st = now + idx * 0.1;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, st);
          gain.gain.setValueAtTime(0, st);
          gain.gain.linearRampToValueAtTime(0.05, st + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(st);
          osc.stop(st + 0.65);
        });
      } else if (dreamId === 'df-3') {
        // Giggle Cloud Front: bouncy chuckles & happy bell arpeggio
        const notes = [587.33, 739.99, 880, 1174.66, 880, 1174.66];
        notes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const st = now + idx * 0.07;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, st);
          gain.gain.setValueAtTime(0, st);
          gain.gain.linearRampToValueAtTime(0.05, st + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(st);
          osc.stop(st + 0.28);
        });
      } else if (dreamId === 'df-4') {
        // Midnight Attic Rain: waterdrop chime cascade with warm low hum
        const drops = [800, 1200, 950, 1400, 1050];
        drops.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const st = now + idx * 0.12;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, st);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.6, st + 0.08);
          gain.gain.setValueAtTime(0, st);
          gain.gain.linearRampToValueAtTime(0.045, st + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.16);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(st);
          osc.stop(st + 0.18);
        });
      } else {
        // Secret Starlit Tea Room: cozy lullaby music box chords
        const notes = [659.25, 783.99, 987.77, 1318.5];
        notes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const st = now + idx * 0.09;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, st);
          gain.gain.setValueAtTime(0, st);
          gain.gain.linearRampToValueAtTime(0.055, st + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.5);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(st);
          osc.stop(st + 0.55);
        });
      }
    } catch {
      // AudioContext unavailable
    }
  }
}

export const soundFx = new SoundFxEngine();
