import { HttpError } from './domain.js';
import { verifyWebhookSignature } from './mercadopago.js';
import { confirmPayment, createOrder, giftEvent, orderStatus, viewGift, type Deps } from './service.js';

export interface Req { method: string; path: string; body: unknown; headers: Record<string, string | undefined>; query: Record<string, string | undefined> }
export interface Res { status: number; body: unknown }

/** Rotas da API. Separado do Firebase para poder ser testado sem a nuvem. */
export async function handle(deps: Deps & { webhookSecret: string }, req: Req): Promise<Res> {
  const parts = req.path.replace(/^\/+|\/+$/g, '').split('/');
  if (parts[0] === 'api') parts.shift();
  const [resource, id, sub] = parts;
  try {
    if (resource === 'pedidos' && !id && req.method === 'POST') return { status: 201, body: await createOrder(deps, req.body) };
    if (resource === 'pedidos' && id && req.method === 'GET') return { status: 200, body: await orderStatus(deps, id) };

    if (resource === 'webhooks' && id === 'mercadopago' && req.method === 'POST') {
      const body = (req.body ?? {}) as { type?: string; data?: { id?: string | number } };
      const dataId = String(req.query['data.id'] ?? body.data?.id ?? '');
      const type = req.query.type ?? body.type;
      if (type !== 'payment' || !dataId) return { status: 200, body: { ignored: true } };
      const ok = verifyWebhookSignature({ signature: req.headers['x-signature'], requestId: req.headers['x-request-id'], dataId, secret: deps.webhookSecret });
      if (!ok) return { status: 401, body: { error: 'Assinatura inválida' } };
      return { status: 200, body: { result: await confirmPayment(deps, dataId) } };
    }

    if (resource === 'presentes' && id && !sub && req.method === 'POST') {
      const answer = (req.body as { resposta?: unknown } | undefined)?.resposta;
      return { status: 200, body: await viewGift(deps, id, typeof answer === 'string' ? answer : undefined) };
    }
    if (resource === 'presentes' && id && sub === 'eventos' && req.method === 'POST') {
      const ev = (req.body as { evento?: unknown } | undefined)?.evento;
      if (ev !== 'opened' && ev !== 'finished') return { status: 400, body: { error: 'Evento inválido' } };
      await giftEvent(deps, id, ev);
      return { status: 204, body: null };
    }
    return { status: 404, body: { error: 'Rota não encontrada' } };
  } catch (e) {
    if (e instanceof HttpError) return { status: e.status, body: { error: e.message } };
    console.error(e);
    return { status: 500, body: { error: 'Algo deu errado do nosso lado. Tente de novo em instantes.' } };
  }
}
