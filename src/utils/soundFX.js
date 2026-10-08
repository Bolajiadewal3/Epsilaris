class SoundFXManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  /** Creates or resumes the browser audio context when the browser permits it. @returns {void} */
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /** Generates the short synthesized click used by interactive controls. @returns {void} */
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      400,
      this.ctx.currentTime + 0.03,
    );

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  /** Generates filtered noise for the site's frame-transition sound. @returns {void} */
  playSwoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const duration = 0.35;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    /** Fill a buffer with noise before shaping it with the filter and envelope. */
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(150, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      1400,
      this.ctx.currentTime + duration * 0.5,
    );
    filter.frequency.exponentialRampToValueAtTime(
      150,
      this.ctx.currentTime + duration,
    );
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(
      0.18,
      this.ctx.currentTime + duration * 0.4,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.ctx.currentTime + duration,
    );

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    whiteNoise.stop(this.ctx.currentTime + duration);
  }
}

export const soundFX = new SoundFXManager();
