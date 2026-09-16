/**
 * IRON BARRICADE
 * Levels & Worlds configuration
 */

const WORLDS = [
  {
    id: 1,
    name: 'Ferro-Velho Central',
    theme: 'day',
    description: 'O ferro-velho durante o dia. Carros destruídos, pilhas de metal e guindastes.',
    color: '#ff8c42',
    bgColor: '#1a2a1a',
    levels: 10,
    boss: 'ironcladColossus'
  },
  {
    id: 2,
    name: 'Ferro-Velho Noturno',
    theme: 'night',
    description: 'Pouca visibilidade, luzes artificiais e inimigos furtivos.',
    color: '#4466aa',
    bgColor: '#0a0e18',
    levels: 10,
    boss: 'shadeStalkerPrime'
  },
  {
    id: 3,
    name: 'Deserto Mecânico',
    theme: 'desert',
    description: 'Areia, tempestades e máquinas abandonadas. Visibilidade reduzida ocasionalmente.',
    color: '#cc9944',
    bgColor: '#2a2210',
    levels: 10,
    boss: 'duneDevourer'
  },
  {
    id: 4,
    name: 'Usina Abandonada',
    theme: 'factory',
    description: 'Eletricidade, plataformas, vapor e áreas energizadas.',
    color: '#44aaff',
    bgColor: '#0e1a22',
    levels: 10,
    boss: 'corebreaker'
  },
  {
    id: 5,
    name: 'Cidadela Riftborn',
    theme: 'alien',
    description: 'Fortaleza alienígena suspensa, gravidade instável e portais ativos.',
    color: '#aa22cc',
    bgColor: '#1a0a22',
    levels: 10,
    boss: 'riftbornOverlord'
  }
];

// Generate levels programmatically for structure
function generateLevels() {
  const levels = {};
  
  WORLDS.forEach(world => {
    for (let i = 1; i <= world.levels; i++) {
      const key = `${world.id}-${i}`;
      const isBoss = i === world.levels;
      
      levels[key] = {
        id: key,
        world: world.id,
        index: i,
        name: isBoss ? `CHEFE: ${BOSSES_DATA[world.boss]?.name || 'Boss'}` : `Fase ${world.id}-${i}`,
        isBoss: isBoss,
        difficulty: Math.min(1 + (world.id - 1) * 0.3 + i * 0.08, 3.5),
        startingEnergy: isBoss ? 175 : (i === 1 ? 100 : 60 + Math.floor(i * 8)),
        waves: generateWaves(world.id, i, isBoss),
        specialObjective: getSpecialObjective(world.id, i),
        unlocks: getUnlocks(world.id, i),
        starRequirements: {
          one: 'complete',
          two: 'noCompact',
          three: getThirdStar(world.id, i)
        }
      };
    }
  });
  
  return levels;
}

function getWaveCountForLevel(levelIndex) {
  // Requested progression:
  // 1-3: 3 waves | 4-6: 4 waves | 7+: +1 wave per level.
  if (levelIndex <= 3) return 3;
  if (levelIndex <= 6) return 4;
  return levelIndex - 2; // 7=5, 8=6, 9=7, 10=8
}

function generateWaves(worldId, levelIndex, isBoss) {
  const waves = [];
  const waveCount = getWaveCountForLevel(levelIndex);
  const baseHpMult = 1 + (worldId - 1) * 0.35 + levelIndex * 0.06;

  const enemyPools = [
    ['riftbornScout', 'riftbornRunner'],
    ['riftbornScout', 'riftbornRunner', 'riftbornBrute'],
    ['riftbornScout', 'riftbornShield', 'riftbornRunner'],
    ['riftbornScout', 'riftbornFlyer', 'riftbornBrute'],
    ['riftbornRunner', 'riftbornLeaper', 'riftbornSplitter'],
    ['riftbornBrute', 'riftbornShield', 'riftbornTechnician'],
    ['riftbornFlyer', 'riftbornSpitter', 'riftbornSwarm'],
    ['riftbornHeavy', 'riftbornCommander', 'riftbornElite'],
    ['riftbornTank', 'riftbornBomber', 'riftbornStealth'],
    ['riftbornElite', 'riftbornHealer', 'riftbornSniper']
  ];

  const pool = enemyPools[Math.min(levelIndex - 1, enemyPools.length - 1)];

  for (let w = 0; w < waveCount; w++) {
    const isFinalWave = w === waveCount - 1;

    // Boss stages keep the exact wave count for their phase number;
    // the final wave is the boss encounter.
    if (isBoss && isFinalWave) {
      waves.push({
        enemies: [{ type: 'boss', bossId: WORLDS[worldId - 1].boss, count: 1, interval: 0 }],
        isBig: true
      });
      continue;
    }

    const enemies = [];
    const count = Math.max(2, 2 + w * 2 + Math.floor(levelIndex / 2) - (levelIndex === 1 ? 1 : 0));

    pool.forEach((type, idx) => {
      const c = Math.max(1, Math.floor(count / pool.length) + (idx === 0 ? 1 : 0));
      enemies.push({
        type,
        count: c,
        interval: 600 + Math.random() * 400,
        hpMult: baseHpMult
      });
    });

    if (isFinalWave) {
      enemies.push({
        type: 'riftbornBrute',
        count: 2 + Math.floor(levelIndex / 3),
        interval: 1200,
        hpMult: baseHpMult
      });
    }

    waves.push({
      enemies,
      isBig: isFinalWave || (isBoss && w === waveCount - 2)
    });
  }

  return waves;
}

function getSpecialObjective(worldId, levelIndex) {
  const objectives = [
    null,
    null,
    { type: 'noGenerators', desc: 'Sem geradores' },
    null,
    { type: 'surviveTime', value: 180, desc: 'Sobreviva 3 minutos' },
    null,
    { type: 'onlyBasic', desc: 'Apenas torres básicas' },
    null,
    { type: 'limitedEnergy', value: 100, desc: 'Energia limitada' },
    null
  ];
  return objectives[(levelIndex - 1) % objectives.length];
}

function getThirdStar(worldId, levelIndex) {
  if (levelIndex % 3 === 0) return 'noDamage';
  if (levelIndex % 2 === 0) return 'fastClear';
  return 'fullStars';
}

function getUnlocks(worldId, levelIndex) {
  const unlockMap = {
    '1-1': ['boltCannon', 'scrapGenerator'],
    '1-2': ['tireWall'],
    '1-3': ['dualTower'],
    '1-4': ['industrialFreezer'],
    '1-5': ['hydraulicPress'],
    '1-6': ['teslaCoil'],
    '1-7': ['oilLauncher'],
    '1-8': ['magneticTower'],
    '1-9': ['sentinelDrone'],
    '1-10': ['scrapLauncher'],
    '2-1': ['microwaveMod'],
    '2-3': ['industrialFan'],
    '2-5': ['overloadedBattery'],
    '3-1': ['plasmaTower']
  };
  return unlockMap[`${worldId}-${levelIndex}`] || [];
}

const LEVELS = generateLevels();

function getLevel(id) {
  return LEVELS[id] || null;
}

function getWorldLevels(worldId) {
  return Object.values(LEVELS).filter(l => l.world === worldId);
}
