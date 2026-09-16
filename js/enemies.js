/**
 * IRON BARRICADE - Enemy Entities
 * Special abilities + Boss multi-phase system
 */

let enemyIdCounter = 0;

// Ritmo-base de deslocamento dos inimigos.
// Mantém a diferença entre tipos (Runner continua rápido, Brute continua lento),
// mas dá ao jogador mais tempo para reagir e montar a defesa.
const ENEMY_MOVE_SCALE = 0.72;


const ENEMY_VISUAL_TUNING = {
  riftbornScout: { hitboxScale: 0.90, spriteScale: 1.10, offsetY: 0.10 },
  riftbornRunner: { hitboxScale: 0.78, spriteScale: 1.12, offsetY: 0.08 },
  riftbornBrute: { hitboxScale: 0.94, spriteScale: 1.20, offsetY: 0.13 },
  riftbornShield: { hitboxScale: 0.92, spriteScale: 1.16, offsetY: 0.12 },
  riftbornFlyer: { hitboxScale: 0.74, spriteScale: 1.18, offsetY: -0.18 },
  riftbornBurrower: { hitboxScale: 0.88, spriteScale: 1.02, offsetY: 0.10 },
  riftbornTechnician: { hitboxScale: 0.86, spriteScale: 1.10, offsetY: 0.10 },
  riftbornLeaper: { hitboxScale: 0.88, spriteScale: 1.10, offsetY: 0.10 },
  riftbornSplitter: { hitboxScale: 0.90, spriteScale: 1.12, offsetY: 0.11 },
  riftbornCommander: { hitboxScale: 0.94, spriteScale: 1.18, offsetY: 0.12 },
  riftbornSpitter: { hitboxScale: 0.86, spriteScale: 1.08, offsetY: 0.09 },
  riftbornHeavy: { hitboxScale: 0.98, spriteScale: 1.24, offsetY: 0.14 },
  riftbornSwarm: { hitboxScale: 0.72, spriteScale: 1.00, offsetY: 0.06 },
  riftbornStealth: { hitboxScale: 0.86, spriteScale: 1.08, offsetY: 0.10 },
  riftbornBomber: { hitboxScale: 0.90, spriteScale: 1.12, offsetY: 0.11 },
  riftbornHealer: { hitboxScale: 0.86, spriteScale: 1.08, offsetY: 0.09 },
  riftbornTank: { hitboxScale: 1.02, spriteScale: 1.26, offsetY: 0.16 },
  riftbornSniper: { hitboxScale: 0.84, spriteScale: 1.08, offsetY: 0.08 },
  riftbornElite: { hitboxScale: 0.92, spriteScale: 1.16, offsetY: 0.11 },
  riftbornInfector: { hitboxScale: 0.86, spriteScale: 1.08, offsetY: 0.10 },
  ironcladColossus: { hitboxScale: 0.88, spriteScale: 1.18, offsetY: 0.22 },
  shadeStalkerPrime: { hitboxScale: 0.76, spriteScale: 1.16, offsetY: 0.14 },
  duneDevourer: { hitboxScale: 0.95, spriteScale: 1.12, offsetY: 0.18 },
  corebreaker: { hitboxScale: 0.84, spriteScale: 1.18, offsetY: 0.14 },
  riftbornOverlord: { hitboxScale: 0.86, spriteScale: 1.20, offsetY: 0.20 }
};

