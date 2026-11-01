import type { Game, Scene } from '../game.js';
import { P, W } from '../palette.js';
import { PAT } from '../render.js';
import { wrap } from '../util.js';

type Pt = { x: number; y: number };
const C = 20, R = 16, TOP = 16;

/** Fase 1: coletar corações; a cada 2, uma memória é revelada. */
export function snakeScene(g: Game): Scene {
  const reveals = Math.min(3, g.config.memories.length);
  const goal = reveals * 2;
  let sn: Pt[] = [], dir: Pt = { x: 1, y: 0 }, nxt: Pt = dir, acc = 0, count = 0, heart: Pt = { x: 0, y: 0 };
  let overlay: { image: CanvasImageSource; caption: string; n: number; t: number } | null = null;
  let done = false, doneT = 0;
  const place = () => { do { heart = { x: Math.floor(Math.random() * C), y: Math.floor(Math.random() * R) }; } while (sn.some((p) => p.x === heart.x && p.y === heart.y)); };
  const turn = (k: string) => {
    const m: Record<string, Pt> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    const v = m[k];
    if (v && !(v.x === -dir.x && v.y === -dir.y)) nxt = v;
  };
  return {
    skippable: true,
    enter() { sn = [{ x: 6, y: 8 }, { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }]; dir = { x: 1, y: 0 }; nxt = dir; place(); },
    input(k) {
      if (overlay) {
        if ((k === 'a' || k === 'start') && g.t - overlay.t > 500) {
          g.sfx.select();
          const last = overlay.n >= reveals;
          overlay = null;
          if (last) { done = true; doneT = g.t; g.sfx.win(); g.burst(80, 70, [P.pink, P.red, P.yellow], 30); } else place();
        }
        return;
      }
      if (done) { if (k === 'a' || k === 'start') g.completePhase(); return; }
      turn(k);
    },
    tap(x, y) {
      if (overlay || done) { this.input!('a'); return; }
      const h = sn[0];
      const dx = x - (h.x * 8 + 4), dy = y - (TOP + h.y * 8 + 4);
      turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    },
    update(dt) {
      if (overlay) return;
      if (done) { if (g.t - doneT > 2600) g.completePhase(); return; }
      acc += dt;
      while (acc >= 150) {
        acc -= 150; dir = nxt;
        const h = sn[0], n = { x: (h.x + dir.x + C) % C, y: (h.y + dir.y + R) % R };
        sn.unshift(n);
        if (n.x === heart.x && n.y === heart.y) {
          count++; g.sfx.coin(); g.burst(n.x * 8 + 4, TOP + n.y * 8 + 4, [P.pink, P.red, P.white]);
          if (count % 2 === 0 && count <= goal) { const m = g.takeMemory(); overlay = { ...m, n: count / 2, t: g.t }; setTimeout(() => g.sfx.reveal(), 150); break; }
          place();
        } else sn.pop();
      }
    },
    draw() {
      const { r, t } = g;
      r.rect(P.ink, 0, 0, W, 144);
      for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) if ((x + y) % 2 === 0) r.rect('#30244a', x * 8, TOP + y * 8, 8, 8);
      r.rect(P.night, 0, 0, W, TOP);
      r.pat(PAT.heart, 4, 5, P.red);
      r.text(`${count}/${goal}`, 14, 4, P.white);
      r.text('FASE 1', 156, 4, P.lav, 'right');
      if (!overlay && !done) r.pat(PAT.heart, heart.x * 8, TOP + heart.y * 8 + 1 + (Math.floor(t / 300) % 2), P.red);
      for (let i = sn.length - 1; i > 0; i--) { const p = sn[i]; r.rect(P.pink, p.x * 8 + 1, TOP + p.y * 8 + 1, 6, 6); r.rect(P.peach, p.x * 8 + 2, TOP + p.y * 8 + 2, 2, 2); }
      const h = sn[0];
      r.rect(P.white, h.x * 8 - 1, TOP + h.y * 8 - 1, 10, 10);
      g.avatar('g', h.x * 8, TOP + h.y * 8, 8);
      if (overlay) {
        r.dim(0.85);
        r.shadow(`MEMÓRIA ${overlay.n}/${reveals}`, 80, 8, P.yellow, 'center');
        r.rect(P.white, 22, 20, 116, 84);
        r.image(overlay.image, 24, 22, 112, 80);
        wrap(overlay.caption.toUpperCase(), 19).slice(0, 2).forEach((l, k) => r.text(l, 80, 110 + k * 10, P.white, 'center'));
        if (t - overlay.t > 500 && Math.floor(t / 450) % 2 === 0) r.text('A: CONTINUAR', 80, 134, P.pink, 'center');
      }
      if (done) { r.dim(0.75, 50, 40); r.shadow('FASE COMPLETA!', 80, 58, P.yellow, 'center'); r.text('A: PRÓXIMA FASE', 80, 74, P.white, 'center'); }
    },
  };
}
