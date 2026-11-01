import type { GiftConfig, Phase } from '@projeto-x/shared';
import { PRESETS } from '@projeto-x/shared';
import { Sfx } from './audio.js';
import { H, P, W } from './palette.js';
import { Renderer, type Particle } from './render.js';
import { defaultGiver, defaultReceiver, loadImage, memoryScene } from './sprites.js';
import { titleScene } from './scenes/title.js';
import { cardScene } from './scenes/card.js';
import { snakeScene } from './scenes/snake.js';
import { runnerScene } from './scenes/runner.js';
import { quizScene } from './scenes/quiz.js';
import { fishingScene } from './scenes/fishing.js';
import { finaleScene } from './scenes/finale.js';
import { previewEndScene } from './scenes/preview-end.js';

export type Key = 'up' | 'down' | 'left' | 'right' | 'a' | 'b' | 'start' | 'select';

export interface Scene {
  enter?(): void;
  update?(dt: number): void;
  draw(): void;
  input?(k: Key): void;
  tap?(x: number, y: number): void;
  /** Fase jogável: mostra a ajuda "pular fase" depois de um tempo. */
  skippable?: boolean;
}

export type GameEvent =
  | { type: 'start' }
  | { type: 'phase-complete'; phase: Phase; index: number }
  | { type: 'finished' };

export interface Assets {
  giver: CanvasImageSource;
  receiver: CanvasImageSource;
  memories: CanvasImageSource[];
}

export interface GameOptions {
  canvas: HTMLCanvasElement;
  config: GiftConfig;
  assets?: Assets;
  onEvent?: (e: GameEvent) => void;
  /** Tempo parado numa fase antes de oferecer "pular" (ms). */
  assistAfterMs?: number;
  /** Modo prévia do editor: depois desta quantidade de fases, mostra a tela "o resto é surpresa". */
  previewPhases?: number;
}

/** Carrega avatares e memórias da configuração; o que faltar vira arte de exemplo. */
export async function loadAssets(config: GiftConfig): Promise<Assets> {
  const safe = async (src: string | undefined, fallback: () => CanvasImageSource) => {
    if (!src) return fallback();
    try { return await loadImage(src); } catch { return fallback(); }
  };
  const [giver, receiver, ...memories] = await Promise.all([
    safe(config.giver.avatar, defaultGiver),
    safe(config.receiver.avatar, defaultReceiver),
    ...config.memories.map((m, i) => safe(m.image, () => memoryScene(i))),
  ]);
  return { giver, receiver, memories };
}

export class Game {
  readonly r: Renderer;
  readonly sfx = new Sfx();
  readonly config: GiftConfig;
  assets: Assets;
  t = 0;
  parts: Particle[] = [];
  /** Índice da próxima memória a revelar. */
  memoryCursor = 0;
  private scene!: Scene;
  private sceneStart = 0;
  private stage = -1;
  private last = 0;
  private raf = 0;
  private running = false;
  private readonly onEvent?: (e: GameEvent) => void;
  private readonly assistAfterMs: number;
  private readonly previewPhases?: number;
  private stars = Array.from({ length: 30 }, (_, i) => ({ x: (i * 53) % W, y: (i * 37) % H, t: i * 97 }));

  constructor(opts: GameOptions) {
    this.r = new Renderer(opts.canvas);
    this.config = opts.config;
    this.assets = opts.assets ?? { giver: defaultGiver(), receiver: defaultReceiver(), memories: opts.config.memories.map((_, i) => memoryScene(i)) };
    this.onEvent = opts.onEvent;
    this.assistAfterMs = opts.assistAfterMs ?? 40_000;
    this.previewPhases = opts.previewPhases;
    this.go(titleScene(this));
  }

  get preset() { return PRESETS[this.config.occasion]; }
  get stages(): (Phase | 'final')[] { return [...this.config.phases, 'final']; }

