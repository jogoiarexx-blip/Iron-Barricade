# Iron Barricade v1.13 — Gameplay & Balance Update

Jogo de defesa estratégica em HTML5 com campanha por linhas, máquinas improvisadas e invasores Riftborn.

## Destaques da v1.13

- Sprites Riftborn e chefes renomeados fisicamente para combinar com os IDs atuais do código.
- 47 caminhos de assets validados, sem sprites configurados ausentes.
- Dificuldade salva no `localStorage`.
- Recompensas por dificuldade: Fácil 80%, Normal 100%, Difícil 125%, Pesadelo 160%.
- Energia por kill removida; geradores voltam a ser a principal fonte estratégica de energia.
- Energia inicial rebalanceada para compensar a nova economia.
- Objetivos especiais funcionais:
  - Sem Geradores: bloqueia o Gerador de Sucata.
  - Apenas Torres Básicas: limita o loadout.
  - Energia Limitada: limita energia armazenada e desliga geração ambiente.
  - Conclua em até 3 minutos: meta real de estrela.
- Sistema de estrelas ligado às regras reais da fase.
- Briefing pré-fase mostra ameaças detectadas, inimigo novo e metas de estrelas.
- Aviso `NOVA AMEAÇA` quando um inimigo novo estreia.
- Mundo 1 com ondas curadas manualmente e progressão revisada.
- Fases 1–3: 3 ondas; 4–6: 4 ondas; fase 7 em diante adiciona uma onda por fase.
- Intervalo invisível de 5 segundos antes da primeira onda e entre ondas concluídas.
- Conquistas centralizadas no arquivo `js/achievements.js`.
- Loja de cosméticos agora permite compras com sucata.
- Botões de Desafios e Sobrevivência ocultados enquanto esses modos ainda não estão completos.

## Como jogar

```bash
npx serve .
# ou
python -m http.server 8080
```

Abra no navegador e acesse o endereço local informado. Evite `file://`.

## Controles

| Ação | Input |
|---|---|
| Selecionar máquina | Clique/toque ou teclas 1–8 |
| Posicionar | Clique/toque na célula |
| Remover | Chave inglesa, tecla 0 ou R |
| Pausar | ESC |
| Velocidade | 1x / 2x / 3x ou Espaço |

## Progressão do Mundo 1

1. Scout
2. + Shield
3. + Runner
4. + Brute
5. + Leaper
6. + Technician
7. + Splitter
8. + Commander
9. + Flyer
10. Recapitulação + Ironclad Colossus

## Identidade visual

- Logo: `assets/images/ui/iron-barricade-logo.webp`
- Tela inicial: `assets/images/ui/iron-barricade-title-screen.webp`

## Estrutura

- `data/` — unidades, inimigos, fases, upgrades e sprites
- `js/` — gameplay, ondas, UI, save, áudio e efeitos
- `assets/` — imagens, sprites e áudio
- `css/` — interface, jogo e responsividade


## Novidades da v1.13

- Integração de **sprites gerados de verdade** no jogo (não mais sheets desenhados apenas por canvas para essas unidades).
- Sprites salvos com **fundo transparente** e convertidos para **WebP**.
- Primeira leva integrada: Scrap Generator, Bolt Cannon, Tire Wall, Dual Tower, Industrial Freezer, Tesla Coil, Hydraulic Press, Oil Launcher, Riftborn Scout e Riftborn Shield.
- Restante das imagens do projeto também foi convertido para `.webp` para manter compatibilidade com o pipeline visual.
