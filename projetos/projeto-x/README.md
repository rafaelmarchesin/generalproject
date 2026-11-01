# Projeto X

Presente digital: um mini game retrô em pixel art estrelado por quem recebe. Concepção completa em `docs/estrategia/projeto-x-concepcao.md`.

## Partes

| Pasta | O que é | Situação |
| --- | --- | --- |
| `packages/shared` | Formato do presente (validação com zod), pacotes, preços e textos de exemplo | Pronto (M1) |
| `packages/engine` | Motor do jogo: console, 4 fases, 5 finais, sons, pixelização | Pronto (M1) |
| `apps/player` | Página onde o presente é aberto | Pronto com exemplos (M1); dados reais na M2 |
| `apps/editor` | Criação do jogo em 7 passos, recorte do rosto, prévia jogável e checkout | Pronto (M2); pagamento em modo demonstração até o back-end entrar |
| `functions` | API: pedidos, Pix do Mercado Pago, aviso de pagamento, publicação do presente, lacre e senha, e-mails | Pronto (M2), falta publicar; nota fiscal na M3 |
| `apps/site` | Páginas de venda | M3 |
| `prototipo` | Protótipo original, mantido como referência | Congelado |

## Testar o player

```bash
pnpm dev:x            # player
pnpm --filter @projeto-x/editor dev   # editor em http://localhost:5174
# http://localhost:5173/?ocasiao=namoro   (namoro, pedido, natal, cha, aniversario)
# &ajuda=1000  faz o "B: pular fase" aparecer depois de 1 segundo
```

## Rodar tudo localmente (Mercado Pago simulado)

```bash
pnpm x:hosting                                   # compila editor, player e funções
pnpm --filter @projeto-x/functions dev           # http://localhost:5050
```
O Pix simulado é aprovado sozinho 4 segundos depois de gerado, e os e-mails aparecem no terminal.

## Configuração do Firebase (feita uma vez)

1. Criar os projetos `projetox-dev` e `projetox-prod` no console do Firebase, no plano Blaze, com alerta de orçamento.
2. Firestore e Functions na região `southamerica-east1` (São Paulo).
3. Criar uma conta de serviço com papel "Firebase Hosting Admin" (e, na M2, "Cloud Functions Admin") e baixar o JSON.
4. No GitHub (Settings → Secrets and variables → Actions):
   - variável `PROJETO_X_FIREBASE_DEV` = `projetox-dev`
   - segredo `PROJETO_X_FIREBASE_SA_DEV` = conteúdo do JSON
5. Se os ids forem diferentes, atualizar `.firebaserc`.

Com isso, todo pull request ganha uma prévia publicada automaticamente.

## Segredos e parâmetros das funções

Cadastrados uma vez por projeto, pelo terminal (nunca no código nem no chat):

```bash
cd projetos/projeto-x
npx firebase-tools@13 functions:secrets:set MP_ACCESS_TOKEN   --project projetox-dev   # Access Token de TESTE do Mercado Pago
npx firebase-tools@13 functions:secrets:set MP_WEBHOOK_SECRET --project projetox-dev   # assinatura secreta dos webhooks (painel do Mercado Pago)
npx firebase-tools@13 functions:secrets:set RESEND_API_KEY    --project projetox-dev   # chave do Resend (e-mails)
```

Parâmetros não secretos (`PUBLIC_BASE_URL`, `MAIL_FROM`): o deploy pergunta na primeira vez, ou use o modelo `functions/.env.example`.

No painel do Mercado Pago (Suas integrações → Webhooks), cadastrar a URL
`https://projetox-dev.web.app/api/webhooks/mercadopago` com o evento "Pagamentos".

## Publicar

GitHub → Actions → "Projeto X - publicar" → Run workflow (dev ou prod).
