import { useEffect, useRef, useState } from 'preact/hooks';
import type { Crop } from '@projeto-x/engine';

/** Recorte do rosto: arrastar para posicionar, controle para aproximar. */
export function PhotoCropper({ img, onDone, onCancel }: { img: HTMLImageElement; onDone: (crop: Crop) => void; onCancel: () => void }) {
  const box = 260;
  const base = Math.min(img.naturalWidth, img.naturalHeight);
  const [zoom, setZoom] = useState(1.6);
  const [pos, setPos] = useState({ x: img.naturalWidth / 2, y: img.naturalHeight / 2.6 });
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const size = base / zoom;
  const crop: Crop = {
    x: Math.max(0, Math.min(img.naturalWidth - size, pos.x - size / 2)),
    y: Math.max(0, Math.min(img.naturalHeight - size, pos.y - size / 2)),
    w: size, h: size,
  };

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, box, box);
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, box, box);
    ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.ellipse(box / 2, box / 2, box * 0.36, box * 0.44, 0, 0, Math.PI * 2); ctx.stroke();
  });

  const onDown = (e: PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY }; (e.target as Element).setPointerCapture(e.pointerId); };
  const onMove = (e: PointerEvent) => {
    if (!drag.current) return;
    const k = size / box;
    setPos((p) => ({ x: p.x - (e.clientX - drag.current!.x) * k, y: p.y - (e.clientY - drag.current!.y) * k }));
    drag.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div class="sheet" role="dialog" aria-modal="true" aria-label="Recortar o rosto">
      <div class="panel">
        <h3>Ajuste o rosto no círculo</h3>
        <canvas ref={canvas} width={box} height={box} class="crop" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => (drag.current = null)} />
        <label class="f" for="zoom">Aproximar
          <input id="zoom" type="range" min="1" max="4" step="0.05" value={zoom} onInput={(e) => setZoom(Number((e.target as HTMLInputElement).value))} />
        </label>
        <p class="hint">Dica: rosto de frente e com boa luz fica melhor em pixel.</p>
        <div class="actions">
          <button class="btn primary" type="button" onClick={() => onDone(crop)}>Usar esta foto</button>
          <button class="btn" type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
