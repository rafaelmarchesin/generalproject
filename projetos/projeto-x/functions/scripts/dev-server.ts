/**
 * Servidor local do Projeto X com Mercado Pago simulado e banco em memória.
 *   pnpm x:hosting && pnpm --filter @projeto-x/functions dev
 *   http://localhost:5050          → editor
 *   http://localhost:5050/p/CODIGO → presente
 * O Pix simulado é aprovado sozinho 4 segundos depois de gerado.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { handle } from '../src/http.js';
import { FakeMP, MemRepo } from '../src/testing.js';

const PORT = Number(process.env.PORT ?? 5050);
const ROOT = new URL('../../hosting/', import.meta.url).pathname;
const repo = new MemRepo();
const mp = new FakeMP();
const TYPES: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };

const origCreate = mp.createPix.bind(mp);
mp.createPix = async (i) => {
  const c = await origCreate(i);
  setTimeout(() => { const ch = mp.charges.get(c.id); if (ch) ch.status = 'approved'; console.log(`Pix ${c.id} aprovado (simulado)`); }, 4000);
  return c;
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  if (url.pathname.startsWith('/api/')) {
    const chunks: Buffer[] = [];
    for await (const c of req) chunks.push(c as Buffer);
    const raw = Buffer.concat(chunks).toString('utf8');
    const out = await handle({
      repo, payments: mp, baseUrl: `http://localhost:${PORT}`, webhookSecret: 'local',
      mailer: { send: async (m) => console.log(`E-mail para ${m.to}: ${m.subject}`) },
    }, {
      method: req.method ?? 'GET', path: url.pathname, body: raw ? JSON.parse(raw) : undefined,
      headers: {}, query: Object.fromEntries(url.searchParams),
    });
    res.writeHead(out.status, { 'Content-Type': 'application/json' });
    res.end(out.body === null ? '' : JSON.stringify(out.body));
    return;
  }
  let path = normalize(url.pathname).replace(/^(\.\.[/\\])+/, '');
  if (path.startsWith('/p/') && !path.startsWith('/p/assets/')) path = '/p/index.html';
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(join(ROOT, path));
    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('Não encontrado');
  }
}).listen(PORT, () => console.log(`Projeto X local em http://localhost:${PORT}`));