class Enemy {
  constructor(data, row, grid, hpMult = 1) {
    this.id = ++enemyIdCounter;
    this.data = data;
    this.row = row;
    this.hp = data.hp * hpMult;
    this.maxHp = this.hp;
    this.speed = data.speed;
    this.baseSpeed = data.speed;
    this.damage = data.damage;
    this.attackRate = data.attackRate || 1000;
    this.attackCooldown = 0;
    this.armor = data.armor || 0;
    this.baseArmor = this.armor;
    this.x = grid.getSpawnX();
    this.y = grid.getLaneY(row);
    this.baseSize = data.size || 1;
    this.visualTuning = ENEMY_VISUAL_TUNING[data.id] || {};
    this.radius = this.baseSize * (this.visualTuning.hitboxScale || 1) * grid.cellSize * 0.28;
    this.drawSize = this.baseSize * grid.cellSize * 0.56 * (this.visualTuning.spriteScale || 1);
    this.drawOffsetY = grid.cellSize * (this.visualTuning.offsetY ?? (data.type === 'air' ? -0.12 : 0.08));
    this.alive = true;
    this.status = {};
    this.shieldHp = data.shieldHp || 0;
    this.maxShieldHp = this.shieldHp;
    this.stealthed = false;
    this.stealthTimer = data.stealth ? (data.stealthInterval || 3000) : 0;
    this.targetDefender = null;
    this.reachedBase = false;
    this.hasLeaped = false;
    this.abilityTimer = 1500 + Math.random() * 1500;
    this.healTimer = 0;
    this.buffTimer = 0;
    this.isBoss = data.type === 'boss';
    this.phaseIndex = 0;
    this.phaseAnnounced = -1;
    this.rage = false;
    this.burrowed = false;
    this.burrowTimer = 0;
    this.spawnedByBoss = false;
    this.animTime = Math.random() * 10;
    this.spawnTimer = 0.38;
    this.hitFlash = 0;
  }

  applyStatus(effect) {
    if (!effect || !effect.type) return;
    // Bosses resist stun/freeze partially
    if (this.isBoss && (effect.type === 'stunned' || effect.type === 'frozen')) {
      effect = { ...effect, duration: (effect.duration || 1000) * 0.4 };
    }
    this.status[effect.type] = {
      ...effect,
      remaining: effect.duration || 1000
    };
  }

  updateStatus(dt) {
    let speedMod = 1;
    for (const key of Object.keys(this.status)) {
      const s = this.status[key];
      s.remaining -= dt * 1000;
      if (s.remaining <= 0) {
        delete this.status[key];
        continue;
      }
      if (key === 'frozen') speedMod *= (s.slowFactor || 0.3);
      if (key === 'oiled' || key === 'slowed') speedMod *= (s.slowFactor || 0.5);
      if (key === 'stunned') speedMod = 0;
      if (key === 'burning') this.hp -= (s.damage || 5) * dt;
      if (key === 'electrified') this.hp -= (s.damage || 3) * dt;
      if (key === 'infected') this.hp -= (s.damage || 4) * dt; // for defenders handled elsewhere
    }
    this.speed = this.baseSpeed * speedMod * (this.rage ? 1.35 : 1);

    // Stealth toggle (regular units)
    if (this.data.stealth && !this.isBoss) {
      this.stealthTimer -= dt * 1000;
      if (this.stealthTimer <= 0) {
        this.stealthed = !this.stealthed;
        this.stealthTimer = this.stealthed
          ? (this.data.stealthDuration || 2000)
          : (this.data.stealthInterval || 4000);
        if (this.stealthed) Particles.emit(this.x, this.y, 'smoke', 4);
      }
    }
  }

  /** Current boss phase based on HP */
  getCurrentPhase() {
    if (!this.isBoss || !this.data.phases) return null;
    const pct = this.hp / this.maxHp;
    let phase = this.data.phases[0];
    let idx = 0;
    for (let i = 0; i < this.data.phases.length; i++) {
      if (pct <= this.data.phases[i].hpPercent + 0.001) {
        phase = this.data.phases[i];
        idx = i;
      }
    }
    // Find highest threshold we're still under
    for (let i = this.data.phases.length - 1; i >= 0; i--) {
      if (pct <= this.data.phases[i].hpPercent) {
        // we're in this phase if below previous threshold or first
        if (i === 0 || pct <= this.data.phases[i].hpPercent) {
          // better: phase i is active when hp% is between phase[i].hpPercent and phase[i+1]
        }
      }
    }
    // Simpler: highest index where pct <= phase.hpPercent for all, pick last matching
    idx = 0;
    for (let i = 0; i < this.data.phases.length; i++) {
      if (pct <= this.data.phases[i].hpPercent) idx = i;
    }
    // Actually phases are defined as thresholds: at 1.0 start, at 0.7 enter phase 2, etc.
    // Enter phase i when hp drops BELOW phases[i].hpPercent (except first)
    idx = 0;
    for (let i = 1; i < this.data.phases.length; i++) {
      if (pct <= this.data.phases[i].hpPercent) idx = i;
    }
    this.phaseIndex = idx;
    return this.data.phases[idx];
  }

