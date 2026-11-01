import type { Phase } from '@projeto-x/shared';
import type { Game, Scene } from '../game.js';
import { P, W } from '../palette.js';
import { wrap } from '../util.js';

const NAMES: Record<Phase | 'final', [string, string, string]> = {
  cobrinha: ['COBRINHA', 'DO AMOR', 'SETAS: MOVER'],
  corrida: ['CORRIDA', 'ATÉ VOCÊ', '← → TROCAR FAIXA'],
  quiz: ['QUIZ DO', 'CASAL', '↑↓ ESCOLHER  A: OK'],
  pescaria: ['PESCARIA DE', 'MEMÓRIAS', '← → MOVER  A: PESCAR'],
  final: ['FASE', 'FINAL', ''],
};

/** Cartinha de quem deu o presente + nome da fase. */
export function cardScene(g: Game, index: number, kind: Phase | 'final', next: () => void): Scene {
  const [l1, l2, hint] = NAMES[kind];
  const letter = (g.config.letters[index] ?? '').toUpperCase();
  let done = false;
  let started = 0;
  const go = () => { if (!done) { done = true; next(); } };
  return {
    enter() { started = g.t; g.sfx.reveal(); },
    update() { if (!letter && g.t - started > 2200) go(); },
    draw() {
      const { r, t } = g;
      r.rect(P.navy, 0, 0, W, 144);
      g.stars8();
      r.shadow(kind === 'final' ? '' : 'FASE ' + (index + 1), 80, 10, P.lav, 'center');
      r.shadow(l1, 80, 24, P.yellow, 'center', true);
      r.shadow(l2, 80, 44, P.pink, 'center', true);
      if (letter) {
        r.rect('#fff1e8', 10, 66, 140, 52);
        r.rect('#ffccaa', 10, 66, 140, 3);
        wrap(letter, 16).slice(0, 4).forEach((line, i) => r.text(line, 80, 74 + i * 11, P.ink, 'center'));
      }
      if (letter && hint) r.text(hint, 80, 120, P.lav, 'center');
      if (Math.floor(t / 500) % 2 === 0) r.text(letter ? 'A: CONTINUAR' : hint, 80, 132, P.white, 'center');
    },
    input(k) { if (k === 'a' || k === 'start') go(); },
  };
}
