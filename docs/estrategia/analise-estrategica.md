# Análise estratégica: qual empresa construir

> Documento de decisão. Objetivo: escolher **um** negócio que (1) seja simples de montar e manter com desenvolvimento assistido por IA, (2) gere receita em poucos meses, (3) escale para virar uma empresa com funcionários, (4) rode em Firebase / Google Cloud **sem IA generativa no produto** e (5) comece com ~R$ 3.000 de investimento em aquisição.

---

## 1. Premissas honestas antes de escolher

1. **R$ 3 mil em tráfego pago não constroem uma empresa sozinhos.** Em B2B pequeno no Brasil, um lead qualificado no Meta/Google custa algo entre R$ 15 e R$ 60, e só uma fração vira cliente. O dinheiro serve para **validar a mensagem e gerar os primeiros clientes**. Os primeiros 20–50 clientes vêm de **venda ativa feita pelo fundador** (WhatsApp, telefone, visita), que custa tempo e não dinheiro.
2. **"Retorno rápido" e "escala grande" só andam juntos em um tipo de produto:** software vendido a empresas (B2B SaaS) que **aumenta o faturamento ou reduz a perda de dinheiro do cliente de forma mensurável**. Produto para consumidor final (B2C) escala, mas exige muito marketing e demora a monetizar. Prestação de serviço gera caixa rápido, mas não escala sem gente.
3. **O código não é o gargalo.** Com IA, construir o software é a parte mais barata. O que decide o sucesso é **nicho, distribuição e retenção**. Por isso a escolha abaixo pesa mais "quem paga, por quê e como eu chego nele" do que tecnologia.
4. **Evitar produtos que "dependem de IA" é uma vantagem**: custo marginal perto de zero por cliente, margem bruta de 85–95%, nada de surpresa na fatura.
5. **O que evitar:** mercados onde o líder já é gigante e barato (cardápio digital/delivery, CRM genérico, agenda genérica para salão), produtos que exigem certificação pesada (prontuário médico, emissão fiscal como produto principal, instituição de pagamento), e qualquer coisa juridicamente cinzenta (rifas, apostas, bolões).

---

## 2. Critérios e pesos

| Critério | Peso | O que significa na prática |
|---|---|---|
| Dor ligada a dinheiro | 25% | O cliente perde ou deixa de ganhar R$ de forma visível sem a solução |
| Facilidade de construir/manter | 20% | MVP em 4–6 semanas com Firebase; poucas integrações; pouca regra fiscal |
| Velocidade da primeira receita | 20% | Dá para vender antes de o produto estar pronto; ciclo de venda curto (1 conversa) |
| Escala / tamanho de mercado | 15% | Dezenas de milhares de clientes possíveis no Brasil; expansão para nichos vizinhos |
| Retenção (lock-in saudável) | 10% | Depois de adotado, sair dói (dados, cobranças, histórico) |
| Concorrência atacável | 10% | Existe concorrente (prova de mercado), mas não domina o nicho específico |

---

## 3. Opções avaliadas

Avaliei 8 modelos. Os 4 mais fracos ficam resumidos; os 4 mais fortes estão detalhados.

### Descartados (resumo)

| Ideia | Por que caiu |
|---|---|
| Cardápio digital / pedidos por WhatsApp | Mercado saturado (Anota AI, Goomer, Cardápio Web, o próprio iFood), ticket baixo, churn alto |
| Agenda online genérica para salão/barbearia | Trinks, AppBarber, Booksy, Avec; preço puxado para baixo; diferenciação difícil |
| Marketplace (ex.: conectar prestadores e clientes) | Problema do "ovo e galinha": precisa dos dois lados ao mesmo tempo; queima os R$ 3 mil sem liquidez |
| Infoproduto / curso | Caixa rápido, mas não é empresa escalável com ativo próprio; depende do fundador como rosto |

### Finalistas