  update(dt, grid, defenders, game) {
    if (!this.alive) return;
    this.animTime += dt;
    if (this.spawnTimer > 0) this.spawnTimer = Math.max(0, this.spawnTimer - dt);
    if (this.hitFlash > 0) this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.updateStatus(dt);
    if (this.hp <= 0) {
      this.die(game);
      return;
    }

    // Boss phase management
    if (this.isBoss) {
      this.updateBoss(dt, grid, game);
    }

    // Special unit passive abilities
    this.updateSpecials(dt, grid, game);

    if (this.burrowed) {
      this.burrowTimer -= dt * 1000;
      if (this.burrowTimer <= 0) {
        this.burrowed = false;
        this.stealthed = false;
        Particles.emit(this.x, this.y, 'dust', 12);
        Audio.playSfx('explosion', 0.3);
      }
      return; // invulnerable / not interacting while burrowed
    }

    this.attackCooldown -= dt * 1000;

    // Air units ignore ground blockers
    const isAir = this.data.type === 'air';
    let blocking = null;

    if (!isAir) {
      const rowDefs = defenders || grid.getDefendersInRow(this.row);
      let bestX = -Infinity;
      const reach = this.radius + grid.cellSize * 0.35;
      for (let i = 0; i < rowDefs.length; i++) {
        const d = rowDefs[i];
        if (!d.alive || d.x >= this.x) continue;
        if (this.x - d.x < reach && d.x > bestX) {
          bestX = d.x;
          blocking = d;
        }
      }
    }

    // Ranged attackers stop at range
    if (this.data.type === 'ranged' && this.data.attackRange) {
      const rangePx = this.data.attackRange * grid.cellSize;
      const rowDefs = grid.getDefendersInRow(this.row);
      let target = null;
      let bestDist = rangePx;
      for (let i = 0; i < rowDefs.length; i++) {
        const d = rowDefs[i];
        if (!d.alive || d.x >= this.x) continue;
        const dist = this.x - d.x;
        if (dist < bestDist) {
          bestDist = dist;
          target = d;
        }
      }
      if (target) {
        if (this.attackCooldown <= 0) {
          target.takeDamage(this.damage);
          Particles.emit(target.x, target.y, 'impact', 4);
          Audio.playSfx('shoot', 0.3);
          this.attackCooldown = this.attackRate;
        }
        return; // hold position while shooting
      }
    }

    if (blocking) {
      if (this.attackCooldown <= 0) {
        this.meleeAttack(blocking, grid, game);
        this.attackCooldown = this.attackRate;
      }
      // Leaper jumps over first wall once
      if (this.data.leap && !this.hasLeaped) {
        this.x = blocking.x - grid.cellSize * 0.7;
        this.hasLeaped = true;
        Particles.emit(this.x, this.y, 'dust', 6);
        Audio.playSfx('place', 0.4);
      }
    } else {
      this.x -= this.speed * grid.cellSize * dt * ENEMY_MOVE_SCALE;
    }

    if (this.x < grid.getBaseX()) {
      this.reachedBase = true;
      this.alive = false;
      game.onEnemyReachedBase(this);
    }
  }

