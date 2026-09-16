/**
 * IRON BARRICADE - Defender Entities
 */

let defenderIdCounter = 0;

class Defender {
  constructor(data, upgradeLevel = 1) {
    this.id = ++defenderIdCounter;
    this.data = data;
    this.upgradeLevel = upgradeLevel;
    this.effects = getUpgradeEffect(data.id, upgradeLevel);
    
    this.hp = (data.hp + (this.effects.hpBonus || 0));
    this.maxHp = this.hp;
    this.damage = data.damage * (this.effects.damageMult || 1);
    this.range = (data.range + (this.effects.rangeBonus || 0)) * (this.effects.rangeMult || 1);
    this.fireRate = data.fireRate * (this.effects.fireRateMult || 1);
    this.cooldown = 0;
    this.x = 0;
    this.y = 0;
    this.row = 0;
    this.col = 0;
    this.alive = true;
    this.disabled = false;
    this.disableTimer = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.state = 'idle'; // idle, attack, damage, destroy
    this.produceTimer = data.produceInterval || 0;
    this.triggerTimer = data.triggerDelay || 0;
    this.singleUseTriggered = false;
  }

  update(dt, enemies, grid, game) {
    if (!this.alive) return;

    if (this.disabled) {
      this.disableTimer -= dt * 1000;
      if (this.disableTimer <= 0) this.disabled = false;
      return;
    }

    // Infection DoT from Riftborn Infector
    if (this._infected && this._infected > 0) {
      this.hp -= 8 * dt;
      this._infected -= dt;
      if (this.hp <= 0) this.takeDamage(1);
    }

    // Regenerators
    if (this.effects.regen) {
      this.hp = Math.min(this.maxHp, this.hp + this.effects.regen * dt);
    }

    // Energy producer
    if (this.data.producesEnergy) {
      this.produceTimer -= dt * 1000;
      if (this.produceTimer <= 0) {
        let amount = this.data.producesEnergy * (this.effects.produceMult || 1);
        if (this.effects.doubleChance && Math.random() < this.effects.doubleChance) amount *= 2;
        game.addEnergy(amount);
        Particles.emit(this.x, this.y - 20, 'energy', 6);
        Audio.playSfx('energy', 0.5);
        this.produceTimer = (this.data.produceInterval || 8000) * (this.effects.intervalMult || 1);
      }
    }

    // Single use explosive
    if (this.data.singleUse && !this.singleUseTriggered) {
      // Wait for enemies nearby or auto after delay once placed
      const nearby = enemies.some(e => e.alive && e.row === this.row && Math.abs(e.x - this.x) < this.range * grid.cellSize);
      if (nearby) {
        this.triggerTimer -= dt * 1000;
        if (this.triggerTimer <= 0) {
          this.explode(enemies, grid, game);
          this.singleUseTriggered = true;
        }
      }
      return;
    }

    if (this.data.type === 'wall' || this.data.damage === 0 && !this.data.producesEnergy) return;

    this.cooldown -= dt * 1000;
    if (this.cooldown > 0) return;

    // Find target
    const target = this.findTarget(enemies, grid);
    if (!target) return;

    this.attack(target, enemies, grid, game);
    this.cooldown = this.fireRate;
    this.state = 'attack';
    this.animTimer = 0.3;
  }

  findTarget(enemies, grid) {
    let best = null;
    let bestDist = Infinity;
    const rangePx = this.range * grid.cellSize;
    const myX = this.x;
    const myRow = this.row;
    const airOnly = this.data.airOnly;
    const n = enemies.length;

    for (let i = 0; i < n; i++) {
      const e = enemies[i];
      if (!e.alive || e.stealthed) continue;
      if (airOnly && e.data.type !== 'air') continue;
      // Same row for ground; air can be any row within vertical tolerance
      if (e.data.type !== 'air' && e.row !== myRow) continue;
      if (e.x < myX - 10) continue;
      const dist = e.x - myX;
      if (dist > rangePx) continue;
      if (dist < bestDist) {
        bestDist = dist;
        best = e;
      }
    }
    return best;
  }

