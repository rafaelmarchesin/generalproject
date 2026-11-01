import { H, W } from './palette.js';

export const PAT = {
  heart: ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'],
  smallHeart: ['101', '111', '010'],
  ring: ['000010000', '000111000', '000010000', '001101100', '010000010', '100000001', '100000001', '010000010', '001111100'],
  star: ['00100', '01110', '11111', '01110', '01010'],
  fish: ['0011100', '0111111', '1111110', '0111111', '0011100'],
  cloud: ['0011100000', '0111111100', '1111111111', '0111111110'],
};

export interface Particle { x: number; y: number; vx: number; vy: number; c: string; life: number; conf?: boolean; heart?: boolean }

/** Desenho em pixel art numa tela lógica de 160×144, ampliada 2× no canvas. */
export class Renderer {
  readonly ctx: CanvasRenderingContext2D;
  static readonly FONT8 = "8px 'Press Start 2P', monospace";
  static readonly FONT16 = "16px 'Press Start 2P', monospace";

  constructor(readonly canvas: HTMLCanvasElement) {
    canvas.width = W * 2;
    canvas.height = H * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D indisponível');
    this.ctx = ctx;
  }

  begin(): void {
    this.ctx.setTransform(2, 0, 0, 2, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.globalAlpha = 1;
  }

  rect(c: string, x: number, y: number, w: number, h: number): void {
    this.ctx.fillStyle = c;
    this.ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  text(s: string, x: number, y: number, c: string, align: CanvasTextAlign = 'left', big = false): void {
    const { ctx } = this;
    ctx.font = big ? Renderer.FONT16 : Renderer.FONT8;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';
    ctx.fillStyle = c;
    ctx.fillText(s, Math.round(x), Math.round(y));
  }

  shadow(s: string, x: number, y: number, c: string, align: CanvasTextAlign = 'left', big = false): void {
    this.text(s, x + 1, y + 1, '#000000', align, big);
    this.text(s, x, y, c, align, big);
  }

  pat(p: string[], x: number, y: number, c: string, s = 1): void {
    this.ctx.fillStyle = c;
    for (let r = 0; r < p.length; r++) {
      const row = p[r];
      for (let k = 0; k < row.length; k++) {
        if (row[k] === '1') this.ctx.fillRect(Math.round(x + k * s), Math.round(y + r * s), s, s);
      }
    }
  }

  image(img: CanvasImageSource, x: number, y: number, w: number, h: number): void {
    this.ctx.drawImage(img, Math.round(x), Math.round(y), w, h);
  }

  dim(alpha: number, y = 0, h = H): void {
    this.ctx.globalAlpha = alpha;
    this.rect('#000000', 0, y, W, h);
    this.ctx.globalAlpha = 1;
  }
}