#### A) Gestão de mensalidades + cobrança automática para negócios de aulas recorrentes ⭐
**Para quem:** escolinhas de futebol/vôlei, artes marciais, escolas de dança, escolas de música, natação, reforço escolar, cursos livres de idiomas pequenos, studios pequenos. Negócios com 30 a 400 alunos que cobram mensalidade e hoje controlam tudo em caderno, planilha e "cobrança no braço" pelo WhatsApp.

**Dor:** inadimplência típica de 10% a 25% e horas por mês gastas cobrando aluno por aluno, com constrangimento. Um negócio com 120 alunos a R$ 180 fatura R$ 21.600/mês; 15% de inadimplência são **R$ 3.240/mês perdidos**. Um sistema de R$ 129/mês que recupera metade disso se paga 12 vezes.

**Produto (MVP):**
- Cadastro de alunos, responsáveis, turmas e planos (valor, vencimento, desconto de pontualidade).
- Geração automática de cobrança mensal via **Pix + boleto + cartão recorrente** usando um provedor de pagamentos (Asaas, Efí, Mercado Pago ou Pagar.me). **O dinheiro cai direto na conta do cliente**; nós nunca custodiamos dinheiro.
- **Régua de cobrança por WhatsApp** (API oficial da Meta): aviso antes do vencimento, no dia, após atraso, com link Pix. Baixa automática quando paga (webhook).
- Painel do dono: quem pagou, quem deve, receita prevista × recebida, inadimplência do mês.
- Portal/link do responsável: segunda via, histórico, comprovantes.
- Depois do MVP: matrícula online com contrato e aceite, lista de presença pelo celular, controle de uniformes/eventos, multiunidade.

**Por que é forte:** dor medida em reais, ROI explicável em uma frase, venda em uma conversa, mercado enorme e pulverizado (dezenas de milhares de escolas/escolinhas de pequeno porte no Brasil), retenção alta (as cobranças do mês rodam no sistema: ninguém troca no meio do ano), e **duas fontes de receita**: mensalidade do software + uma pequena margem por cobrança via conta-filha/white label do provedor de pagamento, quando o provedor permite.

**Concorrência:** existem sistemas gerais de academia/escola (Tecnofit, EVO, Sponte, iClass, ProEscola) e o próprio Asaas oferece cobrança genérica. Os sistemas grandes são caros e complexos para uma escolinha de 80 alunos; o Asaas não sabe o que é "turma", "aluno" ou "responsável". O espaço é o **pequeno operador que precisa de algo simples e que cobra sozinho**.

**Riscos:** taxa de pagamento do provedor precisa ser competitiva; dono pequeno resiste a "mais um app" (resolver com onboarding feito por nós, importação de planilha); risco de concentração em um provedor de pagamento (abstrair a integração desde o início).

#### B) Redução de faltas (no-show) com confirmação e sinal via Pix para clínicas de um nicho
**Para quem:** fisioterapeutas, psicólogos, nutricionistas, dentistas pequenos, clínicas de estética.
**Dor:** faltas de 15–30% das consultas. Uma falta = horário perdido.
**Produto:** agenda + confirmação automática por WhatsApp + cobrança de sinal/pré-pagamento por Pix + lista de espera que preenche horários vagos.
**Por que não é a primeira:** mercado mais disputado (Feegow, iClinic, Simples Agenda, Doctoralia, Amplimed), e clínicas de saúde puxam requisitos de prontuário e LGPD de dados sensíveis. Boa **segunda vertical**, reaproveitando ~70% do motor de A (WhatsApp + Pix + régua).

#### C) Ordem de serviço + status por WhatsApp para oficinas e assistências técnicas
**Para quem:** oficinas mecânicas, assistência de celular/eletrônicos, refrigeração.
**Dor:** cliente ligando para saber status, orçamento não aprovado esquecido, garantia sem controle.
**Por que não é a primeira:** dor mais operacional do que financeira (ROI menos óbvio), público com menor afinidade digital, e existe competição local forte (Oficina Inteligente, GestãoClick, Bling). Ainda assim é um mercado viável.

