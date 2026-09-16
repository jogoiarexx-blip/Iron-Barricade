/**
 * IRON BARRICADE - Asset Loader
 * Loads sprites per-level with real progress. Falls back to procedural canvases.
 */

class AssetManager {
  constructor() {
    this.cache = new Map();       // id -> { image, procedural, cfg }
    this.loading = false;
    this.progress = 0;
    this.status = '';
    this._placeholderCache = new Map();
  }

  has(id) {
    return this.cache.has(id);
  }

  get(id) {
    return this.cache.get(id) || null;
  }

  /**
   * Build load list for a specific level
   */
  getLevelManifest(levelId, selectedUnits = []) {
    const level = getLevel(levelId);
    if (!level) return [];

    const ids = new Set();

    // Background for world
    ids.add(`bg_world${level.world}`);

    // Selected defenders
    for (const uid of selectedUnits) {
      if (SPRITE_CONFIG[uid]) ids.add(uid);
    }

    // Always useful commons
    ids.add('ui_energy');
    ids.add('fx_explosion');

    // Enemies in this level
    const enemyIds = getLevelEnemyIds(level);
    for (const eid of enemyIds) {
      if (SPRITE_CONFIG[eid]) ids.add(eid);
    }

    // Boss if final level of world
    if (level.isBoss) {
      const world = WORLDS[level.world - 1];
      if (world && world.boss && SPRITE_CONFIG[world.boss]) {
        ids.add(world.boss);
      }
    }

    return Array.from(ids);
  }

  /**
   * Load a list of asset IDs with progress callback
   * onProgress(percent 0-100, statusText, currentId)
   */
  async loadManifest(ids, onProgress) {
    this.loading = true;
    this.progress = 0;

    // Filter already cached
    const toLoad = ids.filter(id => !this.cache.has(id) && SPRITE_CONFIG[id]);
    const total = Math.max(toLoad.length, 1);
    let done = 0;

    if (toLoad.length === 0) {
      // Still show a brief load so transition feels intentional
      if (onProgress) onProgress(50, 'Recursos em cache...', '');
      await this._wait(200);
      if (onProgress) onProgress(100, 'Pronto!', '');
      this.loading = false;
      this.progress = 100;
      return;
    }

    // Load in parallel batches of 4
    const batchSize = 4;
    for (let i = 0; i < toLoad.length; i += batchSize) {
      const batch = toLoad.slice(i, i + batchSize);
      await Promise.all(batch.map(async (id) => {
        const label = this._labelFor(id);
        if (onProgress) onProgress(Math.floor((done / total) * 100), label, id);
        await this._loadOne(id);
        done++;
        this.progress = Math.floor((done / total) * 100);
        if (onProgress) onProgress(this.progress, label, id);
      }));
    }

    if (onProgress) onProgress(100, 'Pronto!', '');
    this.loading = false;
    this.progress = 100;
  }

  async _loadOne(id) {
    const cfg = SPRITE_CONFIG[id];
    if (!cfg) return;

    // Try real image
    try {
      const img = await this._loadImage(cfg.path);
      this.cache.set(id, {
        image: img,
        procedural: false,
        cfg,
        width: img.naturalWidth || cfg.frameWidth,
        height: img.naturalHeight || cfg.frameHeight
      });
      return;
    } catch (_) {
      // Fall through to procedural
    }

    // Generate procedural placeholder canvas
    const canvas = this._makePlaceholder(id, cfg);
    this.cache.set(id, {
      image: canvas,
      procedural: true,
      cfg,
      width: cfg.frameWidth || 128,
      height: cfg.frameHeight || 128
    });
  }

