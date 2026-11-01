# Avaliação: app de mini games retrô ("Brick Game" em pixel art)

> Ideia avaliada: um app que imita os mini games portáteis dos anos 1990 ("Brick Game 9999 in 1"), com jogos originais em pixel art 8-bit, controles na parte de baixo em retrato e nas laterais em paisagem, focado em jogos de passatempo tranquilos.
>
> Meta proposta: **transformar R$ 1.000 em R$ 2.000 de lucro** com tráfego pago e reinvestir continuamente.
>
> Os valores de mercado abaixo (CPI, eCPM, retenção) são **faixas de referência típicas** de jogos casuais. Eles variam bastante e precisam ser medidos no nosso próprio app antes de qualquer decisão de escala.

---

## 1. Resumo executivo

| Pergunta | Resposta curta |
|---|---|
| A ideia é boa? | **Sim, como produto**: a nostalgia é forte, o visual é diferenciado, é barato de desenvolver com IA e funciona em celular e navegador com o mesmo código |
| É fácil de desenvolver e manter? | **Sim.** Jogos simples em grade de pixels, sem servidor complexo e sem IA no produto |
| Dá para dobrar R$ 1.000 com tráfego pago em poucos meses? | **Provavelmente não, se a estratégia for "comprar instalação e lucrar com anúncio".** Na maioria dos casos, a conta de jogo casual no Brasil fecha no prejuízo (detalhes na seção 4) |
| Então como ganhar dinheiro? | Crescimento **orgânico primeiro** (vídeos de nostalgia, lojas de apps, portais de jogos web), monetização **híbrida** (anúncio recompensado + compra para remover anúncios + carcaças colecionáveis) e tráfego pago **só depois** que os números provarem que cada R$ 1 investido volta com lucro |
| Vale a pena? | Vale como **aposta de baixo custo e alto potencial de viralizar**, com regras claras de parada. Não é uma fonte de lucro previsível como os SaaS da análise anterior |

---

## 2. Como o mercado ganha dinheiro com esse tipo de app

| Modelo | Como funciona | Peso típico em jogos casuais |
|---|---|---|
| **Anúncios (AdMob + mediação)** | Intersticial (tela cheia entre partidas), recompensado (o jogador escolhe assistir para ganhar algo) e banner | Principal fonte em jogos gratuitos |
| **Compra única "remover anúncios"** | R$ 9,90 a R$ 19,90 | Converte 0,5% a 2% dos jogadores ativos |
| **Itens cosméticos** | Skins, temas, cores do aparelho | Ótimo quando o visual é a identidade do produto, como aqui |
| **Pacotes de jogos / "cartuchos"** | Desbloqueio de jogos extras | Funciona quando há catálogo grande |
| **Assinatura** | Tudo liberado + sem anúncios + desafios exclusivos | Raro em jogos simples; difícil de justificar |
| **Versão paga (premium)** | Paga uma vez, sem anúncios | Vende pouco no Android brasileiro; melhor em iOS e países ricos |
| **Portais de jogos web** (Poki, CrazyGames, GameDistribution) | O portal coloca o jogo para o público dele e divide a receita de anúncios | Distribuição **sem custo de aquisição**: muito relevante para nós |
| **Advergames (B2B)** | Criar jogos retrô com a marca de empresas para campanhas, eventos e promoções | Receita por projeto (de R$ 3 mil a R$ 20 mil, conforme escopo); usa o mesmo motor |

**Como os estúdios grandes lucram com tráfego pago:** eles testam dezenas de protótipos por mês, descartam 90% e escalam só os poucos em que o valor gerado por jogador (LTV) supera o custo por instalação (CPI) com folga. O lucro vem do **volume de testes e da disciplina de cortar rápido**, não de um jogo isolado.

---

## 3. Mercado e concorrência

