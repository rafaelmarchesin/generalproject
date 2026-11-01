import type { Gift, Order, Payments, Repo } from './domain.js';

/** Banco em memória: usado nos testes e no servidor local. */
export class MemRepo implements Repo {
  orders = new Map<string, Order>(); gifts = new Map<string, Gift>();
  async createOrder(o: Order) { this.orders.set(o.id, structuredClone(o)); }
  async getOrder(id: string) { return structuredClone(this.orders.get(id) ?? null); }
  async updateOrder(id: string, p: Partial<Order>) { this.orders.set(id, { ...this.orders.get(id)!, ...p }); }
  async getGift(s: string) { return structuredClone(this.gifts.get(s) ?? null); }
  async updateGift(s: string, p: Partial<Gift>) { this.gifts.set(s, { ...this.gifts.get(s)!, ...p }); }
  async markPaidAndCreateGift(id: string, payment: Order['payment'], gift: Gift) {
    const o = this.orders.get(id);
    if (!o || o.status === 'paid') return false;
    this.gifts.set(gift.slug, gift);
    this.orders.set(id, { ...o, status: 'paid', payment, giftSlug: gift.slug, paidAt: gift.createdAt });
    return true;
  }
}

/** Mercado Pago simulado: cobranças ficam pendentes até serem aprovadas. */
export class FakeMP implements Payments {
  charges = new Map<string, { orderId: string; amountCents: number; status: string }>();
  async createPix(i: { orderId: string; amountCents: number }) {
    const id = String(1000 + this.charges.size);
    this.charges.set(id, { orderId: i.orderId, amountCents: i.amountCents, status: 'pending' });
    return { id, status: 'pending', qrCodeBase64: 'QR', copiaECola: 'PIX-' + id, expiresAt: '2026-11-02T12:30:00.000Z' };
  }
  async getPayment(id: string) { const c = this.charges.get(id)!; return { id, status: c.status, externalReference: c.orderId, amountCents: c.amountCents }; }
}