#### D) Avaliações no Google + reativação de clientes inativos para negócios locais
**Para quem:** qualquer comércio local com base de clientes no WhatsApp.
**Dor:** pouca avaliação no Google e clientes que não voltam.
**Por que não é a primeira:** ROI indireto e difícil de provar; vira "ferramenta de marketing", com churn mais alto. Funciona bem como **módulo adicional** de A ou B.

### Placar

| Critério (peso) | A) Mensalidades | B) No-show clínicas | C) OS oficinas | D) Avaliações |
|---|---|---|---|---|
| Dor ligada a dinheiro (25%) | 10 | 9 | 6 | 5 |
| Construir/manter (20%) | 8 | 7 | 8 | 9 |
| Primeira receita rápida (20%) | 9 | 7 | 7 | 7 |
| Escala (15%) | 9 | 9 | 8 | 8 |
| Retenção (10%) | 10 | 8 | 7 | 4 |
| Concorrência atacável (10%) | 8 | 5 | 6 | 6 |
| **Nota ponderada** | **9,0** | **7,6** | **7,0** | **6,6** |

---

## 4. Recomendação

**Construir a opção A: um sistema de gestão de alunos e cobrança automática para escolas e escolinhas de aulas recorrentes**, começando por **um único sub-nicho** e expandindo depois.

**Sub-nicho de entrada sugerido:** escolinhas esportivas (futebol/futsal, artes marciais) **ou** escolas de dança/música. Critérios para decidir entre eles na validação: qual responde mais rápido no WhatsApp, qual tem maior inadimplência declarada e qual tem mais grupos/associações onde dá para entrar. Comunicar como "o sistema feito para escolinha de futebol" vende muito mais do que "o sistema para escolas".

**Caminho de expansão (escala):**
1. Sub-nicho 1 → sub-nichos vizinhos (mesmo produto, landing page e anúncio diferentes).
2. Módulos pagos: matrícula online com contrato, presença, loja de uniformes/eventos, multiunidade.
3. Receita sobre pagamento (conta-filha/white label do provedor) à medida que o volume cresce.
4. Segunda vertical: clínicas (opção B), reaproveitando o motor de WhatsApp + Pix + régua.
5. Canal de parceiros: federações, ligas, franquias de escolinhas, contadores.

---

## 5. Modelo de receita e números

**Preço sugerido (por faixa de alunos ativos):**

| Plano | Alunos | Preço/mês |
|---|---|---|
| Inicial | até 60 | R$ 79 |
| Escola | até 200 | R$ 149 |
| Pro | até 500 + multiunidade | R$ 279 |

Mais: as tarifas do provedor (Pix/boleto/cartão) são repassadas ao cliente, com ou sem margem conforme o contrato com o provedor.

**Custos variáveis por cliente (estimativa, conferir valores vigentes antes de lançar):**
- Firebase/GCP: centavos a poucos reais por cliente/mês nesse volume (o plano gratuito cobre o início).
- WhatsApp Cloud API: mensagens de **utilidade** (lembrete de cobrança) custam alguns centavos de real cada no Brasil; a Meta mudou a tabela em 2025 para cobrança por mensagem, então é preciso conferir o preço atual. Uma escola de 120 alunos com ~3 mensagens/aluno/mês fica na faixa de R$ 15–25/mês. **Isso precisa estar embutido no preço** ou limitado por plano.
- Margem bruta esperada: **80–90%**.

**Metas de referência:**

| Marco | Clientes | MRR aprox. (ticket médio R$ 130) |
|---|---|---|
| Validação | 10 pagantes | R$ 1,3 mil |
| Sustenta o fundador parcialmente | 50 | R$ 6,5 mil |
| Primeiro funcionário (suporte/vendas) | 120 | R$ 15,6 mil |
| Empresa | 500 | R$ 65 mil |

Com churn mensal abaixo de 3% (realista quando a cobrança roda no sistema), o cliente fica em média mais de 30 meses: **LTV acima de R$ 3.500**. Isso permite pagar até R$ 500–800 para adquirir um cliente, o que torna tráfego pago viável **depois** que a mensagem estiver validada.

