import type { Firestore } from 'firebase-admin/firestore';
import type { Gift, Order, Repo } from './domain.js';

/** Remove campos undefined (o Firestore não aceita). */
const clean = <T extends object>(o: T): T => JSON.parse(JSON.stringify(o)) as T;

export class FirestoreRepo implements Repo {
  constructor(private readonly db: Firestore) {}
  private orders() { return this.db.collection('orders'); }
  private gifts() { return this.db.collection('gifts'); }

  async createOrder(o: Order) { await this.orders().doc(o.id).create(clean(o)); }
  async getOrder(id: string) { const s = await this.orders().doc(id).get(); return s.exists ? (s.data() as Order) : null; }
  async updateOrder(id: string, patch: Partial<Order>) { await this.orders().doc(id).update(clean(patch)); }
  async getGift(slug: string) { const s = await this.gifts().doc(slug).get(); return s.exists ? (s.data() as Gift) : null; }
  async updateGift(slug: string, patch: Partial<Gift>) { await this.gifts().doc(slug).update(clean(patch)); }

  async markPaidAndCreateGift(orderId: string, payment: Order['payment'], gift: Gift): Promise<boolean> {
    return this.db.runTransaction(async (tx) => {
      const ref = this.orders().doc(orderId);
      const snap = await tx.get(ref);
      const order = snap.data() as Order | undefined;
      if (!order || order.status === 'paid') return false;
      tx.set(this.gifts().doc(gift.slug), clean(gift));
      tx.update(ref, clean({ status: 'paid', payment, paidAt: gift.createdAt, giftSlug: gift.slug }));
      return true;
    });
  }
}
