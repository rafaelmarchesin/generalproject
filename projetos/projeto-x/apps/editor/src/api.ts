import type { AddonId, GiftConfig, PlanId } from '@projeto-x/shared';

export interface PixCharge {
  orderId: string;
  status: 'pending' | 'paid';
  amountCents: number;
  pix: { qrCodeBase64: string; copiaECola: string; expiresAt: string };
  /** true quando o back-end ainda não está no ar e a cobrança é só uma simulação. */
  demo?: boolean;
}

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

export async function createOrder(input: { config: GiftConfig; plan: PlanId; addons: AddonId[]; email: string }): Promise<PixCharge> {
  try {
    const res = await fetch(`${API}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    // Sem back-end publicado (página estática), a resposta não é JSON: entra o modo demonstração.
    if (!(res.headers.get('content-type') ?? '').includes('application/json')) return demoCharge();
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((body as { error?: string }).error ?? 'Não foi possível criar o pedido. Tente de novo.');
    return body as PixCharge;
  } catch (e) {
    if (e instanceof TypeError) return demoCharge();
    throw e;
  }
}

export async function orderStatus(orderId: string): Promise<{ status: 'pending' | 'paid'; giftUrl?: string }> {
  const res = await fetch(`${API}/pedidos/${encodeURIComponent(orderId)}`);
  if (!res.ok) throw new Error('Não foi possível consultar o pagamento.');
  return res.json() as Promise<{ status: 'pending' | 'paid'; giftUrl?: string }>;
}

function demoCharge(): PixCharge {
  return {
    orderId: 'demo-' + Math.random().toString(36).slice(2, 10),
    status: 'pending',
    amountCents: 0,
    pix: { qrCodeBase64: '', copiaECola: '00020126580014BR.GOV.BCB.PIX-DEMONSTRACAO', expiresAt: new Date(Date.now() + 30 * 60_000).toISOString() },
    demo: true,
  };
}
