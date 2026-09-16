# Iron Barricade

Jogo completo de defesa estratégica em HTML5 — universo original (ferro-velho tecnológico vs. invasão Riftborn).

## Como jogar

```bash
npx serve .
# ou: python -m http.server 8080
```

Abra no navegador. **Não use `file://`**.

### Controles

| Ação | Input |
|------|--------|
| Selecionar máquina | Clique/toque na carta **ou** teclas **1–8** |
| Posicionar | Clique/toque na célula da grade |
| Remover (chave inglesa) | Carta 🔧 **ou** tecla **0** / **R** |
| Pausar | **ESC** |
| Velocidade | Botões 1x/2x/3x **ou** **Espaço** |

### Recursos

- **Energia** — constrói máquinas (passiva a cada 5s + geradores + kills)
- **Sucata** — moeda permanente (oficina / upgrades)

## Estrutura

```
index.html
css/          main, menu, game, responsive
js/           game, grid, defenders, enemies, projectiles, waves,
              assets, ui, audio, particles, effects, save...
data/         defenders, enemies, levels, upgrades, sprites
assets/       sprites, backgrounds, audio (placeholders prontos)
```

## Progressão

- 5 mundos × 10 fases + chefes (55 fases)
- 15 máquinas · 20+ inimigos · 5 chefes
- Oficina (5 níveis/unidade) · conquistas · coleção · save localStorage
- Loading real de sprites **entre fases** (cache + fallback procedural)

## Arte / áudio

Coloque WebP em `assets/images/sprites/...` conforme `data/sprites.js`.  
Sem arquivos, o jogo gera placeholders e não quebra.

## Versão

1.3 — identidade animada, IDs Riftborn padronizados e novo sistema de ondas com intervalo oculto fixo de 5 segundos.


## Identidade visual
- Logo oficial: `assets/images/ui/iron-barricade-logo.png`
- Tela inicial: `assets/images/ui/iron-barricade-title-screen.png`
