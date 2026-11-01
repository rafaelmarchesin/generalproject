# Projeto X

Presente digital: um mini game retrô em pixel art estrelado por quem recebe. Concepção completa em `docs/estrategia/projeto-x-concepcao.md`.

## Partes

| Pasta | O que é | Situação |
| --- | --- | --- |
| `packages/shared` | Formato do presente (validação com zod), pacotes, preços e textos de exemplo | Pronto (M1) |
| `packages/engine` | Motor do jogo: console, 4 fases, 5 finais, sons, pixelização | Pronto (M1) |
| `apps/player` | Página onde o presente é aberto | Pronto com exemplos (M1); dados reais na M2 |
| `apps/editor` | Criação do jogo, prévia e pagamento | M2 |
| `functions` | Pedidos, Mercado Pago, entrega, nota fiscal, e-mails | M2 |
| `apps/site` | Páginas de venda | M3 |
| `prototipo` | Protótipo original, mantido como referência | Congelado |

## Testar o player

```bash
pnpm dev:x
# http://localhost:5173/?ocasiao=namoro   (namoro, pedido, natal, cha, aniversario)
# &ajuda=1000  faz o "B: pular fase" aparecer depois de 1 segundo
```

## Configuração do Firebase (feita uma vez)

1. Criar os projetos `projetox-dev` e `projetox-prod` no console do Firebase, no plano Blaze, com alerta de orçamento.
2. Firestore e Functions na região `southamerica-east1` (São Paulo).
3. Criar uma conta de serviço com papel "Firebase Hosting Admin" (e, na M2, "Cloud Functions Admin") e baixar o JSON.
4. No GitHub (Settings → Secrets and variables → Actions):
   - variável `PROJETO_X_FIREBASE_DEV` = `projetox-dev`
   - segredo `PROJETO_X_FIREBASE_SA_DEV` = conteúdo do JSON
5. Se os ids forem diferentes, atualizar `.firebaserc`.

Com isso, todo pull request ganha uma prévia publicada automaticamente.

## Mercado Pago

As credenciais de teste (Public Key e Access Token) vão para os segredos do Firebase na M2, nunca para o código.