---

## 6. Plano dos primeiros 90 dias

### Semanas 1–2: validação antes de programar (R$ 0–500)
- Listar 200 escolas do sub-nicho na cidade/região usando Google Maps e Instagram.
- Abordar 100 por WhatsApp/telefone com uma pergunta de dor, não com produto: "quantos alunos atrasam a mensalidade por mês e como você cobra hoje?"
- Fazer 15–20 conversas de 15 minutos. Meta: **5 escolas que aceitem pré-assinar** (ex.: 3 meses a preço de fundador, pagos ou com compromisso por escrito).
- Landing page simples + R$ 300–500 de anúncio para testar duas mensagens ("acabe com a inadimplência" × "pare de cobrar aluno no WhatsApp").
- **Critério de parada:** se depois de 20 conversas ninguém topar pagar, trocar de sub-nicho (dança ↔ futebol ↔ música) antes de escrever código.

### Semanas 3–8: MVP com os clientes fundadores
- Construir só o núcleo: alunos/turmas/planos → cobrança no provedor → webhook de baixa → régua de WhatsApp → painel de inadimplência.
- Onboarding feito por nós: importar a planilha do cliente.
- Medir desde o primeiro dia: **inadimplência antes × depois** (vira o argumento de venda e o case).

### Semanas 9–13: tração
- Transformar os resultados dos fundadores em depoimentos/vídeos curtos.
- Programa de indicação (um mês grátis para quem indica e para quem é indicado): donos de escolinha se conhecem.
- Aplicar R$ 2.000–2.500 restantes em Meta Ads (Instagram) segmentado por interesse/região, com o case real. Medir custo por conversa iniciada e por cliente.
- Meta realista ao fim de 90 dias: **15–30 clientes pagantes**.

### Distribuição do orçamento de R$ 3.000

| Item | Valor |
|---|---|
| Teste de mensagem (semanas 1–2) | R$ 400 |
| Domínio, e-mail, número de WhatsApp Business dedicado | R$ 150 |
| Reserva para custos de API (WhatsApp/pagamento) no início | R$ 250 |
| Tráfego pago com case real (semanas 9–13) | R$ 2.200 |

CNPJ e contador ficam fora desses R$ 3 mil (ver seção 8).

---

## 7. Arquitetura técnica proposta (Firebase / Google Cloud, sem IA generativa)

| Camada | Escolha | Motivo |
|---|---|---|
| Front-end (painel do dono + portal do responsável) | React + Vite + TypeScript, ou Next.js | Ecossistema que a IA domina bem; PWA instalável no celular |
| Hospedagem | Firebase Hosting | CDN, SSL e deploy simples |
| Autenticação | Firebase Auth (e-mail/senha + link mágico) | Zero manutenção |
| Banco | Firestore (multi-tenant: `escolas/{id}/alunos`, `.../cobrancas`) | Sem servidor, regras de segurança por escola, escala automática |
| Back-end | Cloud Functions (Node/TypeScript) | Webhooks do provedor de pagamento e da Meta; tarefas agendadas |
| Agendamentos | Cloud Scheduler + Cloud Tasks | Geração mensal de cobranças e disparos da régua |
| Pagamentos | Asaas, Efí, Mercado Pago ou Pagar.me, atrás de uma interface própria (`PaymentProvider`) | Não custodiar dinheiro; poder trocar de provedor |
| Mensageria | WhatsApp Cloud API oficial (templates de utilidade) | Barata, confiável; evitar APIs não oficiais (risco de banimento do número) |
| Relatórios futuros | Exportação para BigQuery | Quando houver volume |
| Qualidade | Testes automatizados + CI no GitHub Actions + ambientes dev/prod separados | Manutenção fácil com IA exige testes |

Princípios: monorepo único, tipagem forte em tudo, regras de segurança do Firestore testadas, idempotência em todo webhook (pagamento confirmado duas vezes não pode dar baixa duas vezes) e logs estruturados.

---

## 8. Constituição da empresa (CNPJ) e pontos legais

