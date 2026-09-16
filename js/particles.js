/**
 * IRON BARRICADE - Particle System (Optimized + Object Pool)
 */

const PARTICLE_CONFIGS = {
  spark:     { life: 0.35, speed: 2.8, color: '#ffaa44', size: 2.5, gravity: 0.1 },
  smoke:     { life: 0.6,  speed: 1.0, color: '#667788', size: 6,   gravity: -0.04 },
  explosion: { life: 0.45, speed: 3.5, color: '#ff4422', size: 5,   gravity: 0.04 },
  electric:  { life: 0.25, speed: 4.5, color: '#aa66ff', size: 2,   gravity: 0 },
  freeze:    { life: 0.4,  speed: 1.8, color: '#88ddff', size: 3.5, gravity: 0.02 },
  energy:    { life: 0.55, speed: 2.2, color: '#00e5ff', size: 3.5, gravity: -0.07 },
  impact:    { life: 0.2,  speed: 1.8, color: '#ffffff', size: 2.5, gravity: 0 },
  dust:      { life: 0.45, speed: 1.3, color: '#aa9966', size: 4,   gravity: 0.07 },
  fire:      { life: 0.4,  speed: 2.2, color: '#ff6622', size: 4,   gravity: -0.08 },
  scrap:     { life: 0.7,  speed: 2.5, color: '#888899', size: 3.5, gravity: 0.12 }
};

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.pool = [];
    this.enabled = true;
    this.maxParticles = 220;
    this._dt60 = 0;
  }

  setEnabled(val) {
    this.enabled = val;
    if (!val) {
      // return all to pool
      for (let i = 0; i < this.particles.length; i++) {
        this.pool.push(this.particles[i]);
      }
      this.particles.length = 0;
    }
  }

  setQuality(quality) {
    this.maxParticles = quality === 'low' ? 60 : quality === 'medium' ? 120 : 220;
  }

  _acquire() {
    return this.pool.length > 0 ? this.pool.pop() : {
      x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0,
      color: '#fff', size: 2, gravity: 0, active: false
    };
  }

  _release(p) {
    p.active = false;
    this.pool.push(p);
  }

  emit(x, y, type, count = 6) {
    if (!this.enabled) return;
    // Reduce count if near cap
    const room = this.maxParticles - this.particles.length;
    if (room <= 0) return;
    count = Math.min(count, room, 12);

    const cfg = PARTICLE_CONFIGS[type] || PARTICLE_CONFIGS.spark;
    for (let i = 0; i < count; i++) {
      const p = this._acquire();
      const angle = Math.random() * 6.28318530718; // 2*PI
      const spd = cfg.speed * (0.5 + Math.random());
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * spd;
      p.vy = Math.sin(angle) * spd;
      p.life = cfg.life * (0.7 + Math.random() * 0.5);
      p.maxLife = cfg.life;
      p.color = cfg.color;
      p.size = cfg.size * (0.6 + Math.random() * 0.7);
      p.gravity = cfg.gravity;
      p.active = true;
      this.particles.push(p);
    }
  }

  update(dt) {
    const n = this.particles.length;
    if (n === 0) return;
    const dt60 = dt * 60;
    let write = 0;
    for (let i = 0; i < n; i++) {
      const p = this.particles[i];
      p.x += p.vx * dt60;
      p.y += p.vy * dt60;
      p.vy += p.gravity * dt60;
      p.life -= dt;
      if (p.life > 0) {
        this.particles[write++] = p;
      } else {
        this._release(p);
      }
    }
    this.particles.length = write;
  }

  draw(ctx) {
    const n = this.particles.length;
    if (n === 0) return;
    // Batch by avoiding state changes where possible
    for (let i = 0; i < n; i++) {
      const p = this.particles[i];
      const alpha = p.life / p.maxLife;
      if (alpha <= 0.02) continue;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      const r = p.size * alpha;
      // Use fillRect for tiny particles (faster than arc on many GPUs)
      if (r < 2.5) {
        ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, 6.28318530718);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  clear() {
    for (let i = 0; i < this.particles.length; i++) {
      this._release(this.particles[i]);
    }
    this.particles.length = 0;
  }
}

const Particles = new ParticleSystem();
