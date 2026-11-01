import { P } from './palette.js';

function canvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

export interface FaceOptions { skin: string; hair: string; shirt: string; long?: boolean; bow?: boolean }

/** Personagem de exemplo 16×16, desenhado pixel a pixel. */
export function face(o: FaceOptions): HTMLCanvasElement {
  const c = canvas(16, 16);
  const x = c.getContext('2d')!;
  const r = (col: string, a: number, b: number, w: number, h: number) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  r(o.shirt, 3, 13, 10, 3); r(o.skin, 7, 12, 2, 1);
  if (o.long) { r(o.hair, 2, 4, 2, 9); r(o.hair, 12, 4, 2, 9); }
  r(o.skin, 4, 4, 8, 8); r(o.skin, 3, 6, 1, 3); r(o.skin, 12, 6, 1, 3);
  r(o.hair, 4, 2, 8, 3); r(o.hair, 3, 3, 1, 3); r(o.hair, 12, 3, 1, 3);
  if (o.bow) { r(P.red, 11, 1, 3, 2); r(P.pink, 12, 1, 1, 2); }
  r(P.ink, 6, 7, 1, 2); r(P.ink, 9, 7, 1, 2); r(P.pink, 5, 9, 1, 1); r(P.pink, 10, 9, 1, 1); r(P.plum, 7, 10, 2, 1);
  return c;
}

export const defaultGiver = () => face({ skin: '#e0a37a', hair: '#3a2418', shirt: P.blue });
export const defaultReceiver = () => face({ skin: '#f1c5a0', hair: '#7a3b1e', shirt: P.pink, long: true, bow: true });

/** Cenas de exemplo 56×40 para as memórias sem foto. */
export function memoryScene(kind: number): HTMLCanvasElement {
  const c = canvas(56, 40);
  const x = c.getContext('2d')!;
  const r = (col: string, a: number, b: number, w: number, h: number) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  const k = kind % 3;
  if (k === 0) {
    ['#ff77a8', '#ff9a8a', '#ffa300', '#ffcc66'].forEach((col, i) => r(col, 0, i * 5, 56, 5));
    r('#ffec27', 22, 12, 12, 8); r('#fff1e8', 24, 13, 8, 6);
    for (let i = 0; i < 4; i++) r(i % 2 ? '#1d6fb8' : '#29adff', 0, 20 + i * 3, 56, 3);
    r('#ffec27', 25, 21, 6, 1); r('#ffec27', 26, 24, 4, 1); r('#ffec27', 27, 27, 2, 1);
    r('#f1d39b', 0, 32, 56, 8); r('#2a1f3d', 20, 26, 2, 6); r('#2a1f3d', 24, 26, 2, 6); r('#ff77a8', 22, 24, 2, 2);
  } else if (k === 1) {
    r('#7e2553', 0, 0, 56, 26); for (let i = 0; i < 56; i += 8) r('#8f3a62', i, 0, 4, 26);
    r('#ffccaa', 6, 6, 14, 10); r('#ff77a8', 8, 8, 10, 6);
    r('#ab5236', 0, 26, 56, 14); r('#c86a42', 0, 26, 56, 2);
    r('#fff1e8', 14, 18, 8, 8); r('#fff1e8', 22, 20, 2, 3); r('#5f3a24', 15, 19, 6, 2);
    r('#fff1e8', 32, 18, 8, 8); r('#fff1e8', 30, 20, 2, 3); r('#5f3a24', 33, 19, 6, 2);
    r('#ff004d', 24, 9, 3, 2); r('#ff004d', 28, 9, 3, 2); r('#ff004d', 25, 11, 5, 2); r('#ff004d', 26, 13, 3, 1); r('#ff004d', 27, 14, 1, 1);
  } else {
    r('#1d1730', 0, 0, 56, 40); r('#fff1e8', 8, 4, 40, 18); r('#c2c3c7', 8, 22, 40, 1);
    r('#29adff', 12, 8, 10, 8); r('#ffec27', 30, 10, 12, 6); r('#ff77a8', 24, 6, 6, 6);
    for (let row = 0; row < 2; row++) for (let i = 0; i < 7; i++) r(row ? '#7e2553' : '#ab1b4a', 2 + i * 8, 27 + row * 7, 6, 5);
    r('#ffec27', 20, 29, 6, 5); r('#fff1e8', 20, 28, 2, 2); r('#fff1e8', 23, 27, 2, 2);
  }
  return c;
}

/**
 * Transforma uma imagem em pixel art: recorte central na proporção pedida, redução
 * por média de área, contraste e paleta limitada. Roda no aparelho de quem compra.
 */
export function pixelize(img: CanvasImageSource & { width: number; height: number }, w: number, h: number, levels = 5): HTMLCanvasElement {
  const c = canvas(w, h);
  const x = c.getContext('2d', { willReadFrequently: true })!;
  const ar = w / h;
  const iw = (img as HTMLImageElement).naturalWidth || img.width;
  const ih = (img as HTMLImageElement).naturalHeight || img.height;
  let sw = iw, sh = ih, sx = 0, sy = 0;
  if (sw / sh > ar) { const nw = sh * ar; sx = (sw - nw) / 2; sw = nw; } else { const nh = sw / ar; sy = (sh - nh) / 2; sh = nh; }
  x.imageSmoothingEnabled = true;
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h);
  const step = 255 / (levels - 1);
  for (let i = 0; i < d.data.length; i += 4) {
    for (let k = 0; k < 3; k++) {
      const v = (d.data[i + k] - 128) * 1.2 + 128 + 8;
      d.data[i + k] = Math.round(Math.max(0, Math.min(255, v)) / step) * step;
    }
    d.data[i + 3] = 255;
  }
  x.putImageData(d, 0, 0);
  return c;
}

/** Carrega uma imagem a partir de URL ou data URL. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Não foi possível carregar a imagem'));
    img.src = src;
  });
}
