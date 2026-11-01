# Plano de crescimento: app de revenda e consignado integrado à Nuvemshop

> Aprofundamento de `oportunidade-apps-ecommerce.md`. Pesquisa de novembro de 2026, feita por busca indexada no domínio da Nuvemshop (o acesso direto ao site está bloqueado pela política de rede desta sessão).

---

## 1. O que a pesquisa aprofundada mudou

A primeira análise supunha uma loja de apps "vazia" (300 apps). **Não é bem assim.** O quadro real:

| Fato | Fonte | Consequência |
|---|---|---|
| A loja tem **700+ apps** para cerca de 180 mil lojistas na América Latina | [GetApp/E-commerce na Prática](https://ecommercenapratica.com/blog/nuvemshop-review/), [Nuvemshop Companhia](https://www.nuvemshop.com.br/companhia-nova) | Mais concorrência do que eu supunha |
| Lojas brasileiras da Nuvemshop venderam **+44%** no 1º semestre de 2026; meta de GMV de R$ 20 bilhões em 2026 | [Gironews](https://gironews.com/varejo-digital/e-commerce-cresce-44-no-primeiro-semestre-aponta-nuvemshop/), [Mercado & Consumo](https://mercadoeconsumo.com.br/22/06/2026/ecommerce/nuvemshop-mira-r-20-bilhoes-em-vendas-de-parceiros-e-mantem-ipo-no-radar/) | Plataforma crescendo: o mercado de apps cresce junto |
| Uma desenvolvedora (Empreender) domina vários apps populares: Cheguei (avise-me, R$ 59/mês), Lily Reviews (avaliações), **Frete Hero (pré-venda, app oficial a pedido da Nuvemshop, R$ 59 a R$ 549/mês)** | [Cheguei](https://www.nuvemshop.com.br/loja-aplicativos-nuvem/cheguei-avise-me), [Frete Hero](https://www.nuvemshop.com.br/loja-aplicativos-nuvem/frete-hero), [E-Commerce Brasil](https://www.ecommercebrasil.com.br/noticias/lojas-nuvemshop-melhoram-seus-resultados-com-ferramentas-do-empreender-plus) | Os apps "simples" que eu tinha listado **já têm dono forte** |
| **Atacado** (tabelas de preço, pedido mínimo) e **assinatura** já são **nativos** (a partir do plano Impulso) | [Atacado](https://atendimento.nuvemshop.com.br/pt_BR/varejo-e-atacado/o-que-e-e-como-configurar-o-recurso-de-vendas-no-atacado-e-varejo-da-nuvemshop), [Assinatura](https://atendimento.nuvemshop.com.br/pt_BR/venda-por-assinatura/como-vender-produto-por-assinatura-na-nuvemshop) | Riscar esses dois da lista |
| Tabela de medidas: já há Abejita e Sizebay, além de recurso nativo | [Abejita](https://www.nuvemshop.com.br/loja-aplicativos-nuvem/size-guides-size-chart), [Ajuda](https://atendimento.nuvemshop.com.br/pt_BR/paginas-de-conteudo/como-adicionar-uma-guia-de-medidas-na-minha-loja) | Riscar |
| **Revendedores/afiliados:** "Fidelizar +Afiliados" tem **nota 2,9**; "Afiliados Creators" custa R$ 19/mês e tem **1 avaliação**; nenhum dos dois cuida de **consignado/maleta** | [Fidelizar](https://www.nuvemshop.com.br/loja-aplicativos-nuvem/fidelizar-mais-afiliados), [Afiliados Creators](https://www.nuvemshop.com.br/loja-aplicativos-nuvem/parceiros2) | **Lacuna real**: concorrência fraca dentro da loja de apps |
| Fora da Nuvemshop, há sistemas de consignado para semijoias cobrando **R$ 89,99 a R$ 379,90/mês**: Jueri, Dynamic PRO, Gestão Joias, EasySale. **Nenhum é um app integrado à loja virtual** | [Jueri](https://jueri.com.br/), [Dynamic PRO](https://dynamicpro.com.br/), [Gestão Joias](https://gestaojoias.com.br/), [EasySale](https://easysale.io/) | **Prova de que o lojista paga caro por isso** e de que falta a integração |
| Venda direta no Brasil: cerca de **3,5 milhões de revendedores independentes** (dado ABEVD de 2023) | [Monitor Mercantil](https://monitormercantil.com.br/congresso-de-vendas-diretas-reunira-gigantes-do-setor-em-sao-paulo/) | Hábito de venda enorme e muito brasileiro |
| Cobrança de apps: o desenvolvedor pode cobrar **pela Nuvemshop** (junto com o plano da loja; após o teste, a cobrança automática é opcional) **ou diretamente** (saque pelo portal de parceiros, já com taxas e nota descontadas) | [Ajuda Nuvemshop](https://atendimento.nuvemshop.com.br/pt_BR/parceiros-tecnologicos/como-eu-recebo-pelo-uso-do-meu-aplicativo-criado-na-nuvemshop), [Pagamento de apps](https://atendimento.nuvemshop.com.br/pt_BR/pague-seu-plano/como-e-feito-o-pagamento-dos-aplicativos-instalados-na-minha-nuvemshop) | Validar qual modelo dá menos atrito |

### Conclusão da revisão
**Trocar a estratégia "fábrica de muitos apps simples" por "um app mais profundo, num problema caro e mal atendido".** Os apps simples já têm dono. Esse problema é **revenda e consignado (maleta) integrados ao estoque da loja virtual**.

---

## 2. A oportunidade: "Revenda Integrada"

### O problema
Marcas e lojas de **semijoias, moda, moda íntima, cosméticos e fitness** vendem por dois canais ao mesmo tempo:
1. a loja virtual (Nuvemshop);
2. uma rede de **revendedoras**, que recebem **maletas consignadas** ou compram com desconto.

Hoje o lojista:
- controla a maleta numa planilha ou num sistema separado (Jueri, Dynamic PRO…);
- **não tem o estoque sincronizado**: a peça que está na maleta aparece disponível no site, e a venda dá errado;
- faz o "acerto" (vendido × devolvido × comissão) à mão, com erro e briga;
- não dá à revendedora um **catálogo online próprio** para ela vender pelo WhatsApp com o link dela.

### A solução (um app da Nuvemshop + um portal da revendedora)
| Para o lojista (painel no admin da Nuvemshop) | Para a revendedora (app web no celular) |
|---|---|
| Cadastro e aprovação de revendedoras, níveis e metas | **Catálogo próprio** com o link dela, puxando produtos e estoque reais da loja |
| **Maleta consignada**: separa as peças, o estoque da loja é baixado automaticamente, e o app gera o romaneio em PDF | Vê a maleta dela, marca o que vendeu, registra o cliente |
| **Acerto automático**: vendido + devolvido → comissão → cobrança/recebimento por Pix | Vê comissão, metas, ranking |
| Pedidos de reposição da revendedora entram como pedidos na Nuvemshop (com preço de revenda) | Faz pedidos de reposição pelo celular |
| Comissão por link/cupom nas vendas online da revendedora | Compartilha produtos no WhatsApp/Instagram com o link dela |
| Relatórios: quem vende mais, peças paradas, inadimplência | Avisos de prazo de acerto |

**O diferencial em uma frase:** *"A maleta da revendedora, o estoque do site e a comissão no mesmo lugar, sincronizados com a sua Nuvemshop."*

### Por que essa é a melhor aposta
1. **Dor cara e comprovada:** lojistas já pagam de R$ 90 a R$ 380/mês por sistemas de consignado **não integrados**.
2. **Concorrência fraca dentro da loja de apps** (nota 2,9 e apps sem consignado).
3. **Retenção altíssima:** a operação da rede de revendedoras roda dentro do app; sair dele custa caro.
4. **Ticket alto** para um app (R$ 97 a R$ 297/mês), então poucos clientes já pagam as contas.
5. **Efeito multiplicador:** cada revendedora usa o portal. Revendedoras de várias marcas espalham o nome entre lojistas.
6. **Sem IA generativa e sem custo variável relevante.**

---

## 3. Modelo de preço

| Plano | Revendedoras ativas | Preço/mês | Observação |
|---|---|---|---|
| Começo | até 10 | R$ 97 | Para quem está montando a rede |
| Rede | até 50 | R$ 197 | Plano principal |
| Pro | ilimitadas + múltiplos níveis/supervisoras | R$ 297 | Marcas maiores |
| Implantação assistida (opcional) | — | R$ 297 a R$ 497 (única) | Importar revendedoras e maletas, treinar a equipe |

- **Plano anual com 2 meses grátis**: dinheiro adiantado, importante para crescer rápido.
- Comparação: Jueri custa de R$ 109,90 a R$ 379,90 **sem** integração com a loja virtual.

---

## 4. Plano para crescer rápido (6 meses)

### Fase 0, semanas 1 e 2: validar antes de programar (custo ~R$ 0 a R$ 300)
1. **Mapear a loja de apps** (categorias "Vendas", "Marketing", "Gestão"), procurando apps de revenda, afiliados e consignado: nota, preço, avaliações e reclamações. Você pode fazer isso pelo Chrome, ou eu faço quando o domínio for liberado.
2. **20 conversas com lojistas de semijoias, moda e cosméticos** que usam Nuvemshop e têm revendedoras:
   - grupos de Facebook de lojistas Nuvemshop;
   - Instagram de marcas de semijoias;
   - **polos de semijoias, como Limeira (SP) e Guaporé (RS)**, onde há concentração de fabricantes que vendem por revenda.
3. Perguntas:
   - Quantas revendedoras você tem?
   - Como controla as maletas?
   - Quanto tempo leva o acerto?
   - Já vendeu peça que estava na maleta?
   - Quanto paga hoje?
4. **Pré-venda "cliente fundador"**: plano anual por R$ 997 (em vez de R$ 2.364) para os 10 primeiros, com implantação grátis.
5. **Critério de seguir:** pelo menos **5 fundadores pagantes** ou **10 cartas de intenção**. Se não bater, trocar o nicho (ex.: só moda, ou cosméticos) ou o problema, antes de escrever código.

### Fase 1, semanas 3 a 8: construir o MVP com os fundadores
- **Semanas 3 e 4:** base técnica: app parceiro Nuvemshop (OAuth, produtos, estoque, pedidos, webhooks), cadastro de revendedoras, portal da revendedora com catálogo e link.
- **Semanas 5 e 6:** **maletas + acerto + comissão** (o coração do produto) + romaneio em PDF + Pix.
- **Semanas 7 e 8:** pedidos de reposição, relatórios, ajustes com os fundadores, envio para aprovação na loja de apps.

### Fase 2, meses 3 e 4: lançamento na loja de apps
- Página do app com vídeo de 60 segundos e depoimentos dos fundadores.
- **Avaliações 5 estrelas dos fundadores** logo no lançamento (decisivas para o ranking).
- Teste grátis de 14 dias + implantação assistida como oferta de entrada.
- Conteúdo: "Como controlar maletas de revendedoras sem planilha", "Quanto pagar de comissão para revendedora".
- **Meta Ads** (R$ 1.000 a R$ 1.500): público de donos de marcas de semijoias, moda e cosméticos, com o vídeo do acerto automático. Destino: teste grátis.

### Fase 3, meses 5 e 6: multiplicar
- **Parceiros Especialistas da Nuvemshop** (agências que montam lojas): oferecer 20% de comissão recorrente para quem indicar o app.
- **Indicação entre lojistas:** um mês grátis para cada indicação que assinar.
- **Revendedoras como canal:** no portal, "Sua marca ainda não usa? Indique" (revendedoras trabalham para várias marcas).
- Versão em espanhol para a Tiendanube (México e Argentina têm forte cultura de venda por catálogo).
- **Segundo produto com o mesmo motor:** integração com outras plataformas (Shopify, Loja Integrada, Tray, Yampi) ou uma versão "sem loja" para concorrer direto com Jueri e Dynamic PRO.

### Projeção (estimativa)
| Mês | Pessimista | Base | Otimista |
|---|---|---|---|
| 1 | 3 fundadores (R$ 3 mil à vista) | 5 fundadores (R$ 5 mil) | 10 fundadores (R$ 10 mil) |
| 3 | 10 clientes, R$ 1,5 mil/mês | 25 clientes, R$ 4 mil/mês | 50 clientes, R$ 9 mil/mês |
| 6 | 25 clientes, R$ 4 mil/mês | 70 clientes, R$ 12 mil/mês | 150 clientes, R$ 28 mil/mês |

As **pré-vendas anuais do mês 1 já devolvem o investimento inicial**. Isso cumpre a meta de lucrar 100% ou mais em 6 meses mesmo no cenário pessimista.

### Investimento
| Item | Valor |
|---|---|
| Validação (anúncios de teste, brindes/visitas no polo de semijoias) | até R$ 300 |
| Infraestrutura (Firebase/Cloud Run) nos 6 meses | R$ 0 a R$ 600 |
| Domínio, termos de uso, política de privacidade | R$ 150 |
| Meta Ads de lançamento | R$ 1.000 a R$ 1.500 |
| **Total** | **R$ 1.450 a R$ 2.550** |

---

## 5. Arquitetura (construída aqui com Claude Code)

- **App Nuvemshop:** Node/TypeScript em Cloud Run, OAuth da Nuvemshop, webhooks (`order/created`, `order/paid`, produtos, estoque), painel React embutido no admin.
- **Portal da revendedora:** PWA (instala no celular sem loja de apps), login por link mágico/WhatsApp.
- **Banco:** Firestore (multi-loja, regras de segurança por loja).
- **Estoque:** a Nuvemshop é a fonte da verdade. A maleta é uma "reserva" que baixa o estoque e devolve no acerto (com trilha de auditoria).
- **Pix:** cobrança do acerto via provedor (Mercado Pago/Asaas) na conta do lojista. Nunca custodiamos dinheiro.
- **Pouca manutenção:** testes automatizados dos fluxos de maleta e acerto, monitoramento de erros, alertas de webhook com falha.

---

## 6. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| A Empreender ou a própria Nuvemshop lança algo parecido | Profundidade no consignado (difícil de copiar bem) + relacionamento próximo com os primeiros clientes |
| O lojista de semijoias não usa a Nuvemshop | Validar na fase 0; o motor serve depois a outras plataformas e à versão "sem loja" |
| Erro no estoque/acerto gera desconfiança | Testes automatizados e trilha de auditoria; começar com 5 fundadores acompanhados de perto |
| Suporte cresce com o número de revendedoras | Portal simples, vídeos curtos, suporte só ao lojista (não à revendedora) |
| Aprovação na loja de apps demora | Submeter cedo; enquanto isso, os fundadores usam como app "não listado" (verificar se a Nuvemshop permite) |
| Cobrança pela Nuvemshop sem renovação automática | Avaliar cobrar direto (cartão/Pix recorrente) ou ativar a cobrança automática opcional |

---

## 7. Próximos passos

1. **Liberar o acesso à Nuvemshop para eu pesquisar direto:** adicionar `nuvemshop.com.br` em "Allowed domains" nas configurações de rede do ambiente desta sessão. Ou usar a extensão do Chrome numa sessão do Claude rodando no seu computador, porque daqui, da nuvem, não consigo usar a extensão.
2. **Você:** criar a conta de **Parceiro Tecnológico** na Nuvemshop e começar as conversas com lojistas (eu preparo o roteiro e as mensagens).
3. **Eu:** preparar o roteiro de entrevista, a página de pré-venda "cliente fundador" e o esqueleto técnico do app (OAuth + webhooks + loja de testes).