  meleeAttack(target, grid, game) {
    target.takeDamage(this.damage * (this.rage ? 1.4 : 1));
    Audio.playSfx('hit', 0.3);
    Particles.emit(target.x, target.y, 'impact', 3);

    // Technician — disable nearby machines
    if (this.data.disableRange) {
      const rangeSq = (this.data.disableRange * grid.cellSize) ** 2;
      const all = grid.getDefenders();
      for (let i = 0; i < all.length; i++) {
        const d = all[i];
        if (!d.alive) continue;
        const dx = d.x - this.x, dy = d.y - this.y;
        if (dx * dx + dy * dy < rangeSq) {
          d.applyDisable(this.data.disableDuration || 2500);
          Particles.emit(d.x, d.y, 'electric', 5);
        }
      }
      Audio.playSfx('alert', 0.25);
    }

    // Infector — DoT on machine
    if (this.data.infect) {
      target.applyStatus?.({ type: 'infected', duration: 4000, damage: 6 });
      // Fallback: direct periodic damage flag
      if (!target._infected) {
        target._infected = 4;
      }
    }
  }

  updateSpecials(dt, grid, game) {
    // Commander aura — buff nearby allies
    if (this.data.auraRange && this.data.auraBuff) {
      this.buffTimer -= dt * 1000;
      if (this.buffTimer <= 0) {
        this.buffTimer = 800;
        const rangeSq = (this.data.auraRange * grid.cellSize) ** 2;
        for (const e of game.enemies) {
          if (!e.alive || e === this) continue;
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx * dx + dy * dy < rangeSq) {
            e._auraBoost = 0.9; // refreshed
            e.speed = e.baseSpeed * (this.data.auraBuff.speed || 1.2);
          }
        }
      }
    }
    // Decay aura boost
    if (this._auraBoost !== undefined) {
      this._auraBoost -= dt;
      if (this._auraBoost <= 0) {
        this.speed = this.baseSpeed;
        delete this._auraBoost;
      }
    }

