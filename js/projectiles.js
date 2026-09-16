/**
 * IRON BARRICADE - Projectile System (Optimized + Object Pool)
 */

class Projectile {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 0; this.y = 0;
    this.vx = 0; this.vy = 0;
    this.damage = 10;
    this.speed = 6;
    this.type = 'bolt';
    this.color = '#ffaa44';
    this.pierce = 0;
    this.aoe = 0;
    this.statusEffect = null;
    this.hitEnemies = null; // lazy Set
    this.alive = false;
    this.radius = 6;
    this.radiusSq = 36;
    this.homing = false;
    this.target = null;
    this.airOnly = false;
    this.groundOnly = false;
    this.critChance = 0;
    this.config = null;
  }

  init(x, y, targetX, targetY, config) {
    this.x = x;
    this.y = y;
    this.config = config;
    this.damage = config.damage || 10;
    this.speed = config.speed || 6;
    this.type = config.type || 'bolt';
    this.color = config.color || '#ffaa44';
    this.pierce = config.pierce || 0;
    this.aoe = config.aoe || 0;
    this.statusEffect = config.statusEffect || null;
    this.hitEnemies = null;
    this.alive = true;
    this.radius = config.radius || 6;
    this.radiusSq = this.radius * this.radius;
    this.homing = config.homing || false;
    this.target = config.target || null;
    this.airOnly = config.airOnly || false;
    this.groundOnly = config.groundOnly || false;
    this.critChance = config.critChance || 0;

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
  }

  update(dt, enemiesByRow, grid) {
    if (!this.alive) return;

    if (this.homing && this.target && this.target.alive) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      this.vx = (dx / dist) * this.speed;
      this.vy = (dy / dist) * this.speed;
    }

    const step = dt * 60;
    this.x += this.vx * step;
    this.y += this.vy * step;

    // Bounds (use grid offsets)
    if (this.x < grid.offsetX - 60 || this.x > grid.offsetX + grid.pixelWidth + 60 ||
        this.y < grid.offsetY - 40 || this.y > grid.offsetY + grid.pixelHeight + 40) {
      this.alive = false;
      return;
    }

    // Lane-based collision: only check nearby rows
    const cellSize = grid.cellSize;
    const approxRow = Math.floor((this.y - grid.offsetY) / cellSize);
    const rowStart = Math.max(0, approxRow - 1);
    const rowEnd = Math.min(grid.rows - 1, approxRow + 1);

    for (let r = rowStart; r <= rowEnd; r++) {
      const rowEnemies = enemiesByRow[r];
      if (!rowEnemies) continue;
      for (let i = 0; i < rowEnemies.length; i++) {
        const enemy = rowEnemies[i];
        if (!enemy.alive) continue;
        if (this.hitEnemies && this.hitEnemies.has(enemy.id)) continue;
        if (this.airOnly && enemy.data.type !== 'air') continue;
        if (this.groundOnly && enemy.data.type === 'air') continue;
        if (enemy.stealthed) continue;

        const dx = enemy.x - this.x;
        const dy = enemy.y - this.y;
        const distSq = dx * dx + dy * dy;
        const minDist = this.radius + enemy.radius;
        if (distSq < minDist * minDist) {
          this.onHit(enemy, enemiesByRow, grid);
          if (this.pierce <= 0) {
            this.alive = false;
            return;
          }
          this.pierce--;
          if (!this.hitEnemies) this.hitEnemies = new Set();
          this.hitEnemies.add(enemy.id);
        }
      }
    }
  }

  onHit(enemy, enemiesByRow, grid) {
    let dmg = this.damage;
    if (enemy.status.magnetized) {
      dmg *= (1 + (enemy.status.magnetized.armorReduce || 0.4));
    }
    const isCrit = this.critChance > 0 && Math.random() < this.critChance;
    if (isCrit) dmg *= 2;

    enemy.takeDamage(dmg, this.type);
    Effects.spawnDamageNumber(enemy.x, enemy.y - 20, Math.round(dmg), isCrit);
    const pType = this.type === 'freeze' ? 'freeze' : this.type === 'plasma' ? 'fire' : 'impact';
    Particles.emit(this.x, this.y, pType, 3);
    Audio.playSfx('hit', 0.5);

    if (this.statusEffect) {
      enemy.applyStatus(this.statusEffect);
    }

    if (this.aoe > 0) {
      const aoeR = this.aoe * grid.cellSize;
      const aoeRSq = aoeR * aoeR;
      for (let r = 0; r < enemiesByRow.length; r++) {
        const list = enemiesByRow[r];
        if (!list) continue;
        for (let i = 0; i < list.length; i++) {
          const e = list[i];
          if (!e.alive || e === enemy) continue;
          const dx = e.x - this.x;
          const dy = e.y - this.y;
          if (dx * dx + dy * dy < aoeRSq) {
            e.takeDamage(this.damage * 0.5, this.type);
            if (this.statusEffect) e.applyStatus(this.statusEffect);
          }
        }
      }
      Particles.emit(this.x, this.y, 'explosion', 6);
    }
  }

  draw(ctx) {
    if (!this.alive) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    const angle = Math.atan2(this.vy, this.vx);
    ctx.rotate(angle);

    switch (this.type) {
      case 'bolt':
        ctx.fillStyle = this.color;
        ctx.fillRect(-8, -2, 16, 4);
        ctx.fillStyle = '#fff';
        ctx.fillRect(4, -1, 6, 2);
        break;
      case 'freeze':
        ctx.fillStyle = '#88ddff';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, 6.28318530718);
        ctx.fill();
        break;
      case 'plasma':
        ctx.fillStyle = '#cc44ff';
        ctx.shadowColor = '#cc44ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, 6.28318530718);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      case 'magnet':
        ctx.fillStyle = '#4488ff';
        ctx.fillRect(-6, -3, 12, 6);
        break;
      case 'scrapChunk':
        ctx.fillStyle = '#aa8866';
        ctx.fillRect(-9, -5, 18, 10);
        break;
      default:
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, 6.28318530718);
        ctx.fill();
    }
    ctx.restore();
  }
}

class ProjectileManager {
  constructor() {
    this.list = [];
    this.pool = [];
    this.maxActive = 80;
  }

  _acquire() {
    return this.pool.length > 0 ? this.pool.pop() : new Projectile();
  }

  _release(p) {
    p.alive = false;
    p.target = null;
    p.hitEnemies = null;
    p.config = null;
    this.pool.push(p);
  }

  spawn(x, y, targetX, targetY, config) {
    if (this.list.length >= this.maxActive) return;
    const p = this._acquire();
    p.init(x, y, targetX, targetY, config);
    this.list.push(p);
  }

  update(dt, enemiesByRow, grid) {
    let write = 0;
    for (let i = 0; i < this.list.length; i++) {
      const p = this.list[i];
      p.update(dt, enemiesByRow, grid);
      if (p.alive) {
        this.list[write++] = p;
      } else {
        this._release(p);
      }
    }
    this.list.length = write;
  }

  draw(ctx) {
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].draw(ctx);
    }
  }

  clear() {
    for (let i = 0; i < this.list.length; i++) {
      this._release(this.list[i]);
    }
    this.list.length = 0;
  }
}

const Projectiles = new ProjectileManager();
