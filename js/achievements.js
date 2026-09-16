/**
 * IRON BARRICADE - Achievements
 */

const ACHIEVEMENTS = [
  { id: 'first_contact', name: 'Primeiro Contato', desc: 'Derrote seu primeiro Riftborn', check: (s) => s.enemiesDefeated >= 1 },
  { id: 'scrapyard_safe', name: 'Ferro-Velho Seguro', desc: 'Complete o Mundo 1', check: (s) => s.levelsCompleted >= 10 },
  { id: 'scrap_master', name: 'Mestre da Sucata', desc: 'Colete 10.000 sucatas', check: (s) => Save.data.resources.totalScrapEarned >= 10000 },
  { id: 'no_scratches', name: 'Sem Arranhões', desc: 'Complete uma fase sem compactadores' },
  { id: 'engineer', name: 'Engenheiro', desc: 'Melhore uma máquina ao nível máximo', check: () => Object.values(Save.data.defenders.levels).some(l => l >= 5) },
  { id: 'builder', name: 'Construtor', desc: 'Construa 100 máquinas', check: (s) => s.machinesBuilt >= 100 },
  { id: 'boss_slayer', name: 'Caçador de Chefes', desc: 'Derrote 3 chefes', check: (s) => s.bossesDefeated >= 3 },
  { id: 'perfect_engineer', name: 'Linha Perfeita', desc: 'Conclua uma fase sem perder máquinas', check: () => Save.data.achievements.unlocked.includes('perfect_engineer') },
  { id: 'three_star', name: 'Trabalho Impecável', desc: 'Consiga 3 estrelas em uma fase', check: () => Object.values(Save.data.campaign.stars).some(v => v >= 3) }
];

function checkAchievements() {
  const stats = Save.data.statistics;
  for (const a of ACHIEVEMENTS) {
    if (Save.data.achievements.unlocked.includes(a.id)) continue;
    if (a.check && a.check(stats)) {
      Save.unlockAchievement(a.id);
    }
  }
}