  _loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('fail'));
      // Timeout so missing files don't hang
      const t = setTimeout(() => {
        img.onload = img.onerror = null;
        reject(new Error('timeout'));
      }, 800);
      img.onload = () => { clearTimeout(t); resolve(img); };
      img.onerror = () => { clearTimeout(t); reject(new Error('fail')); };
      img.src = src;
    });
  }

  _makePlaceholder(id, cfg) {
    const cacheKey = id + '_ph';
    if (this._placeholderCache.has(cacheKey)) {
      return this._placeholderCache.get(cacheKey);
    }

    const w = cfg.frameWidth || 128;
    const h = cfg.frameHeight || 128;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const ph = cfg.placeholder || { color: '#666', icon: '?', shape: 'box' };

    // Background shape
    ctx.fillStyle = ph.color || '#666';
    const margin = Math.floor(w * 0.08);
    const bw = w - margin * 2;
    const bh = h - margin * 2;

    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 3;

    switch (ph.shape) {
      case 'generator':
        ctx.fillRect(margin + bw * 0.2, margin, bw * 0.6, bh);
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(margin + bw * 0.35, margin + bh * 0.15, bw * 0.3, bh * 0.2);
        break;
      case 'cannon':
        ctx.beginPath();
        ctx.roundRect(margin, margin + bh * 0.2, bw * 0.7, bh * 0.6, 8);
        ctx.fill();
        ctx.fillRect(margin + bw * 0.6, margin + bh * 0.35, bw * 0.4, bh * 0.3);
        break;
      case 'tower':
        ctx.beginPath();
        ctx.roundRect(margin + bw * 0.15, margin, bw * 0.7, bh, 10);
        ctx.fill();
        break;
      case 'coil':
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, bw * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, bw * 0.15 + i * 8, 0, Math.PI * 1.5);
          ctx.stroke();
        }
        break;
      case 'wall':
        ctx.fillRect(margin, margin, bw, bh);
        ctx.fillStyle = '#333';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(margin + bw * 0.25 + i * bw * 0.25, h / 2, bw * 0.12, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 'press':
        ctx.fillRect(margin + bw * 0.1, margin, bw * 0.8, bh * 0.3);
        ctx.fillRect(margin + bw * 0.25, margin + bh * 0.3, bw * 0.5, bh * 0.7);
        break;
      case 'drone':
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, bw * 0.4, bh * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'fan':
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, bw * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(w / 2, h / 2);
          ctx.lineTo(w / 2 + Math.cos(a) * bw * 0.35, h / 2 + Math.sin(a) * bh * 0.35);
          ctx.stroke();
        }
        break;
      case 'box':
        ctx.beginPath();
        ctx.roundRect(margin, margin, bw, bh, 12);
        ctx.fill();
        break;
      case 'creature':
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, bw * 0.4, bh * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'brute':
        ctx.beginPath();
        ctx.roundRect(margin, margin, bw, bh, 16);
        ctx.fill();
        break;
      case 'flyer':
        ctx.beginPath();
        ctx.moveTo(w / 2, margin);
        ctx.lineTo(w - margin, h / 2);
        ctx.lineTo(w / 2, h - margin);
        ctx.lineTo(margin, h / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'swarm':
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(margin + 20 + (i % 3) * 30, margin + 30 + Math.floor(i / 3) * 35, 14, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 'boss':
        ctx.beginPath();
        ctx.roundRect(margin, margin, bw, bh, 20);
        ctx.fill();
        ctx.strokeStyle = '#ff3344';
        ctx.lineWidth = 4;
        ctx.stroke();
        break;
      case 'bg':
        ctx.fillStyle = ph.color || '#0d1219';
        ctx.fillRect(0, 0, w, h);
        // Decorative scrap piles
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        for (let i = 0; i < 12; i++) {
          ctx.fillRect(Math.random() * w, Math.random() * h, 40 + Math.random() * 80, 20 + Math.random() * 40);
        }
        break;
      default:
        ctx.beginPath();
        ctx.roundRect(margin, margin, bw, bh, 8);
        ctx.fill();
    }

    // Icon overlay
    if (ph.icon && ph.type !== 'bg') {
      const fontSize = Math.floor(w * 0.35);
      ctx.font = `${fontSize}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.95;
      ctx.fillText(ph.icon, w / 2, h / 2);
      ctx.globalAlpha = 1;
    }

    // Label strip for identification during development
    if (ph.type !== 'bg') {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, h - 18, w, 18);
      ctx.font = '10px Orbitron, monospace';
      ctx.fillStyle = '#aaa';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(id.slice(0, 16), w / 2, h - 9);
    }

    this._placeholderCache.set(cacheKey, canvas);
    return canvas;
  }

  _labelFor(id) {
    const labels = {
      scrapGenerator: 'Carregando Gerador de Sucata...',
      boltCannon: 'Carregando Canhão Parafuso...',
      dualTower: 'Carregando Torre Dupla...',
      industrialFreezer: 'Carregando Gelador Industrial...',
      teslaCoil: 'Carregando Bobina Tesla...',
      hydraulicPress: 'Carregando Prensa Hidráulica...',
      tireWall: 'Carregando Muro de Pneus...',
      oilLauncher: 'Carregando Lançador de Óleo...',
      magneticTower: 'Carregando Torre Magnética...',
      sentinelDrone: 'Carregando Drone Sentinela...',
      scrapLauncher: 'Carregando Lança-Sucata...',
      microwaveMod: 'Carregando Micro-ondas...',
      industrialFan: 'Carregando Ventilador...',
      overloadedBattery: 'Carregando Bateria...',
      plasmaTower: 'Carregando Torre Plasma...',
      bg_world1: 'Carregando Ferro-Velho...',
      bg_world2: 'Carregando Ferro-Velho Noturno...',
      bg_world3: 'Carregando Deserto Mecânico...',
      bg_world4: 'Carregando Usina Abandonada...',
      bg_world5: 'Carregando Cidadela Riftborn...',
      ironcladColossus: 'Carregando Ironclad Colossus...',
      shadeStalkerPrime: 'Carregando Shade Stalker Prime...',
      duneDevourer: 'Carregando Dune Devourer...',
      corebreaker: 'Carregando Corebreaker...',
      riftbornOverlord: 'Carregando Riftborn Overlord...',
      fx_explosion: 'Carregando efeitos...',
      ui_energy: 'Carregando interface...'
    };
    if (labels[id]) return labels[id];
    if (id.startsWith('vorak')) return `Carregando ${id}...`;
    return `Carregando ${id}...`;
  }

  _wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  /**
   * Draw a sprite (or placeholder) centered at x,y scaled to size
   */
  draw(ctx, id, x, y, size, animState) {
    const asset = this.cache.get(id);
    if (!asset) return false;

    const s = size || 64;
    const half = s * 0.5;

    if (asset.procedural) {
      ctx.drawImage(asset.image, x - half, y - half, s, s);
      return true;
    }

    // Real spritesheet frame
    const cfg = asset.cfg;
    const fw = cfg.frameWidth || s;
    const fh = cfg.frameHeight || s;
    let sx = 0, sy = 0;

    if (animState && cfg.animations && cfg.animations[animState.name]) {
      const anim = cfg.animations[animState.name];
      const frame = Math.floor(animState.time * anim.fps) % anim.frames;
      sx = frame * fw;
      sy = (anim.row || 0) * fh;
    }

    ctx.drawImage(asset.image, sx, sy, fw, fh, x - half, y - half, s, s);
    return true;
  }

  /** Preload core menu assets */
  async loadCore(onProgress) {
    const core = ['ui_energy', 'fx_explosion', 'bg_world1'];
    await this.loadManifest(core, onProgress);
  }
}

const Assets = new AssetManager();
