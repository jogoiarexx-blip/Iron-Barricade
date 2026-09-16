/**
 * IRON BARRICADE - Audio Manager
 * Uses Web Audio API with silent fallbacks
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.buffers = {};
    this.musicSource = null;
    this.currentMusic = null;
    this.enabled = true;
    this.initialized = false;
  }

  async init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.applySettings();
      this.initialized = true;
    } catch (e) {
      console.warn('Audio init failed', e);
      this.enabled = false;
    }
  }

  applySettings() {
    if (!this.initialized) return;
    const s = Save.data.settings;
    this.masterGain.gain.value = s.masterVolume;
    this.musicGain.gain.value = s.musicVolume;
    this.sfxGain.gain.value = s.sfxVolume;
  }

  async loadSound(name, url) {
    if (!this.initialized) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('not found');
      const arrayBuf = await res.arrayBuffer();
      this.buffers[name] = await this.ctx.decodeAudioData(arrayBuf);
    } catch (e) {
      // Silent fallback - no error
      this.buffers[name] = null;
    }
  }

  playSfx(name, volume = 1, pitch = 1) {
    if (!this.enabled || !this.initialized) return;
    const buf = this.buffers[name];
    if (!buf) {
      // Procedural fallback beeps for key sounds
      this.playProcedural(name, volume);
      return;
    }
    try {
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = pitch;
      const gain = this.ctx.createGain();
      gain.gain.value = volume;
      src.connect(gain);
      gain.connect(this.sfxGain);
      src.start(0);
    } catch (e) {}
  }

  playProcedural(name, volume = 1) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.sfxGain);
      
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.15 * volume, now);
      
      switch (name) {
        case 'shoot':
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now); osc.stop(now + 0.13);
          break;
        case 'explosion':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(100, now);
          osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now); osc.stop(now + 0.4);
          break;
        case 'place':
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.setValueAtTime(500, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now); osc.stop(now + 0.16);
          break;
        case 'hit':
          osc.type = 'square';
          osc.frequency.setValueAtTime(200, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now); osc.stop(now + 0.09);
          break;
        case 'death':
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now); osc.stop(now + 0.32);
          break;
        case 'energy':
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.setValueAtTime(900, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now); osc.stop(now + 0.22);
          break;
        case 'click':
          osc.frequency.setValueAtTime(800, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now); osc.stop(now + 0.06);
          break;
        case 'alert':
          osc.type = 'square';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(330, now + 0.15);
          osc.frequency.setValueAtTime(440, now + 0.3);
          gain.gain.setValueAtTime(0.12 * volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.start(now); osc.stop(now + 0.55);
          break;
        case 'victory':
          [523, 659, 784, 1047].forEach((f, i) => {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.connect(g); g.connect(this.sfxGain);
            o.frequency.value = f;
            g.gain.setValueAtTime(0.1, now + i * 0.12);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);
            o.start(now + i * 0.12); o.stop(now + i * 0.12 + 0.35);
          });
          break;
        case 'defeat':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.6);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          osc.start(now); osc.stop(now + 0.75);
          break;
        case 'freeze':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(900, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now); osc.stop(now + 0.32);
          break;
        case 'tesla':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.setValueAtTime(800, now + 0.05);
          osc.frequency.setValueAtTime(100, now + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now); osc.stop(now + 0.28);
          break;
        case 'boss_roar':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(80, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
          gain.gain.setValueAtTime(0.2 * volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          osc.start(now); osc.stop(now + 0.75);
          break;
        default:
          osc.frequency.setValueAtTime(440, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now); osc.stop(now + 0.11);
      }
    } catch (e) {}
  }

  playMusic(name) {
    if (!this.enabled || !this.initialized || !this.ctx) return;
    this.stopMusic();
    this.currentMusic = name;
    try {
      // Simple procedural drone ambient (no external files needed)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.value = name && name.includes('boss') ? 55 : 65;
      osc2.frequency.value = name && name.includes('boss') ? 82.5 : 97.5;
      g.gain.value = 0.03;
      osc1.connect(g);
      osc2.connect(g);
      g.connect(this.musicGain);
      osc1.start();
      osc2.start();
      this.musicSource = { stop() { try { osc1.stop(); osc2.stop(); } catch(e) {} } };
    } catch (e) {}
  }

  stopMusic() {
    if (this.musicSource) {
      try { this.musicSource.stop(); } catch (e) {}
      this.musicSource = null;
    }
    this.currentMusic = null;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
}

const Audio = new AudioManager();
