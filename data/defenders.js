/**
 * IRON BARRICADE
 * Defenders data - all machines
 */

const DEFENDERS_DATA = {
  scrapGenerator: {
    id: 'scrapGenerator',
    name: 'Gerador de Sucata',
    description: 'Produz energia periodicamente a partir de sucata reciclada. Frágil, mas essencial.',
    icon: '⚡',
    cost: 50,
    hp: 80,
    damage: 0,
    range: 0,
    cooldown: 0,
    fireRate: 0,
    type: 'support',
    unlockLevel: 1,
    color: '#00e5ff',
    producesEnergy: 25,
    produceInterval: 7000, // ms
    animations: {
      idle: { frames: 4, fps: 6 },
      damage: { frames: 2, fps: 8 },
      destroy: { frames: 4, fps: 10 }
    }
  },

  boltCannon: {
    id: 'boltCannon',
    name: 'Canhão Parafuso',
    description: 'Dispara parafusos afiados na linha. Unidade ofensiva básica e confiável.',
    icon: '🔩',
    cost: 100,
    hp: 160,
    damage: 22,
    range: 9, // cells
    cooldown: 0,
    fireRate: 1300,
    type: 'projectile',
    unlockLevel: 1,
    color: '#ff8c42',
    projectileType: 'bolt',
    projectileSpeed: 6,
    animations: {
      idle: { frames: 4, fps: 5 },
      attack: { frames: 3, fps: 12 },
      damage: { frames: 2, fps: 8 },
      destroy: { frames: 5, fps: 10 }
    }
  },

  dualTower: {
    id: 'dualTower',
    name: 'Torre Dupla',
    description: 'Dois canos, dois parafusos. Dispara projéteis em sequência rápida.',
    icon: '🔫',
    cost: 175,
    hp: 160,
    damage: 15,
    range: 9,
    fireRate: 900,
    type: 'projectile',
    unlockLevel: 3,
    color: '#ffaa55',
    projectileType: 'bolt',
    projectileSpeed: 6.5,
    multiShot: 2
  },

  industrialFreezer: {
    id: 'industrialFreezer',
    name: 'Gelador Industrial',
    description: 'Dispara rajadas de ar criogênico. Reduz drasticamente a velocidade dos inimigos.',
    icon: '❄️',
    cost: 150,
    hp: 140,
    damage: 5,
    range: 6,
    fireRate: 2000,
    type: 'projectile',
    unlockLevel: 4,
    color: '#66ccff',
    projectileType: 'freeze',
    projectileSpeed: 5,
    statusEffect: { type: 'frozen', duration: 2500, slowFactor: 0.35 }
  },

  teslaCoil: {
    id: 'teslaCoil',
    name: 'Bobina Tesla',
    description: 'Libera arcos elétricos que saltam entre inimigos próximos. Excelente contra grupos.',
    icon: '⚡',
    cost: 200,
    hp: 120,
    damage: 25,
    range: 3,
    fireRate: 1800,
    type: 'aoe',
    unlockLevel: 6,
    color: '#aa66ff',
    chainCount: 3,
    chainRange: 1.5,
    statusEffect: { type: 'electrified', duration: 800, damage: 5 }
  },

  hydraulicPress: {
    id: 'hydraulicPress',
    name: 'Prensa Hidráulica',
    description: 'Esmaga inimigos corpo a corpo com força devastadora. Alcance curto, dano alto.',
    icon: '🔨',
    cost: 175,
    hp: 280,
    damage: 80,
    range: 1,
    fireRate: 2200,
    type: 'melee',
    unlockLevel: 5,
    color: '#cc6644'
  },

  tireWall: {
    id: 'tireWall',
    name: 'Muro de Pneus',
    description: 'Barreira reforçada com pilhas de pneus. Alta resistência, não ataca.',
    icon: '🛞',
    cost: 50,
    hp: 600,
    damage: 0,
    range: 0,
    fireRate: 0,
    type: 'wall',
    unlockLevel: 2,
    color: '#555566'
  },

  oilLauncher: {
    id: 'oilLauncher',
    name: 'Lançador de Óleo',
    description: 'Cria poças de óleo escorregadio que reduzem a velocidade dos inimigos na área.',
    icon: '🛢️',
    cost: 125,
    hp: 130,
    damage: 0,
    range: 5,
    fireRate: 3500,
    type: 'area',
    unlockLevel: 7,
    color: '#443322',
    statusEffect: { type: 'oiled', duration: 4000, slowFactor: 0.5 },
    areaDuration: 5000
  },

  magneticTower: {
    id: 'magneticTower',
    name: 'Torre Magnética',
    description: 'Emite campos magnéticos que enfraquecem armaduras metálicas dos Riftborn.',
    icon: '🧲',
    cost: 150,
    hp: 140,
    damage: 8,
    range: 4,
    fireRate: 1600,
    type: 'projectile',
    unlockLevel: 8,
    color: '#4488ff',
    projectileType: 'magnet',
    statusEffect: { type: 'magnetized', duration: 3000, armorReduce: 0.4 }
  },

  sentinelDrone: {
    id: 'sentinelDrone',
    name: 'Drone Sentinela',
    description: 'Drone aéreo improvisado. Especialista em abater unidades voadoras.',
    icon: '🛸',
    cost: 175,
    hp: 100,
    damage: 30,
    range: 7,
    fireRate: 1200,
    type: 'projectile',
    unlockLevel: 9,
    color: '#66ffaa',
    projectileType: 'droneBolt',
    airOnly: true,
    projectileSpeed: 7
  },

  scrapLauncher: {
    id: 'scrapLauncher',
    name: 'Lança-Sucata',
    description: 'Dispara pedaços pesados de metal em área. Dano em grupo, cadência baixa.',
    icon: '💥',
    cost: 250,
    hp: 180,
    damage: 45,
    range: 6,
    fireRate: 2800,
    type: 'aoe',
    unlockLevel: 10,
    color: '#dd8844',
    projectileType: 'scrapChunk',
    aoeRadius: 1.2,
    projectileSpeed: 4.5
  },

  microwaveMod: {
    id: 'microwaveMod',
    name: 'Micro-ondas Modificado',
    description: 'Emite pulsos de calor concentrado em área curta. Bom para controle de multidões.',
    icon: '📡',
    cost: 200,
    hp: 110,
    damage: 15,
    range: 2.5,
    fireRate: 1500,
    type: 'aoe',
    unlockLevel: 11,
    color: '#ff6644',
    statusEffect: { type: 'burning', duration: 2000, damage: 8 }
  },

  industrialFan: {
    id: 'industrialFan',
    name: 'Ventilador Industrial',
    description: 'Empurra inimigos para trás com rajadas de vento poderosas. Controle de posicionamento.',
    icon: '💨',
    cost: 150,
    hp: 130,
    damage: 5,
    range: 4,
    fireRate: 2500,
    type: 'utility',
    unlockLevel: 12,
    color: '#88aacc',
    knockback: 1.5
  },

  overloadedBattery: {
    id: 'overloadedBattery',
    name: 'Bateria Sobrecarregada',
    description: 'Explode causando dano massivo em área. Uso único — escolha o momento certo!',
    icon: '🔋',
    cost: 75,
    hp: 60,
    damage: 200,
    range: 2,
    fireRate: 0,
    type: 'explosive',
    unlockLevel: 13,
    color: '#ffee44',
    singleUse: true,
    triggerDelay: 1500
  },

  plasmaTower: {
    id: 'plasmaTower',
    name: 'Torre Plasma',
    description: 'Tecnologia de ponta recuperada. Alto dano contínuo de plasma superquente.',
    icon: '🟣',
    cost: 350,
    hp: 200,
    damage: 40,
    range: 8,
    fireRate: 1000,
    type: 'projectile',
    unlockLevel: 15,
    color: '#cc44ff',
    projectileType: 'plasma',
    projectileSpeed: 8,
    statusEffect: { type: 'burning', duration: 1500, damage: 10 }
  }
};

// Helper
function getDefenderData(id) {
  return DEFENDERS_DATA[id] || null;
}

function getAllDefenders() {
  return Object.values(DEFENDERS_DATA);
}

function getUnlockedDefenders(unlockedIds) {
  return getAllDefenders().filter(d => unlockedIds.includes(d.id));
}
