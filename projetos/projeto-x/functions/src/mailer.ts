import type { Mailer } from './domain.js';

/** Envio pelo Resend. Sem chave configurada, só registra no log (útil em desenvolvimento). */
export class ResendMailer implements Mailer {
  constructor(private readonly apiKey: string, private readonly from: string) {}
  async send(msg: { to: string; subject: string; html: string }) {
    if (!this.apiKey) { console.info('E-mail não enviado (sem RESEND_API_KEY):', msg.to, msg.subject); return; }
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: this.from, to: [msg.to], subject: msg.subject, html: msg.html }),
    });
    if (!res.ok) throw new Error(`Resend respondeu ${res.status}: ${await res.text()}`);
  }
}