  attack(target, enemies, grid, game) {
    Audio.playSfx('shoot', 0.4);

    if (this.data.type === 'melee') {
      target.takeDamage(this.damage, 'melee');
      Effects.spawnDamageNumber(target.x, target.y - 20, Math.round(this.damage));
      Particles.emit(target.x, target.y, 'impact', 6);
      if (this.effects.stun) target.applyStatus({ type: 'stunned', duration: this.effects.stun });
      if (this.effects.aoe) {
        // small aoe
        for (const e of enemies) {
          if (e !== target && e.alive && e.row === this.row && Math.abs(e.x - target.x) < this.effects.aoe * grid.cellSize) {
            e.takeDamage(this.damage * 0.4, 'melee');
          }
        }
      }
      return;
    }

    if (this.data.type === 'aoe' || this.data.type === 'utility') {
      if (this.data.id === 'teslaCoil') {
        this.teslaAttack(target, enemies, grid);
      } else if (this.data.id === 'industrialFan') {
        this.fanAttack(enemies, grid);
      } else if (this.data.id === 'microwaveMod') {
        this.microwaveAttack(enemies, grid);
      } else if (this.data.id === 'scrapLauncher') {
        Projectiles.spawn(this.x, this.y, target.x, target.y, {
          damage: this.damage,
          speed: 4.5,
          type: 'scrapChunk',
          color: this.data.color,
          aoe: this.data.aoeRadius || 1.2,
          pierce: 0
        });
      }
      return;
    }

    // Projectile types
    const multi = this.effects.multiShot || this.data.multiShot || 1;
    for (let i = 0; i < multi; i++) {
      const offsetY = (i - (multi - 1) / 2) * 8;
      Projectiles.spawn(this.x + 20, this.y + offsetY, target.x, target.y + offsetY, {
        damage: this.damage,
        speed: (this.data.projectileSpeed || 6) * (this.effects.speedMult || 1),
        type: this.data.projectileType || 'bolt',
        color: this.data.color,
        pierce: this.effects.pierce || 0,
        aoe: this.effects.aoe || 0,
        statusEffect: this.data.statusEffect,
        critChance: this.effects.critChance || 0,
        airOnly: this.data.airOnly,
        homing: this.effects.homing,
        target: this.effects.homing ? target : null
      });
    }
  }

  teslaAttack(firstTarget, enemies, grid) {
    const chain = this.effects.chainCount || this.data.chainCount || 3;
    const chainRange = (this.effects.chainRange || this.data.chainRange || 1.5) * grid.cellSize;
    let current = firstTarget;
    const hit = new Set();
    
    for (let i = 0; i < chain && current; i++) {
      current.takeDamage(this.damage * (1 - i * 0.15), 'electric');
      Effects.spawnDamageNumber(current.x, current.y - 15, Math.round(this.damage * (1 - i * 0.15)));
      Particles.emit(current.x, current.y, 'electric', 8);
      if (this.data.statusEffect) current.applyStatus(this.data.statusEffect);
      if (this.effects.stun) current.applyStatus({ type: 'stunned', duration: this.effects.stun });
      hit.add(current.id);
      
      // Find next
      let next = null;
      let nextDist = chainRange;
      for (const e of enemies) {
        if (!e.alive || hit.has(e.id)) continue;
        const d = Math.hypot(e.x - current.x, e.y - current.y);
        if (d < nextDist) {
          nextDist = d;
          next = e;
        }
      }
      current = next;
    }
  }

  fanAttack(enemies, grid) {
    const rangePx = this.range * grid.cellSize;
    for (const e of enemies) {
      if (!e.alive || e.row !== this.row) continue;
      if (e.x < this.x || e.x > this.x + rangePx) continue;
      e.x += (this.effects.knockback || this.data.knockback || 1.5) * grid.cellSize * 0.3;
      if (this.effects.stun) e.applyStatus({ type: 'stunned', duration: this.effects.stun });
      Particles.emit(e.x, e.y, 'dust', 3);
    }
  }

