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
        startingEnergy: isBoss ? 250 : Math.min(244, 180 + (i - 1) * 8),
        waves: generateWaves(world.id, i, isBoss),
        specialObjective: getSpecialObjective(world.id, i),
        unlocks: getUnlocks(world.id, i),
        starRequirements: {
          one: 'complete',
          two: 'noCompact',
          three: getThirdStar(world.id, i)
        },
        starDescriptions: getStarDescriptions(world.id, i)
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

function getEnemyProgression(worldId, levelIndex) {
  // World 1 is hand-curated so each stage teaches one threat at a time.
  // "returning" = enemies the player has already met.
  // "newEnemy" = first appearance in this stage (introduced after wave 1).
  if (worldId === 1) {
    const progression = {
      1: { returning: ['riftbornScout'], newEnemy: null },
      2: { returning: ['riftbornScout'], newEnemy: 'riftbornShield' },
      3: { returning: ['riftbornScout', 'riftbornShield'], newEnemy: 'riftbornRunner' },
      4: { returning: ['riftbornScout', 'riftbornRunner'], newEnemy: 'riftbornBrute' },
      5: { returning: ['riftbornScout', 'riftbornBrute', 'riftbornRunner'], newEnemy: 'riftbornLeaper' },
      6: { returning: ['riftbornBrute', 'riftbornShield', 'riftbornScout'], newEnemy: 'riftbornTechnician' },
      7: { returning: ['riftbornScout', 'riftbornRunner', 'riftbornLeaper'], newEnemy: 'riftbornSplitter' },
      8: { returning: ['riftbornBrute', 'riftbornShield', 'riftbornTechnician'], newEnemy: 'riftbornCommander' },
      9: { returning: ['riftbornScout', 'riftbornRunner', 'riftbornCommander'], newEnemy: 'riftbornFlyer' },
      10:{ returning: ['riftbornBrute', 'riftbornShield', 'riftbornCommander', 'riftbornFlyer'], newEnemy: null }
    };
    return progression[Math.min(levelIndex, 10)];
  }

  // Later worlds keep familiar enemies in rotation and introduce one new specialist
  // per stage. This avoids random rosters that teach too many mechanics at once.
  const worldPools = {
    2: ['riftbornStealth', 'riftbornSpitter', 'riftbornBomber', 'riftbornHealer', 'riftbornSniper', 'riftbornElite', 'riftbornHeavy', 'riftbornSwarm', 'riftbornInfector'],
    3: ['riftbornBurrower', 'riftbornHeavy', 'riftbornBomber', 'riftbornSpitter', 'riftbornTank', 'riftbornSwarm', 'riftbornCommander', 'riftbornElite', 'riftbornHealer'],
    4: ['riftbornTechnician', 'riftbornHeavy', 'riftbornTank', 'riftbornSniper', 'riftbornBomber', 'riftbornHealer', 'riftbornElite', 'riftbornInfector', 'riftbornCommander'],
    5: ['riftbornElite', 'riftbornTank', 'riftbornSniper', 'riftbornStealth', 'riftbornHealer', 'riftbornBomber', 'riftbornInfector', 'riftbornHeavy', 'riftbornCommander']
  };

  const specialistPool = worldPools[worldId] || worldPools[2];
  const familiarBase = ['riftbornScout', 'riftbornRunner', 'riftbornBrute', 'riftbornShield'];
  const introducedBefore = specialistPool.slice(0, Math.max(0, levelIndex - 1));
  const returning = [...familiarBase, ...introducedBefore].slice(-5);
  const newEnemy = levelIndex < 10 ? specialistPool[Math.min(levelIndex - 1, specialistPool.length - 1)] : null;
  return { returning, newEnemy };
}

