import type { Game, Scene } from '../game.js';
import { P, W } from '../palette.js';
import { PAT } from '../render.js';

/** Fim da prévia no editor: o resto do jogo fica como surpresa até a compra. */
export function previewEndScene(g: Game): Scene {
  return {
    enter() { g.sfx.reveal(); },
    draw() {
      const { r, t } = g;
      r.rect(P.night, 0, 0, W, 144);
      g.stars8();
      r.pat(PAT.heart, 73, 20 + Math.round(Math.sin(t / 200) * 2), P.red, 2);
      r.shadow('FIM DA PRÉVIA', 80, 44, P.yellow, 'center');
      r.text('AS OUTRAS FASES', 80, 66, P.white, 'center');
      r.text('E O FINAL FICAM', 80, 78, P.white, 'center');
      r.text('DE SURPRESA', 80, 90, P.white, 'center');
      if (Math.floor(t / 500) % 2 === 0) r.text('A: JOGAR DE NOVO', 80, 122, P.pink, 'center');
    },
    input(k) { if (k === 'a' || k === 'start') { g.sfx.select(); g.restart(); } },
  };
}
