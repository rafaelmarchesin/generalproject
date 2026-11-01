import { createHmac } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { demoConfig } from '@projeto-x/shared';
import type { Mailer } from './domain.js';
import { FakeMP, MemRepo } from './testing.js';
import { handle } from './http.js';
import { verifyWebhookSignature } from './mercadopago.js';

const SECRET = 'segredo-teste';
const sign = (dataId: string, requestId: string, ts = '1700000000') =>
  `ts=${ts},v1=${createHmac('sha256', SECRET).update(`id:${dataId};request-id:${requestId};ts:${ts};`).digest('hex')}`;

describe('API do Projeto X', () => {
  let repo: MemRepo, mp: FakeMP, mails: { to: string; subject: string }[], deps: Parameters<typeof handle>[0];
  let now = new Date('2026-11-02T12:00:00Z');
  beforeEach(() => {
    repo = new MemRepo(); mp = new FakeMP(); mails = [];
    const mailer: Mailer = { send: async (m) => { mails.push(m); } };
    now = new Date('2026-11-02T12:00:00Z');
    deps = { repo, payments: mp, mailer, baseUrl: 'https://px.test', webhookSecret: SECRET, now: () => now };
  });
  const req = (method: string, path: string, body?: unknown, headers: Record<string, string> = {}) =>
    handle(deps, { method, path, body, headers, query: {} });

  const newOrder = async (extra: Record<string, unknown> = {}) => {
    const r = await req('POST', '/api/pedidos', { config: demoConfig('pedido'), plan: 'completo', addons: ['cartucho'], email: 'Ana@Exemplo.com', ...extra });
    expect(r.status).toBe(201);
    return r.body as { orderId: string; amountCents: number; pix: { copiaECola: string } };
  };
  const pay = async (orderId: string) => {
    const paymentId = repo.orders.get(orderId)!.payment!.id;
    mp.charges.get(paymentId)!.status = 'approved';
    return req('POST', '/api/webhooks/mercadopago', { type: 'payment', data: { id: paymentId } }, { 'x-signature': sign(paymentId, 'req-1'), 'x-request-id': 'req-1' });
  };

  it('calcula o preço no servidor e gera o Pix', async () => {
    const o = await newOrder();
    expect(o.amountCents).toBe(5980);
    expect(o.pix.copiaECola).toMatch(/^PIX-/);
    expect(repo.orders.get(o.orderId)!.email).toBe('ana@exemplo.com');
  });

  it('recusa dados inválidos e pacote fora de venda', async () => {
    expect((await req('POST', '/api/pedidos', { plan: 'completo' })).status).toBe(400);
    expect((await req('POST', '/api/pedidos', { config: demoConfig(), plan: 'inesquecivel', email: 'a@b.co' })).status).toBe(400);
  });

  it('recusa aviso com assinatura inválida', async () => {
    const o = await newOrder();
    const id = repo.orders.get(o.orderId)!.payment!.id;
    const r = await req('POST', '/api/webhooks/mercadopago', { type: 'payment', data: { id } }, { 'x-signature': 'ts=1,v1=errado', 'x-request-id': 'x' });
    expect(r.status).toBe(401);
    expect(repo.orders.get(o.orderId)!.status).toBe('pending');
  });

  it('publica o presente uma única vez, mesmo com aviso repetido', async () => {
    const o = await newOrder();
    await pay(o.orderId); await pay(o.orderId);
    expect(repo.gifts.size).toBe(1);
    expect(mails.filter((m) => m.subject.includes('está pronto'))).toHaveLength(1);
    const st = await req('GET', `/api/pedidos/${o.orderId}`);
    expect(st.body).toMatchObject({ status: 'paid', giftUrl: expect.stringMatching(/^https:\/\/px\.test\/p\/[A-Za-z0-9]{12}$/) });
  });

  it('confirma pela consulta de status se o aviso não chegar', async () => {
    const o = await newOrder();
    mp.charges.get(repo.orders.get(o.orderId)!.payment!.id)!.status = 'approved';
    expect((await req('GET', `/api/pedidos/${o.orderId}`)).body).toMatchObject({ status: 'paid' });
  });

  it('respeita lacre e senha no servidor', async () => {
    const o = await newOrder({ delivery: { opensAt: '2026-12-25T00:00:00-03:00', password: { question: 'Nome do nosso cachorro?', answer: 'Bolinha' } } });
    await pay(o.orderId);
    const slug = repo.orders.get(o.orderId)!.giftSlug!;
    expect((await req('POST', `/api/presentes/${slug}`)).body).toMatchObject({ state: 'sealed' });
    now = new Date('2026-12-25T10:00:00Z');
    expect((await req('POST', `/api/presentes/${slug}`)).body).toMatchObject({ state: 'password', question: 'Nome do nosso cachorro?' });
    expect((await req('POST', `/api/presentes/${slug}`, { resposta: 'rex' })).body).toMatchObject({ state: 'password', wrong: true });
    const open = await req('POST', `/api/presentes/${slug}`, { resposta: '  bolinha ' });
    expect(open.body).toMatchObject({ state: 'open', config: { occasion: 'pedido' } });
  });

  it('avisa quem comprou na primeira abertura', async () => {
    const o = await newOrder();
    await pay(o.orderId);
    const slug = repo.orders.get(o.orderId)!.giftSlug!;
    await req('POST', `/api/presentes/${slug}/eventos`, { evento: 'opened' });
    await req('POST', `/api/presentes/${slug}/eventos`, { evento: 'opened' });
    expect(mails.filter((m) => m.subject.includes('abriu'))).toHaveLength(1);
  });

  it('não aceita lacre no Clássico', async () => {
    const r = await req('POST', '/api/pedidos', { config: demoConfig(), plan: 'classico', email: 'a@b.co', delivery: { opensAt: '2026-12-25T00:00:00-03:00' } });
    expect(r.status).toBe(400);
  });
});

describe('assinatura do Mercado Pago', () => {
  it('aceita a assinatura correta e recusa a adulterada', () => {
    expect(verifyWebhookSignature({ signature: sign('123', 'abc'), requestId: 'abc', dataId: '123', secret: SECRET })).toBe(true);
    expect(verifyWebhookSignature({ signature: sign('123', 'abc'), requestId: 'abc', dataId: '124', secret: SECRET })).toBe(false);
  });
});
