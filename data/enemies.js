/**
 * IRON BARRICADE
 * Enemies data - Riftborn creatures
 */

const ENEMIES_DATA = {
  riftbornScout: {
    id: 'riftbornScout',
    name: 'Riftborn Scout',
    description: 'Unidade de reconhecimento básica. Rápida e numerosa.',
    icon: '👾',
    hp: 80,
    speed: 0.55,
    damage: 12,
    attackRate: 1000,
    reward: 10,
    armor: 0,
    type: 'ground',
    color: '#66aa44',
    size: 1.0
  },

  riftbornRunner: {
    id: 'riftbornRunner',
    name: 'Riftborn Runner',
    description: 'Extremamente ágil. Prioriza velocidade sobre resistência.',
    icon: '🏃',
    hp: 50,
    speed: 1.15,
    damage: 10,
    attackRate: 900,
    reward: 15,
    armor: 0,
    type: 'ground',
    color: '#88cc55',
    size: 0.9
  },

  riftbornBrute: {
    id: 'riftbornBrute',
    name: 'Riftborn Brute',
    description: 'Tanque de carne e metal. Lento, mas aguenta muito dano.',
    icon: '👹',
    hp: 450,
    speed: 0.28,
    damage: 35,
    attackRate: 1400,
    reward: 40,
    armor: 0.15,
    type: 'ground',
    color: '#aa5533',
    size: 1.4
  },

  riftbornShield: {
    id: 'riftbornShield',
    name: 'Riftborn Shield',
    description: 'Possui escudo frontal que absorve os primeiros impactos.',
    icon: '🛡️',
    hp: 180,
    speed: 0.4,
    damage: 18,
    attackRate: 1100,
    reward: 25,
    armor: 0,
    type: 'ground',
    color: '#5588aa',
    size: 1.1,
    shieldHp: 120
  },

  riftbornFlyer: {
    id: 'riftbornFlyer',
    name: 'Riftborn Flyer',
    description: 'Unidade aérea. Ignora defesas terrestres e voa sobre a grade.',
    icon: '🦇',
    hp: 70,
    speed: 0.7,
    damage: 15,
    attackRate: 1000,
    reward: 20,
    armor: 0,
    type: 'air',
    color: '#9966cc',
    size: 1.0
  },

  riftbornBurrower: {
    id: 'riftbornBurrower',
    name: 'Riftborn Burrower',
    description: 'Surge do solo em posições aleatórias da linha.',
    icon: '🕳️',
    hp: 110,
    speed: 0.5,
    damage: 20,
    attackRate: 1000,
    reward: 22,
    armor: 0.1,
    type: 'ground',
    color: '#775533',
    size: 1.0,
    burrow: true
  },

  riftbornTechnician: {
    id: 'riftbornTechnician',
    name: 'Riftborn Technician',
    description: 'Emite pulsos que desativam máquinas próximas temporariamente.',
    icon: '🔧',
    hp: 90,
    speed: 0.45,
    damage: 8,
    attackRate: 2000,
    reward: 30,
    armor: 0,
    type: 'ground',
    color: '#44aacc',
    size: 1.0,
    disableRange: 1.5,
    disableDuration: 2500
  },

  riftbornLeaper: {
    id: 'riftbornLeaper',
    name: 'Riftborn Leaper',
    description: 'Salta sobre a primeira defesa que encontra.',
    icon: '🦘',
    hp: 100,
    speed: 0.6,
    damage: 22,
    attackRate: 1100,
    reward: 28,
    armor: 0,
    type: 'ground',
    color: '#cc8844',
    size: 1.05,
    leap: true
  },

  riftbornSplitter: {
    id: 'riftbornSplitter',
    name: 'Riftborn Splitter',
    description: 'Ao morrer, divide-se em dois Scouts menores.',
    icon: '🧬',
    hp: 140,
    speed: 0.4,
    damage: 16,
    attackRate: 1200,
    reward: 18,
    armor: 0,
    type: 'ground',
    color: '#66bb77',
    size: 1.15,
    splitOnDeath: true,
    splitInto: 'riftbornScout',
    splitCount: 2
  },

  riftbornCommander: {
    id: 'riftbornCommander',
    name: 'Riftborn Commander',
    description: 'Fortalece criaturas próximas, aumentando sua velocidade e dano.',
    icon: '👑',
    hp: 220,
    speed: 0.35,
    damage: 25,
    attackRate: 1300,
    reward: 50,
    armor: 0.1,
    type: 'ground',
    color: '#ddaa22',
    size: 1.25,
    auraRange: 2,
    auraBuff: { speed: 1.25, damage: 1.3 }
  },

  riftbornSpitter: {
    id: 'riftbornSpitter',
    name: 'Riftborn Spitter',
    description: 'Ataca à distância cuspendo ácido corrosivo nas máquinas.',
    icon: '🤢',
    hp: 95,
    speed: 0.42,
    damage: 18,
    attackRate: 1600,
    reward: 24,
    armor: 0,
    type: 'ranged',
    color: '#88bb44',
    size: 1.0,
    attackRange: 3
  },

  riftbornHeavy: {
    id: 'riftbornHeavy',
    name: 'Riftborn Heavy',
    description: 'Versão reforçada do Brute com armadura pesada.',
    icon: '🦾',
    hp: 700,
    speed: 0.22,
    damage: 45,
    attackRate: 1600,
    reward: 60,
    armor: 0.3,
    type: 'ground',
    color: '#884422',
    size: 1.5
  },

  riftbornSwarm: {
    id: 'riftbornSwarm',
    name: 'Riftborn Swarmling',
    description: 'Pequeno e frágil, mas vem em enxames densos.',
    icon: '🦠',
    hp: 25,
    speed: 0.85,
    damage: 6,
    attackRate: 800,
    reward: 5,
    armor: 0,
    type: 'ground',
    color: '#99cc66',
    size: 0.7
  },

  riftbornStealth: {
    id: 'riftbornStealth',
    name: 'Riftborn Stealth',
    description: 'Fica invisível periodicamente, dificultando o targeting.',
    icon: '👻',
    hp: 85,
    speed: 0.55,
    damage: 14,
    attackRate: 1000,
    reward: 26,
    armor: 0,
    type: 'ground',
    color: '#556677',
    size: 1.0,
    stealth: true,
    stealthInterval: 4000,
    stealthDuration: 2000
  },

  riftbornBomber: {
    id: 'riftbornBomber',
    name: 'Riftborn Bomber',
    description: 'Explode ao morrer, causando dano em área às máquinas próximas.',
    icon: '💣',
    hp: 120,
    speed: 0.48,
    damage: 20,
    attackRate: 1200,
    reward: 20,
    armor: 0,
    type: 'ground',
    color: '#cc4444',
    size: 1.1,
    explodeOnDeath: true,
    explodeDamage: 80,
    explodeRadius: 1.5
  },

  riftbornHealer: {
    id: 'riftbornHealer',
    name: 'Riftborn Healer',
    description: 'Regenera a vida de aliados próximos.',
    icon: '💚',
    hp: 100,
    speed: 0.38,
    damage: 5,
    attackRate: 1500,
    reward: 35,
    armor: 0,
    type: 'ground',
    color: '#44cc88',
    size: 1.0,
    healRange: 2,
    healAmount: 8,
    healInterval: 1200
  },

  riftbornTank: {
    id: 'riftbornTank',
    name: 'Riftborn Tank',
    description: 'Massa móvel de metal alienígena. Extremamente resistente.',
    icon: '🦏',
    hp: 1200,
    speed: 0.18,
    damage: 55,
    attackRate: 1800,
    reward: 80,
    armor: 0.4,
    type: 'ground',
    color: '#665544',
    size: 1.7
  },

  riftbornSniper: {
    id: 'riftbornSniper',
    name: 'Riftborn Sniper',
    description: 'Ataca de longe com projéteis de energia concentrada.',
    icon: '🎯',
    hp: 75,
    speed: 0.35,
    damage: 40,
    attackRate: 2500,
    reward: 32,
    armor: 0,
    type: 'ranged',
    color: '#aa66aa',
    size: 1.0,
    attackRange: 5
  },

  riftbornElite: {
    id: 'riftbornElite',
    name: 'Riftborn Elite',
    description: 'Unidade de elite com alta velocidade e dano balanceados.',
    icon: '⚔️',
    hp: 280,
    speed: 0.65,
    damage: 30,
    attackRate: 900,
    reward: 45,
    armor: 0.1,
    type: 'ground',
    color: '#ccaa44',
    size: 1.2
  },

  riftbornInfector: {
    id: 'riftbornInfector',
    name: 'Riftborn Infector',
    description: 'Infecta máquinas, causando dano contínuo e reduzindo eficiência.',
    icon: '🦠',
    hp: 110,
    speed: 0.5,
    damage: 10,
    attackRate: 1400,
    reward: 28,
    armor: 0,
    type: 'ground',
    color: '#88aa33',
    size: 1.0,
    infect: true
  }
};

