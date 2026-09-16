/**
 * IRON BARRICADE - Wave Manager
 * Fixed pacing: 5s hidden preparation before first wave and between cleared waves.
 */

class WaveManager {
  constructor() {
    this.waves = [];
    this.currentWave = 0;
    this.waveTimer = 0;
    this.spawnQueue = [];
    this.active = false;
    this.finished = false;
    this.totalWaves = 0;
    this.waveInProgress = false;
    this.interWaveDelay = 5000;
  }

  start(levelData) {
    this.waves = levelData.waves || [];
    this.currentWave = 0;
    this.waveTimer = this.interWaveDelay; // hidden 5-second initial preparation
    this.spawnQueue = [];
    this.active = true;
    this.finished = false;
    this.totalWaves = this.waves.length;
    this.waveInProgress = false;
  }

  update(dt, game) {
    if (!this.active || this.finished) return;

    // Spawn queued enemies for the active wave.
    for (let i = this.spawnQueue.length - 1; i >= 0; i--) {
      const s = this.spawnQueue[i];
      s.timer -= dt * 1000;
      if (s.timer <= 0) {
        this.spawnEnemy(s, game);
        s.count--;
        if (s.count <= 0) {
          this.spawnQueue.splice(i, 1);
        } else {
          s.timer = s.interval;
        }
      }
    }

    const noQueuedSpawns = this.spawnQueue.length === 0;
    const noLivingEnemies = game._aliveCount === 0 || game.enemies.every(e => !e.alive);

    // A wave only ends after all of its spawns are out and all enemies are defeated.
    if (this.waveInProgress && noQueuedSpawns && noLivingEnemies) {
      this.waveInProgress = false;

      if (this.currentWave >= this.waves.length) {
        this.finished = true;
        game.onAllWavesComplete();
        return;
      }

      // Same hidden 5-second interval before every next wave.
      this.waveTimer = this.interWaveDelay;
    }

    // The timer is intentionally internal only; no countdown is rendered in the HUD.
    if (!this.waveInProgress && this.currentWave < this.waves.length) {
      this.waveTimer -= dt * 1000;
      if (this.waveTimer <= 0) {
        this.triggerWave(game);
      }
    }
  }

  triggerWave(game) {
    const wave = this.waves[this.currentWave];
    if (!wave) return;

    this.waveInProgress = true;

    if (wave.isBig) {
      Effects.showAlert('⚠ GRANDE INVASÃO DETECTADA ⚠', 3000);
      Effects.screenShake(3);
      Effects.flash('#ff0000', 0.2);
    }

    for (const group of wave.enemies) {
      if (group.type === 'boss') {
        const bossData = getEnemyData(group.bossId);
        if (bossData) {
          const row = Math.floor(game.grid.rows / 2);
          const mod = game.diffMods[game.difficulty] || game.diffMods.normal;
          const boss = new Enemy(bossData, row, game.grid, mod.hp || 1);
          boss.baseSpeed *= (mod.speed || 1);
          boss.speed = boss.baseSpeed;
          boss.x = game.grid.getSpawnX() + 50;
          game.enemies.push(boss);
          game.onBossSpawn(boss);
        }
      } else {
        this.spawnQueue.push({
          type: group.type,
          count: group.count,
          interval: group.interval || 700,
          timer: 200 + Math.random() * 300,
          hpMult: group.hpMult || 1,
          rowMode: 'random'
        });
      }
    }

    this.currentWave++;
  }

  spawnEnemy(s, game) {
    const data = getEnemyData(s.type);
    if (!data) return;
    let row;
    if (data.type === 'air') {
      row = Math.floor(Math.random() * game.grid.rows);
    } else if (s.rowMode === 'random') {
      row = Math.floor(Math.random() * game.grid.rows);
    } else {
      row = s.row || 0;
    }

    const mod = game.diffMods[game.difficulty] || game.diffMods.normal;
    const hpMult = (s.hpMult || 1) * (mod.hp || 1);

    const enemy = new Enemy(data, row, game.grid, hpMult);
    enemy.baseSpeed *= (mod.speed || 1);
    enemy.speed = enemy.baseSpeed;

    if (data.burrow) {
      enemy.x = game.grid.offsetX + game.grid.cellSize * (3 + Math.random() * 4);
      Particles.emit(enemy.x, enemy.y, 'dust', 8);
    }
    game.enemies.push(enemy);
  }

  getProgress() {
    if (this.totalWaves === 0) return 0;
    return this.currentWave / this.totalWaves;
  }

  getLabel() {
    if (this.finished) return `Onda ${this.totalWaves}/${this.totalWaves}`;
    const shown = Math.min(Math.max(this.currentWave || 1, 1), this.totalWaves);
    return `Onda ${shown}/${this.totalWaves}`;
  }
}
