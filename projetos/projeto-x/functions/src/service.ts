import { applyPlanLimits, formatBRL, orderTotalCents, PLANS, PRESETS } from '@projeto-x/shared';
import {
  checkPassword, hashPassword, HttpError, newOrderId, newSlug, orderInputSchema,
  type Gift, type Mailer, type Order, type Payments, type Repo,
} from './domain.js';
import { deliveryEmail, openedEmail } from './emails.js';

export interface Deps {
  repo: Repo;
  payments: Payments;
  mailer: Mailer;
  /** Endereço público do site, ex.: https://projetox-dev.web.app */
  baseUrl: string;
  now?: () => Date;
}

const PIX_MINUTES = 30;

export function giftUrl(baseUrl: string, slug: string): string {
  return `${baseUrl.replace(/\/$/, '')}/p/${slug}`;
}

/** Cria o pedido e a cobrança Pix. O preço é sempre calculado aqui, nunca no navegador. */
export async function createOrder(deps: Deps, raw: unknown) {
  const parsed = orderInputSchema.safeParse(raw);
  if (!parsed.success) throw new HttpError(400, 'Dados do presente incompletos: ' + parsed.error.issues.map((i) => i.path.join('.')).join(', '));
  const input = parsed.data;
  const plan = PLANS[input.plan];
  if (!plan.onSale) throw new HttpError(400, `O pacote ${plan.name} ainda não está à venda.`);
  if (!plan.sealedAndPassword && (input.delivery.opensAt || input.delivery.password)) {
    throw new HttpError(400, 'Lacre e senha fazem parte do pacote Completo.');
  }
  const now = (deps.now ?? (() => new Date()))();
  const order: Order = {
    id: newOrderId(),
    status: 'pending',
    plan: input.plan,
    addons: input.addons,
    amountCents: orderTotalCents(input.plan, input.addons),
    email: input.email.toLowerCase(),
    ...(input.cpf ? { cpf: input.cpf } : {}),
    config: applyPlanLimits(input.config, input.plan),
    delivery: input.delivery,
    ...(input.utm ? { utm: input.utm } : {}),
    createdAt: now.toISOString(),
  };
  await deps.repo.createOrder(order);
  const expiresAt = new Date(now.getTime() + PIX_MINUTES * 60_000);
  const pix = await deps.payments.createPix({
    orderId: order.id,
    amountCents: order.amountCents,
    email: order.email,
    cpf: order.cpf,
    description: `Projeto X · ${plan.name} · ${PRESETS[order.config.occasion].label}`,
    expiresAt,
  });
  await deps.repo.updateOrder(order.id, { payment: { provider: 'mercadopago', id: pix.id, status: pix.status } });
  return {
    orderId: order.id,
    status: 'pending' as const,
    amountCents: order.amountCents,
    pix: { qrCodeBase64: pix.qrCodeBase64, copiaECola: pix.copiaECola, expiresAt: pix.expiresAt || expiresAt.toISOString() },
  };
}

export async function orderStatus(deps: Deps, orderId: string) {
  const order = await deps.repo.getOrder(orderId);
  if (!order) throw new HttpError(404, 'Pedido não encontrado.');
  // Plano B do aviso do Mercado Pago: se ainda está pendente, consulta o pagamento direto.
  if (order.status === 'pending' && order.payment) await confirmPayment(deps, order.payment.id);
  const fresh = (await deps.repo.getOrder(orderId))!;
  return {
    status: fresh.status === 'paid' ? 'paid' as const : 'pending' as const,
    ...(fresh.giftSlug ? { giftUrl: giftUrl(deps.baseUrl, fresh.giftSlug) } : {}),
  };
}

/**
 * Consulta o pagamento no Mercado Pago (nunca confia no conteúdo do aviso) e, se
 * aprovado, publica o presente uma única vez e envia o e-mail de entrega.
 */
export async function confirmPayment(deps: Deps, paymentId: string): Promise<'paid' | 'ignored'> {
  const payment = await deps.payments.getPayment(paymentId);
  if (payment.status !== 'approved') return 'ignored';
  const order = await deps.repo.getOrder(payment.externalReference);
  if (!order) return 'ignored';
  if (payment.amountCents !== order.amountCents) {
    console.error('Valor pago diferente do pedido', { orderId: order.id, paid: payment.amountCents, expected: order.amountCents });
    return 'ignored';
  }
  const now = (deps.now ?? (() => new Date()))().toISOString();
  const gift: Gift = {
    slug: newSlug(),
    orderId: order.id,
    config: order.config,
    buyerEmail: order.email,
    ...(order.delivery.opensAt ? { opensAt: order.delivery.opensAt } : {}),
    ...(order.delivery.password ? { password: hashPassword(order.delivery.password.question, order.delivery.password.answer) } : {}),
    createdAt: now,
  };
  const created = await deps.repo.markPaidAndCreateGift(order.id, { provider: 'mercadopago', id: payment.id, status: payment.status }, gift);
  if (created) {
    const url = giftUrl(deps.baseUrl, gift.slug);
    await deps.mailer.send({
      to: order.email,
      subject: `Seu presente para ${order.config.receiver.name} está pronto`,
      html: deliveryEmail({ url, receiver: order.config.receiver.name, plan: PLANS[order.plan].name, total: formatBRL(order.amountCents), opensAt: gift.opensAt }),
    }).catch((e) => console.error('Falha ao enviar e-mail de entrega', e));
  }
  return 'paid';
}

export type GiftView =
  | { state: 'sealed'; opensAt: string; giver: string; shell: string }
  | { state: 'password'; question: string; giver: string; shell: string; wrong?: boolean }
  | { state: 'open'; config: Gift['config'] };

/** O conteúdo só sai do servidor depois da data de abertura e da senha certa. */
export async function viewGift(deps: Deps, slug: string, answer?: string): Promise<GiftView> {
  const gift = await deps.repo.getGift(slug);
  if (!gift) throw new HttpError(404, 'Presente não encontrado.');
  const now = (deps.now ?? (() => new Date()))();
  const base = { giver: gift.config.giver.name, shell: gift.config.shell };
  if (gift.opensAt && new Date(gift.opensAt) > now) return { state: 'sealed', opensAt: gift.opensAt, ...base };
  if (gift.password) {
    if (answer === undefined) return { state: 'password', question: gift.password.question, ...base };
    if (!checkPassword(gift.password, answer)) return { state: 'password', question: gift.password.question, wrong: true, ...base };
  }
  return { state: 'open', config: gift.config };
}

/** Registra abertura e conclusão; avisa quem comprou na primeira vez de cada uma. */
export async function giftEvent(deps: Deps, slug: string, event: 'opened' | 'finished') {
  const gift = await deps.repo.getGift(slug);
  if (!gift) throw new HttpError(404, 'Presente não encontrado.');
  const field = event === 'opened' ? 'openedAt' : 'finishedAt';
  if (gift[field]) return;
  await deps.repo.updateGift(slug, { [field]: (deps.now ?? (() => new Date()))().toISOString() });
  await deps.mailer.send({
    to: gift.buyerEmail,
    subject: event === 'opened' ? `${gift.config.receiver.name} abriu seu presente` : `${gift.config.receiver.name} chegou ao final do jogo`,
    html: openedEmail({ receiver: gift.config.receiver.name, event }),
  }).catch((e) => console.error('Falha ao enviar aviso', e));
}
