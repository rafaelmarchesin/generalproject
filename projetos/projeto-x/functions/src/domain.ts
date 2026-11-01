import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { ADDONS, giftConfigSchema, PLAN_IDS, type AddonId, type GiftConfig, type PlanId } from '@projeto-x/shared';

export const deliverySchema = z.object({
  /** Abertura agendada (presente lacrado), em ISO 8601. */
  opensAt: z.string().datetime({ offset: true }).optional(),
  password: z.object({
    question: z.string().trim().min(3).max(60),
    answer: z.string().trim().min(1).max(40),
  }).optional(),
}).default({});

export const orderInputSchema = z.object({
  config: giftConfigSchema,
  plan: z.enum(PLAN_IDS),
  addons: z.array(z.enum(Object.keys(ADDONS) as [AddonId, ...AddonId[]])).max(5).default([]),
  email: z.string().trim().email('E-mail inválido').max(120),
  cpf: z.string().regex(/^\d{11}$/).optional(),
  delivery: deliverySchema,
  utm: z.record(z.string().max(100)).optional(),
});

export type OrderInput = z.infer<typeof orderInputSchema>;
export type Delivery = z.infer<typeof deliverySchema>;

export type OrderStatus = 'pending' | 'paid' | 'refunded' | 'cancelled';

export interface Order {
  id: string;
  status: OrderStatus;
  plan: PlanId;
  addons: AddonId[];
  amountCents: number;
  email: string;
  cpf?: string;
  config: GiftConfig;
  delivery: Delivery;
  utm?: Record<string, string>;
  payment?: { provider: 'mercadopago'; id: string; status: string };
  giftSlug?: string;
  createdAt: string;
  paidAt?: string;
}

export interface StoredPassword { question: string; salt: string; hash: string }

export interface Gift {
  slug: string;
  orderId: string;
  config: GiftConfig;
  buyerEmail: string;
  opensAt?: string;
  password?: StoredPassword;
  createdAt: string;
  openedAt?: string;
  finishedAt?: string;
}

export interface Repo {
  createOrder(o: Order): Promise<void>;
  getOrder(id: string): Promise<Order | null>;
  updateOrder(id: string, patch: Partial<Order>): Promise<void>;
  /** Marca o pedido como pago e cria o presente numa única transação; devolve false se já estava pago. */
  markPaidAndCreateGift(orderId: string, payment: Order['payment'], gift: Gift): Promise<boolean>;
  getGift(slug: string): Promise<Gift | null>;
  updateGift(slug: string, patch: Partial<Gift>): Promise<void>;
}

export interface PixCharge { id: string; status: string; qrCodeBase64: string; copiaECola: string; expiresAt: string }

export interface Payments {
  createPix(input: { orderId: string; amountCents: number; email: string; cpf?: string; description: string; expiresAt: Date }): Promise<PixCharge>;
  getPayment(id: string): Promise<{ id: string; status: string; externalReference: string; amountCents: number }>;
}

export interface Mailer {
  send(msg: { to: string; subject: string; html: string }): Promise<void>;
}

/** Código do link do presente: 12 caracteres, cerca de 71 bits, impossível de adivinhar. */
export function newSlug(): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 12 }, () => alphabet[randomInt(alphabet.length)]).join('');
}

export function newOrderId(): string {
  return 'px_' + randomBytes(9).toString('base64url');
}

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');

export function hashPassword(question: string, answer: string): StoredPassword {
  const salt = randomBytes(12).toString('base64url');
  return { question, salt, hash: createHash('sha256').update(salt + ':' + normalize(answer)).digest('hex') };
}

/** Compara sem diferenciar maiúsculas e acentos ("Bolinha" = "bolinha"). */
export function checkPassword(stored: StoredPassword, answer: string): boolean {
  const h = createHash('sha256').update(stored.salt + ':' + normalize(answer)).digest();
  return timingSafeEqual(h, Buffer.from(stored.hash, 'hex'));
}

export class HttpError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}
