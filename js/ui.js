/**
 * IRON BARRICADE - UI Manager
 */

class UIManager {
  constructor() {
    this.overlay = document.getElementById('ui-overlay');
    this.currentScreen = null;
    this.selectedUnits = [];
    this.maxUnits = 8;
  }

  clear() {
    this.overlay.innerHTML = '';
    this.currentScreen = null;
  }

  showLoading(title, subtitle) {
    this.clear();
    document.getElementById('hud')?.classList.add('hidden');
    const el = document.createElement('div');
    el.id = 'loading-screen';
    el.innerHTML = `
      <div class="loading-brand-wrap">
        <img class="brand-logo loading-brand" src="assets/images/ui/iron-barricade-logo.png" alt="Iron Barricade">
      </div>
      <div id="loading-logo">${title || 'IRON'}</div>
      <div id="loading-subtitle">${subtitle || 'BARRICADE'}</div>
      <div id="loading-bar-container"><div id="loading-bar"></div></div>
      <div id="loading-percent">0%</div>
      <div id="loading-tip">Preparando recursos da fase...</div>
      <div id="loading-status"></div>
      <div id="loading-detail" style="margin-top:12px;font-size:0.75rem;color:var(--text-dim);opacity:0.6"></div>
    `;
    this.overlay.appendChild(el);
    this.currentScreen = 'loading';
  }

  updateLoading(pct, tip, status, detail) {
    const bar = document.getElementById('loading-bar');
    const percent = document.getElementById('loading-percent');
    const tipEl = document.getElementById('loading-tip');
    const statusEl = document.getElementById('loading-status');
    const detailEl = document.getElementById('loading-detail');
    if (bar) bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    if (percent) percent.textContent = Math.floor(pct) + '%';
    if (tip && tipEl) tipEl.textContent = tip;
    if (status !== undefined && statusEl) statusEl.textContent = status;
    if (detail !== undefined && detailEl) detailEl.textContent = detail;
  }

  /**
   * Loading screen between phases — loads sprites for the level
   */
  async showPhaseLoading(levelId, selectedUnits) {
    const level = getLevel(levelId);
    const world = WORLDS[(level?.world || 1) - 1];
    const tips = [
      'Geradores de energia são fracos, mas essenciais.',
      'Use muros de pneus para proteger unidades frágeis.',
      'Inimigos voadores ignoram defesas terrestres.',
      'A Bobina Tesla é excelente contra grupos.',
      'Cada linha tem um Compactador de Emergência.',
      'Observe o tipo de inimigo antes de posicionar.',
      'Congelar inimigos dá tempo para concentrar fogo.'
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];

    this.showLoading(
      level?.isBoss ? '⚠ CHEFE' : (level?.name || 'FASE'),
      world?.name || 'Carregando'
    );
    this.updateLoading(0, tip, 'Montando lista de recursos...');

    const manifest = Assets.getLevelManifest(levelId, selectedUnits);
    const totalAssets = manifest.length;

    await Assets.loadManifest(manifest, (pct, status, id) => {
      this.updateLoading(
        pct,
        tip,
        status || 'Carregando...',
        id ? `${Math.min(manifest.indexOf(id) + 1, totalAssets)}/${totalAssets}  •  ${id}` : ''
      );
    });

    this.updateLoading(100, tip, 'Pronto!', `${totalAssets} recursos`);
    await new Promise(r => setTimeout(r, 280));
  }

