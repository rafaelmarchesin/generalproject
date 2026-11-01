import { useEffect, useRef } from 'preact/hooks';
import { Game, H, loadAssets, W, type Key } from '@projeto-x/engine';
import type { GiftConfig } from '@projeto-x/shared';

const KEYS: Record<string, Key> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', z: 'a', Z: 'a', x: 'b', X: 'b', Enter: 'start' };

/** Mini console com a prévia jogável (só a primeira fase), atualizado a cada mudança. */
export function ConsolePreview({ config, full = false }: { config: GiftConfig; full?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      const assets = await loadAssets(config);
      if (!alive || !canvas.current) return;
      game.current?.stop();
      game.current = new Game({ canvas: canvas.current, config, assets, previewPhases: full ? undefined : 1, assistAfterMs: 20_000 });
      game.current.start();
    }, 350);
    return () => { alive = false; clearTimeout(timer); };
  }, [config, full]);

  useEffect(() => () => game.current?.stop(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      const k = KEYS[e.key];
      if (k) { e.preventDefault(); game.current?.press(k); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const press = (k: Key) => (e: Event) => { e.preventDefault(); game.current?.press(k); };
  const tap = (e: PointerEvent) => {
    const el = canvas.current;
    if (!el || !game.current) return;
    const r = el.getBoundingClientRect();
    game.current.tap(((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H);
  };

  return (
    <div class="mini" data-shell={config.shell}>
      <canvas ref={canvas} class="mini-screen" onPointerDown={tap} aria-label="Prévia do jogo" />
      <div class="mini-pad">
        <div class="mini-dpad">
          <button aria-label="Cima" class="u" onPointerDown={press('up')} />
          <button aria-label="Esquerda" class="l" onPointerDown={press('left')} />
          <button aria-label="Direita" class="r" onPointerDown={press('right')} />
          <button aria-label="Baixo" class="d" onPointerDown={press('down')} />
        </div>
        <button class="mini-start" onPointerDown={press('start')}>START</button>
        <div class="mini-ab">
          <button aria-label="Botão B" onPointerDown={press('b')}>B</button>
          <button aria-label="Botão A" onPointerDown={press('a')}>A</button>
        </div>
      </div>
    </div>
  );
}