// Bosses
const BOSSES_DATA = {
  ironcladColossus: {
    id: 'ironcladColossus',
    name: 'Ironclad Colossus',
    description: 'Monstro alienígena blindado com carcaças de carros. Chefe do Mundo 1.',
    icon: '🚗',
    hp: 8000,
    speed: 0.12,
    damage: 80,
    attackRate: 2000,
    reward: 500,
    armor: 0.25,
    type: 'boss',
    color: '#cc4422',
    size: 2.5,
    phases: [
      { hpPercent: 1.0, abilities: ['slam', 'spawnScouts'] },
      { hpPercent: 0.7, abilities: ['slam', 'spawnScouts', 'armorUp'] },
      { hpPercent: 0.4, abilities: ['slam', 'rage', 'spawnBrutes'] }
    ]
  },

  shadeStalkerPrime: {
    id: 'shadeStalkerPrime',
    name: 'Shade Stalker Prime',
    description: 'Especialista em invisibilidade e emboscadas. Chefe do Mundo 2.',
    icon: '🌑',
    hp: 6500,
    speed: 0.25,
    damage: 60,
    attackRate: 1500,
    reward: 600,
    armor: 0.1,
    type: 'boss',
    color: '#334466',
    size: 2.2,
    phases: [
      { hpPercent: 1.0, abilities: ['stealth', 'slash'] },
      { hpPercent: 0.6, abilities: ['stealth', 'clone', 'slash'] },
      { hpPercent: 0.3, abilities: ['permanentStealth', 'frenzy'] }
    ]
  },

  duneDevourer: {
    id: 'duneDevourer',
    name: 'Dune Devourer',
    description: 'Criatura subterrânea gigante que engole defesas. Chefe do Mundo 3.',
    icon: '🏜️',
    hp: 10000,
    speed: 0.1,
    damage: 100,
    attackRate: 2500,
    reward: 700,
    armor: 0.35,
    type: 'boss',
    color: '#cc9944',
    size: 2.8,
    phases: [
      { hpPercent: 1.0, abilities: ['burrow', 'sandstorm'] },
      { hpPercent: 0.65, abilities: ['burrow', 'swallow', 'sandstorm'] },
      { hpPercent: 0.35, abilities: ['earthquake', 'spawnBurrowers'] }
    ]
  },

  corebreaker: {
    id: 'corebreaker',
    name: 'Corebreaker',
    description: 'Absorve energia elétrica das máquinas. Chefe do Mundo 4.',
    icon: '☢️',
    hp: 9000,
    speed: 0.15,
    damage: 70,
    attackRate: 1800,
    reward: 800,
    armor: 0.2,
    type: 'boss',
    color: '#44aaff',
    size: 2.4,
    phases: [
      { hpPercent: 1.0, abilities: ['drain', 'shock'] },
      { hpPercent: 0.55, abilities: ['drain', 'overload', 'shock'] },
      { hpPercent: 0.25, abilities: ['emp', 'powerSurge'] }
    ]
  },

  riftbornOverlord: {
    id: 'riftbornOverlord',
    name: 'Riftborn Overlord',
    description: 'O líder supremo da invasão. Chefe final da Cidadela Riftborn.',
    icon: '👁️',
    hp: 15000,
    speed: 0.08,
    damage: 120,
    attackRate: 1600,
    reward: 1500,
    armor: 0.3,
    type: 'boss',
    color: '#aa22cc',
    size: 3.0,
    phases: [
      { hpPercent: 1.0, abilities: ['summon', 'beam', 'shield'] },
      { hpPercent: 0.7, abilities: ['summonElite', 'beam', 'teleport'] },
      { hpPercent: 0.4, abilities: ['rageMode', 'multiBeam', 'spawnAll'] },
      { hpPercent: 0.15, abilities: ['finalForm'] }
    ]
  }
};

function getEnemyData(id) {
  return ENEMIES_DATA[id] || BOSSES_DATA[id] || null;
}
