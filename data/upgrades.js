/**
 * IRON BARRICADE
 * Upgrade trees for defenders
 */

const UPGRADE_TREES = {
  scrapGenerator: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 150, desc: '+20% energia produzida', effect: { produceMult: 1.2 } },
    { level: 3, cost: 300, desc: '-15% intervalo de produção', effect: { intervalMult: 0.85 } },
    { level: 4, cost: 500, desc: '+30 HP', effect: { hpBonus: 30 } },
    { level: 5, cost: 800, desc: 'Produz 2x energia ocasionalmente', effect: { doubleChance: 0.2 } }
  ],
  boltCannon: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 120, desc: '+15% dano', effect: { damageMult: 1.15 } },
    { level: 3, cost: 250, desc: '+12% velocidade de tiro', effect: { fireRateMult: 0.88 } },
    { level: 4, cost: 450, desc: 'Projétil perfura 1 inimigo', effect: { pierce: 1 } },
    { level: 5, cost: 700, desc: 'Chance de tiro crítico (2x dano)', effect: { critChance: 0.2 } }
  ],
  dualTower: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 180, desc: '+10% dano', effect: { damageMult: 1.1 } },
    { level: 3, cost: 350, desc: 'Dispara 3 projéteis', effect: { multiShot: 3 } },
    { level: 4, cost: 550, desc: '+20% alcance', effect: { rangeMult: 1.2 } },
    { level: 5, cost: 850, desc: 'Projéteis mais rápidos', effect: { speedMult: 1.3 } }
  ],
  industrialFreezer: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 150, desc: '+1s duração do gelo', effect: { durationBonus: 1000 } },
    { level: 3, cost: 300, desc: 'Congelamento mais forte', effect: { slowFactor: 0.25 } },
    { level: 4, cost: 500, desc: '+20% dano', effect: { damageMult: 1.2 } },
    { level: 5, cost: 750, desc: 'Área de efeito ao atingir', effect: { aoe: 0.8 } }
  ],
  teslaCoil: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 200, desc: '+1 salto de corrente', effect: { chainCount: 4 } },
    { level: 3, cost: 400, desc: '+25% dano', effect: { damageMult: 1.25 } },
    { level: 4, cost: 600, desc: 'Alcance de corrente maior', effect: { chainRange: 2.2 } },
    { level: 5, cost: 900, desc: 'Paralisia breve nos alvos', effect: { stun: 400 } }
  ],
  hydraulicPress: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 160, desc: '+20% dano', effect: { damageMult: 1.2 } },
    { level: 3, cost: 320, desc: '+50 HP', effect: { hpBonus: 50 } },
    { level: 4, cost: 500, desc: 'Atordoa por 0.8s', effect: { stun: 800 } },
    { level: 5, cost: 800, desc: 'Dano em área pequena', effect: { aoe: 0.6 } }
  ],
  tireWall: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 80, desc: '+150 HP', effect: { hpBonus: 150 } },
    { level: 3, cost: 180, desc: '+200 HP', effect: { hpBonus: 200 } },
    { level: 4, cost: 350, desc: 'Reflete 10% do dano', effect: { thorns: 0.1 } },
    { level: 5, cost: 550, desc: '+300 HP e regeneração lenta', effect: { hpBonus: 300, regen: 2 } }
  ],
  oilLauncher: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 140, desc: '+2s duração do óleo', effect: { durationBonus: 2000 } },
    { level: 3, cost: 280, desc: 'Óleo mais escorregadio', effect: { slowFactor: 0.35 } },
    { level: 4, cost: 450, desc: 'Área maior', effect: { aoe: 1.5 } },
    { level: 5, cost: 700, desc: 'Óleo inflamável (combo com fogo)', effect: { flammable: true } }
  ],
  magneticTower: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 150, desc: 'Mais redução de armadura', effect: { armorReduce: 0.55 } },
    { level: 3, cost: 300, desc: '+15% dano', effect: { damageMult: 1.15 } },
    { level: 4, cost: 480, desc: 'Puxa inimigos levemente', effect: { pull: 0.3 } },
    { level: 5, cost: 750, desc: 'Desativa escudos temporariamente', effect: { breakShield: true } }
  ],
  sentinelDrone: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 160, desc: '+20% dano aéreo', effect: { damageMult: 1.2 } },
    { level: 3, cost: 320, desc: 'Também ataca alvos terrestres', effect: { airOnly: false } },
    { level: 4, cost: 500, desc: '+25% velocidade de tiro', effect: { fireRateMult: 0.8 } },
    { level: 5, cost: 780, desc: 'Mísseis teleguiados', effect: { homing: true } }
  ],
  scrapLauncher: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 220, desc: '+15% dano', effect: { damageMult: 1.15 } },
    { level: 3, cost: 420, desc: 'Área de impacto maior', effect: { aoeRadius: 1.6 } },
    { level: 4, cost: 650, desc: 'Chance de atordoar', effect: { stunChance: 0.25 } },
    { level: 5, cost: 950, desc: 'Fragmentos secundários', effect: { fragments: 3 } }
  ],
  microwaveMod: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 180, desc: '+20% dano de queimadura', effect: { burnDamage: 1.2 } },
    { level: 3, cost: 350, desc: 'Alcance maior', effect: { rangeMult: 1.25 } },
    { level: 4, cost: 550, desc: 'Queimadura mais longa', effect: { durationBonus: 1000 } },
    { level: 5, cost: 850, desc: 'Pulso que atravessa inimigos', effect: { pierce: 2 } }
  ],
  industrialFan: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 140, desc: 'Empurrão mais forte', effect: { knockback: 2.0 } },
    { level: 3, cost: 280, desc: '+1 célula de alcance', effect: { rangeBonus: 1 } },
    { level: 4, cost: 450, desc: 'Atordoa levemente', effect: { stun: 300 } },
    { level: 5, cost: 700, desc: 'Empurra múltiplos inimigos', effect: { multiPush: true } }
  ],
  overloadedBattery: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 100, desc: '+30% dano de explosão', effect: { damageMult: 1.3 } },
    { level: 3, cost: 220, desc: 'Raio maior', effect: { rangeMult: 1.3 } },
    { level: 4, cost: 400, desc: 'Atraso reduzido', effect: { triggerDelay: 800 } },
    { level: 5, cost: 650, desc: 'Deixa área eletrificada', effect: { residual: true } }
  ],
  plasmaTower: [
    { level: 1, cost: 0, desc: 'Nível base' },
    { level: 2, cost: 300, desc: '+15% dano', effect: { damageMult: 1.15 } },
    { level: 3, cost: 550, desc: 'Cadência melhorada', effect: { fireRateMult: 0.85 } },
    { level: 4, cost: 850, desc: 'Plasma perfura 2 alvos', effect: { pierce: 2 } },
    { level: 5, cost: 1200, desc: 'Feixe contínuo de plasma', effect: { continuous: true } }
  ]
};

function getUpgradeTree(defenderId) {
  return UPGRADE_TREES[defenderId] || [];
}

function getUpgradeEffect(defenderId, level) {
  const tree = getUpgradeTree(defenderId);
  const effects = {};
  for (let i = 0; i < level && i < tree.length; i++) {
    Object.assign(effects, tree[i].effect || {});
  }
  return effects;
}
