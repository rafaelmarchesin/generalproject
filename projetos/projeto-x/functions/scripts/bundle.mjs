// Gera functions/deploy: um único arquivo com o código (incluindo @projeto-x/shared)
// e um package.json limpo, que é o que o Firebase envia para a nuvem.
import { build } from 'esbuild';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
mkdirSync(new URL('../deploy/', import.meta.url), { recursive: true });
await build({
  entryPoints: [new URL('../src/index.ts', import.meta.url).pathname],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outfile: new URL('../deploy/index.js', import.meta.url).pathname,
  external: ['firebase-admin', 'firebase-admin/*', 'firebase-functions', 'firebase-functions/*'],
  sourcemap: true,
});
writeFileSync(new URL('../deploy/package.json', import.meta.url), JSON.stringify({
  name: 'projeto-x-functions',
  private: true,
  type: 'module',
  main: 'index.js',
  engines: { node: '22' },
  dependencies: { 'firebase-admin': pkg.dependencies['firebase-admin'], 'firebase-functions': pkg.dependencies['firebase-functions'] },
}, null, 2) + '\n');
// Parâmetros por projeto (.env.projetox-dev etc.) seguem junto; o modelo .env.example não.
const dir = new URL('../', import.meta.url);
for (const f of readdirSync(dir)) if (/^\.env\.[\w-]+$/.test(f) && f !== '.env.example') copyFileSync(new URL(f, dir), new URL(`deploy/${f}`, dir));
console.log('functions/deploy pronto');
