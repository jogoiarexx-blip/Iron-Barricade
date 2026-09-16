/**
 * IRON BARRICADE - Player / Forge character helpers
 */

const FORGE = {
  name: 'FORGE',
  title: 'Engenheiro da Barricada',
  dialogs: {
    victory: [
      'Ha! Mais sucata para a coleção!',
      'Esses Riftborn subestimaram o poder da improvisação.',
      'Oficina aberta! Hora de melhorar as máquinas.'
    ],
    defeat: [
      'Droga... precisamos de mais parafusos.',
      'Recuar, reagrupar, re-sucatear.',
      'A base caiu, mas a ideia continua.'
    ],
    boss: [
      'Isso não é um Riftborn comum...',
      'Grande demais para o compactador. Fogo concentrado!'
    ]
  },
  getRandom(type) {
    const list = this.dialogs[type] || [];
    return list[Math.floor(Math.random() * list.length)] || '...';
  }
};
