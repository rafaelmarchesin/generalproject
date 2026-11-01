// Junta os sites compilados numa pasta só para o Firebase Hosting:
//   /        → editor (por enquanto; as páginas de venda entram na M3)
//   /p/...   → player (página do presente)
import { cpSync, existsSync, rmSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const out = new URL('hosting/', root);
const editor = new URL('apps/editor/dist/', root);
const player = new URL('apps/player/dist/', root);
for (const d of [editor, player]) if (!existsSync(d)) throw new Error(`Falta compilar: ${d.pathname}`);
rmSync(out, { recursive: true, force: true });
cpSync(editor, out, { recursive: true });
cpSync(player, new URL('p/', out), { recursive: true });
console.log('hosting/ pronto');
