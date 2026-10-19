import { RainPreset } from '../types';

class RainAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private secondaryFilter: BiquadFilterNode | null = null;
  private dropIntervalId: number | null = null;
  private isRunning: boolean = false;
  private volume: number = 0.5;
  private currentPreset: RainPreset = 'gentle';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate 5 seconds of procedural pink/brown noise loop
  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filtering
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  // Occasional gentle drop pings
  private triggerDropPing() {
    if (!this.ctx || !this.isRunning || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();

      // Pitch sweep down quickly to simulate droplet "plink"
      const freq = 600 + Math.random() * 800;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.06);

      dropGain.gain.setValueAtTime(0, now);
      dropGain.gain.linearRampToValueAtTime(0.04 * this.volume, now + 0.005);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(dropGain);
      dropGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore if context closed
    }
  }

  public start(preset: RainPreset = 'gentle', vol: number = 0.5) {
    this.initContext();
    if (!this.ctx) return;

    this.stop(); // Stop any active nodes first

    this.volume = vol;
    this.currentPreset = preset;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.volume), this.ctx.currentTime + 0.8);
    this.masterGain.connect(this.ctx.destination);

    // Primary Lowpass Filter
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';

    // Secondary Highpass Filter for texture
    this.secondaryFilter = this.ctx.createBiquadFilter();
    this.secondaryFilter.type = 'highpass';

    this.applyPresetConfig(preset);

    // Continuous Noise Source
    const buffer = this.createNoiseBuffer();
    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;

    this.noiseNode.connect(this.secondaryFilter);
    this.secondaryFilter.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);

    this.noiseNode.start();
    this.isRunning = true;

    // Set interval for random water drop pings
    const intervalMs = preset === 'window' ? 350 : preset === 'downpour' ? 180 : 700;
    this.dropIntervalId = window.setInterval(() => {
      if (Math.random() > 0.3) {
        this.triggerDropPing();
      }
    }, intervalMs);
  }

  private applyPresetConfig(preset: RainPreset) {
    if (!this.filterNode || !this.secondaryFilter || !this.ctx) return;
    const now = this.ctx.currentTime;

    switch (preset) {
      case 'mist':
        this.filterNode.frequency.setTargetAtTime(1400, now, 0.2);
        this.filterNode.Q.setTargetAtTime(0.7, now, 0.2);
        this.secondaryFilter.frequency.setTargetAtTime(300, now, 0.2);
        break;
      case 'gentle':
        this.filterNode.frequency.setTargetAtTime(2200, now, 0.2);
        this.filterNode.Q.setTargetAtTime(1.0, now, 0.2);
        this.secondaryFilter.frequency.setTargetAtTime(180, now, 0.2);
        break;
      case 'window':
        this.filterNode.frequency.setTargetAtTime(3000, now, 0.2);
        this.filterNode.Q.setTargetAtTime(1.5, now, 0.2);
        this.secondaryFilter.frequency.setTargetAtTime(400, now, 0.2);
        break;
      case 'downpour':
        this.filterNode.frequency.setTargetAtTime(5500, now, 0.2);
        this.filterNode.Q.setTargetAtTime(0.8, now, 0.2);
        this.secondaryFilter.frequency.setTargetAtTime(80, now, 0.2);
        break;
    }
  }

  public setPreset(preset: RainPreset) {
    this.currentPreset = preset;
    if (this.isRunning) {
      this.applyPresetConfig(preset);
      if (this.dropIntervalId) {
        clearInterval(this.dropIntervalId);
        const intervalMs = preset === 'window' ? 350 : preset === 'downpour' ? 180 : 700;
        this.dropIntervalId = window.setInterval(() => {
          if (Math.random() > 0.3) {
            this.triggerDropPing();
          }
        }, intervalMs);
      }
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && this.isRunning) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    if (this.dropIntervalId) {
      clearInterval(this.dropIntervalId);
      this.dropIntervalId = null;
    }

    if (this.noiseNode && this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setTargetAtTime(0.0001, now, 0.1);
        setTimeout(() => {
          try {
            this.noiseNode?.stop();
            this.noiseNode?.disconnect();
            this.filterNode?.disconnect();
            this.secondaryFilter?.disconnect();
            this.masterGain?.disconnect();
          } catch {
            // Already disconnected
          }
          this.noiseNode = null;
        }, 150);
      } catch {
        // Clean up
      }
    }
    this.isRunning = false;
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }
}

export const rainAudio = new RainAudioEngine();