  start(): void {
    if (this.running) return;
    this.running = true;
    const frame = (ts: number) => {
      if (!this.running) return;
      const dt = Math.min(50, ts - (this.last || ts));
      this.last = ts;
      this.tick(dt);
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Avança um quadro; separado de `start` para testes e gravação de vídeo. */
  tick(dt: number): void {
    this.t += dt;
    this.scene.update?.(dt);
    this.updateParticles(dt);
    this.r.begin();
    this.scene.draw();
    this.drawParticles();
    if (this.scene.skippable && this.t - this.sceneStart > this.assistAfterMs) this.drawAssist();
  }

  press(k: Key): void {
    this.sfx.unlock();
    if (k === 'select') { this.sfx.select(); this.restart(); return; }
    if (k === 'b' && this.scene.skippable && this.t - this.sceneStart > this.assistAfterMs) { this.completePhase(); return; }
    this.scene.input?.(k);
  }

  /** Toque na tela, em coordenadas lógicas (0..160, 0..144). */
  tap(x: number, y: number): void {
    this.sfx.unlock();
    if (this.scene.tap) this.scene.tap(x, y);
    else this.scene.input?.('a');
  }

  go(scene: Scene): void {
    this.scene = scene;
    this.sceneStart = this.t;
    this.parts = [];
    scene.enter?.();
  }

  restart(): void {
    this.stage = -1;
    this.memoryCursor = 0;
    this.go(titleScene(this));
  }

  /** Mostra a cartinha e o título da próxima fase. */
  nextStage(): void {
    this.stage += 1;
    if (this.stage === 0) this.onEvent?.({ type: 'start' });
    if (this.previewPhases !== undefined && this.stage >= this.previewPhases) { this.go(previewEndScene(this)); return; }
    const kind = this.stages[this.stage];
    if (!kind) return;
    this.go(cardScene(this, this.stage, kind, () => this.go(this.phaseScene(kind))));
  }

  /** Chamado pela fase ao terminar (ou ao pular). */
  completePhase(): void {
    const kind = this.stages[this.stage];
    if (kind && kind !== 'final') this.onEvent?.({ type: 'phase-complete', phase: kind, index: this.stage });
    this.nextStage();
  }

  finished(): void { this.onEvent?.({ type: 'finished' }); }

  /** Próxima memória a revelar (volta ao início se acabarem). */
  takeMemory(): { image: CanvasImageSource; caption: string; index: number } {
    const n = this.config.memories.length;
    const index = this.memoryCursor % n;
    this.memoryCursor += 1;
    return { image: this.assets.memories[index], caption: this.config.memories[index].caption, index };
  }

  avatar(which: 'g' | 'r', x: number, y: number, size = 16): void {
    this.r.image(which === 'g' ? this.assets.giver : this.assets.receiver, x, y, size, size);
  }

  stars8(): void {
    for (const s of this.stars) if ((this.t + s.t) % 2400 < 1600) this.r.rect(P.lav, s.x, s.y, 1, 1);
  }

  burst(x: number, y: number, colors: string[], n = 18, spread = 1.6): void {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = (0.4 + Math.random()) * spread;
      this.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, c: colors[i % colors.length], life: 900 + Math.random() * 600 });
    }
  }

  confetti(colors: string[], n = 40): void {
    for (let i = 0; i < n; i++) this.parts.push({ x: Math.random() * W, y: -Math.random() * 40, vx: (Math.random() - 0.5) * 0.4, vy: 0.4 + Math.random() * 0.6, c: colors[i % colors.length], life: 3000, conf: true });
  }

  private phaseScene(kind: Phase | 'final'): Scene {
    switch (kind) {
      case 'cobrinha': return snakeScene(this);
      case 'corrida': return runnerScene(this);
      case 'quiz': return quizScene(this);
      case 'pescaria': return fishingScene(this);
      default: return finaleScene(this);
    }
  }

  private updateParticles(dt: number): void {
    const k = dt / 16;
    for (const p of this.parts) { p.x += p.vx * k; p.y += p.vy * k; if (!p.conf) p.vy += 0.06 * k; p.life -= dt; }
    this.parts = this.parts.filter((p) => p.life > 0 && p.y < H + 4);
  }

  private drawParticles(): void {
    for (const p of this.parts) {
      if (p.heart) this.r.pat(['101', '111', '010'], p.x, p.y, P.red);
      else this.r.rect(p.c, p.x, p.y, 2, 2);
    }
  }

  private drawAssist(): void {
    this.r.ctx.globalAlpha = 0.85;
    this.r.rect('#000000', 0, H - 12, W, 12);
    this.r.ctx.globalAlpha = 1;
    if (Math.floor(this.t / 500) % 2 === 0) this.r.text('B: PULAR FASE', W / 2, H - 10, P.yellow, 'center');
  }
}