function generateWorld1CuratedWaves(levelIndex, isBoss, hpMult) {
  const I = (type, count, interval = 950) => ({ type, count, interval, hpMult });
  const plans = {
    1: [[['riftbornScout',3]],[['riftbornScout',4]],[['riftbornScout',5]]],
    2: [[['riftbornScout',4]],[['riftbornScout',3],['riftbornShield',1]],[['riftbornScout',4],['riftbornShield',2]]],
    3: [[['riftbornScout',4]],[['riftbornScout',3],['riftbornRunner',1]],[['riftbornScout',3],['riftbornShield',1],['riftbornRunner',2]]],
    4: [[['riftbornScout',4],['riftbornRunner',1]],[['riftbornScout',3],['riftbornBrute',1]],[['riftbornScout',3],['riftbornRunner',2],['riftbornBrute',1]],[['riftbornScout',4],['riftbornShield',1],['riftbornBrute',1]]],
    5: [[['riftbornScout',4],['riftbornBrute',1]],[['riftbornScout',3],['riftbornLeaper',1]],[['riftbornScout',3],['riftbornRunner',2],['riftbornLeaper',2]],[['riftbornScout',4],['riftbornBrute',1],['riftbornLeaper',2]]],
    6: [[['riftbornScout',4],['riftbornShield',1]],[['riftbornScout',3],['riftbornTechnician',1]],[['riftbornBrute',1],['riftbornShield',2],['riftbornTechnician',1],['riftbornScout',2]],[['riftbornBrute',2],['riftbornScout',3],['riftbornTechnician',2]]],
    7: [[['riftbornScout',5]],[['riftbornRunner',2],['riftbornScout',3],['riftbornSplitter',1]],[['riftbornScout',4],['riftbornLeaper',1],['riftbornSplitter',2]],[['riftbornRunner',3],['riftbornScout',3],['riftbornSplitter',2]],[['riftbornBrute',1],['riftbornLeaper',2],['riftbornSplitter',3],['riftbornScout',3]]],
    8: [[['riftbornScout',4],['riftbornShield',2]],[['riftbornBrute',1],['riftbornShield',2],['riftbornCommander',1]],[['riftbornTechnician',1],['riftbornCommander',1],['riftbornScout',3]],[['riftbornBrute',1],['riftbornCommander',1],['riftbornShield',2]],[['riftbornTechnician',2],['riftbornCommander',1],['riftbornScout',3]],[['riftbornBrute',2],['riftbornShield',2],['riftbornCommander',2],['riftbornScout',2]]],
    9: [[['riftbornScout',4]],[['riftbornScout',3],['riftbornFlyer',1]],[['riftbornRunner',2],['riftbornFlyer',2],['riftbornScout',2]],[['riftbornCommander',1],['riftbornFlyer',2],['riftbornScout',3]],[['riftbornShield',2],['riftbornFlyer',2],['riftbornRunner',2]],[['riftbornBrute',1],['riftbornCommander',1],['riftbornFlyer',3],['riftbornScout',2]],[['riftbornBrute',1],['riftbornShield',2],['riftbornFlyer',3],['riftbornRunner',2]]],
    10:[[['riftbornScout',4],['riftbornShield',1]],[['riftbornRunner',3],['riftbornScout',3]],[['riftbornBrute',1],['riftbornShield',2],['riftbornScout',2]],[['riftbornTechnician',1],['riftbornCommander',1],['riftbornScout',3]],[['riftbornFlyer',2],['riftbornRunner',2],['riftbornScout',2]],[['riftbornBrute',1],['riftbornCommander',1],['riftbornShield',2]],[['riftbornBrute',2],['riftbornFlyer',2],['riftbornCommander',1],['riftbornScout',2]],[]]
  };
  const newByLevel = {2:'riftbornShield',3:'riftbornRunner',4:'riftbornBrute',5:'riftbornLeaper',6:'riftbornTechnician',7:'riftbornSplitter',8:'riftbornCommander',9:'riftbornFlyer'};
  const rows = plans[levelIndex] || plans[10];
  return rows.map((groups, idx) => {
    if (isBoss && idx === rows.length - 1) {
      return { enemies: [{ type:'boss', bossId:'ironcladColossus', count:1, interval:0 }], isBig:true, waveNumber:idx+1 };
    }
    return {
      enemies: groups.map(([type,count], gi) => I(type, count, 900 + gi * 170)),
      isBig: idx === rows.length - 1 || (isBoss && idx === rows.length - 2),
      introducedEnemy: idx === 1 ? newByLevel[levelIndex] || null : null,
      waveNumber: idx + 1
    };
  });
}

