import { createHmac, timingSafeEqual } from 'node:crypto';
import type { PixCharge, Payments } from './domain.js';

const API = 'https://api.mercadopago.com';

type FetchLike = typeof fetch;

/** Cliente mínimo da API de pagamentos do Mercado Pago (Pix). */
export class MercadoPago implements Payments {
  constructor(private readonly accessToken: string, private readonly notificationUrl: string, private readonly http: FetchLike = fetch) {}

  async createPix(input: { orderId: string; amountCents: number; email: string; cpf?: string; description: string; expiresAt: Date }): Promise<PixCharge> {
    const res = await this.http(`${API}/v1/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        // Mesma chave = mesma cobrança, mesmo se a requisição for repetida.
        'X-Idempotency-Key': input.orderId,
      },
      body: JSON.stringify({
        transaction_amount: input.amountCents / 100,
        description: input.description,
        payment_method_id: 'pix',
        external_reference: input.orderId,
        notification_url: this.notificationUrl,
        date_of_expiration: input.expiresAt.toISOString().replace('Z', '-00:00'),
        payer: { email: input.email, ...(input.cpf ? { identification: { type: 'CPF', number: input.cpf } } : {}) },
      }),
    });
    const body = await res.json() as Record<string, any>;
    if (!res.ok) throw new Error(`Mercado Pago recusou a cobrança (${res.status}): ${body.message ?? ''}`);
    const tx = body.point_of_interaction?.transaction_data ?? {};
    return {
      id: String(body.id),
      status: String(body.status),
      qrCodeBase64: String(tx.qr_code_base64 ?? ''),
      copiaECola: String(tx.qr_code ?? ''),
      expiresAt: String(body.date_of_expiration ?? ''),
    };
  }

  async getPayment(id: string) {
    const res = await this.http(`${API}/v1/payments/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${this.accessToken}` } });
    const body = await res.json() as Record<string, any>;
    if (!res.ok) throw new Error(`Não foi possível consultar o pagamento ${id} (${res.status})`);
    return {
      id: String(body.id),
      status: String(body.status),
      externalReference: String(body.external_reference ?? ''),
      amountCents: Math.round(Number(body.transaction_amount) * 100),
    };
  }
}

/**
 * Confere a assinatura do aviso (webhook) do Mercado Pago.
 * Cabeçalho x-signature: "ts=...,v1=..."; o texto assinado é
 * "id:{data.id};request-id:{x-request-id};ts:{ts};" com HMAC-SHA256 da chave secreta.
 */
export function verifyWebhookSignature(opts: { signature: string | undefined; requestId: string | undefined; dataId: string; secret: string }): boolean {
  if (!opts.signature || !opts.secret) return false;
  const parts = Object.fromEntries(opts.signature.split(',').map((p) => p.trim().split('=') as [string, string]));
  const ts = parts.ts, v1 = parts.v1;
  if (!ts || !v1) return false;
  let manifest = `id:${opts.dataId.toLowerCase()};`;
  if (opts.requestId) manifest += `request-id:${opts.requestId};`;
  manifest += `ts:${ts};`;
  const expected = createHmac('sha256', opts.secret).update(manifest).digest('hex');
  return expected.length === v1.length && timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}