*Confirmar com um contador; os pontos abaixo servem para a primeira conversa.*

- **MEI não serve**: desenvolvimento e licenciamento de software não está entre as atividades permitidas ao MEI.
- **Formato provável:** Sociedade Limitada Unipessoal (SLU) ou LTDA, no **Simples Nacional**.
- **CNAE principal provável:** 6203-1/00 (desenvolvimento e licenciamento de programas de computador não customizáveis), que é o enquadramento comum de SaaS. Tributação no Anexo III ou V conforme o **Fator R** (relação folha/faturamento); o contador pode planejar pró-labore para ficar no Anexo III (a partir de 6%).
- **Custos de referência:** abertura de R$ 0 a R$ 1.000 (há contabilidades online que abrem de graça) e contador online de R$ 150 a R$ 400/mês.
- **Pagamentos:** usar subcontas/white label de um provedor autorizado pelo Banco Central. **Nunca receber o dinheiro dos alunos em conta própria para repassar**: isso pode caracterizar atividade de instituição de pagamento.
- **LGPD:** dados de menores (alunos) e responsáveis → termos de uso, política de privacidade, contrato de operador de dados com as escolas, dados mínimos.
- **WhatsApp:** número dedicado verificado no Meta Business, só templates aprovados e opt-in dos responsáveis.

---

## 9. Avaliação do repositório atual (`generalproject`)

**O que existe:** um projeto PHP **Symfony 5.0** (PHP 7.4) de lista de tarefas ("todo list") iniciado e não terminado:
- 2 controllers (`IndexController`, `TaskController`) que só renderizam templates Twig; nenhum fluxo funciona de ponta a ponta (o formulário de tarefa faz POST para uma rota sem tratamento).
- 1 entidade `Task` com anotações Doctrine incompletas (falta o `@Id`, os `use` das anotações, e `getDate()` lê `$this->data`, uma propriedade que não existe).
- Docker Compose com nginx + PHP-FPM + MySQL.
- Sem testes reais (só `tests/bootstrap.php`).

**Problemas encontrados:**
1. **Pasta `mysql/` versionada (~45 MB)**: são os arquivos binários do banco de dados de desenvolvimento, incluindo **chaves privadas TLS** (`ca-key.pem`, `server-key.pem`, `client-key.pem`, `private_key.pem`). Isso não deveria estar no Git. São chaves de desenvolvimento local, então o risco prático é baixo, mas elas continuam no histórico mesmo que a pasta seja apagada.
2. `.env` com `APP_SECRET` e senha de banco (`root:root`) versionados.
3. `composer.phar` versionado.
4. Stack desatualizada: PHP 7.4 e Symfony 5.0 estão sem suporte há anos.
5. Nada aproveitável para o produto proposto (stack, domínio e infraestrutura diferentes).

**Recomendação:** não reaproveitar código. Duas opções:
- **(Preferida) Começar com histórico limpo**: criar o projeto novo em um repositório novo (ou recriar este), para que as chaves e os 45 MB de binários não fiquem no histórico.
- **Alternativa:** neste mesmo repositório, apagar tudo em um commit "reset" e começar a estrutura nova. É mais simples, mas o histórico antigo continua lá.

Em qualquer caso, o novo repositório deve ter desde o primeiro commit: `.gitignore` correto (sem `.env`, sem dados de banco), segredos no Secret Manager / variáveis de ambiente do Firebase, e CI rodando testes.

---

## 10. Próximas decisões necessárias (do fundador)

1. Confirmar a opção A (ou escolher outra) e o **sub-nicho de entrada**.
2. Cidade/região da prospecção inicial.
3. Repositório novo × reaproveitar este.
4. Provedor de pagamento a testar primeiro (sugestão: Asaas, pela API de subcontas e documentação boa; comparar taxas com Efí e Mercado Pago).
5. Nome provisório da marca e domínio.

Com essas respostas, o passo seguinte é: roteiro de entrevista de validação + landing page + estrutura inicial do projeto (Firebase + React + Functions) com o modelo de dados.