  showMainMenu() {
    this.clear();
    document.getElementById('hud').classList.add('hidden');
    const el = document.createElement('div');
    el.id = 'main-menu';
    el.innerHTML = `
      <div class="logo-container">
        <img class="brand-logo menu-brand" src="assets/images/ui/iron-barricade-logo.png" alt="Iron Barricade">
        <div class="logo-subtitle">SCRAP FORTRESS DEFENSE</div>
      </div>
      <div class="menu-buttons">
        <button class="menu-btn primary" data-action="play">JOGAR</button>
        <button class="menu-btn" data-action="continue">CONTINUAR</button>
        <button class="menu-btn" data-action="workshop">OFICINA</button>
        <button class="menu-btn" data-action="collection">COLEÇÃO</button>
        <button class="menu-btn" data-action="achievements">CONQUISTAS</button>
        <button class="menu-btn" data-action="stats">ESTATÍSTICAS</button>
        <button class="menu-btn" data-action="settings">CONFIGURAÇÕES</button>
        <button class="menu-btn" data-action="credits">CRÉDITOS</button>
      </div>
      <div class="menu-footer">v1.3 • Iron Barricade</div>
    `;
    this.overlay.appendChild(el);
    this.currentScreen = 'main';
    this.bindMenuActions(el);
  }

  showPlayMenu() {
    this.clear();
    const el = document.createElement('div');
    el.id = 'main-menu';
    el.innerHTML = `
      <div class="menu-panel">
        <h2>JOGAR</h2>
        <button class="menu-btn primary" data-action="newgame">NOVO JOGO</button>
        <button class="menu-btn" data-action="continue">CONTINUAR CAMPANHA</button>
        <button class="menu-btn" data-action="selectlevel">SELECIONAR FASE</button>
        <button class="menu-btn" data-action="challenges">DESAFIOS</button>
        <button class="menu-btn" data-action="survival">MODO SOBREVIVÊNCIA</button>
        <button class="menu-btn" data-action="back">VOLTAR</button>
      </div>
    `;
    this.overlay.appendChild(el);
    this.bindMenuActions(el);
  }

