import type { Game, Scene } from '../game.js';
import { P, W } from '../palette.js';
import { PAT } from '../render.js';

const LX = [36, 80, 124];

/** Fase 2: trocar de faixa, desviar dos obstáculos e chegar até quem recebe. */
export function runnerScene(g: Game): Scene {
  const words = g.config.occasion === 'cha'
    ? ['DO SONO', 'DO ENJOO', 'DAS FRALDAS', 'DA ANSIEDADE']
    : ['DA SAUDADE', 'DA DISTÂNCIA', 'DA SEGUNDA', 'DO TRÂNSITO', 'DA ROTINA'];
  let lane = 1, px = LX[1], obs: { l: number; y: number; heart: boolean; hit?: boolean }[] = [];
  let spawn = 600, prog = 0, hitT = 0, scroll = 0, wordT = 0, wi = 0, done = false, doneT = 0, meetY = -18, cele = false;
  const move = (d: number) => { const n = Math.max(0, Math.min(2, lane + d)); if (n !== lane) { lane = n; g.sfx.move(); } };
  return {
    skippable: true,
    input(k) {
      if (done) { if ((k === 'a' || k === 'start') && g.t - doneT > 1500) g.completePhase(); return; }
      if (k === 'left') move(-1);
      if (k === 'right') move(1);
    },
    tap(x) { if (done) { this.input!('a'); return; } move(x < px ? -1 : 1); },
    update(dt) {
      scroll = (scroll + dt * 0.09) % 16;
      px += (LX[lane] - px) * Math.min(1, dt / 70);
      if (done) {
        meetY = Math.min(86, meetY + dt * 0.05);
        if (meetY >= 86 && !cele) { cele = true; g.sfx.win(); g.burst(80, 90, [P.pink, P.red, P.yellow, P.white], 40, 2); }
        if (g.t - doneT > 5200) g.completePhase();
        return;
      }
      prog += dt * 0.0042;
      wordT += dt; if (wordT > 3000) { wordT = 0; wi = (wi + 1) % words.length; }
      if (hitT > 0) hitT -= dt;
      spawn -= dt;
      if (spawn <= 0) { spawn = 650 + Math.random() * 450; obs.push({ l: Math.floor(Math.random() * 3), y: 16, heart: Math.random() < 0.28 }); }
      for (const o of obs) {
        o.y += dt * 0.075;
        if (!o.hit && o.y > 100 && o.y < 122 && o.l === lane) {
          o.hit = true;
          if (o.heart) { prog += 4; g.sfx.coin(); g.burst(LX[o.l], 112, [P.pink, P.red]); }
          else { hitT = 600; prog = Math.max(0, prog - 6); g.sfx.hit(); }
        }
      }
      obs = obs.filter((o) => o.y < 154 && !(o.hit && o.heart));
      if (prog >= 100) { prog = 100; done = true; doneT = g.t; obs = []; }
    },
    draw() {
      const { r, t, config } = g;
      r.rect(P.green, 0, 0, W, 144); r.rect(P.dgray, 14, 0, 132, 144);
      for (let y = -16; y < 144; y += 16) { r.rect(P.lgray, 57, y + scroll, 2, 8); r.rect(P.lgray, 101, y + scroll, 2, 8); }
      for (let y = -24; y < 144; y += 32) { const yy = y + ((scroll * 2) % 32); r.pat(['0110', '1111', '1111', '0110'], 2, yy, '#00b35f', 2); r.pat(['0110', '1111', '1111', '0110'], 150, yy + 16, '#00b35f', 2); }
      for (const o of obs) {
        if (o.hit) continue;
        if (o.heart) r.pat(PAT.heart, LX[o.l] - 7, o.y, P.red, 2);
        else { r.pat(PAT.cloud, LX[o.l] - 10, o.y, '#a99fbd', 2); r.rect(P.blue, LX[o.l] - 6, o.y + 9, 1, 3); r.rect(P.blue, LX[o.l], o.y + 10, 1, 3); r.rect(P.blue, LX[o.l] + 5, o.y + 9, 1, 3); }
      }
      r.rect(P.night, 0, 0, W, 16); r.rect('#3b3546', 8, 6, 144, 5); r.rect(P.pink, 8, 6, Math.round(144 * prog / 100), 5);
      g.avatar('g', 2 + Math.round(140 * prog / 100), 1, 12); g.avatar('r', 146, 1, 12);
      if (!done) {
        r.shadow('DESVIE ' + words[wi], 80, 22, P.white, 'center');
        if (!(hitT > 0 && Math.floor(t / 80) % 2)) g.avatar('g', px - 8, 108, 16);
      } else {
        g.avatar('g', 64, 96, 16); g.avatar('r', 80, meetY + 10, 16);
        if (meetY >= 86) {
          r.pat(PAT.heart, 74, 78 + Math.round(Math.sin(t / 150) * 2), P.red, 2);
          r.dim(0.8, 26, 34);
          r.shadow('VOCÊ CHEGOU ATÉ', 80, 32, P.white, 'center');
          r.shadow(config.receiver.name.toUpperCase().slice(0, 14) + '!', 80, 46, P.yellow, 'center');
        }
      }
    },
  };
}
