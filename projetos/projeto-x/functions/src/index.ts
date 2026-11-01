import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import { FirestoreRepo } from './firestore-repo.js';
import { handle } from './http.js';
import { ResendMailer } from './mailer.js';
import { MercadoPago } from './mercadopago.js';

initializeApp();

const MP_ACCESS_TOKEN = defineSecret('MP_ACCESS_TOKEN');
const MP_WEBHOOK_SECRET = defineSecret('MP_WEBHOOK_SECRET');
const RESEND_API_KEY = defineSecret('RESEND_API_KEY');
const PUBLIC_BASE_URL = defineString('PUBLIC_BASE_URL', { description: 'Endereço público do site, ex.: https://projetox-dev.web.app' });
const MAIL_FROM = defineString('MAIL_FROM', { default: 'Projeto X <onboarding@resend.dev>' });

export const api = onRequest(
  { region: 'southamerica-east1', secrets: [MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET, RESEND_API_KEY], maxInstances: 20, memory: '256MiB', timeoutSeconds: 30 },
  async (req, res) => {
    const baseUrl = PUBLIC_BASE_URL.value();
    const result = await handle({
      repo: new FirestoreRepo(getFirestore()),
      payments: new MercadoPago(MP_ACCESS_TOKEN.value(), `${baseUrl}/api/webhooks/mercadopago`),
      mailer: new ResendMailer(RESEND_API_KEY.value(), MAIL_FROM.value()),
      baseUrl,
      webhookSecret: MP_WEBHOOK_SECRET.value(),
    }, {
      method: req.method,
      path: req.path,
      body: req.body,
      headers: { 'x-signature': req.get('x-signature'), 'x-request-id': req.get('x-request-id') },
      query: Object.fromEntries(Object.entries(req.query).map(([k, v]) => [k, typeof v === 'string' ? v : undefined])),
    });
    res.set('Cache-Control', 'no-store');
    if (result.body === null) res.status(result.status).end();
    else res.status(result.status).json(result.body);
  },
);
