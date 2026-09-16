/**
 * IRON BARRICADE - Save System
 */

const SAVE_KEY = 'iron_barricade_save_v1';
const SAVE_VERSION = 1;

const DEFAULT_SAVE = {
  saveVersion: SAVE_VERSION,
  campaign: {
    currentWorld: 1,
    currentLevel: '1-1',
    unlockedLevels: ['1-1'],
    stars: {}, // levelId -> 0-3
    completed: []
  },
  resources: {
    scrap: 0,
    totalScrapEarned: 0
  },
  defenders: {
    unlocked: ['boltCannon', 'scrapGenerator'],
    levels: {} // id -> upgrade level (1-5)
  },
  achievements: {
    unlocked: [],
    progress: {}
  },
  statistics: {
    enemiesDefeated: 0,
    levelsCompleted: 0,
    machinesBuilt: 0,
    scrapCollected: 0,
    energyProduced: 0,
    bossesDefeated: 0,
    totalPlayTime: 0,
    bestScore: 0,
    highestCombo: 0,
    compactorsUsed: 0
  },
  settings: {
    masterVolume: 0.7,
    musicVolume: 0.5,
    sfxVolume: 0.8,
    quality: 'high',
    particles: true,
    damageNumbers: true,
    fullscreen: false,
    language: 'pt-BR',
    vibration: true,
    gameplayDifficulty: 'normal'
  },
  cosmetics: { owned: [], equipped: {} },
  survival: {
    bestWave: 0,
    bestScore: 0,
    bestTime: 0
  },
  tutorialCompleted: false,
  firstLaunch: true
};

class SaveManager {
  constructor() {
    this.data = null;
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.saveVersion === SAVE_VERSION) {
          this.data = this.mergeDefaults(parsed);
        } else {
          // Migration placeholder
          this.data = this.mergeDefaults(parsed);
          this.data.saveVersion = SAVE_VERSION;
        }
      } else {
        this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
      }
    } catch (e) {
      console.warn('Save load failed, using defaults', e);
      this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    }
    return this.data;
  }

  mergeDefaults(saved) {
    const result = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    function deepMerge(target, source) {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else if (source[key] !== undefined) {
          target[key] = source[key];
        }
      }
    }
    deepMerge(result, saved);
    return result;
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Save failed', e);
    }
  }

  autoSave() {
    this.save();
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    this.save();
  }

  // Helpers
  unlockLevel(levelId) {
    if (!this.data.campaign.unlockedLevels.includes(levelId)) {
      this.data.campaign.unlockedLevels.push(levelId);
      this.autoSave();
    }
  }

  completeLevel(levelId, stars, scrapEarned) {
    if (!this.data.campaign.completed.includes(levelId)) {
      this.data.campaign.completed.push(levelId);
      this.data.statistics.levelsCompleted++;
    }
    const prevStars = this.data.campaign.stars[levelId] || 0;
    this.data.campaign.stars[levelId] = Math.max(prevStars, stars);
    this.data.resources.scrap += scrapEarned;
    this.data.resources.totalScrapEarned += scrapEarned;
    this.data.statistics.scrapCollected += scrapEarned;

    // Unlock next
    const [w, l] = levelId.split('-').map(Number);
    if (l < 10) {
      this.unlockLevel(`${w}-${l + 1}`);
    } else if (w < 5) {
      this.unlockLevel(`${w + 1}-1`);
    }
    this.autoSave();
  }

  unlockDefender(id) {
    if (!this.data.defenders.unlocked.includes(id)) {
      this.data.defenders.unlocked.push(id);
      this.autoSave();
      return true;
    }
    return false;
  }

  getDefenderLevel(id) {
    return this.data.defenders.levels[id] || 1;
  }

  upgradeDefender(id) {
    const current = this.getDefenderLevel(id);
    if (current >= 5) return false;
    const tree = getUpgradeTree(id);
    const next = tree[current];
    if (!next || this.data.resources.scrap < next.cost) return false;
    this.data.resources.scrap -= next.cost;
    this.data.defenders.levels[id] = current + 1;
    this.autoSave();
    return true;
  }

  addStat(key, amount = 1) {
    if (this.data.statistics[key] !== undefined) {
      this.data.statistics[key] += amount;
    }
  }

  unlockAchievement(id) {
    if (!this.data.achievements.unlocked.includes(id)) {
      this.data.achievements.unlocked.push(id);
      this.autoSave();
      return true;
    }
    return false;
  }

  isLevelUnlocked(levelId) {
    return this.data.campaign.unlockedLevels.includes(levelId);
  }

  getStars(levelId) {
    return this.data.campaign.stars[levelId] || 0;
  }
}

const Save = new SaveManager();
