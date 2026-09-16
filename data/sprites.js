/**
 * IRON BARRICADE - Sprite Atlas Configuration
 * Paths point to future WebP spritesheets. Loader falls back to procedural art.
 */

const SPRITE_CONFIG = {
  // ===== DEFENDERS =====
  scrapGenerator: {
    path: 'assets/images/sprites/defenders/scrap-generator.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle:    { row: 0, frames: 4, fps: 6, loop: true },
      damage:  { row: 1, frames: 2, fps: 8, loop: false },
      destroy: { row: 2, frames: 4, fps: 10, loop: false }
    },
    placeholder: { icon: '⚡', color: '#00e5ff', shape: 'generator' }
  },
  boltCannon: {
    path: 'assets/images/sprites/defenders/bolt-cannon.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle:    { row: 0, frames: 4, fps: 5, loop: true },
      attack:  { row: 1, frames: 3, fps: 12, loop: false },
      damage:  { row: 2, frames: 2, fps: 8, loop: false },
      destroy: { row: 3, frames: 5, fps: 10, loop: false }
    },
    placeholder: { icon: '🔩', color: '#ff8c42', shape: 'cannon' }
  },
  dualTower: {
    path: 'assets/images/sprites/defenders/dual-tower.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 4, fps: 5, loop: true },
      attack: { row: 1, frames: 4, fps: 14, loop: false },
      destroy: { row: 2, frames: 4, fps: 10, loop: false }
    },
    placeholder: { icon: '🔫', color: '#ffaa55', shape: 'tower' }
  },
  industrialFreezer: {
    path: 'assets/images/sprites/defenders/industrial-freezer.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 4, fps: 5, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      destroy: { row: 2, frames: 4, fps: 10, loop: false }
    },
    placeholder: { icon: '❄️', color: '#66ccff', shape: 'tower' }
  },
  teslaCoil: {
    path: 'assets/images/sprites/defenders/tesla-coil.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 6, fps: 8, loop: true },
      attack: { row: 1, frames: 4, fps: 14, loop: false },
      destroy: { row: 2, frames: 5, fps: 10, loop: false }
    },
    placeholder: { icon: '⚡', color: '#aa66ff', shape: 'coil' }
  },
  hydraulicPress: {
    path: 'assets/images/sprites/defenders/hydraulic-press.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 3, fps: 4, loop: true },
      attack: { row: 1, frames: 4, fps: 12, loop: false },
      destroy: { row: 2, frames: 4, fps: 10, loop: false }
    },
    placeholder: { icon: '🔨', color: '#cc6644', shape: 'press' }
  },
  tireWall: {
    path: 'assets/images/sprites/defenders/tire-wall.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 2, fps: 2, loop: true },
      damage: { row: 1, frames: 2, fps: 6, loop: false },
      destroy: { row: 2, frames: 4, fps: 10, loop: false }
    },
    placeholder: { icon: '🛞', color: '#555566', shape: 'wall' }
  },
  oilLauncher: {
    path: 'assets/images/sprites/defenders/oil-launcher.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 4, fps: 5, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      destroy: { row: 2, frames: 4, fps: 10, loop: false }
    },
    placeholder: { icon: '🛢️', color: '#443322', shape: 'tower' }
  },
  magneticTower: {
    path: 'assets/images/sprites/defenders/magnetic-tower.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 4, fps: 6, loop: true },
      attack: { row: 1, frames: 3, fps: 12, loop: false },
      destroy: { row: 2, frames: 4, fps: 10, loop: false }
    },
    placeholder: { icon: '🧲', color: '#4488ff', shape: 'tower' }
  },
  sentinelDrone: {
    path: 'assets/images/sprites/defenders/sentinel-drone.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 6, fps: 10, loop: true },
      attack: { row: 1, frames: 3, fps: 12, loop: false },
      destroy: { row: 2, frames: 4, fps: 10, loop: false }
    },
    placeholder: { icon: '🛸', color: '#66ffaa', shape: 'drone' }
  },
  scrapLauncher: {
    path: 'assets/images/sprites/defenders/scrap-launcher.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 4, fps: 5, loop: true },
      attack: { row: 1, frames: 4, fps: 10, loop: false },
      destroy: { row: 2, frames: 5, fps: 10, loop: false }
    },
    placeholder: { icon: '💥', color: '#dd8844', shape: 'cannon' }
  },
  microwaveMod: {
    path: 'assets/images/sprites/defenders/microwave-mod.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 4, fps: 6, loop: true },
      attack: { row: 1, frames: 3, fps: 12, loop: false },
      destroy: { row: 2, frames: 4, fps: 10, loop: false }
    },
    placeholder: { icon: '📡', color: '#ff6644', shape: 'box' }
  },
  industrialFan: {
    path: 'assets/images/sprites/defenders/industrial-fan.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 8, fps: 12, loop: true },
      attack: { row: 0, frames: 8, fps: 20, loop: true },
      destroy: { row: 1, frames: 4, fps: 10, loop: false }
    },
    placeholder: { icon: '💨', color: '#88aacc', shape: 'fan' }
  },
  overloadedBattery: {
    path: 'assets/images/sprites/defenders/overloaded-battery.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 4, fps: 8, loop: true },
      destroy: { row: 1, frames: 6, fps: 14, loop: false }
    },
    placeholder: { icon: '🔋', color: '#ffee44', shape: 'box' }
  },
  plasmaTower: {
    path: 'assets/images/sprites/defenders/plasma-tower.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      idle: { row: 0, frames: 4, fps: 6, loop: true },
      attack: { row: 1, frames: 4, fps: 14, loop: false },
      destroy: { row: 2, frames: 5, fps: 10, loop: false }
    },
    placeholder: { icon: '🟣', color: '#cc44ff', shape: 'tower' }
  },

  // ===== ENEMIES =====
  riftbornScout: {
    path: 'assets/images/sprites/enemies/riftborn-scout.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 10, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      death: { row: 2, frames: 5, fps: 12, loop: false }
    },
    placeholder: { icon: '👾', color: '#66aa44', shape: 'creature' }
  },
  riftbornRunner: {
    path: 'assets/images/sprites/enemies/riftborn-runner.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 14, loop: true },
      attack: { row: 1, frames: 3, fps: 12, loop: false },
      death: { row: 2, frames: 4, fps: 12, loop: false }
    },
    placeholder: { icon: '🏃', color: '#88cc55', shape: 'creature' }
  },
  riftbornBrute: {
    path: 'assets/images/sprites/enemies/riftborn-brute.webp',
    frameWidth: 160, frameHeight: 160,
    animations: {
      walk: { row: 0, frames: 6, fps: 6, loop: true },
      attack: { row: 1, frames: 4, fps: 8, loop: false },
      death: { row: 2, frames: 6, fps: 10, loop: false }
    },
    placeholder: { icon: '👹', color: '#aa5533', shape: 'brute' }
  },
  riftbornShield: {
    path: 'assets/images/sprites/enemies/riftborn-shield.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 8, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      death: { row: 2, frames: 5, fps: 12, loop: false }
    },
    placeholder: { icon: '🛡️', color: '#5588aa', shape: 'creature' }
  },
  riftbornFlyer: {
    path: 'assets/images/sprites/enemies/riftborn-flyer.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 12, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      death: { row: 2, frames: 4, fps: 12, loop: false }
    },
    placeholder: { icon: '🦇', color: '#9966cc', shape: 'flyer' }
  },
  riftbornBurrower: {
    path: 'assets/images/sprites/enemies/riftborn-burrower.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 8, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      death: { row: 2, frames: 5, fps: 12, loop: false }
    },
    placeholder: { icon: '🕳️', color: '#775533', shape: 'creature' }
  },
  riftbornTechnician: {
    path: 'assets/images/sprites/enemies/riftborn-technician.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 8, loop: true },
      attack: { row: 1, frames: 4, fps: 10, loop: false },
      death: { row: 2, frames: 4, fps: 12, loop: false }
    },
    placeholder: { icon: '🔧', color: '#44aacc', shape: 'creature' }
  },
  riftbornLeaper: {
    path: 'assets/images/sprites/enemies/riftborn-leaper.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 10, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      death: { row: 2, frames: 4, fps: 12, loop: false }
    },
    placeholder: { icon: '🦘', color: '#cc8844', shape: 'creature' }
  },
  riftbornSplitter: {
    path: 'assets/images/sprites/enemies/riftborn-splitter.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 8, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      death: { row: 2, frames: 6, fps: 12, loop: false }
    },
    placeholder: { icon: '🧬', color: '#66bb77', shape: 'creature' }
  },
  riftbornCommander: {
    path: 'assets/images/sprites/enemies/riftborn-commander.webp',
    frameWidth: 160, frameHeight: 160,
    animations: {
      walk: { row: 0, frames: 6, fps: 7, loop: true },
      attack: { row: 1, frames: 4, fps: 10, loop: false },
      death: { row: 2, frames: 5, fps: 12, loop: false }
    },
    placeholder: { icon: '👑', color: '#ddaa22', shape: 'brute' }
  },
  riftbornSpitter: {
    path: 'assets/images/sprites/enemies/riftborn-spitter.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 8, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      death: { row: 2, frames: 4, fps: 12, loop: false }
    },
    placeholder: { icon: '🤢', color: '#88bb44', shape: 'creature' }
  },
  riftbornHeavy: {
    path: 'assets/images/sprites/enemies/riftborn-heavy.webp',
    frameWidth: 160, frameHeight: 160,
    animations: {
      walk: { row: 0, frames: 6, fps: 5, loop: true },
      attack: { row: 1, frames: 4, fps: 8, loop: false },
      death: { row: 2, frames: 6, fps: 10, loop: false }
    },
    placeholder: { icon: '🦾', color: '#884422', shape: 'brute' }
  },
  riftbornSwarm: {
    path: 'assets/images/sprites/enemies/riftborn-swarm.webp',
    frameWidth: 96, frameHeight: 96,
    animations: {
      walk: { row: 0, frames: 4, fps: 12, loop: true },
      death: { row: 1, frames: 3, fps: 12, loop: false }
    },
    placeholder: { icon: '🦠', color: '#99cc66', shape: 'swarm' }
  },
  riftbornStealth: {
    path: 'assets/images/sprites/enemies/riftborn-stealth.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 10, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      death: { row: 2, frames: 4, fps: 12, loop: false }
    },
    placeholder: { icon: '👻', color: '#556677', shape: 'creature' }
  },
  riftbornBomber: {
    path: 'assets/images/sprites/enemies/riftborn-bomber.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 8, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      death: { row: 2, frames: 6, fps: 14, loop: false }
    },
    placeholder: { icon: '💣', color: '#cc4444', shape: 'creature' }
  },
  riftbornHealer: {
    path: 'assets/images/sprites/enemies/riftborn-healer.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 8, loop: true },
      attack: { row: 1, frames: 4, fps: 10, loop: false },
      death: { row: 2, frames: 4, fps: 12, loop: false }
    },
    placeholder: { icon: '💚', color: '#44cc88', shape: 'creature' }
  },
  riftbornTank: {
    path: 'assets/images/sprites/enemies/riftborn-tank.webp',
    frameWidth: 192, frameHeight: 192,
    animations: {
      walk: { row: 0, frames: 6, fps: 4, loop: true },
      attack: { row: 1, frames: 4, fps: 6, loop: false },
      death: { row: 2, frames: 6, fps: 8, loop: false }
    },
    placeholder: { icon: '🦏', color: '#665544', shape: 'brute' }
  },
  riftbornSniper: {
    path: 'assets/images/sprites/enemies/riftborn-sniper.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 7, loop: true },
      attack: { row: 1, frames: 3, fps: 8, loop: false },
      death: { row: 2, frames: 4, fps: 12, loop: false }
    },
    placeholder: { icon: '🎯', color: '#aa66aa', shape: 'creature' }
  },
  riftbornElite: {
    path: 'assets/images/sprites/enemies/riftborn-elite.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 10, loop: true },
      attack: { row: 1, frames: 4, fps: 12, loop: false },
      death: { row: 2, frames: 5, fps: 12, loop: false }
    },
    placeholder: { icon: '⚔️', color: '#ccaa44', shape: 'creature' }
  },
  riftbornInfector: {
    path: 'assets/images/sprites/enemies/riftborn-infector.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      walk: { row: 0, frames: 6, fps: 8, loop: true },
      attack: { row: 1, frames: 3, fps: 10, loop: false },
      death: { row: 2, frames: 4, fps: 12, loop: false }
    },
    placeholder: { icon: '🦠', color: '#88aa33', shape: 'creature' }
  },

  // ===== BOSSES =====
  ironcladColossus: {
    path: 'assets/images/sprites/bosses/ironclad-colossus.webp',
    frameWidth: 256, frameHeight: 256,
    animations: {
      idle: { row: 0, frames: 4, fps: 4, loop: true },
      walk: { row: 1, frames: 6, fps: 5, loop: true },
      attack1: { row: 2, frames: 5, fps: 8, loop: false },
      hurt: { row: 3, frames: 3, fps: 8, loop: false },
      death: { row: 4, frames: 8, fps: 8, loop: false }
    },
    placeholder: { icon: '🚗', color: '#cc4422', shape: 'boss' }
  },
  shadeStalkerPrime: {
    path: 'assets/images/sprites/bosses/shade-stalker-prime.webp',
    frameWidth: 256, frameHeight: 256,
    animations: {
      idle: { row: 0, frames: 4, fps: 5, loop: true },
      walk: { row: 1, frames: 6, fps: 8, loop: true },
      attack1: { row: 2, frames: 5, fps: 10, loop: false },
      death: { row: 3, frames: 7, fps: 10, loop: false }
    },
    placeholder: { icon: '🌑', color: '#334466', shape: 'boss' }
  },
  duneDevourer: {
    path: 'assets/images/sprites/bosses/dune-devourer.webp',
    frameWidth: 256, frameHeight: 256,
    animations: {
      idle: { row: 0, frames: 4, fps: 4, loop: true },
      walk: { row: 1, frames: 6, fps: 5, loop: true },
      attack1: { row: 2, frames: 6, fps: 8, loop: false },
      death: { row: 3, frames: 8, fps: 8, loop: false }
    },
    placeholder: { icon: '🏜️', color: '#cc9944', shape: 'boss' }
  },
  corebreaker: {
    path: 'assets/images/sprites/bosses/corebreaker.webp',
    frameWidth: 256, frameHeight: 256,
    animations: {
      idle: { row: 0, frames: 4, fps: 5, loop: true },
      walk: { row: 1, frames: 6, fps: 6, loop: true },
      attack1: { row: 2, frames: 5, fps: 10, loop: false },
      death: { row: 3, frames: 8, fps: 8, loop: false }
    },
    placeholder: { icon: '☢️', color: '#44aaff', shape: 'boss' }
  },
  riftbornOverlord: {
    path: 'assets/images/sprites/bosses/riftborn-overlord.webp',
    frameWidth: 320, frameHeight: 320,
    animations: {
      idle: { row: 0, frames: 6, fps: 5, loop: true },
      walk: { row: 1, frames: 6, fps: 4, loop: true },
      attack1: { row: 2, frames: 6, fps: 8, loop: false },
      special: { row: 3, frames: 8, fps: 10, loop: false },
      death: { row: 4, frames: 10, fps: 8, loop: false }
    },
    placeholder: { icon: '👁️', color: '#aa22cc', shape: 'boss' }
  },

  // ===== BACKGROUNDS =====
  bg_world1: {
    path: 'assets/images/backgrounds/world1-scrapyard.webp',
    frameWidth: 1920, frameHeight: 1080,
    placeholder: { color: '#1a2a1a', type: 'bg' }
  },
  bg_world2: {
    path: 'assets/images/backgrounds/world2-night.webp',
    frameWidth: 1920, frameHeight: 1080,
    placeholder: { color: '#0a0e18', type: 'bg' }
  },
  bg_world3: {
    path: 'assets/images/backgrounds/world3-desert.webp',
    frameWidth: 1920, frameHeight: 1080,
    placeholder: { color: '#2a2210', type: 'bg' }
  },
  bg_world4: {
    path: 'assets/images/backgrounds/world4-factory.webp',
    frameWidth: 1920, frameHeight: 1080,
    placeholder: { color: '#0e1a22', type: 'bg' }
  },
  bg_world5: {
    path: 'assets/images/backgrounds/world5-mothership.webp',
    frameWidth: 1920, frameHeight: 1080,
    placeholder: { color: '#1a0a22', type: 'bg' }
  },

  // ===== UI / FX =====
  ui_energy: {
    path: 'assets/images/ui/energy-icon.webp',
    frameWidth: 64, frameHeight: 64,
    placeholder: { icon: '⚡', color: '#00e5ff', shape: 'icon' }
  },
  fx_explosion: {
    path: 'assets/images/sprites/effects/explosion.webp',
    frameWidth: 128, frameHeight: 128,
    animations: {
      play: { row: 0, frames: 8, fps: 16, loop: false }
    },
    placeholder: { icon: '💥', color: '#ff4422', shape: 'fx' }
  }
};

/** Collect unique enemy type IDs used in a level's waves */
function getLevelEnemyIds(levelData) {
  const ids = new Set();
  if (!levelData || !levelData.waves) return ids;
  for (const wave of levelData.waves) {
    if (!wave.enemies) continue;
    for (const g of wave.enemies) {
      if (g.type === 'boss' && g.bossId) ids.add(g.bossId);
      else if (g.type) ids.add(g.type);
    }
  }
  return ids;
}