- **Nostalgia retrô é um nicho consolidado.** As lojas têm vários apps "Brick Game", "Retro Tetris-like" e "9999 in 1", alguns com milhões de downloads, o que prova a demanda. A maioria tem visual pobre (imita o LCD monocromático), excesso de anúncios e nenhuma progressão.
- **Nosso diferencial possível:**
  1. **Pixel art colorida 8-bit** em vez de pontinhos pretos.
  2. **O aparelho é o personagem.** Carcaças colecionáveis: preta, amarela, transparente roxa, "edição camelô 9999 in 1", edições sazonais. Isso cria identidade, vontade de colecionar e uma monetização natural.
  3. **Jogos calmos e originais**, com progressão leve e desafio diário.
  4. **Muito humor e nostalgia brasileira** ("o presente que todo mundo ganhou em 1998"), que gera conteúdo compartilhável.
- **Riscos legais (importantes):**
  - **Não fazer clone de Tetris.** A The Tetris Company protege marca e "trade dress" (aparência e jogabilidade de peças caindo e completando linhas) e derruba clones nas lojas. Jogo de "empilhar" deve ter mecânica própria.
  - Não usar nomes ou elementos de marcas (Tetris, Game Boy, Game & Watch, Frogger, Pac-Man, Picross). Mecânicas genéricas como cobrinha, quebra-blocos, nonograma, corrida desviando de carros e campo minado podem ser usadas, sempre com arte, nome e sons originais.
  - Arte, fontes e músicas próprias ou com licença comercial.

---

## 4. A conta do tráfego pago (o ponto mais importante)

**Fórmula do lucro com tráfego pago:**

```
Lucro = Instalações compradas × (LTV por jogador − CPI)
```

- **CPI** (custo por instalação) é quanto pagamos ao Google/Meta/TikTok por cada pessoa que instala.
- **LTV** (valor do tempo de vida) é quanto cada jogador gera de receita, somando anúncios e compras, menos a taxa da loja (15% para receitas de até US$ 1 milhão/ano no Google Play e na App Store).

Para R$ 1.000 virarem R$ 2.000 de **lucro**, o investimento precisa voltar como R$ 3.000 de receita, ou seja, **ROAS de 300%**. Em jogos casuais, estúdios profissionais consideram bom recuperar 100% a 150% do investimento **em 6 a 12 meses**. ROAS de 300% em poucos meses só acontece com um jogo que viraliza ou que tem retenção excepcional.

### Simulação com valores típicos (Android, estimativas)

| Item | Brasil | EUA (inglês) |
|---|---|---|
| CPI típico de jogo casual | R$ 0,60 a R$ 2,00 | US$ 1,00 a US$ 3,00 |
| Retenção D1 / D7 / D30 de um jogo casual razoável | 30% / 10% / 4% | 30% / 10% / 4% |
| Dias ativos médios nos primeiros 90 dias | cerca de 3,5 | cerca de 3,5 |
| Receita de anúncio por jogador ativo por dia (ARPDAU) | R$ 0,03 a R$ 0,08 | US$ 0,03 a US$ 0,08 |
| LTV de anúncio em 90 dias | R$ 0,10 a R$ 0,28 | US$ 0,10 a US$ 0,28 |
| LTV de compras (1% compra "remover anúncios", menos 15%) | cerca de R$ 0,10 | cerca de US$ 0,04 |
| **LTV total em 90 dias** | **R$ 0,20 a R$ 0,40** | **US$ 0,15 a US$ 0,35** |
| **Resultado por instalação paga** | **prejuízo de R$ 0,40 a R$ 1,60** | **prejuízo de US$ 0,85 a US$ 2,65** |

**Conclusão honesta:** com métricas medianas, cada instalação comprada **dá prejuízo** nos dois mercados. Para o tráfego pago dar lucro, precisamos de pelo menos uma destas condições, idealmente várias:

1. **Retenção muito acima da média** (D1 ≥ 40%, D7 ≥ 15%, D30 ≥ 7%). É possível com desafio diário, coleção de carcaças e catálogo crescente.
2. **CPI muito baixo** graças a criativos que viralizam (nostalgia costuma ter custo por clique baixo).
3. **Monetização bem calibrada** (anúncio recompensado com boa adesão, compra de carcaças).
4. **Viralidade orgânica** em que cada instalação paga traz instalações grátis (o "k-factor"). Isso reduz o CPI efetivo.