function generateWaves(worldId, levelIndex, isBoss) {
  const waves = [];
  const waveCount = getWaveCountForLevel(levelIndex);
  const baseHpMult = 1 + (worldId - 1) * 0.35 + levelIndex * 0.06;
  if (worldId === 1) return generateWorld1CuratedWaves(levelIndex, isBoss, baseHpMult);
  const progression = getEnemyProgression(worldId, levelIndex);
  const returning = progression.returning;
  const newEnemy = progression.newEnemy;

  const makeGroup = (type, count, interval = 900) => ({
    type,
    count: Math.max(1, count),
    interval,
    hpMult: baseHpMult
  });

  for (let w = 0; w < waveCount; w++) {
    const isFinalWave = w === waveCount - 1;

    if (isBoss && isFinalWave) {
      waves.push({
        enemies: [{ type: 'boss', bossId: WORLDS[worldId - 1].boss, count: 1, interval: 0 }],
        isBig: true
      });
      continue;
    }

    const enemies = [];
    const waveNumber = w + 1;
    const baseCount = 2 + Math.floor(levelIndex / 3) + w;

    // Wave 1: only threats already learned. Level 1 is Scouts only.
    if (w === 0) {
      const firstType = returning[0] || 'riftbornScout';
      enemies.push(makeGroup(firstType, baseCount + 1, 950));

      // From later stages, add one second familiar enemy to keep repetition varied.
      if (levelIndex >= 4 && returning[1]) {
        enemies.push(makeGroup(returning[1], Math.max(1, Math.floor(baseCount / 2)), 1150));
      }
    } else {
      // Later waves remix familiar enemies instead of replacing them.
      const familiarSlots = Math.min(2 + Math.floor(w / 2), returning.length);
      for (let i = 0; i < familiarSlots; i++) {
        const type = returning[(i + w - 1) % returning.length];
        const count = Math.max(1, Math.floor(baseCount / familiarSlots) + (i === 0 ? 1 : 0));
        enemies.push(makeGroup(type, count, 800 + i * 170));
      }

      // The new enemy never appears at the opening of the stage.
      // It debuts from wave 2 onward, with a small count first, then joins the mix.
      if (newEnemy) {
        const introCount = w === 1 ? 1 : Math.min(1 + w, 3);
        enemies.push(makeGroup(newEnemy, introCount, w === 1 ? 1450 : 1050));
      }
    }

    // Final non-boss wave is a recap: more familiar pressure + the newly learned threat.
    if (isFinalWave && !isBoss) {
      const heavyRepeat = levelIndex >= 4 ? 'riftbornBrute' : 'riftbornScout';
      if (!enemies.some(e => e.type === heavyRepeat)) {
        enemies.push(makeGroup(heavyRepeat, 1 + Math.floor(levelIndex / 4), 1250));
      }
    }

    waves.push({
      enemies,
      isBig: isFinalWave || (isBoss && w === waveCount - 2),
      introducedEnemy: w === 1 ? newEnemy : null,
      waveNumber
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
    { type: 'finishUnder', value: 180, desc: 'Conclua em até 3 minutos' },
    null,
    { type: 'onlyBasic', desc: 'Apenas torres básicas' },
    null,
    { type: 'limitedEnergy', value: 100, desc: 'Energia limitada' },
    null
  ];
  return objectives[(levelIndex - 1) % objectives.length];
}

function getThirdStar(worldId, levelIndex) {
  const special = getSpecialObjective(worldId, levelIndex);
  if (special) return `special:${special.type}`;
  if (levelIndex % 3 === 0) return 'noDefenderLost';
  if (levelIndex % 2 === 0) return 'fastClear';
  return 'efficiency';
}

function getStarDescriptions(worldId, levelIndex) {
  const special = getSpecialObjective(worldId, levelIndex);
  let third = 'Economize energia e termine com pelo menos 50';
  if (special) third = special.desc;
  else if (levelIndex % 3 === 0) third = 'Não perca nenhuma máquina';
  else if (levelIndex % 2 === 0) third = `Conclua em até ${90 + levelIndex * 12}s`;
  return ['Concluir a fase', 'Não usar Compactador', third];
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
    '1-8': ['magneticTower', 'sentinelDrone'],
    '1-9': [],
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