    // Healer
    if (this.data.healRange) {
      this.healTimer -= dt * 1000;
      if (this.healTimer <= 0) {
        this.healTimer = this.data.healInterval || 1200;
        const rangeSq = (this.data.healRange * grid.cellSize) ** 2;
        for (const e of game.enemies) {
          if (!e.alive || e === this) continue;
          const dx = e.x - this.x, dy = e.y - this.y;
          if (dx * dx + dy * dy < rangeSq) {
            e.hp = Math.min(e.maxHp, e.hp + (this.data.healAmount || 8));
            Particles.emit(e.x, e.y - 10, 'energy', 2);
          }
        }
      }
    }
  }

  updateBoss(dt, grid, game) {
    const phase = this.getCurrentPhase();
    if (!phase) return;

    // Announce phase change once
    if (this.phaseIndex !== this.phaseAnnounced) {
      this.phaseAnnounced = this.phaseIndex;
      if (this.phaseIndex > 0) {
        Effects.showAlert(`FASE ${this.phaseIndex + 1} — ${this.data.name}`, 2200);
        Effects.screenShake(5);
        Effects.flash(this.data.color || '#ff0000', 0.25);
        Audio.playSfx('alert', 0.8);
      }
      // Apply phase-entry effects
      if (phase.abilities.includes('armorUp')) {
        this.armor = Math.min(0.55, this.baseArmor + 0.15);
      }
      if (phase.abilities.includes('rage') || phase.abilities.includes('rageMode') || phase.abilities.includes('frenzy')) {
        this.rage = true;
        this.baseSpeed *= 1.25;
      }
      if (phase.abilities.includes('finalForm')) {
        this.rage = true;
        this.armor = Math.min(0.5, this.baseArmor + 0.1);
        this.baseSpeed *= 1.15;
        Effects.showAlert('FORMA FINAL!', 2500);
      }
    }

    this.abilityTimer -= dt * 1000;
    if (this.abilityTimer > 0) return;
    this.abilityTimer = 3500 + Math.random() * 2000 - (this.rage ? 1000 : 0);

    const abilities = phase.abilities || [];
    const pick = abilities[Math.floor(Math.random() * abilities.length)];
    this.castBossAbility(pick, grid, game);
  }

  castBossAbility(name, grid, game) {
    switch (name) {
      case 'slam':
      case 'slash':
      case 'earthquake': {
        Effects.screenShake(name === 'earthquake' ? 10 : 6);
        Particles.emit(this.x, this.y, 'explosion', 14);
        Audio.playSfx('explosion', 0.6);
        const all = grid.getDefenders();
        const range = (name === 'earthquake' ? 4 : 2.2) * grid.cellSize;
        for (const d of all) {
          if (!d.alive) continue;
          if (Math.hypot(d.x - this.x, d.y - this.y) < range) {
            d.takeDamage(this.damage * (name === 'earthquake' ? 0.7 : 0.5));
          }
        }
        break;
      }
      case 'spawnScouts':
        this.spawnMinions(game, 'riftbornScout', 3);
        break;
      case 'spawnBrutes':
        this.spawnMinions(game, 'riftbornBrute', 1);
        break;
      case 'spawnBurrowers':
        this.spawnMinions(game, 'riftbornBurrower', 2);
        break;
      case 'summon':
        this.spawnMinions(game, 'riftbornScout', 2);
        this.spawnMinions(game, 'riftbornRunner', 2);
        break;
      case 'summonElite':
        this.spawnMinions(game, 'riftbornElite', 1);
        this.spawnMinions(game, 'riftbornShield', 1);
        break;
      case 'spawnAll':
        this.spawnMinions(game, 'riftbornSwarm', 4);
        this.spawnMinions(game, 'riftbornFlyer', 1);
        break;
      case 'stealth':
      case 'permanentStealth':
        this.stealthed = true;
        this.stealthTimer = name === 'permanentStealth' ? 99999 : 3500;
        Particles.emit(this.x, this.y, 'smoke', 10);
        break;
      case 'clone': {
        // Spawn a weaker copy
        const clone = new Enemy(this.data, (this.row + 1) % grid.rows, grid, 0.25);
        clone.x = this.x + 40;
        clone.hp = this.maxHp * 0.15;
        clone.maxHp = clone.hp;
        clone.spawnedByBoss = true;
        clone.isBoss = false; // don't recurse boss AI
        clone.data = { ...this.data, type: 'ground', phases: null };
        game.enemies.push(clone);
        Particles.emit(clone.x, clone.y, 'smoke', 8);
        break;
      }
      case 'burrow':
        this.burrowed = true;
        this.stealthed = true;
        this.burrowTimer = 2000;
        // Reappear further left
        this.x = Math.max(grid.offsetX + grid.cellSize * 2, this.x - grid.cellSize * 2.5);
        Particles.emit(this.x, this.y, 'dust', 15);
        Audio.playSfx('place', 0.5);
        break;
      case 'swallow': {
        const rowDefs = grid.getDefendersInRow(this.row);
        let closest = null, best = Infinity;
        for (const d of rowDefs) {
          if (!d.alive) continue;
          const dist = Math.abs(d.x - this.x);
          if (dist < best && dist < grid.cellSize * 3) {
            best = dist;
            closest = d;
          }
        }
        if (closest) {
          closest.takeDamage(closest.hp + 1); // destroy
          Particles.emit(closest.x, closest.y, 'explosion', 12);
          this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.03);
          Effects.showAlert('DEFESA ENGOLIDA!', 1500);
          Audio.playSfx('explosion', 0.7);
        }
        break;
      }
      case 'sandstorm':
        Effects.flash('#cc9944', 0.2);
        for (const d of grid.getDefenders()) {
          if (d.alive) d.applyDisable(1200);
        }
        break;
      case 'drain':
      case 'overload': {
        // Steal energy from player
        const steal = name === 'overload' ? 40 : 25;
        game.energy = Math.max(0, game.energy - steal);
        this.hp = Math.min(this.maxHp, this.hp + steal * 2);
        Particles.emit(this.x, this.y, 'electric', 12);
        Audio.playSfx('energy', 0.5);
        Effects.showAlert(`ENERGIA DRENADA (−${steal})`, 1500);
        break;
      }
      case 'shock':
      case 'emp': {
        Effects.flash('#44aaff', 0.3);
        Effects.screenShake(4);
        for (const d of grid.getDefenders()) {
          if (!d.alive) continue;
          d.applyDisable(name === 'emp' ? 3000 : 1500);
          d.takeDamage(name === 'emp' ? 30 : 15);
          Particles.emit(d.x, d.y, 'electric', 4);
        }
        Audio.playSfx('alert', 0.5);
        break;
      }
      case 'powerSurge':
        this.damage *= 1.15;
        Particles.emit(this.x, this.y, 'electric', 16);
        break;
      case 'beam':
      case 'multiBeam': {
        const rows = name === 'multiBeam'
          ? [0, 1, 2, 3, 4].slice(0, grid.rows)
          : [this.row];
        for (const r of rows) {
          for (const d of grid.getDefendersInRow(r)) {
            if (d.alive && d.x < this.x) {
              d.takeDamage(this.damage * 0.35);
              Particles.emit(d.x, d.y, 'fire', 3);
            }
          }
        }
        Audio.playSfx('shoot', 0.6);
        break;
      }
      case 'shield':
        this.shieldHp = Math.max(this.shieldHp, this.maxHp * 0.08);
        Particles.emit(this.x, this.y, 'energy', 10);
        break;
      case 'teleport':
        this.x = Math.max(grid.offsetX + grid.cellSize, this.x - grid.cellSize * 1.5);
        this.row = Math.floor(Math.random() * grid.rows);
        this.y = grid.getLaneY(this.row);
        Particles.emit(this.x, this.y, 'smoke', 12);
        Audio.playSfx('place', 0.5);
        break;
      case 'frenzy':
      case 'rage':
      case 'rageMode':
        this.rage = true;
        break;
      case 'finalForm':
        this.rage = true;
        this.spawnMinions(game, 'riftbornElite', 2);
        break;
      default:
        break;
    }
  }

  spawnMinions(game, type, count) {
    const data = getEnemyData(type);
    if (!data) return;
    for (let i = 0; i < count; i++) {
      const row = Math.floor(Math.random() * game.grid.rows);
      const e = new Enemy(data, row, game.grid, 0.85);
      e.x = this.x + 30 + Math.random() * 40;
      e.spawnedByBoss = true;
      game.enemies.push(e);
      Particles.emit(e.x, e.y, 'smoke', 4);
    }
    Audio.playSfx('place', 0.35);
  }

  takeDamage(amount, type = 'normal') {
    if (!this.alive || this.burrowed) return;
    if (this.stealthed && this.isBoss) {
      // attacking reveals briefly
      this.stealthed = false;
      this.stealthTimer = 2000;
    }
    if (this.shieldHp > 0) {
      this.shieldHp -= amount;
      if (this.shieldHp < 0) {
        amount = -this.shieldHp;
        this.shieldHp = 0;
      } else {
        Particles.emit(this.x, this.y, 'impact', 2);
        return;
      }
    }
    const finalDmg = amount * (1 - this.armor);
    this.hp -= finalDmg;
    this.hitFlash = 0.10;
    Particles.emit(this.x, this.y, type === 'electric' ? 'electric' : 'spark', 3);
  }

  die(game) {
    this.alive = false;
    game.onEnemyKilled(this);
    Particles.emit(this.x, this.y, 'explosion', this.isBoss ? 24 : 6);
    Audio.playSfx(this.isBoss ? 'explosion' : 'death', this.isBoss ? 0.9 : 0.4);
    if (this.isBoss) {
      Effects.screenShake(12);
      Effects.flash('#ffffff', 0.4);
      Effects.showAlert(`${this.data.name} DERROTADO!`, 2500);
    }

    // Splitter
    if (this.data.splitOnDeath && !this.spawnedByBoss) {
      for (let i = 0; i < (this.data.splitCount || 2); i++) {
        const childData = getEnemyData(this.data.splitInto || 'riftbornScout');
        if (childData) {
          const child = new Enemy(childData, this.row, game.grid, 0.55);
          child.x = this.x + (i - 0.5) * 24;
          child.y = this.y;
          game.enemies.push(child);
        }
      }
    }

    // Bomber
    if (this.data.explodeOnDeath) {
      Particles.emit(this.x, this.y, 'explosion', 15);
      Effects.screenShake(4);
      const r = (this.data.explodeRadius || 1.5) * game.grid.cellSize;
      for (const d of game.grid.getDefenders()) {
        if (d.alive && Math.hypot(d.x - this.x, d.y - this.y) < r) {
          d.takeDamage(this.data.explodeDamage || 50);
        }
      }
    }
  }

  draw(ctx) {
    if (!this.alive) return;
    if (this.burrowed) {
      // only dust ring
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = '#886633';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius * 1.2, this.radius * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (this.stealthed) ctx.globalAlpha = this.isBoss ? 0.35 : 0.28;

    ctx.save();
    ctx.translate(this.x, this.y);
    const s = this.drawSize || (this.radius * 2);
    const bob = Math.sin(this.animTime * 6) * 2;
    if (this.spawnTimer > 0) {
      const p = 1 - this.spawnTimer / 0.38;
      const scale = 0.35 + Math.min(1, p * 1.15) * 0.65;
      ctx.scale(scale, scale);
      ctx.globalAlpha *= Math.min(1, p * 2.5);
    }
    if (this.hitFlash > 0) {
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = this.isBoss ? 24 : 14;
    }

    if (typeof Assets !== 'undefined' && Assets.has(this.data.id)) {
      Assets.draw(ctx, this.data.id, 0, bob + this.drawOffsetY, s, { name: 'walk', time: this.animTime });
    } else {
      // Improved procedural body
      ctx.fillStyle = this.data.color || '#66aa44';
      ctx.strokeStyle = this.rage ? '#ff2200' : '#111';
      ctx.lineWidth = this.isBoss ? 3 : 2;
      ctx.beginPath();
      if (this.data.type === 'air') {
        ctx.moveTo(0, -s / 2 + bob);
        ctx.lineTo(s / 2, bob);
        ctx.lineTo(0, s / 2 + bob);
        ctx.lineTo(-s / 2, bob);
        ctx.closePath();
      } else if (this.isBoss) {
        ctx.roundRect(-s / 2, -s / 2 + bob, s, s, 12);
      } else {
        ctx.ellipse(0, bob, s / 2, s / 2 * 0.85, 0, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();

      // Eyes
      ctx.fillStyle = this.rage ? '#ff4400' : '#fff';
      const eyeY = bob - s * 0.1;
      ctx.beginPath();
      ctx.arc(-s * 0.15, eyeY, s * 0.08, 0, Math.PI * 2);
      ctx.arc(s * 0.15, eyeY, s * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(-s * 0.15, eyeY, s * 0.04, 0, Math.PI * 2);
      ctx.arc(s * 0.15, eyeY, s * 0.04, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `${Math.floor(s * 0.32)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(this.data.icon || '👾', 0, bob + s * 0.15);
    }

    if (this.shieldHp > 0) {
      ctx.strokeStyle = '#4488ff';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(0, 0, s / 2 + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    if (this.status.frozen) {
      ctx.fillStyle = 'rgba(100,200,255,0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, s / 2 + 2, 0, Math.PI * 2);
      ctx.fill();
    }
    if (this.status.burning) {
      ctx.fillStyle = 'rgba(255,100,30,0.3)';
      ctx.beginPath();
      ctx.arc(0, 0, s / 2 + 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.hp < this.maxHp || this.isBoss) {
      const bw = s * (this.isBoss ? 1.2 : 1);
      const bh = this.isBoss ? 7 : 4;
      ctx.fillStyle = '#333';
      ctx.fillRect(-bw / 2, -s / 2 - 12, bw, bh);
      const pct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = pct > 0.5 ? '#22cc66' : pct > 0.25 ? '#ffaa00' : '#ff3344';
      ctx.fillRect(-bw / 2, -s / 2 - 12, bw * pct, bh);
    }

    // Phase pips for bosses
    if (this.isBoss && this.data.phases) {
      const n = this.data.phases.length;
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = i <= this.phaseIndex ? '#ff3344' : '#444';
        ctx.beginPath();
        ctx.arc(-s * 0.3 + i * 12, -s / 2 - 22, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
