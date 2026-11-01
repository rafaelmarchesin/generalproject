import type { Game, Scene } from '../game.js';
import { P, W } from '../palette.js';
import { PAT } from '../render.js';

export function titleScene(g: Game): Scene {
  return {
    draw() {
      const { r, t, config } = g;
      r.rect(P.night, 0, 0, W, 144);
      g.stars8();
      r.shadow(g.preset.title, 80, 12, P.peach, 'center');
      r.shadow(config.occasion === 'cha' ? 'PARA A' : 'UM JOGO PARA', 80, 28, P.lav, 'center');
      r.shadow(config.receiver.name.toUpperCase().slice(0, 10), 80, 42, P.yellow, 'center', true);
      const bob = Math.round(Math.sin(t / 250) * 2);
      g.avatar('g', 30, 70 + bob, 32);
      g.avatar('r', 98, 70 - bob, 32);
      r.pat(PAT.heart, 73, 80 + Math.round(Math.sin(t / 180) * 3), P.red, 2);
      if (Math.floor(t / 500) % 2 === 0) r.shadow('PRESS START', 80, 118, P.white, 'center');
      r.text('DE: ' + config.giver.name.toUpperCase().slice(0, 14), 80, 132, P.lav, 'center');
    },
    input(k) { if (k === 'start' || k === 'a') { g.sfx.select(); g.nextStage(); } },
  };
}
