import type { Game, Scene } from '../game.js';
import { P, W } from '../palette.js';
import { PAT } from '../render.js';
import { daysSince, wrap } from '../util.js';

type Phase = 'ask' | 'yes' | 'suspense' | 'reveal' | 'credits' | 'end';

/** Final de cada ocasião: créditos, pedido, revelação do chá, bolo ou Natal. */
export function finaleScene(g: Game): Scene {
  const { config } = g;
  const occ = config.occasion;
  let phase: Phase = 'credits', t0 = 0, sel = 0, cd = 3, cy = 148, notified = false;
  const reveal = config.reveal ?? 'menina';
  const credits = (() => {
    const L = ['PARA ' + config.receiver.name.toUpperCase().slice(0, 14), ''];
    wrap(config.message.toUpperCase(), 18).forEach((l) => L.push(l));
    L.push('');
    if (occ === 'namoro' || occ === 'natal' || occ === 'pedido') {
      const d = daysSince(config.specialDate);
      if (d) { L.push(`${d.toLocaleString('pt-BR')} DIAS`); L.push('JOGANDO JUNTOS'); L.push(''); }
    }
    L.push('COM AMOR,'); L.push(config.giver.name.toUpperCase().slice(0, 16));
    return L;
  })();
  const answer = () => { phase = 'yes'; t0 = g.t; g.sfx.win(); g.confetti([P.pink, P.yellow, P.white, P.red], 70); };
  return {
    enter() {
      t0 = g.t;
      phase = occ === 'pedido' ? 'ask' : occ === 'cha' ? 'suspense' : 'credits';
      if (phase === 'credits') g.sfx.win();
    },
    input(k) {
      if (phase === 'ask') { if (k === 'left' || k === 'right') { sel = 1 - sel; g.sfx.move(); } if (k === 'a' || k === 'start') answer(); return; }
      if (phase === 'end' && (k === 'a' || k === 'start')) { g.sfx.select(); g.restart(); }
    },
    tap(x, y) {
      if (phase === 'ask' && y > 96 && y < 124) { sel = x < 80 ? 0 : 1; answer(); }
      else if (phase === 'end') this.input!('a');
    },
    update(dt) {
      if (occ === 'natal' || phase === 'suspense') {
        if (Math.random() < 0.3) g.parts.push({ x: Math.random() * W, y: -2, vx: (Math.random() - 0.5) * 0.2, vy: 0.3 + Math.random() * 0.3, c: P.white, life: 5000, conf: true });
      }
      if (phase === 'suspense') {
        const n = 3 - Math.floor((g.t - t0 - 1200) / 1000);
        if (g.t - t0 > 1200 && n !== cd && n >= 0) { cd = n; if (n > 0) g.sfx.drum(3 - n); }
        if (g.t - t0 > 4300) {
          phase = 'reveal'; t0 = g.t; g.parts = []; g.sfx.win();
          const c = reveal === 'menina' ? [P.pink, P.white, P.peach] : [P.blue, P.white, '#9fd8ff'];
          g.confetti(c, 90); g.burst(80, 60, c, 40, 2.2);
        }
      }
      if ((phase === 'reveal' || phase === 'yes') && g.t - t0 > 3500) { phase = 'credits'; cy = 148; }
      if (phase === 'credits') {
        cy -= dt * 0.022;
        if (cy + credits.length * 11 < 44) { phase = 'end'; if (!notified) { notified = true; g.finished(); } }
        if (occ !== 'natal' && Math.random() < 0.04) g.parts.push({ x: 20 + Math.random() * 120, y: 144, vx: 0, vy: -0.5, c: P.red, life: 4000, conf: true, heart: true });
      }
    },
    draw() {
      const { r, t } = g;
      const bg = occ === 'natal' ? P.navy : occ === 'cha' && phase === 'reveal' ? (reveal === 'menina' ? '#ffd6e7' : '#cfeaff') : P.night;
      r.rect(bg, 0, 0, W, 144);
      if (!(occ === 'cha' && phase === 'reveal')) g.stars8();
      if (phase === 'ask') {
        g.avatar('g', 40, 20, 24); g.avatar('r', 96, 20, 24); r.pat(PAT.heart, 71, 28, P.red, 2);
        r.shadow('QUER CASAR', 80, 58, P.white, 'center'); r.shadow('COMIGO?', 80, 72, P.yellow, 'center', true);
        ['SIM', 'SIM!'].forEach((o, k) => { const x = k ? 92 : 20, on = k === sel; r.rect(on ? P.pink : '#3b3546', x, 100, 48, 18); r.text(o, x + 24, 105, on ? P.night : P.white, 'center'); });
        r.text('ESCOLHA COM ← →', 80, 130, P.lav, 'center');
      } else if (phase === 'yes') {
        r.pat(PAT.ring, 62, 24, P.yellow, 4); r.rect(P.blue, 78, 24, 4, 4);
        r.shadow('SIM!!!', 80, 72, P.pink, 'center', true); r.shadow('PRÓXIMA FASE:', 80, 98, P.white, 'center'); r.shadow('O CASAMENTO ♥', 80, 112, P.yellow, 'center');
      } else if (phase === 'suspense') {
        r.shadow('O NOVO PLAYER', 80, 30, P.white, 'center'); r.shadow('QUE VAI CHEGAR', 80, 44, P.white, 'center'); r.shadow('É...', 80, 62, P.yellow, 'center', true);
        if (t - t0 > 1200 && cd > 0) r.shadow(String(cd), 80, 92, P.pink, 'center', true);
        g.avatar('g', 8, 110, 24);
      } else if (phase === 'reveal') {
        const word = reveal === 'menina' ? 'MENINA!' : 'MENINO!', col = reveal === 'menina' ? '#d6336c' : '#1971c2';
        r.text('É', 80, 34, P.night, 'center', true);
        const sc = 1 + 0.06 * Math.sin(t / 120);
        r.ctx.save(); r.ctx.translate(80, 66); r.ctx.scale(sc, sc); r.text(word, 1, -7, '#ffffff', 'center', true); r.text(word, 0, -8, col, 'center', true); r.ctx.restore();
        r.pat(PAT.heart, 64, 96, col, 2); r.pat(PAT.heart, 82, 96, col, 2);
      } else {
        if (occ === 'aniversario') { r.rect(P.brown, 56, 104, 48, 20); r.rect(P.pink, 56, 104, 48, 4); r.rect(P.white, 52, 124, 56, 3); for (let k = 0; k < 3; k++) { r.rect(P.yellow, 66 + k * 12, 96, 2, 8); r.rect(Math.floor(t / 120 + k) % 2 ? P.orange : P.yellow, 66 + k * 12, 92, 2, 3); } }
        else if (occ === 'natal') { for (let k = 0; k < 4; k++) r.rect(P.green, 80 - 6 - k * 6, 92 + k * 8, 12 + k * 12, 8); r.rect(P.brown, 77, 124, 6, 6); r.pat(PAT.star, 78, 84, P.yellow); }
        else { g.avatar('g', 52, 112, 24); g.avatar('r', 84, 112, 24); r.pat(PAT.heart, 73, 104 + Math.round(Math.sin(t / 200) * 2), P.red); }
        r.ctx.save(); r.ctx.beginPath(); r.ctx.rect(0, 0, W, 108); r.ctx.clip();
        credits.forEach((l, k) => { const y = cy + k * 11; if (y > -10 && y < 110) r.shadow(l, 80, y, k === 0 ? P.yellow : /DIAS$/.test(l) ? P.pink : P.white, 'center'); });
        r.ctx.restore();
        if (phase === 'end') {
          r.dim(0.8, 30, 46);
          r.shadow('FIM? NÃO.', 80, 38, P.yellow, 'center'); r.shadow('CONTINUA... ♥', 80, 52, P.pink, 'center');
          if (Math.floor(t / 500) % 2 === 0) r.text('A: JOGAR DE NOVO', 80, 66, P.white, 'center');
        }
      }
    },
  };
}
