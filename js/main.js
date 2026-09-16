/**
 * IRON BARRICADE - Entry Point
 */

const TIPS = [
  'Geradores de energia são fracos, mas essenciais para manter sua defesa funcionando.',
  'Use muros de pneus para proteger unidades frágeis na frente.',
  'Inimigos voadores ignoram defesas terrestres — use Drones Sentinela.',
  'A Bobina Tesla é excelente contra grupos densos de Riftborn.',
  'Salve a Bateria Sobrecarregada para ondas grandes.',
  'Cada linha tem um Compactador de Emergência — use com sabedoria.',
  'Melhore suas máquinas na Oficina Central com sucata.',
  'Observe o tipo de inimigo: blindados, rápidos, voadores...',
  'Posicione geradores no fundo, protegidos por muros.',
  'Congelar inimigos dá tempo para concentrar fogo.'
];

// Polyfill roundRect for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
    this.beginPath();
    this.moveTo(x + r.tl, y);
    this.lineTo(x + w - r.tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    this.lineTo(x + w, y + h - r.br);
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    this.lineTo(x + r.bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    this.lineTo(x, y + r.tl);
    this.quadraticCurveTo(x, y, x + r.tl, y);
    this.closePath();
    return this;
  };
}

async function boot() {
  // Load save
  Save.load();
  Game.difficulty = Save.data.settings.gameplayDifficulty || 'normal';
  
  // Init audio (requires user gesture later)
  await Audio.init();
  Particles.setEnabled(Save.data.settings.particles);
  
  // Show loading — load core assets for real
  UI.showLoading('IRON', 'BARRICADE');
  UI.updateLoading(0, TIPS[0], 'Inicializando...');

  await Assets.loadCore((pct, status) => {
    const tip = TIPS[Math.min(Math.floor(pct / 15), TIPS.length - 1)];
    UI.updateLoading(pct * 0.85, tip, status || 'Carregando núcleo...');
  });

  UI.updateLoading(90, TIPS[6], 'Finalizando...');
  await new Promise(r => setTimeout(r, 200));
  UI.updateLoading(100, TIPS[6], 'Pronto!');
  await new Promise(r => setTimeout(r, 250));
  
  // Resize handler
  window.addEventListener('resize', () => {
    if (Game.running) Game.resize();
  });
  
  UI.showMainMenu();
}

// Start when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