Por isso a estratégia certa **não é** começar comprando instalação. É **provar os números primeiro com tráfego orgânico e testes pequenos**, e só escalar o que já se pagou.

---

## 5. Estratégia recomendada para maximizar lucro

### 5.1 Produto: "um console que você coleciona"
- **Interface do aparelho:**
  - Em **retrato**, a tela fica em cima e o direcional + botões embaixo, como no aparelho original.
  - Em **paisagem**, a tela fica no centro, o direcional na lateral esquerda e os botões de ação na direita.
  - Vibração (feedback tátil) ao apertar, sons de "clique" do botão e opção de som chiptune.
- **Lançamento com 5 jogos originais e calmos** (e 1 jogo novo a cada 2–3 semanas):
  1. **Cobrinha** com cenários pixel art e frutas colecionáveis.
  2. **Corrida na estrada**: desviar de carros, com troca de faixa (clássico do brick game, mecânica genérica).
  3. **Quebra-blocos** com fases desenhadas à mão.
  4. **Nonograma pixel**: o desafio diário revela um desenho 8-bit. É calmo, viciante e excelente para retenção.
  5. **Pescaria** de ritmo tranquilo, com coleção de peixes.
  - Depois: empurrar caixas (puzzle), campo minado, batalha naval contra o computador, jardim/fazendinha, tanque.
- **Mecanismos de retenção:** desafio diário, sequência de dias jogados, recordes, conquistas e moedas para desbloquear carcaças.
- **Compartilhamento:** botão "compartilhar recorde no WhatsApp", que gera uma imagem pixel art do aparelho com a pontuação. É um laço viral gratuito.

### 5.2 Monetização híbrida
| Fonte | Configuração inicial | Observação |
|---|---|---|
| Anúncio recompensado | Continuar partida, dobrar moedas, desbloquear carcaça antes | O jogador escolhe assistir, então não irrita e paga melhor |
| Intersticial | No máximo 1 a cada 3–4 partidas ou a cada 3 minutos, nunca no primeiro dia | Excesso de anúncio derruba a retenção; frequência ajustável remotamente (Firebase Remote Config) |
| Banner | Não usar | Paga pouco e polui o visual do aparelho |
| Remover anúncios | R$ 12,90 (único) | Testar preço com Remote Config |
| Carcaças e pacotes | R$ 4,90 a R$ 9,90 cada, ou "coleção completa" R$ 24,90 | Principal diferencial de monetização |
| Versão web nos portais | Poki/CrazyGames com divisão de receita | Distribuição grátis + teste de jogos antes de ir para o app |

### 5.3 Distribuição: orgânico primeiro, pago depois

**Canais orgânicos (custo zero, prioridade máxima):**
1. **Vídeos curtos de nostalgia** (TikTok, Reels, Shorts): "quem teve esse aparelho?", "o presente de Natal de 1997", gameplay com som de bipe. Esse formato tende a viralizar. Meta: 1 vídeo por dia.
2. **ASO (otimização nas lojas):** palavras-chave como "brick game", "mini game", "jogo antigo", "9999 em 1", "jogos anos 90", "retrô", ícone forte e vídeo de demonstração.
3. **Portais de jogos web:** versão HTML5 publicada no CrazyGames, Poki (seletivo) e GameDistribution.
4. **Comunidades:** grupos de nostalgia, Reddit (r/retrogaming, r/AndroidGaming), páginas de "anos 90".
5. **Imprensa e criadores de tecnologia/games:** "app brasileiro recria o brick game em pixel art".

**Tráfego pago, com gatilhos objetivos:**
Só começar quando o app tiver, com usuários orgânicos, **D1 ≥ 35%, D7 ≥ 12% e ARPDAU medido**.

---

## 6. Divulgação automatizada com tráfego pago

### 6.1 Campanhas
| Plataforma | Tipo de campanha | Por que |
|---|---|---|
| **Google Ads: campanha para apps** | Instalações → depois "valor in-app" (tROAS) | Totalmente automatizada: usamos textos, imagens e vídeos e o algoritmo distribui em Play Store, YouTube, pesquisa e rede de display |
| **Meta (Facebook/Instagram)** | Advantage+ para apps | Ótimo para criativos de nostalgia em Reels |
| **TikTok Ads** | App install | Público e formato ideais para nostalgia; CPI pode ser baixo |

