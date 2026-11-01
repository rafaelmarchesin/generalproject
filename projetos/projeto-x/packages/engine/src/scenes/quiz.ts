import type { Game, Scene } from '../game.js';
import { P, W } from '../palette.js';
import { wrap } from '../util.js';

/** Fase 3: perguntas do casal. Errar só pede outra tentativa. */
export function quizScene(g: Game): Scene {
  const qs = g.config.quiz;
  let i = 0, sel = 0, fb: { ok: boolean; t: number } | null = null, errors = 0;
  const choose = () => {
    const q = qs[i];
    if (sel === q.correct) { fb = { ok: true, t: g.t }; g.sfx.coin(); g.burst(80, 70, [P.pink, P.yellow, P.lime], 24); }
    else { fb = { ok: false, t: g.t }; errors++; g.sfx.wrong(); }
  };
  return {
    skippable: true,
    input(k) {
      if (fb) return;
      if (k === 'up') { sel = (sel + 2) % 3; g.sfx.move(); }
      if (k === 'down') { sel = (sel + 1) % 3; g.sfx.move(); }
      if (k === 'a' || k === 'start') choose();
    },
    tap(_x, y) {
      if (fb) return;
      for (let k = 0; k < 3; k++) { const oy = 78 + k * 20; if (y >= oy - 4 && y < oy + 16) { sel = k; choose(); } }
    },
    update() {
      if (!fb || g.t - fb.t <= (fb.ok ? 1300 : 1100)) return;
      if (fb.ok) {
        i++; sel = 0;
        if (i >= qs.length) { g.completePhase(); return; }
      } else if (errors >= 3) {
        // Ajuda: depois de 3 erros, a resposta certa fica destacada.
        sel = qs[i].correct;
      }
      fb = null;
    },
    draw() {
      const { r } = g;
      r.rect(P.plum, 0, 0, W, 144);
      g.stars8();
      r.text(`PERGUNTA ${Math.min(i + 1, qs.length)}/${qs.length}`, 80, 6, P.peach, 'center');
      const q = qs[Math.min(i, qs.length - 1)];
      wrap(q.question.toUpperCase(), 18).slice(0, 4).forEach((l, k) => r.shadow(l, 80, 22 + k * 11, P.white, 'center'));
      q.options.forEach((o, k) => {
        const oy = 78 + k * 20, on = k === sel;
        r.rect(on ? P.yellow : '#5a1d43', 14, oy - 4, 132, 16);
        r.text(o.toUpperCase().slice(0, 15), 24, oy, on ? P.night : P.white);
        if (on) r.text('>', 16, oy, P.night);
      });
      if (fb) { r.dim(0.85, 58, 26); r.shadow(fb.ok ? 'ACERTOU! ♥' : 'QUASE! DE NOVO', 80, 67, fb.ok ? P.lime : P.orange, 'center'); }
    },
  };
}