  microwaveAttack(enemies, grid) {
    const rangePx = this.range * grid.cellSize;
    for (const e of enemies) {
      if (!e.alive) continue;
      const dist = Math.hypot(e.x - this.x, e.y - this.y);
      if (dist < rangePx) {
        e.takeDamage(this.damage, 'fire');
        if (this.data.statusEffect) e.applyStatus(this.data.statusEffect);
        Particles.emit(e.x, e.y, 'fire', 4);
      }
    }
  }

  explode(enemies, grid, game) {
    const rangePx = this.range * grid.cellSize;
    Particles.emit(this.x, this.y, 'explosion', 20);
    Effects.screenShake(8);
    Audio.playSfx('explosion');
    for (const e of enemies) {
      if (!e.alive) continue;
      const dist = Math.hypot(e.x - this.x, e.y - this.y);
      if (dist < rangePx) {
        e.takeDamage(this.damage * (this.effects.damageMult || 1), 'explosion');
      }
    }
    // Damage self
    this.takeDamage(this.hp + 1);
  }

  takeDamage(amount) {
    if (!this.alive) return;
    if (this.effects.thorns) {
      // reflect handled by attacker if needed
    }
    this.hp -= amount;
    this.state = 'damage';
    this.animTimer = 0.2;
    Particles.emit(this.x, this.y, 'spark', 4);
    if (this.hp <= 0) {
      this.alive = false;
      this.state = 'destroy';
      Particles.emit(this.x, this.y, 'explosion', 8);
      Audio.playSfx('death', 0.5);
    }
  }

  applyDisable(duration) {
    this.disabled = true;
    this.disableTimer = duration;
  }

  draw(ctx, cellSize) {
    if (!this.alive && this.state !== 'destroy') return;
    
    const s = cellSize * 0.7;
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.disabled) {
      ctx.globalAlpha = 0.5;
    }

    // Try loaded sprite first
    if (typeof Assets !== 'undefined' && Assets.has(this.data.id)) {
      Assets.draw(ctx, this.data.id, 0, 0, s, { name: this.state || 'idle', time: (this.animTimer || 0) });
      // HP bar
      if (this.hp < this.maxHp) {
        const bw = s * 0.8, bh = 5;
        ctx.fillStyle = '#333';
        ctx.fillRect(-bw/2, -s/2 - 10, bw, bh);
        ctx.fillStyle = this.hp / this.maxHp > 0.3 ? '#22cc66' : '#ff3344';
        ctx.fillRect(-bw/2, -s/2 - 10, bw * (this.hp / this.maxHp), bh);
      }
      if (this.disabled) {
        ctx.fillStyle = 'rgba(100, 100, 255, 0.35)';
        ctx.fillRect(-s/2, -s/2, s, s);
      }
      ctx.restore();
      return;
    }

    // Body (procedural fallback)
    ctx.fillStyle = this.data.color || '#888';
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    
    // Different shapes by type
    if (this.data.type === 'wall') {
      ctx.fillRect(-s/2, -s/2, s, s);
      ctx.strokeRect(-s/2, -s/2, s, s);
      // tire marks
      ctx.fillStyle = '#333';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(-s/4 + i * s/4, 0, s/6, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.roundRect(-s/2, -s/2, s, s, 6);
      ctx.fill();
      ctx.stroke();
    }

    // Icon
    ctx.font = `${Math.floor(s * 0.45)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(this.data.icon || '?', 0, 0);

    // HP bar
    if (this.hp < this.maxHp) {
      const bw = s * 0.8;
      const bh = 5;
      ctx.fillStyle = '#333';
      ctx.fillRect(-bw/2, -s/2 - 10, bw, bh);
      ctx.fillStyle = this.hp / this.maxHp > 0.3 ? '#22cc66' : '#ff3344';
      ctx.fillRect(-bw/2, -s/2 - 10, bw * (this.hp / this.maxHp), bh);
    }

    // Disabled indicator
    if (this.disabled) {
      ctx.fillStyle = 'rgba(100, 100, 255, 0.4)';
      ctx.fillRect(-s/2, -s/2, s, s);
      ctx.font = '12px Orbitron';
      ctx.fillStyle = '#aaf';
      ctx.fillText('OFF', 0, s/2 + 12);
    }

    ctx.restore();
  }
}
