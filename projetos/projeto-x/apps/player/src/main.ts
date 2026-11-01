import { Game, H, loadAssets, W, type Key } from '@projeto-x/engine';
import { demoConfig, giftConfigSchema, OCCASIONS, type GiftConfig, type Occasion } from '@projeto-x/shared';
import { fetchGift, sendEvent, slugFromPath, type GiftView } from './api.js';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

/** Sem código no endereço, mostra um exemplo (?ocasiao=pedido ou #pedido). */
function demoFromUrl(): GiftConfig {
  const params = new URLSearchParams(location.search);
  const occ = params.get('ocasiao') ?? location.hash.slice(1);
  const occasion: Occasion = OCCASIONS.includes(occ as Occasion) ? (occ as Occasion) : 'namoro';
  return giftConfigSchema.parse(demoConfig(occasion));
}

const slug = slugFromPath(location.pathname);
/** ?teste=1: quem comprou joga antes, sem contar como aberto. */
const testMode = new URLSearchParams(location.search).has('teste');

/** Busca o presente; resolve lacre e senha antes de liberar o jogo. */
async function resolveConfig(): Promise<GiftConfig> {
  if (!slug) return demoFromUrl();
  let view: GiftView = await fetchGift(slug);
  if (view.state === 'sealed') {
    const v = view;
    $('console').dataset.shell = v.shell;
    $<HTMLButtonElement>('power').disabled = true;
    const tick = () => {
      const ms = new Date(v.opensAt).getTime() - Date.now();
      if (ms <= 0) { location.reload(); return; }
      const d = Math.floor(ms / 86_400_000), h = Math.floor(ms / 3_600_000) % 24, m = Math.floor(ms / 60_000) % 60, s = Math.floor(ms / 1000) % 60;
      $('banner').textContent = `${v.giver} preparou um presente lacrado. Abre em ${d > 0 ? d + 'd ' : ''}${h}h ${m}min ${s}s.`;
    };
    tick(); setInterval(tick, 1000);
    return new Promise(() => undefined);
  }
  while (view.state === 'password') {
    const v = view;
    $('console').dataset.shell = v.shell;
    $('banner').textContent = `${v.giver} preparou um presente para você. Responda para abrir.`;
    const form = $<HTMLFormElement>('senha');
    form.hidden = false;
    $('pergunta').textContent = v.question;
    $('senha-erro').hidden = !v.wrong;
    const answer = await new Promise<string>((resolve) => {
      form.onsubmit = (e) => { e.preventDefault(); resolve($<HTMLInputElement>('resposta').value); };
    });
    view = await fetchGift(slug, answer);
  }
  $('senha').hidden = true;
  if (view.state !== 'open') { location.reload(); return new Promise(() => undefined); }
  return giftConfigSchema.parse(view.config);
}

async function boot(): Promise<void> {
  const config = await resolveConfig();
  const consoleEl = $('console');
  consoleEl.dataset.shell = config.shell;
  $('banner').textContent = `${config.giver.name} preparou um presente para você.`;
  const track = (ev: 'opened' | 'finished') => { if (slug && !testMode) void sendEvent(slug, ev); };

  const assets = await loadAssets(config);
  // ?ajuda=1000 encurta o tempo até aparecer "pular fase" (útil em testes automáticos).
  const assist = Number(new URLSearchParams(location.search).get('ajuda')) || undefined;
  const game = new Game({
    canvas: $<HTMLCanvasElement>('screen'),
    config,
    assets,
    assistAfterMs: assist,
    onEvent: (e) => { if (e.type === 'finished') { $('banner').textContent = 'Fim? Não. Continua…'; track('finished'); } },
  });
  await document.fonts?.load("8px 'Press Start 2P'").catch(() => undefined);
  game.tick(0);

  const power = $<HTMLButtonElement>('power');
  power.addEventListener('click', () => {
    game.sfx.unlock();
    power.hidden = true;
    track('opened');
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
  $('banner').textContent = err instanceof Error && err.message ? err.message : 'Não foi possível abrir o presente. Tente recarregar a página.';
});