O Meta Ads já está conectado a esta sessão, então posso criar e operar campanhas e regras diretamente quando chegar a hora, **sempre com sua aprovação** antes de gastar.

### 6.2 Fábrica automatizada de criativos
Como os jogos são nossos e determinísticos, dá para **gerar vídeos de anúncio automaticamente a partir do próprio jogo**:
- Um "modo demonstração" joga sozinho seguindo roteiros pré-programados (quase perdendo, recorde, combo).
- Um script grava a tela do navegador em vídeo vertical 9:16 (Playwright + ffmpeg), coloca a moldura do aparelho, a legenda ("Lembra disso?", "Você teve um desses?") e o som.
- Saem **dezenas de variações por semana** (jogo × carcaça × legenda × gancho dos primeiros 2 segundos), sem IA generativa e com custo zero.
- Os mesmos vídeos alimentam os posts orgânicos.

### 6.3 Regras automáticas de orçamento (sem depender de olhar todo dia)
| Regra | Ação |
|---|---|
| Criativo com CPI acima de 1,5× a meta depois de 50 instalações | Pausar automaticamente |
| Criativo com CPI abaixo da meta e ROAS D3 acima da meta | Aumentar o orçamento em 20% a cada 3 dias |
| ROAS D7 da campanha abaixo de 25% depois de R$ 300 gastos | Pausar a campanha e voltar ao orgânico |
| Novo jogo lançado | Gerar e subir automaticamente novos criativos para teste |

Ferramentas: regras automatizadas do Meta e do Google Ads, Firebase Analytics + AdMob (receita por usuário) ligados às plataformas de anúncio para otimizar por valor, e um painel diário com CPI, ROAS D1/D3/D7 e LTV por campanha.

---

## 7. Plano de execução e uso dos R$ 1.000

### Fase 1: construir (semanas 1 a 4)
- Motor do "aparelho" (moldura, controles retrato/paisagem, carcaças, sons) + 3 a 5 jogos.
- Tecnologia: **TypeScript + Phaser (HTML5)**. Um único código gera:
  - o app Android/iOS (via Capacitor);
  - a versão web para portais;
  - os vídeos de anúncio.
- Firebase: Analytics, Remote Config, Crashlytics e placares (Firestore). AdMob com mediação. Compras pela Google Play Billing (biblioteca RevenueCat, gratuita no início).
- Lançar **primeiro só no Android** (a grande maioria dos celulares no Brasil). iOS depois, se os números justificarem (conta Apple: US$ 99/ano).

### Fase 2: provar com orgânico (semanas 5 a 8)
- Publicar na Play Store e nos portais web; 1 vídeo de nostalgia por dia; ASO.
- **Metas para seguir em frente:** 1.000+ instalações orgânicas, D1 ≥ 35%, D7 ≥ 12%, sessão média ≥ 8 min.
- Se não bater: melhorar os jogos e a retenção antes de gastar com mídia.

### Fase 3: teste pago controlado (semanas 9 a 12)
- R$ 400 de teste dividido entre Google (campanha para apps) e TikTok ou Meta (o canal com melhor resposta orgânica).
- Medir CPI real e ROAS D7.
- **Decisão:** se o ROAS D7 for de 40% ou mais (sinal de payback em poucos meses), escalar com o restante + receita. Se ficar abaixo de 25%, parar o pago e manter o crescimento orgânico.

### Fase 4: multiplicar (mês 4 em diante)
- Reinvestir **apenas o lucro comprovado**, nunca o capital inteiro de uma vez.
- Traduzir para inglês e espanhol (nostalgia do brick game é global: América Latina, Europa Oriental, Ásia).
- 1 jogo novo a cada 2–3 semanas (conteúdo novo traz jogadores de volta e alimenta os criativos).
- Abrir a frente B2B de **advergames retrô** para marcas e eventos, usando o mesmo motor.

