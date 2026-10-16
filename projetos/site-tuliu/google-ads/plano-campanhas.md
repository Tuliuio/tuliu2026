# Google Ads Tuliu — Plano de campanhas v1

- **Conta:** Tuliu 876-312-1335 (MCC Tuliu 404-679-7654) · BRL · America/Sao_Paulo · faturamento aprovado
- **Região:** Brasil · idioma português
- **Orçamento:** R$50/dia → Hospedagem R$30 + Agência R$20
- **Rede:** só Pesquisa (sem Display, sem parceiros de pesquisa)
- **Lance inicial:** Maximizar cliques com teto de CPC (sem dados de conversão ainda). Migrar para Maximizar conversões depois de ~15–30 conversões.

---

## Campanha A — `Tuliu | Search | Hospedagem → Starter` (R$30/dia)

**Tese:** quem procura hospedagem compra um servidor e ainda tem de fazer o site sozinho. A Tuliu entrega o site pronto, hospedado e cuidado por R$97/mês. A porta de entrada é o Starter, e depois expandimos o cliente.

**Landings:** A1 e A2 → `tuliu.io/hospedagem` (comparativo genérico, sem marca) · A3 → `tuliu.io/alternativa-hostinger`
**Teto de CPC:** R$3,00

| Grupo | Palavras-chave (frase / exata) |
|---|---|
| A1 Hospedagem | "hospedagem de site", "hospedagem de sites", "hospedagem site barata", "hospedagem com domínio", [hospedagem de site] |
| A2 Site + hospedagem | "criar site profissional", "site com domínio e hospedagem", "quanto custa um site", "site para empresa", "fazer site para minha empresa" |
| A3 Concorrentes | "hostinger", "locaweb", "hostgator", "kinghost", "alternativa hostinger", "cancelar hostinger" |

> A3 fica num grupo separado para poder ser cortado. Licitar no nome do concorrente é permitido, mas **o anúncio não pode citar a marca** dele.

**Negativas da campanha:** login, entrar, webmail, cpanel, "área do cliente", telefone, suporte, grátis, gratuito, gratuita, curso, vaga, emprego, vps, dedicado, revenda, minecraft, "servidor de jogo", email marketing

**RSA — títulos (≤30)**
1. Site Pronto + Hospedagem
2. Por R$97/mês, Tudo Incluso
3. Hospedagem Sozinha Não Vende
4. Domínio, SSL e E-mail Inclusos
5. Nós Criamos e Cuidamos do Site
6. Hospedagem com Site Incluso
7. Esqueça cPanel e Configuração
8. Suporte Direto no WhatsApp
9. Sem Taxa de Criação do Site
10. Sem Fidelidade
11. Mais que Hospedagem: Um Time
12. Troque de Hospedagem Hoje
13. Tuliu: Site Feito Para Você

**RSA — descrições (≤90)**
1. Hospedagem te dá um servidor. A Tuliu te entrega o site pronto, publicado e mantido.
2. Domínio, hospedagem, SSL, e-mails e site profissional por R$97/mês. Sem fidelidade.
3. Nada de painel técnico: você pede pelo WhatsApp e nosso time resolve.
4. Comece pelo Starter e cresça com tráfego pago e SEO quando quiser.

---

## Campanha B — `Tuliu | Search | Agência Repensada` (R$20/dia)

**Tese:** "Agências de marketing são lentas e caras." A Tuliu é um time completo pelo preço de uma ferramenta: a IA executa e especialistas aprovam. A conversão é o diagnóstico gratuito, e o fechamento é comercial (Business/Enterprise).

**Landings:** B1 e B3 → `tuliu.io/alternativa-agencia-de-marketing` · B2 → `tuliu.io/gestao-de-trafego-com-ia` (todas levam ao diagnóstico)
**Teto de CPC:** R$5,00

| Grupo | Palavras-chave (frase / exata) |
|---|---|
| B1 Agência de marketing | "agência de marketing digital", "contratar agência de marketing", "agência de marketing para pequenas empresas", "quanto custa agência de marketing", "agência de marketing preço" |
| B2 Tráfego pago | "agência de tráfego pago", "gestão de tráfego pago", "gestor de tráfego para empresa", "agência google ads" |
| B3 Agência com IA | "agência de marketing com ia", "marketing com inteligência artificial para empresas", "trocar de agência de marketing" |

**Negativas da campanha:** vaga, vagas, emprego, estágio, salário, curso, faculdade, pdf, "como abrir", "como ser", "como montar", "nome para", logo, grátis

**RSA — títulos (≤30)**
1. Agência de Marketing Repensada
2. Um Time de Marketing Completo
3. Pelo Preço de uma Ferramenta
4. Agências São Lentas e Caras
5. IA Executa, Humano Aprova
6. Diagnóstico Gratuito
7. Tráfego, Site e SEO Juntos
8. Gestão de Google e Meta Ads
9. Melhora Toda Semana com Dados
10. Planos a Partir de R$497/mês
11. Sem Fidelidade, via WhatsApp
12. Veja Nossos Cases Reais

**RSA — descrições (≤90)**
1. Site, SEO, conteúdo, tráfego pago e IA numa só operação que melhora toda semana.
2. A IA faz o operacional, nosso time cuida da estratégia. Você paga resultado, não horas.
3. Peça seu diagnóstico gratuito e receba um panorama real do seu marketing pelo WhatsApp.
4. Sem fidelidade e sem taxa de criação. Tudo direto pelo WhatsApp, sem fila.

---

## Extensões (nível conta)

- **Sitelinks:** Planos e Preços (`/#precos`) · Cases Reais (`/cases`) · Diagnóstico Gratuito (`/diagnostico`) · Como Funciona (`/#servicos`)
- **Callouts:** Sem fidelidade · Sem taxa de criação · Suporte via WhatsApp · Domínio e SSL inclusos · IA + especialistas · Relatório de resultados

---

## Medição (feito)

- Tag `AW-18517648392` no `index.html` do tuliu.io, com as conversões disparadas por `src/lib/ads.ts`:
  - `Lead — Diagnóstico`: envio do formulário em `/diagnostico` → primária
  - `Checkout Starter iniciado`: checkout ASAAS criado → primária
  - `Clique WhatsApp`: qualquer link wa.me → secundária
- Página `/hospedagem` criada em `src/data/landings.ts`.

## Leitura após 14 dias

- CTR < 3% num grupo → revisar títulos
- Termos de busca → negativar o lixo (sobretudo em A3 e B1)
- CPA do Starter vs Diagnóstico → redistribuir os R$50
