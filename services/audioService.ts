
import { FieldState } from "../types";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillator: OscillatorNode | null = null;
  private noise: AudioWorkletNode | ScriptProcessorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private panner: StereoPannerNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private initialized = false;

  public init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.ctx.destination);

    // Main carrier resonance
    this.oscillator = this.ctx.createOscillator();
    this.oscillator.type = 'sine';
    
    // Filter for energy profiling
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    
    // Panning for spin
    this.panner = this.ctx.createStereoPanner();

    // Noise generation for fluctuation entropy
    const bufferSize = 4096;
    const noiseNode = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    noiseNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    };
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.05;

    // LFO for modulation
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfoGain = this.ctx.createGain();
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.oscillator.frequency);

    // Connections
    this.oscillator.connect(this.filter);
    noiseNode.connect(noiseGain);
    noiseGain.connect(this.filter);
    this.filter.connect(this.panner);
    this.panner.connect(this.masterGain);

    this.oscillator.start();
    this.lfo.start();
    this.initialized = true;
  }

  public update(state: FieldState, isMuted: boolean) {
    if (!this.initialized || !this.ctx || !this.masterGain || !this.oscillator || !this.filter || !this.panner || !this.lfo || !this.lfoGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const transition = 0.1;

    // Master volume mapped to intensity
    const targetGain = isMuted ? 0 : (state.intensity / 100) * 0.15;
    this.masterGain.gain.setTargetAtTime(targetGain, now, transition);

    // Frequency mapped to resonance frequency
    // Range 40Hz to 440Hz base
    const baseFreq = 40 + (state.frequency * 20);
    this.oscillator.frequency.setTargetAtTime(baseFreq, now, transition);

    // Fluctuation affects LFO rate and noise mix
    const lfoRate = (state.fluctuation / 100) * 10;
    this.lfo.frequency.setTargetAtTime(lfoRate, now, transition);
    this.lfoGain.gain.setTargetAtTime(state.fluctuation * 0.5, now, transition);

    // Energy level maps to filter cutoff (higher energy = brighter/sharper)
    const cutoff = 200 + (state.energyLevel * 20);
    this.filter.frequency.setTargetAtTime(cutoff, now, transition);
    this.filter.Q.setTargetAtTime(state.entanglement / 10, now, transition);

    // Spin maps to panning
    const pan = Math.sin(now * (state.particleSpin / 2));
    this.panner.pan.setTargetAtTime(pan, now, transition);
  }

  public resume() {
    this.ctx?.resume();
  }
}

export const audioEngine = new AudioEngine();