### Orçamento
| Item | Valor |
|---|---|
| Conta de desenvolvedor Google Play (pagamento único de US$ 25) | ~R$ 140 |
| Domínio + política de privacidade | ~R$ 60 |
| Fontes/sons com licença comercial (se não produzirmos) | ~R$ 100 |
| Teste de tráfego pago (Fase 3) | R$ 400 |
| Reserva para escalar o canal vencedor | R$ 300 |
| **Total** | **R$ 1.000** |

Firebase, AdMob, Capacitor, Phaser e RevenueCat têm custo zero nesse estágio.

---

## 8. Cenários realistas para os primeiros 6 meses

| Cenário | O que acontece | Resultado financeiro aproximado |
|---|---|---|
| **Pessimista** (o mais comum para jogos novos) | Retenção mediana, pouca tração orgânica, pago não fecha a conta | Receita de algumas dezenas a poucas centenas de reais/mês; R$ 400–700 gastos sem retorno; o motor e os jogos ficam como ativo |
| **Base** | Boa retenção, alguns vídeos com bom alcance, 10–30 mil instalações orgânicas | R$ 300 a R$ 1.500/mês; o pago empata ou dá lucro pequeno; o objetivo de R$ 2.000 de lucro é alcançado em vários meses |
| **Otimista** | Um vídeo de nostalgia viraliza, retenção alta, ROAS > 100% | Centenas de milhares de instalações; R$ 5 mil a R$ 30 mil/mês; aí sim reinvestir e multiplicar com tráfego pago |

A meta "R$ 1.000 → R$ 2.000 de lucro" é **possível no cenário base ao longo de alguns meses e provável no otimista**, mas **não é garantida**. O que garantimos com este plano é que o prejuízo máximo fica limitado a algumas centenas de reais, porque só escalamos o que já provou retorno.

---

## 9. Pontos legais e operacionais

- **Recebimento:** AdMob e Google Play pagam em dólar. É possível começar como pessoa física (com imposto via carnê-leão), mas o ideal é receber pela empresa (CNPJ com CNAE de jogos/software). Confirmar o enquadramento com o contador.
- **Público infantil:** se o app atrair crianças, as políticas de família do Google Play e a LGPD exigem anúncios certificados para crianças e restrições de dados. Recomendação: classificar o público como **13+ / adultos nostálgicos**, coerente com o marketing de "quem viveu os anos 90".
- **Privacidade:** política de privacidade publicada, consentimento de anúncios (UMP do AdMob para Europa) e Firebase configurado com dados mínimos.
- **Propriedade intelectual:** ver seção 3 (sem clones de Tetris, sem marcas de terceiros, arte e sons próprios).

---

## 10. Avaliação comparada com as opções SaaS anteriores

| Critério | App de jogos retrô | SaaS de cobrança (escolas/aluguel) |
|---|---|---|
| Facilidade de construir | Alta | Alta |
| Custo para começar | Muito baixo | Muito baixo |
| Previsibilidade de receita | **Baixa** (depende de "hit") | **Alta** (assinatura mensal) |
| Potencial de viralizar | **Alto** | Baixo |
| Lucro com tráfego pago | Difícil (LTV baixo por jogador) | Viável (LTV de R$ 3.000+ por cliente) |
| Manutenção | Baixa | Média (suporte a clientes) |
| Prazo até a primeira receita | 1–2 meses (pouca) | 1–3 meses (consistente) |

**Recomendação final:** o app retrô é um bom projeto **se tratado como aposta de baixo custo com potencial de explosão**, crescido primeiro no orgânico e no conteúdo de nostalgia e escalado com tráfego pago só depois de provar ROAS. Ele **não substitui** um negócio de receita recorrente como base da empresa. Os dois podem andar juntos: o SaaS sustenta, o jogo é a aposta.

---

## 11. Próximos passos sugeridos

1. Decidir o nome e a identidade (ex.: algo que remeta a "9999 em 1" sem usar marcas registradas).
2. Escolher os 5 jogos de lançamento.
3. Eu monto o protótipo jogável na web (moldura do aparelho + controles retrato/paisagem + 1 jogo) para testarmos no celular em poucos dias.
4. Em paralelo, gravar os primeiros vídeos de nostalgia para medir o interesse antes do lançamento.
