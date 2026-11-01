# generalproject

Monorepo de projetos de oportunidade. Cada negócio vive em `projetos/<nome>`; peças reaproveitáveis ficam em `compartilhado/`.

| Pasta | Conteúdo |
| --- | --- |
| `projetos/projeto-x` | Presente digital: mini game retrô personalizado (projeto atual) |
| `compartilhado/tsconfig` | Configuração base de TypeScript |
| `docs/estrategia` | Estudos de oportunidade e a concepção do Projeto X |

## Como rodar

Requer Node 22 e pnpm 10.

```bash
pnpm install
pnpm test        # testes de todos os pacotes
pnpm build       # compila tudo
pnpm dev:x       # abre o player do Projeto X em http://localhost:5173/?ocasiao=pedido
```
