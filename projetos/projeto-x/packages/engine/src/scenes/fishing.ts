import type { Game, Scene } from '../game.js';
import { P, W } from '../palette.js';
import { PAT } from '../render.js';
import { wrap } from '../util.js';

interface Fish { x: number; y: number; v: number; c: string }

/** Fase 4 (Completo): mover o barco e pescar; cada peixe traz uma lembrança. */
export function fishingScene(g: Game): Scene {
  const goal = Math.max(2, Math.min(4, g.config.memories.length));
  let boat = 80, hook = 0, dir = 0, caught = 0, fish: Fish[] = [];
  let overlay: { image: CanvasImageSource; caption: string; t: number } | null = null;
  let done = false, doneT = 0;
  const colors = [P.orange, P.pink, P.yellow, P.lime];
  const spawn = (i: number) => ({ x: Math.random() * W, y: 64 + (i % 4) * 18, v: (0.02 + Math.random() * 0.025) * (i % 2 ? -1 : 1), c: colors[i % colors.length] });
  const cast = () => { if (dir === 0) { dir = 1; g.sfx.select(); } };
  return {
    skippable: true,
    enter() { fish = Array.from({ length: 6 }, (_, i) => spawn(i)); },
    input(k) {
      if (overlay) {
        if ((k === 'a' || k === 'start') && g.t - overlay.t > 500) {
          g.sfx.select(); overlay = null;
          if (caught >= goal) { done = true; doneT = g.t; g.sfx.win(); g.burst(80, 60, [P.blue, P.white, P.yellow], 30); }
        }
        return;
      }
      if (done) { if (k === 'a' || k === 'start') g.completePhase(); return; }
      if (dir === 0 && k === 'left') boat = Math.max(16, boat - 8);
      if (dir === 0 && k === 'right') boat = Math.min(144, boat + 8);
      if (k === 'a' || k === 'down') cast();
    },
    tap(x) {
      if (overlay || done) { this.input!('a'); return; }
      if (dir === 0) { boat = Math.max(16, Math.min(144, x)); cast(); }
    },
    update(dt) {
      if (overlay) return;
      if (done) { if (g.t - doneT > 2600) g.completePhase(); return; }
      for (const f of fish) { f.x += f.v * dt; if (f.x < -10) f.x = W + 8; if (f.x > W + 10) f.x = -8; }
      if (dir !== 0) {
        hook += dir * dt * 0.12;
        const hy = 44 + hook;
        const hit = fish.findIndex((f) => Math.abs(f.x + 3 - boat) < 7 && Math.abs(f.y + 2 - hy) < 5);
        if (dir === 1 && hit >= 0) {
          caught++; g.sfx.coin(); g.burst(boat, hy, [P.white, P.blue]);
          fish[hit] = spawn(hit);
          dir = -1;
          const m = g.takeMemory(); overlay = { image: m.image, caption: m.caption, t: g.t };
          setTimeout(() => g.sfx.reveal(), 150);
        }
        if (hook > 92) dir = -1;
        if (hook <= 0) { hook = 0; dir = 0; }
      }
    },
    draw() {
      const { r, t } = g;
      r.rect('#9fd8ff', 0, 0, W, 48); r.rect(P.blue, 0, 48, W, 96);
      for (let i = 0; i < W; i += 12) r.rect('#bfe6ff', (i + Math.floor(t / 60)) % W, 50, 6, 1);
      r.rect(P.sea, 0, 120, W, 24);
      r.rect(P.brown, boat - 14, 38, 28, 6); r.rect('#c86a42', boat - 10, 44, 20, 3);
      g.avatar('g', boat - 8, 22, 16);
      r.rect(P.white, boat, 44, 1, hook); r.rect(P.lgray, boat - 1, 44 + hook, 3, 3);
      for (const f of fish) r.pat(f.v < 0 ? PAT.fish.map((row) => [...row].reverse().join('')) : PAT.fish, f.x, f.y, f.c);
      r.rect(P.night, 0, 0, W, 14);
      r.text(`PEIXES ${caught}/${goal}`, 4, 3, P.white);
      r.text('FASE ' + (g.config.phases.indexOf('pescaria') + 1), 156, 3, P.lav, 'right');
      if (overlay) {
        r.dim(0.85);
        r.shadow('UMA MEMÓRIA!', 80, 8, P.yellow, 'center');
        r.rect(P.white, 22, 20, 116, 84);
        r.image(overlay.image, 24, 22, 112, 80);
        wrap(overlay.caption.toUpperCase(), 19).slice(0, 2).forEach((l, k) => r.text(l, 80, 110 + k * 10, P.white, 'center'));
        if (t - overlay.t > 500 && Math.floor(t / 450) % 2 === 0) r.text('A: CONTINUAR', 80, 134, P.pink, 'center');
      }
      if (done) { r.dim(0.75, 50, 40); r.shadow('FASE COMPLETA!', 80, 58, P.yellow, 'center'); r.text('A: PRÓXIMA FASE', 80, 74, P.white, 'center'); }
    },
  };
}
