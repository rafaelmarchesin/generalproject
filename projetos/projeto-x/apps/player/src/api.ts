import type { GiftConfig } from '@projeto-x/shared';

export type GiftView =
  | { state: 'sealed'; opensAt: string; giver: string; shell: string }
  | { state: 'password'; question: string; giver: string; shell: string; wrong?: boolean }
  | { state: 'open'; config: GiftConfig };

/** Código do presente no endereço /p/{codigo}. */
export function slugFromPath(path: string): string | null {
  const m = /\/p\/([A-Za-z0-9]{12})\/?$/.exec(path);
  return m ? m[1]! : null;
}

export async function fetchGift(slug: string, resposta?: string): Promise<GiftView> {
  const res = await fetch(`/api/presentes/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resposta === undefined ? {} : { resposta }),
  });
  if (res.status === 404) throw new Error('Este presente não existe ou foi removido.');
  if (!res.ok) throw new Error('Não foi possível abrir o presente agora.');
  return res.json() as Promise<GiftView>;
}

export function sendEvent(slug: string, evento: 'opened' | 'finished'): Promise<void> {
  return fetch(`/api/presentes/${slug}/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evento }),
    keepalive: true,
  }).then(() => undefined, () => undefined);
}
