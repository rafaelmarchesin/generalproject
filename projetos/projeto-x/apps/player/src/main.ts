import { Game, H, loadAssets, W, type Key } from '@projeto-x/engine';
import { demoConfig, giftConfigSchema, OCCASIONS, type GiftConfig, type Occasion } from '@projeto-x/shared';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

/**
 * Por enquanto o presente vem de um exemplo (?ocasiao=pedido). Na etapa M2,
 * o código secreto do link será trocado pela configuração vinda do servidor.
 */
function readConfig(): GiftConfig {
  const params = new URLSearchParams(location.search);
  const occ = params.get('ocasiao') ?? location.hash.slice(1);
  const occasion: Occasion = OCCASIONS.includes(occ as Occasion) ? (occ as Occasion) : 'namoro';
  return giftConfigSchema.parse(demoConfig(occasion));
}

async function boot(): Promise<void> {
  const config = readConfig();
  const consoleEl = $('console');
  consoleEl.dataset.shell = config.shell;
  $('banner').textContent = `${config.giver.name} preparou um presente para você.`;

  const assets = await loadAssets(config);
  // ?ajuda=1000 encurta o tempo até aparecer "pular fase" (útil em testes automáticos).
  const assist = Number(new URLSearchParams(location.search).get('ajuda')) || undefined;
  const game = new Game({
    canvas: $<HTMLCanvasElement>('screen'),
    config,
    assets,
    assistAfterMs: assist,
    onEvent: (e) => { if (e.type === 'finished') $('banner').textContent = 'Fim? Não. Continua…'; },
  });
  await document.fonts?.load("8px 'Press Start 2P'").catch(() => undefined);
  game.tick(0);

  const power = $<HTMLButtonElement>('power');
  power.addEventListener('click', () => {
    game.sfx.unlock();
    power.hidden = true;
    $('led').classList.add('on');
    document.documentElement.requestFullscreen?.().catch(() => undefined);
    game.start();
  });

  const press = (k: Key) => { if (power.hidden) game.press(k); };
  document.querySelectorAll<HTMLButtonElement>('.console [data-k]').forEach((b) => {
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); b.classList.add('down'); press(b.dataset.k as Key); });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => b.classList.remove('down'));
  });

  const keys: Record<string, Key> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', z: 'a', Z: 'a', x: 'b', X: 'b', Enter: 'start', ' ': 'a' };
  document.addEventListener('keydown', (e) => {
    const k = keys[e.key];
    if (!k) return;
    e.preventDefault();
    if (!power.hidden) { power.click(); return; }
    press(k);
  });

  const screen = $<HTMLCanvasElement>('screen');
  screen.addEventListener('pointerdown', (e) => {
    if (!power.hidden) return;
    const r = screen.getBoundingClientRect();
    game.tap(((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H);
  });

  const mute = $<HTMLButtonElement>('mute');
  mute.addEventListener('click', () => {
    game.sfx.muted = !game.sfx.muted;
    mute.textContent = 'Som: ' + (game.sfx.muted ? 'desligado' : 'ligado');
  });
}

window.addEventListener('hashchange', () => location.reload());

boot().catch((err) => {
  console.error(err);
  $('banner').textContent = 'Não foi possível abrir o presente. Tente recarregar a página.';
});
