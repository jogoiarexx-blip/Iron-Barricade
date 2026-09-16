/**
 * IRON BARRICADE - Core Game Logic
 */

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.grid = new Grid(5, 9);
    this.waves = new WaveManager();
    this.enemies = [];
    this.energy = 50;
    this.difficulty = 'normal';
    this.speed = 1;
    this.paused = false;
    this.running = false;
    this.selectedCard = null;
    this.cardCooldowns = {};
    this.levelId = null;
    this.levelData = null;
    this.selectedUnits = [];
    this.kills = 0;
    this.score = 0;
    this.compactorsUsed = 0;
    this.boss = null;
    this.lastTime = 0;
    this.animId = null;
    this.hoverCell = null;
    this.tutorialStep = 0;
    this.enemiesByRow = [[], [], [], [], [], [], [], []];
    this._hudTimer = 0;
    this._bossBarTimer = 0;
    this._aliveCount = 0;
    this._bgColor = '#0d1219';
    
    this.diffMods = {
      easy: { hp: 0.7, speed: 0.85, energy: 1.3, reward: 1.2 },
      normal: { hp: 1, speed: 1, energy: 1, reward: 1 },
      hard: { hp: 1.35, speed: 1.1, energy: 0.85, reward: 0.9 },
      nightmare: { hp: 1.7, speed: 1.2, energy: 0.7, reward: 0.8 }
    };

    // Canvas performance flags
    this.ctx.imageSmoothingEnabled = false;
    if (this.ctx.imageSmoothingQuality) this.ctx.imageSmoothingQuality = 'low';

    this.setupInput();
    this.setupHUD();
  }

  setupInput() {
    this.canvas.addEventListener('click', (e) => this.onClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMove(e));
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      this.onClick({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: false });

    document.addEventListener('keydown', (e) => {
      if (!this.running) return;
      if (e.key === 'Escape') {
        this.togglePause();
        return;
      }
      if (this.paused) return;
      // 1-8 select cards, 0 or R for wrench
      if (e.key >= '1' && e.key <= '8') {
        const idx = parseInt(e.key, 10) - 1;
        if (this.selectedUnits[idx]) this.selectCard(this.selectedUnits[idx]);
      } else if (e.key === '0' || e.key === 'r' || e.key === 'R') {
        this.selectCard('wrench');
      } else if (e.key === ' ') {
        e.preventDefault();
        // cycle speed
        const speeds = [1, 2, 3];
        const i = speeds.indexOf(this.speed);
        this.speed = speeds[(i + 1) % speeds.length];
        document.querySelectorAll('.speed-btn').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.speed) === this.speed);
        });
      }
    });
  }

  setupHUD() {
    document.getElementById('pause-btn')?.addEventListener('click', () => this.togglePause());
    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.speed = parseInt(btn.dataset.speed);
        document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    
    document.getElementById('resume-btn')?.addEventListener('click', () => this.togglePause());
    document.getElementById('restart-btn')?.addEventListener('click', () => {
      this.togglePause();
      this.restartLevel();
    });
    document.getElementById('map-btn')?.addEventListener('click', () => {
      this.stop();
      UI.showWorldMap();
    });
    document.getElementById('main-menu-btn')?.addEventListener('click', () => {
      this.stop();
      UI.showMainMenu();
    });
    document.getElementById('settings-pause-btn')?.addEventListener('click', () => {
      UI.showSettings(true); // fromPause
    });
  }

  resize() {
    const container = document.getElementById('game-container');
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.canvas.width = w;
    this.canvas.height = h;
    this.grid.resize(w, h, 55, 105);
  }

  selectLevel(levelId) {
    this.levelId = levelId;
    UI.showPreLevel(levelId);
  }

  async startLevel(levelId, selectedUnits) {
    // Real loading screen — sprites of this phase
    await UI.showPhaseLoading(levelId, selectedUnits);

    this.levelId = levelId;
    this.levelData = getLevel(levelId);
    this.selectedUnits = selectedUnits;
    this.energy = Math.floor((this.levelData.startingEnergy || 50) * (this.diffMods[this.difficulty]?.energy || 1));
    this.enemies = [];
    this.enemiesByRow = [];
    for (let r = 0; r < this.grid.rows; r++) this.enemiesByRow[r] = [];
    this.kills = 0;
    this.score = 0;
    this.compactorsUsed = 0;
    this.boss = null;
    this.cardCooldowns = {};
    this.selectedCard = null;
    this.paused = false;
    this.running = true;
    this._aliveCount = 0;
    this._hudTimer = 0;
    this._bossBarTimer = 0;
    this._levelEnded = false;
    this._energyTick = 0;
    this.grid.init();
    
    const world = WORLDS[(this.levelData?.world || 1) - 1];
    this._bgColor = world ? world.bgColor : '#0d1219';
    
    // Unlocks applied on victory (not on start)
    this._pendingUnlocks = this.levelData.unlocks || [];

    // Apply particle quality from settings
    const q = Save.data.settings.quality || 'high';
    Particles.setQuality(q);
    Particles.setEnabled(Save.data.settings.particles !== false);

    UI.clear();
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('boss-bar').classList.add('hidden');
    UI.buildDefenderCards(selectedUnits);
    
    this.resize();
    this.waves.start(this.levelData);
    
    // Tutorial for first level
    if (levelId === '1-1' && !Save.data.tutorialCompleted) {
      this.runTutorial();
    }

    this.lastTime = performance.now();
    this.loop();
  }

  async runTutorial() {
    this.paused = true;
    await UI.showDialog('FORGE', 'Bem-vindo ao ferro-velho! Esses Riftborn escolheram o lugar errado.', '🔧');
    await UI.showDialog('FORGE', 'Colete energia e posicione máquinas na grade para defender a base.', '🔧');
    await UI.showDialog('IA', 'Probabilidade de sobrevivência: questionável.', '🤖');
    await UI.showDialog('FORGE', 'Questionável ainda é melhor que zero. Vamos nessa!', '🔧');
    Save.data.tutorialCompleted = true;
    Save.autoSave();
    this.paused = false;
  }

  restartLevel() {
    if (this.levelId && this.selectedUnits.length) {
      this.startLevel(this.levelId, this.selectedUnits);
    }
  }

  stop() {
    this.running = false;
    this._levelEnded = true;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('boss-bar').classList.add('hidden');
    Projectiles.clear();
    Particles.clear();
    this.enemies = [];
    this.waves.active = false;
  }

  togglePause() {
    if (!this.running) return;
    this.paused = !this.paused;
    document.getElementById('pause-menu').classList.toggle('hidden', !this.paused);
    if (!this.paused) {
      // Don't schedule a second rAF — existing loop continues
      this.lastTime = performance.now();
    }
  }

  selectCard(id) {
    if (id === 'wrench') {
      this.selectedCard = this.selectedCard === 'wrench' ? null : 'wrench';
    } else {
      if ((this.cardCooldowns[id] || 0) > 0) return;
      const data = getDefenderData(id);
      if (!data || this.energy < data.cost) return;
      this.selectedCard = this.selectedCard === id ? null : id;
    }
    // Visual
    document.querySelectorAll('.defender-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.id === this.selectedCard);
    });
  }

  onClick(e) {
    if (!this.running || this.paused) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cell = this.grid.getCellAt(x, y);
    if (!cell) return;

    if (this.selectedCard === 'wrench') {
      const d = this.grid.remove(cell.row, cell.col);
      if (d) {
        this.energy += Math.floor(d.data.cost * 0.3);
        Audio.playSfx('place');
        Particles.emit(d.x, d.y, 'scrap', 5);
      }
      this.selectedCard = null;
      document.querySelectorAll('.defender-card').forEach(c => c.classList.remove('selected'));
      return;
    }

    if (this.selectedCard) {
      const data = getDefenderData(this.selectedCard);
      if (!data) return;
      if (this.energy < data.cost) return;
      if (!this.grid.canPlace(cell.row, cell.col)) return;

      const level = Save.getDefenderLevel(this.selectedCard);
      const defender = new Defender(data, level);
      if (this.grid.place(cell.row, cell.col, defender)) {
        this.energy -= data.cost;
        this.cardCooldowns[this.selectedCard] = 2500;
        Save.addStat('machinesBuilt');
        Audio.playSfx('place');
        Particles.emit(defender.x, defender.y, 'spark', 6);
      }
    }
  }

  onMove(e) {
    if (!this.running) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.hoverCell = this.grid.getCellAt(x, y);
  }

  addEnergy(amount) {
    this.energy += amount;
    Save.addStat('energyProduced', amount);
  }

  onEnemyKilled(enemy) {
    this.kills++;
    const reward = enemy.data.reward || 10;
    this.score += reward;
    // Energy refund scales with reward — keeps mid-game flowing
    this.energy += Math.max(5, Math.floor(reward * 0.45));
    Save.addStat('enemiesDefeated');
    
    if (enemy.data.type === 'boss') {
      Save.addStat('bossesDefeated');
      this.boss = null;
      document.getElementById('boss-bar').classList.add('hidden');
    }
  }

  onEnemyReachedBase(enemy) {
    // Try compactors
    const comp = this.grid.compactors[enemy.row];
    if (comp && !comp.used) {
      comp.used = true;
      this.compactorsUsed++;
      Save.addStat('compactorsUsed');
      // Kill all enemies on this row
      this.enemies.forEach(e => {
        if (e.alive && e.row === enemy.row) {
          e.alive = false;
          Particles.emit(e.x, e.y, 'explosion', 8);
        }
      });
      Effects.screenShake(6);
      Effects.flash('#ff6600', 0.3);
      Audio.playSfx('explosion');
      return;
    }
    // Game over
    this.gameOver();
  }

  onBossSpawn(boss) {
    this.boss = boss;
    document.getElementById('boss-bar').classList.remove('hidden');
    document.getElementById('boss-name').textContent = boss.data.name;
    Audio.playMusic('boss');
    Audio.playSfx('boss_roar', 0.7);
    Effects.showAlert(`⚠ ${boss.data.name} ⚠`, 2500);
  }

  onAllWavesComplete() {
    if (this._levelEnded) return;
    if (this._aliveCount > 0 || this.enemies.some(e => e.alive)) return;
    this.victory();
  }

  victory() {
    if (this._levelEnded) return;
    this._levelEnded = true;
    this.running = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    
    let stars = 1;
    if (this.compactorsUsed === 0) stars = 2;
    if (this.compactorsUsed === 0 && this.kills >= 15) stars = 3;

    const scrap = Math.floor((50 + this.score * 0.5 + stars * 30) * (this.diffMods[this.difficulty]?.reward || 1));
    const unlocks = this._pendingUnlocks || this.levelData.unlocks || [];
    
    // Unlock defenders earned by completing this level
    unlocks.forEach(id => Save.unlockDefender(id));
    Save.completeLevel(this.levelId, stars, scrap);
    
    if (this.kills >= 1) Save.unlockAchievement('first_contact');
    if (this.levelId === '1-10') Save.unlockAchievement('scrapyard_safe');
    if (Save.data.resources.totalScrapEarned >= 10000) Save.unlockAchievement('scrap_master');
    if (this.compactorsUsed === 0) Save.unlockAchievement('no_scratches');
    if (Object.values(Save.data.defenders.levels).some(l => l >= 5)) Save.unlockAchievement('engineer');

    UI.showVictory({
      levelId: this.levelId,
      stars,
      score: this.score,
      scrap,
      kills: this.kills,
      unlocks
    });
  }

  gameOver() {
    if (this._levelEnded) return;
    this._levelEnded = true;
    this.running = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    UI.showDefeat({
      levelId: this.levelId,
      kills: this.kills,
      wave: this.waves.currentWave
    });
  }

  loop(now) {
    if (!this.running) return;
    this.animId = requestAnimationFrame((t) => this.loop(t));
    
    if (this.paused) return;
    
    const dt = Math.min((now - this.lastTime) / 1000, 0.05) * this.speed;
    this.lastTime = now;

    this.update(dt);
    this.draw();
  }

  /** Rebuild per-row enemy index (O(n), called once per frame) */
  _indexEnemies() {
    const rows = this.grid.rows;
    for (let r = 0; r < rows; r++) {
      if (this.enemiesByRow[r]) this.enemiesByRow[r].length = 0;
      else this.enemiesByRow[r] = [];
    }
    let alive = 0;
    const list = this.enemies;
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (!e.alive) continue;
      alive++;
      const row = e.row;
      if (row >= 0 && row < rows) this.enemiesByRow[row].push(e);
    }
    this._aliveCount = alive;
  }

  /** Swap-and-pop dead enemies without allocating a new array */
  _compactEnemies() {
    let write = 0;
    const list = this.enemies;
    for (let i = 0; i < list.length; i++) {
      if (list[i].alive) {
        list[write++] = list[i];
      }
    }
    list.length = write;
  }

  update(dt) {
    if (this._levelEnded) return;

    // Cooldowns
    for (const id in this.cardCooldowns) {
      if (this.cardCooldowns[id] > 0) {
        this.cardCooldowns[id] -= dt * 1000;
      }
    }

    // Passive energy income (scrapyard ambient power)
    this._energyTick += dt;
    if (this._energyTick >= 5) {
      this._energyTick -= 5;
      this.addEnergy(5);
      // subtle feedback only if no generators
    }

    // Waves
    this.waves.update(dt, this);

    // Index enemies by row for fast lane queries
    this._indexEnemies();

    // Defenders (cached list, no reallocation)
    const defenders = this.grid.getDefenders();
    let anyDead = false;
    for (let i = 0; i < defenders.length; i++) {
      const d = defenders[i];
      d.update(dt, this.enemies, this.grid, this);
      if (!d.alive) anyDead = true;
    }
    if (anyDead) this.grid.markDirty();

    // Enemies — pass row defenders only when needed
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (e.alive) e.update(dt, this.grid, this.grid.getDefendersInRow(e.row), this);
    }
    this._compactEnemies();

    // Projectiles use lane index
    Projectiles.update(dt, this.enemiesByRow, this.grid);

    // Particles & effects
    Particles.update(dt);
    Effects.update(dt);

    // Boss bar — throttle DOM writes
    this._bossBarTimer += dt;
    if (this.boss && this.boss.alive && this._bossBarTimer > 0.08) {
      this._bossBarTimer = 0;
      const pct = Math.max(0, this.boss.hp / this.boss.maxHp) * 100;
      const el = document.getElementById('boss-hp-fill');
      if (el) el.style.width = pct + '%';
    }

    // Victory check
    if (this.waves.finished && this._aliveCount === 0) {
      this.victory();
      return;
    }

    // HUD — throttle to ~10 fps
    this._hudTimer += dt;
    if (this._hudTimer > 0.1) {
      this._hudTimer = 0;
      UI.updateHUD(this);
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // Background
    const bgId = this.levelData ? `bg_world${this.levelData.world}` : null;
    if (bgId && typeof Assets !== 'undefined' && Assets.has(bgId)) {
      const asset = Assets.get(bgId);
      ctx.drawImage(asset.image, 0, 0, w, h);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = this._bgColor || '#0d1219';
      ctx.fillRect(0, 0, w, h);
    }

    const shake = Effects.getShakeOffset();
    const hasShake = shake.x !== 0 || shake.y !== 0;
    if (hasShake) {
      ctx.save();
      ctx.translate(shake.x, shake.y);
    }

    // Grid (cached offscreen)
    this.grid.draw(ctx);

    // Placement preview
    if (this.selectedCard && this.selectedCard !== 'wrench' && this.hoverCell) {
      const valid = this.grid.canPlace(this.hoverCell.row, this.hoverCell.col);
      this.grid.drawPlacementPreview(ctx, this.hoverCell.row, this.hoverCell.col, valid);
    }

    // Defenders
    const defenders = this.grid.getDefenders();
    const cs = this.grid.cellSize;
    for (let i = 0; i < defenders.length; i++) {
      defenders[i].draw(ctx, cs);
    }

    // Enemies
    const enemies = this.enemies;
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].alive) enemies[i].draw(ctx);
    }

    // Projectiles
    Projectiles.draw(ctx);

    // Particles
    Particles.draw(ctx);

    if (hasShake) ctx.restore();

    // Effects overlay (no shake)
    Effects.drawOverlay(ctx, w, h);
  }
}

const Game = new GameEngine();