  showDifficultySelect(callback) {
    this.clear();
    const el = document.createElement('div');
    el.id = 'main-menu';
    el.innerHTML = `
      <div class="menu-panel">
        <h2>DIFICULDADE</h2>
        <div class="difficulty-grid">
          <button class="difficulty-btn" data-diff="easy">
            FÁCIL
            <div class="diff-desc">Inimigos mais fracos, mais energia</div>
          </button>
          <button class="difficulty-btn selected" data-diff="normal">
            NORMAL
            <div class="diff-desc">Experiência equilibrada</div>
          </button>
          <button class="difficulty-btn" data-diff="hard">
            DIFÍCIL
            <div class="diff-desc">Mais inimigos, menos recursos</div>
          </button>
          <button class="difficulty-btn" data-diff="nightmare">
            PESADELO
            <div class="diff-desc">Para os verdadeiros inventores</div>
          </button>
        </div>
        <button class="menu-btn primary" data-action="confirm-diff">CONFIRMAR</button>
        <button class="menu-btn" data-action="back">VOLTAR</button>
      </div>
    `;
    this.overlay.appendChild(el);
    let selected = 'normal';
    el.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selected = btn.dataset.diff;
        Audio.playSfx('click');
      });
    });
    el.querySelector('[data-action="confirm-diff"]').addEventListener('click', () => {
      Audio.playSfx('click');
      callback(selected);
    });
    el.querySelector('[data-action="back"]').addEventListener('click', () => {
      Audio.playSfx('click');
      this.showPlayMenu();
    });
  }

  showWorldMap() {
    this.clear();
    document.getElementById('hud').classList.add('hidden');
    const el = document.createElement('div');
    el.id = 'world-map';
    
    const world = WORLDS[Save.data.campaign.currentWorld - 1] || WORLDS[0];
    el.innerHTML = `
      <div class="world-header">
        <button class="menu-btn" data-action="back" style="min-width:auto;padding:8px 16px;">← Menu</button>
        <h2>${world.name}</h2>
        <div class="world-nav">
          <button id="prev-world" ${world.id <= 1 ? 'disabled' : ''}>◀</button>
          <span style="font-family:Orbitron;color:var(--text-dim)">Mundo ${world.id}/5</span>
          <button id="next-world" ${world.id >= 5 ? 'disabled' : ''}>▶</button>
        </div>
      </div>
      <div id="map-canvas-container">
        <div id="level-nodes" style="position:relative;width:100%;height:100%;padding:40px;"></div>
      </div>
    `;
    this.overlay.appendChild(el);
    
    const container = el.querySelector('#level-nodes');
    const levels = getWorldLevels(world.id);
    
    levels.forEach((lvl, idx) => {
      const node = document.createElement('div');
      const unlocked = Save.isLevelUnlocked(lvl.id);
      const stars = Save.getStars(lvl.id);
      const completed = Save.data.campaign.completed.includes(lvl.id);
      
      node.className = `level-node ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''} ${lvl.isBoss ? 'boss' : ''}`;
      node.textContent = lvl.isBoss ? 'BOSS' : `${lvl.world}-${lvl.index}`;
      node.style.left = `${15 + (idx % 5) * 18}%`;
      node.style.top = `${20 + Math.floor(idx / 5) * 40}%`;
      
      if (stars > 0) {
        const starEl = document.createElement('div');
        starEl.className = 'level-stars';
        starEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
        node.appendChild(starEl);
      }
      
      if (unlocked) {
        node.addEventListener('click', () => {
          Audio.playSfx('click');
          Game.selectLevel(lvl.id);
        });
      }
      container.appendChild(node);
    });

    el.querySelector('[data-action="back"]').addEventListener('click', () => {
      Audio.playSfx('click');
      this.showMainMenu();
    });
    
    el.querySelector('#prev-world')?.addEventListener('click', () => {
      if (Save.data.campaign.currentWorld > 1) {
        Save.data.campaign.currentWorld--;
        this.showWorldMap();
      }
    });
    el.querySelector('#next-world')?.addEventListener('click', () => {
      if (Save.data.campaign.currentWorld < 5) {
        Save.data.campaign.currentWorld++;
        this.showWorldMap();
      }
    });
    
    this.currentScreen = 'map';
  }

  showPreLevel(levelId) {
    this.clear();
    const level = getLevel(levelId);
    if (!level) return;
    
    this.selectedUnits = [];
    // Auto-select first unlocked up to max
    const unlocked = Save.data.defenders.unlocked;
    this.selectedUnits = unlocked.slice(0, this.maxUnits);

    const el = document.createElement('div');
    el.id = 'prelevel-screen';
    el.innerHTML = `
      <div class="prelevel-header">
        <h2>${level.name}</h2>
        <p>Selecione até ${this.maxUnits} máquinas para esta missão</p>
        ${level.specialObjective ? `<p style="color:var(--accent)">Objetivo especial: ${level.specialObjective.desc}</p>` : ''}
      </div>
      <div class="unit-select-grid" id="unit-grid"></div>
      <div class="selected-count">Selecionadas: <span id="sel-count">${this.selectedUnits.length}</span>/${this.maxUnits}</div>
      <div class="prelevel-actions">
        <button class="menu-btn" data-action="back">VOLTAR</button>
        <button class="menu-btn primary" data-action="start">INICIAR MISSÃO</button>
      </div>
    `;
    this.overlay.appendChild(el);

    const grid = el.querySelector('#unit-grid');
    getAllDefenders().forEach(d => {
      const unlocked = Save.data.defenders.unlocked.includes(d.id);
      const selected = this.selectedUnits.includes(d.id);
      const card = document.createElement('div');
      card.className = `unit-card ${unlocked ? '' : 'locked'} ${selected ? 'selected' : ''}`;
      card.dataset.id = d.id;
      card.innerHTML = `
        <div class="unit-icon">${d.icon}</div>
        <div class="unit-name">${d.name}</div>
        <div class="unit-cost">⚡ ${d.cost}</div>
      `;
      if (unlocked) {
        card.addEventListener('click', () => {
          Audio.playSfx('click');
          const idx = this.selectedUnits.indexOf(d.id);
          if (idx >= 0) {
            this.selectedUnits.splice(idx, 1);
            card.classList.remove('selected');
          } else if (this.selectedUnits.length < this.maxUnits) {
            this.selectedUnits.push(d.id);
            card.classList.add('selected');
          }
          document.getElementById('sel-count').textContent = this.selectedUnits.length;
        });
      }
      grid.appendChild(card);
    });

    el.querySelector('[data-action="back"]').addEventListener('click', () => {
      Audio.playSfx('click');
      this.showWorldMap();
    });
    el.querySelector('[data-action="start"]').addEventListener('click', () => {
      if (this.selectedUnits.length === 0) return;
      Audio.playSfx('click');
      Game.startLevel(levelId, this.selectedUnits);
    });
  }

  showVictory(stats) {
    const el = document.createElement('div');
    el.className = 'result-screen';
    el.innerHTML = `
      <div class="result-panel victory">
        <h1>MISSÃO CONCLUÍDA</h1>
        <div class="stars-display">${'★'.repeat(stats.stars)}${'☆'.repeat(3 - stats.stars)}</div>
        <div class="result-stats">
          <div>Pontuação: <strong>${stats.score}</strong></div>
          <div>Sucata: <strong>+${stats.scrap}</strong></div>
          <div>Inimigos derrotados: <strong>${stats.kills}</strong></div>
          ${stats.unlocks.length ? `<div style="color:var(--energy)">Novas máquinas desbloqueadas!</div>` : ''}
        </div>
        <button class="menu-btn primary" data-action="next">PRÓXIMA FASE</button>
        <button class="menu-btn" data-action="retry">REPETIR</button>
        <button class="menu-btn" data-action="map">MAPA</button>
        <button class="menu-btn" data-action="menu">MENU</button>
      </div>
    `;
    this.overlay.appendChild(el);
    Audio.playSfx('victory');
    
    el.querySelector('[data-action="next"]').addEventListener('click', () => {
      const [w, l] = stats.levelId.split('-').map(Number);
      const next = l < 10 ? `${w}-${l+1}` : (w < 5 ? `${w+1}-1` : null);
      if (next && Save.isLevelUnlocked(next)) {
        Game.selectLevel(next);
      } else {
        this.showWorldMap();
      }
    });
    el.querySelector('[data-action="retry"]').addEventListener('click', () => Game.selectLevel(stats.levelId));
    el.querySelector('[data-action="map"]').addEventListener('click', () => this.showWorldMap());
    el.querySelector('[data-action="menu"]').addEventListener('click', () => this.showMainMenu());
  }

  showDefeat(stats) {
    const el = document.createElement('div');
    el.className = 'result-screen';
    el.innerHTML = `
      <div class="result-panel defeat">
        <h1>BASE INVADIDA</h1>
        <div class="result-stats">
          <div>Inimigos derrotados: <strong>${stats.kills}</strong></div>
          <div>Onda alcançada: <strong>${stats.wave}</strong></div>
        </div>
        <button class="menu-btn primary" data-action="retry">TENTAR NOVAMENTE</button>
        <button class="menu-btn" data-action="equip">MUDAR EQUIPAMENTOS</button>
        <button class="menu-btn" data-action="map">MAPA</button>
        <button class="menu-btn" data-action="menu">MENU PRINCIPAL</button>
      </div>
    `;
    this.overlay.appendChild(el);
    Audio.playSfx('defeat');
    
    el.querySelector('[data-action="retry"]').addEventListener('click', () => Game.restartLevel());
    el.querySelector('[data-action="equip"]').addEventListener('click', () => Game.selectLevel(stats.levelId));
    el.querySelector('[data-action="map"]').addEventListener('click', () => this.showWorldMap());
    el.querySelector('[data-action="menu"]').addEventListener('click', () => this.showMainMenu());
  }

  showWorkshop() {
    this.clear();
    const el = document.createElement('div');
    el.className = 'screen-full';
    el.innerHTML = `
      <div class="screen-header">
        <button class="menu-btn" data-action="back" style="min-width:auto;padding:8px 16px;">← Voltar</button>
        <h2>OFICINA CENTRAL</h2>
        <div style="font-family:Orbitron;color:var(--scrap)">🔩 ${Save.data.resources.scrap}</div>
      </div>
      <div class="screen-content" id="workshop-list"></div>
    `;
    this.overlay.appendChild(el);
    
    const list = el.querySelector('#workshop-list');
    Save.data.defenders.unlocked.forEach(id => {
      const d = getDefenderData(id);
      if (!d) return;
      const level = Save.getDefenderLevel(id);
      const tree = getUpgradeTree(id);
      const next = tree[level];
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--bg-panel);border:2px solid var(--border);border-radius:8px;padding:16px;margin-bottom:12px;display:flex;align-items:center;gap:16px;';
      card.innerHTML = `
        <div style="font-size:2.5rem">${d.icon}</div>
        <div style="flex:1">
          <div style="font-family:Orbitron;color:var(--accent)">${d.name}</div>
          <div style="color:var(--text-dim);font-size:0.85rem">Nível ${level}/5</div>
          <div style="color:var(--text-dim);font-size:0.8rem;margin-top:4px">${next ? next.desc : 'Máximo alcançado'}</div>
        </div>
        <button class="menu-btn" style="min-width:120px;padding:10px" ${!next || Save.data.resources.scrap < next.cost ? 'disabled' : ''} data-id="${id}">
          ${next ? `🔩 ${next.cost}` : 'MAX'}
        </button>
      `;
      const btn = card.querySelector('button');
      if (next && Save.data.resources.scrap >= next.cost) {
        btn.addEventListener('click', () => {
          if (Save.upgradeDefender(id)) {
            Audio.playSfx('place');
            this.showWorkshop();
          }
        });
      }
      list.appendChild(card);
    });

    el.querySelector('[data-action="back"]').addEventListener('click', () => {
      Audio.playSfx('click');
      this.showMainMenu();
    });
  }

  showSettings(fromPause = false) {
    this.clear();
    const s = Save.data.settings;
    const el = document.createElement('div');
    el.id = 'main-menu';
    el.innerHTML = `
      <div class="menu-panel" style="text-align:left;max-width:420px">
        <h2 style="text-align:center">CONFIGURAÇÕES</h2>
        <label style="display:block;margin:12px 0">Volume Geral <input type="range" id="vol-master" min="0" max="1" step="0.05" value="${s.masterVolume}" style="width:100%"></label>
        <label style="display:block;margin:12px 0">Música <input type="range" id="vol-music" min="0" max="1" step="0.05" value="${s.musicVolume}" style="width:100%"></label>
        <label style="display:block;margin:12px 0">Efeitos <input type="range" id="vol-sfx" min="0" max="1" step="0.05" value="${s.sfxVolume}" style="width:100%"></label>
        <label style="display:flex;align-items:center;gap:8px;margin:12px 0"><input type="checkbox" id="set-particles" ${s.particles ? 'checked' : ''}> Partículas</label>
        <label style="display:flex;align-items:center;gap:8px;margin:12px 0"><input type="checkbox" id="set-dmgnum" ${s.damageNumbers ? 'checked' : ''}> Números de dano</label>
        <button class="menu-btn" data-action="reset" style="margin-top:20px;border-color:var(--danger);color:var(--danger)">APAGAR PROGRESSO</button>
        <button class="menu-btn" data-action="back" style="margin-top:8px">VOLTAR</button>
      </div>
    `;
    this.overlay.appendChild(el);

    const apply = () => {
      Save.data.settings.masterVolume = parseFloat(document.getElementById('vol-master').value);
      Save.data.settings.musicVolume = parseFloat(document.getElementById('vol-music').value);
      Save.data.settings.sfxVolume = parseFloat(document.getElementById('vol-sfx').value);
      Save.data.settings.particles = document.getElementById('set-particles').checked;
      Save.data.settings.damageNumbers = document.getElementById('set-dmgnum').checked;
      Audio.applySettings();
      Particles.setEnabled(Save.data.settings.particles);
      Save.autoSave();
    };
    el.querySelectorAll('input').forEach(i => i.addEventListener('change', apply));
    el.querySelector('[data-action="back"]').addEventListener('click', () => {
      apply();
      if (fromPause && Game.running) {
        this.clear();
        document.getElementById('pause-menu').classList.remove('hidden');
      } else {
        this.showMainMenu();
      }
    });
    el.querySelector('[data-action="reset"]').addEventListener('click', () => {
      if (confirm('Tem certeza? Isso apagará TODO o progresso.') && confirm('Última confirmação: apagar tudo?')) {
        Save.reset();
        this.showMainMenu();
      }
    });
  }

  showCredits() {
    this.clear();
    const el = document.createElement('div');
    el.id = 'main-menu';
    el.innerHTML = `
      <div class="menu-panel">
        <h2>CRÉDITOS</h2>
        <p style="line-height:2;color:var(--text-dim)">
          <strong style="color:var(--accent)">IRON BARRICADE</strong><br>
          Um jogo original de defesa por linhas<br><br>
          Design & Código: Iron Barricade Team<br>
          Universo: Iron Barricade<br>
          Inimigos: Os Riftborn<br><br>
          Feito com HTML5, Canvas & muito café
        </p>
        <button class="menu-btn" data-action="back">VOLTAR</button>
      </div>
    `;
    this.overlay.appendChild(el);
    el.querySelector('[data-action="back"]').addEventListener('click', () => this.showMainMenu());
  }

  showStats() {
    this.clear();
    const st = Save.data.statistics;
    const el = document.createElement('div');
    el.id = 'main-menu';
    el.innerHTML = `
      <div class="menu-panel" style="text-align:left">
        <h2 style="text-align:center">ESTATÍSTICAS</h2>
        <div style="line-height:2;color:var(--text-dim)">
          Inimigos derrotados: <strong style="color:var(--text)">${st.enemiesDefeated}</strong><br>
          Fases concluídas: <strong style="color:var(--text)">${st.levelsCompleted}</strong><br>
          Máquinas construídas: <strong style="color:var(--text)">${st.machinesBuilt}</strong><br>
          Sucata coletada: <strong style="color:var(--text)">${st.scrapCollected}</strong><br>
          Energia produzida: <strong style="color:var(--text)">${st.energyProduced}</strong><br>
          Chefes derrotados: <strong style="color:var(--text)">${st.bossesDefeated}</strong><br>
          Compactadores usados: <strong style="color:var(--text)">${st.compactorsUsed}</strong>
        </div>
        <button class="menu-btn" data-action="back" style="margin-top:20px">VOLTAR</button>
      </div>
    `;
    this.overlay.appendChild(el);
    el.querySelector('[data-action="back"]').addEventListener('click', () => this.showMainMenu());
  }

  showAchievements() {
    this.clear();
    const achievements = [
      { id: 'first_contact', name: 'Primeiro Contato', desc: 'Derrote seu primeiro Riftborn' },
      { id: 'scrapyard_safe', name: 'Ferro-Velho Seguro', desc: 'Complete o Mundo 1' },
      { id: 'scrap_master', name: 'Mestre da Sucata', desc: 'Colete 10.000 sucatas' },
      { id: 'no_scratches', name: 'Sem Arranhões', desc: 'Complete uma fase sem usar compactadores' },
      { id: 'engineer', name: 'Engenheiro', desc: 'Melhore uma máquina ao nível máximo' },
      { id: 'survivor', name: 'Sobrevivente', desc: 'Sobreviva 10 ondas no modo sobrevivência' },
      { id: 'boss_slayer', name: 'Caçador de Chefes', desc: 'Derrote 3 chefes' },
      { id: 'builder', name: 'Construtor', desc: 'Construa 100 máquinas' }
    ];
    const el = document.createElement('div');
    el.className = 'screen-full';
    el.innerHTML = `
      <div class="screen-header">
        <button class="menu-btn" data-action="back" style="min-width:auto;padding:8px 16px;">← Voltar</button>
        <h2>CONQUISTAS</h2>
        <div></div>
      </div>
      <div class="screen-content" id="ach-list"></div>
    `;
    this.overlay.appendChild(el);
    const list = el.querySelector('#ach-list');
    achievements.forEach(a => {
      const unlocked = Save.data.achievements.unlocked.includes(a.id);
      const card = document.createElement('div');
      card.style.cssText = `background:var(--bg-panel);border:2px solid ${unlocked ? 'var(--success)' : 'var(--border)'};border-radius:8px;padding:14px;margin-bottom:10px;opacity:${unlocked ? 1 : 0.5}`;
      card.innerHTML = `<div style="font-family:Orbitron;color:${unlocked ? 'var(--success)' : 'var(--text-dim)'}">${unlocked ? '✓ ' : ''}${a.name}</div>
        <div style="color:var(--text-dim);font-size:0.85rem">${a.desc}</div>`;
      list.appendChild(card);
    });
    el.querySelector('[data-action="back"]').addEventListener('click', () => this.showMainMenu());
  }

  showCollection() {
    this.clear();
    const el = document.createElement('div');
    el.className = 'screen-full';
    el.innerHTML = `
      <div class="screen-header">
        <button class="menu-btn" data-action="back" style="min-width:auto;padding:8px 16px;">← Voltar</button>
        <h2>ARQUIVO DA BASE</h2>
        <div></div>
      </div>
      <div class="screen-content">
        <h3 style="color:var(--accent);margin-bottom:12px">MÁQUINAS</h3>
        <div id="col-defenders" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:24px"></div>
        <h3 style="color:var(--danger);margin-bottom:12px">INIMIGOS</h3>
        <div id="col-enemies" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px"></div>
      </div>
    `;
    this.overlay.appendChild(el);
    
    const defGrid = el.querySelector('#col-defenders');
    getAllDefenders().forEach(d => {
      const unlocked = Save.data.defenders.unlocked.includes(d.id);
      const card = document.createElement('div');
      card.style.cssText = `background:var(--bg-panel);border:2px solid var(--border);border-radius:8px;padding:12px;text-align:center;opacity:${unlocked ? 1 : 0.35}`;
      card.innerHTML = `<div style="font-size:2rem">${unlocked ? d.icon : '?'}</div>
        <div style="font-family:Orbitron;font-size:0.7rem;margin-top:4px">${unlocked ? d.name : '???'}</div>`;
      defGrid.appendChild(card);
    });

    const enGrid = el.querySelector('#col-enemies');
    Object.values(ENEMIES_DATA).slice(0, 12).forEach(e => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--bg-panel);border:2px solid var(--border);border-radius:8px;padding:12px;text-align:center';
      card.innerHTML = `<div style="font-size:2rem">${e.icon}</div>
        <div style="font-family:Orbitron;font-size:0.7rem;margin-top:4px">${e.name}</div>`;
      enGrid.appendChild(card);
    });

    el.querySelector('[data-action="back"]').addEventListener('click', () => this.showMainMenu());
  }

  bindMenuActions(el) {
    el.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        Audio.playSfx('click');
        Audio.resume();
        const action = btn.dataset.action;
        switch (action) {
          case 'play': this.showPlayMenu(); break;
          case 'continue': 
            if (Save.data.campaign.unlockedLevels.length > 1) this.showWorldMap();
            else this.showPlayMenu();
            break;
          case 'newgame': 
            this.showDifficultySelect(diff => {
              Game.difficulty = diff;
              this.showWorldMap();
            });
            break;
          case 'selectlevel': this.showWorldMap(); break;
          case 'workshop': this.showWorkshop(); break;
          case 'collection': this.showCollection(); break;
          case 'achievements': this.showAchievements(); break;
          case 'stats': this.showStats(); break;
          case 'settings': this.showSettings(); break;
          case 'credits': this.showCredits(); break;
          case 'back': this.showMainMenu(); break;
          case 'challenges': alert('Desafios em breve!'); break;
          case 'survival': alert('Modo Sobrevivência desbloqueado após avançar na campanha!'); break;
        }
      });
    });
  }

  updateHUD(game) {
    // Cache DOM nodes
    if (!this._hudCache) {
      this._hudCache = {
        energy: document.getElementById('energy-count'),
        scrap: document.getElementById('scrap-count'),
        waveLabel: document.getElementById('wave-label'),
        waveFill: document.getElementById('wave-fill'),
        cards: null
      };
    }
    const h = this._hudCache;
    if (h.energy) h.energy.textContent = Math.floor(game.energy);
    if (h.scrap) h.scrap.textContent = Save.data.resources.scrap;
    if (h.waveLabel) h.waveLabel.textContent = game.waves.getLabel();
    if (h.waveFill) h.waveFill.style.width = (game.waves.getProgress() * 100) + '%';
    
    // Cards — use cached list rebuilt in buildDefenderCards
    const cards = h.cards;
    if (!cards) return;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const id = card.id;
      if (id === 'wrench') continue;
      const cd = game.cardCooldowns[id] || 0;
      const overlay = card.overlay;
      const text = card.text;
      if (cd > 0) {
        if (!card.el.classList.contains('disabled')) card.el.classList.add('disabled');
        if (overlay) overlay.style.height = ((cd / 3000) * 100) + '%';
        if (text) text.textContent = ((cd / 1000) | 0) + 1;
      } else {
        const data = getDefenderData(id);
        const noEnergy = data && game.energy < data.cost;
        if (noEnergy) {
          if (!card.el.classList.contains('disabled')) card.el.classList.add('disabled');
        } else {
          card.el.classList.remove('disabled');
        }
        if (overlay) overlay.style.height = '0%';
        if (text) text.textContent = '';
      }
    }
  }

  buildDefenderCards(selectedIds) {
    const container = document.getElementById('defender-cards');
    container.innerHTML = '';
    const cache = [];
    selectedIds.forEach(id => {
      const d = getDefenderData(id);
      if (!d) return;
      const card = document.createElement('div');
      card.className = 'defender-card';
      card.dataset.id = id;
      card.innerHTML = `
        <div class="card-icon">${d.icon}</div>
        <div class="card-cost">⚡${d.cost}</div>
        <div class="card-name">${d.name.split(' ')[0]}</div>
        <div class="cooldown-overlay"></div>
        <div class="cooldown-text"></div>
      `;
      card.addEventListener('click', () => Game.selectCard(id));
      container.appendChild(card);
      cache.push({
        id,
        el: card,
        overlay: card.querySelector('.cooldown-overlay'),
        text: card.querySelector('.cooldown-text')
      });
    });
    
    // Wrench tool
    const wrench = document.createElement('div');
    wrench.className = 'defender-card';
    wrench.dataset.id = 'wrench';
    wrench.innerHTML = `<div class="card-icon">🔧</div><div class="card-name">Remover</div>`;
    wrench.addEventListener('click', () => Game.selectCard('wrench'));
    container.appendChild(wrench);
    cache.push({ id: 'wrench', el: wrench, overlay: null, text: null });

    if (!this._hudCache) this._hudCache = {};
    this._hudCache.cards = cache;
  }

  showDialog(name, text, portrait = '🔧') {
    const box = document.getElementById('dialog-box');
    document.getElementById('dialog-name').textContent = name;
    document.getElementById('dialog-text').textContent = text;
    document.getElementById('dialog-portrait').textContent = portrait;
    box.classList.remove('hidden');
    return new Promise(resolve => {
      const next = document.getElementById('dialog-next');
      const handler = () => {
        box.classList.add('hidden');
        next.removeEventListener('click', handler);
        resolve();
      };
      next.addEventListener('click', handler);
    });
  }
}

const UI = new UIManager();
