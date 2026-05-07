# Briefing — Landing Page Jornada Reviva

**Cliente:** Viviam Agatti
**Projeto:** Landing page institucional para a Jornada Reviva
**Status do briefing:** Em fechamento — pendências sinalizadas no fim do doc
**Última atualização:** 2026-04-29

---

## 1. Visão geral

Landing page de página única apresentando a Jornada Reviva, um programa conduzido pela Viviam Agatti. O objetivo da página é despertar interesse no público-alvo (provavelmente mulheres em busca de processo terapêutico/transformação pessoal), comunicar a proposta da Jornada e gerar contato qualificado via formulário de interesse e WhatsApp do consultório.

**Referência de inspiração visual:** [beatrizpinaud.com.br](https://beatrizpinaud.com.br/) — análise detalhada em `assets/referencia/REFERENCIA-BEATRIZ-PINAUD.md`. Tomamos como inspiração de **clima, padrões visuais e ritmo**, não estrutura literal. A paleta Reviva é mauve/lilás (do logo) — não rosa-salmão como a Beatriz.

---

## 2. Stack & infraestrutura

| Item | Decisão |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Estilização | Tailwind CSS |
| Linguagem | TypeScript |
| Hospedagem | Hostinger Cloud (com Node.js) |
| Deploy | Via GitHub (push automático) |
| Versionamento | Git + repositório no GitHub |
| Analytics | **Nenhum** (sem GA, sem Pixel) |
| Form backend | Não há — submit do form abre WhatsApp da Viviam com dados pré-preenchidos |

**Observação Hostinger:** como o deploy é via GitHub e o plano comporta Node, podemos rodar Next.js em modo SSR completo. Configurar GitHub Actions ou webhook do Hostinger pra deploy automático na branch `main`.

---

## 3. Identidade visual (design system)

### 3.1 Paleta — Reviva mapeada nos papéis da referência

Mantemos a paleta lilás do logo, mas distribuímos as cores nos **mesmos papéis** que a Beatriz Pinaud usa, pra reproduzir o ritmo visual da referência:

| Papel (espelhando Beatriz) | Cor Beatriz | Cor Reviva | Uso |
|---|---|---|---|
| **Primário** (CTAs, header, destaques) | `#D99D8F` | `#A88AA6` | botões principais, navbar, ícones de destaque |
| **Secundário escuro** (cards de serviço) | `#838C74` | `#5B4660` | fundo dos cards de Módulos, headings importantes |
| **Background soft** (fundos de seção) | `#B5BFAA` | `#C5A3C2` | fundos de seção alternados, banner CTA |
| **Neutro claro** (fundos neutros) | `#F4F4F4` | `#F5EDF2` | fundo de seções "calmas" (Sobre, Blog se houver) |
| **Texto corpo** | `#4D4D4D` | `#4A3D4F` | parágrafos |
| **Texto escuro (títulos)** | `#212121` | `#2C1F2E` | H1, H2 |
| **Branco** | `#FFFFFF` | `#FFFFFF` | sobre fundos escuros |

**Variáveis CSS:**
```
--reviva-primary:     #A88AA6   /* mauve-deep — CTAs e destaques */
--reviva-secondary:   #5B4660   /* purple-deep — cards e títulos */
--reviva-soft:        #C5A3C2   /* mauve suave — backgrounds de seção */
--reviva-neutral:     #F5EDF2   /* cream rosado — fundos calmos */
--reviva-text:        #4A3D4F   /* corpo */
--reviva-ink:         #2C1F2E   /* títulos */
--reviva-white:       #FFFFFF
```

> Valores são extração visual aproximada do PNG. Refinar quando logo em vetor (SVG) estiver disponível.

### 3.2 Tipografia

**Decisão (espelhando Beatriz):** **`Poppins`** como fonte única, em pesos variados.

- **H1/H2:** Poppins SemiBold/Bold (600-700)
- **Eyebrow** (rótulo de seção): Poppins Medium (500), uppercase, letter-spacing aberto
- **Corpo:** Poppins Regular (400)
- **Botões:** Poppins SemiBold (600)

Carregar via `next/font/google` (sem chamadas externas em runtime). Pesos a importar: 400, 500, 600, 700.

> **Nota:** no logo, "Reviva" aparece em script manuscrito. Esse acento manuscrito fica restrito ao próprio logo — não vamos duplicar com outra fonte handwriting no corpo da página.

### 3.3 Padrões visuais a herdar da Beatriz

| Padrão | Aplicação na Reviva |
|---|---|
| **Border-radius generoso** | cards, botões, navbar, imagens (rounded-2xl ou maior) |
| **Eyebrow labels uppercase** | antes de cada H2 ("SOBRE A JORNADA", "MÓDULOS", "QUEM CONDUZ", etc.) — em mauve-deep |
| **Split layout** (texto + imagem) | Hero (texto esquerda + foto Viviam direita) e Sobre Viviam (foto esquerda + texto direita) |
| **Cards escuros sobre seção clara** | Cards dos 3 módulos: fundo `--reviva-secondary` sobre seção `--reviva-soft` |
| **Badges flutuantes sobre foto** | Considerar 2-3 badges sobre a foto da Viviam ("Acolhimento", "Escuta ativa", "Transformação") |
| **WhatsApp flutuante** | Botão fixo no canto inferior direito (verde WhatsApp `#25D366`) com label "Posso te ajudar?" |
| **CTAs convergem pro WhatsApp** | Todos os botões da página apontam pro mesmo destino (WhatsApp da Viviam) |
| **Tom editorial 1ª pessoa** | Copy da Viviam em primeira pessoa ("Sou", "Acompanho", "Acredito") |

### 3.4 Tom & ritmo

- Espaçamento generoso (clima introspectivo, não comercial)
- Foto da Viviam com tratamento que harmonize com a paleta mauve (recortar fundo, aplicar leve overlay, ou usar bloco de cor de apoio)
- Animações sutis no scroll (fade-in, slide-up curto) — sem parallax pesado
- Mobile-first

---

## 4. Estrutura da página

A cliente listou 7 seções de conteúdo. Adicionamos: **navbar flutuante** (acima do hero) e **WhatsApp flutuante** (botão fixo) — ambos espelham a Beatriz e são padrão de mercado. Total: 7 seções de conteúdo + 2 elementos persistentes.

### 4.0 Navbar flutuante (elemento persistente)
**Inspiração Beatriz:** card flutuante com bordas arredondadas, fundo `--reviva-primary`.

**Elementos:**
- Logo Reviva à esquerda (versão `logo-icon-only.png` ou texto)
- Links centrais: Sobre · Módulos · Quem conduz · Datas · Contato
- CTA à direita: "Falar no WhatsApp" (ícone WhatsApp + texto)
- Mobile: hamburger menu

### 4.1 Hero / Banner da home
**Inspiração Beatriz:** split layout 50/50 (texto esquerda, foto direita), eyebrow uppercase, dois CTAs.

**Layout:** duas colunas — texto à esquerda, foto da Viviam à direita.

**Elementos:**
- **Eyebrow:** "JORNADA REVIVA" (uppercase, letter-spacing aberto, mauve-deep)
- **H1:** título principal com palavra-chave em cor de destaque
- **Parágrafo:** 1 frase explicando o que é
- **CTAs (2):** primário "Falar no WhatsApp" (sólido) + secundário "Conhecer a Jornada" (outline, faz scroll pra Sobre)
- **Imagem:** foto da Viviam tratada (ver seção 4.5 Tratamento da foto)
- **Fundo:** `--reviva-neutral` (cream rosado, suave)

**Rascunho de copy (Claude):**
> **Eyebrow:** JORNADA REVIVA
> **Título:** Reviva sua essência. <span>Reescreva sua história.</span>
> **Parágrafo:** Uma jornada de autoconhecimento e ressignificação conduzida pela terapeuta Viviam Agatti.
> **CTA primário:** Falar no WhatsApp
> **CTA secundário:** Conhecer a Jornada

### 4.2 Sobre o Reviva
**Inspiração Beatriz:** seção centrada com eyebrow + H2 + texto, sem imagem dominante.

**Layout:** seção centralizada, max-width contido, fundo `--reviva-white`.

**Elementos:**
- **Eyebrow:** "SOBRE A JORNADA"
- **H2:** "O que é a Jornada Reviva"
- 2-3 parágrafos curtos
- Elemento gráfico sutil (ícone de lótus extraído do logo, em mauve)

**Rascunho de copy (Claude):**
> **Eyebrow:** SOBRE A JORNADA
> **Título:** Um caminho de retorno a si mesma
> **Texto:** A Jornada Reviva é um processo de transformação pessoal conduzido em três módulos. Mais do que um programa, é um caminho de retorno a si mesma — onde memórias, padrões e relações são olhados com cuidado pra abrir espaço pro novo.
>
> Pra quem sente que algo precisa mudar, mas ainda não encontrou o caminho. Pra quem busca clareza, leveza e um sentido mais profundo pras próprias escolhas.

### 4.3 Módulos (3)
**Inspiração Beatriz:** cards de fundo escuro (`--reviva-secondary`) sobre seção de fundo soft (`--reviva-soft`), border-radius generoso, ícone no topo de cada card.

**Layout:**
- Fundo da seção: `--reviva-soft` (mauve suave)
- 3 cards horizontais (desktop) / stack vertical (mobile)
- Cada card: fundo `--reviva-secondary`, texto branco, rounded-2xl, ícone no topo
- Ícones sugeridos: lótus aberto / espiral / pétala emergindo (em SVG, monoline)

**Elementos por card:**
- Ícone no topo (mauve claro sobre fundo escuro)
- Numeração ("01", "02", "03") em peso fino
- Nome do módulo (H3)
- Descrição curta (2-3 linhas)

**Rascunho de copy (Claude — placeholder, validar com Viviam):**
> **Eyebrow:** MÓDULOS
> **Título da seção:** Três passos de uma mesma jornada
>
> **Módulo 01 — Reconhecer**
> O primeiro passo é olhar pra dentro. Identificar padrões, memórias e relações que pedem atenção.
>
> **Módulo 02 — Ressignificar**
> Com clareza, vem o trabalho de transformar. Aqui acontece a integração e o cuidado com o que veio à tona.
>
> **Módulo 03 — Reviver**
> O encerramento é um recomeço. Levar pra vida o que foi descoberto e firmar novas escolhas.

### 4.4 Sobre a Viviam Agatti
**Inspiração Beatriz:** split inverso (foto esquerda, texto direita) + **badges flutuantes** sobre a foto.

**Layout:** duas colunas — foto à esquerda, texto à direita. Fundo `--reviva-white`.

**Elementos:**
- Foto da Viviam (`viviam-agatti.jpeg`, com tratamento — ver 4.5)
- 2-3 **badges flutuantes** sobre a foto (rounded-full, sombra suave, fundo branco com texto mauve-deep + ícone):
  - "Acolhimento empático" 🤲
  - "Escuta ativa" 💬
  - "Transformação" 🌸
- Eyebrow: "QUEM CONDUZ"
- H2: "Viviam Agatti"
- Bio em 2-3 parágrafos
- Lista de formações/credenciais (se Viviam mandar)
- CTA: "Falar com a Viviam" (botão WhatsApp)

**Rascunho de copy (Claude — placeholder, Viviam vai mandar):**
> **Eyebrow:** QUEM CONDUZ
> **Título:** Viviam Agatti
> **Texto:** Sou Viviam Agatti, terapeuta dedicada a acompanhar processos de transformação pessoal. [PLACEHOLDER PARA BIO REAL — abordagens, formações, anos de experiência, propósito].

### 4.4.1 Tratamento da foto da Viviam

A foto enviada tem fundo cortina cinza-azulada que destoa da paleta lilás. Três opções (Claude Code escolhe a que ficar mais limpa de implementar — recomendo a opção 2):

1. **Recorte + fundo mauve:** remover fundo da foto e colocar sobre bloco `--reviva-soft`. Requer ferramenta de remoção de fundo (remove.bg ou similar) — Tom executa antes do build.
2. **Bloco de cor de apoio (recomendado):** manter foto inteira, mas envolver em container com sombra mauve e leve gradiente nas bordas pra suavizar transição. Sem edição da imagem.
3. **Ajuste de curvas warm:** aplicar filter CSS (`hue-rotate`, `saturate`) ou processar previamente pra puxar tons quentes. Risco: pode prejudicar tom de pele.

### 4.5 Datas
**Inspiração Beatriz:** seção centrada, eyebrow + H2, conteúdo abaixo.

**Layout provisório:** fundo `--reviva-soft`, cards horizontais com data em destaque + descrição curta + CTA.

**Pendência:** confirmar com Viviam se são turmas, calendário de encontros ou eventos pontuais — copy e layout específico esperam essa definição.

### 4.6 Mini formulário de interesse
**Inspiração Beatriz:** seção contato com fundo de destaque (rosê na ref → `--reviva-primary` aqui).

**Layout:** fundo `--reviva-primary`, formulário centralizado em card branco com border-radius generoso.

**Comportamento:** o submit **não envia para servidor** — abre `wa.me` da Viviam com mensagem pré-preenchida usando os dados do form.

**Campos:**
- Nome (obrigatório)
- WhatsApp (obrigatório, com máscara)
- E-mail (opcional)
- Mensagem curta — "O que te trouxe até aqui?" (opcional, textarea)

**Lógica do submit:**
```js
mensagem = `Olá, Viviam! Meu nome é ${nome}. Cheguei pela Jornada Reviva e gostaria de saber mais.${mensagem ? ' ' + mensagem : ''}`
url = `https://wa.me/{{WHATSAPP_NUMBER}}?text=${encodeURIComponent(mensagem)}`
window.open(url, '_blank')
```

**Rascunho de copy (Claude):**
> **Eyebrow:** QUERO SABER MAIS
> **Título:** Vamos conversar?
> **Subtítulo:** Preencha abaixo e a gente segue no WhatsApp.

### 4.7 CTA final → WhatsApp
**Inspiração Beatriz:** banner CTA full-width com fundo primário e CTA único centralizado.

**Layout:** banner full-width, fundo `--reviva-primary` (com possível foto/elemento gráfico de apoio em opacidade reduzida), conteúdo centralizado.

**Elementos:**
- Eyebrow + frase de fechamento curta
- Botão grande "Falar no WhatsApp" → `wa.me/{{WHATSAPP_NUMBER}}` com mensagem pré-preenchida genérica
- Abaixo do banner (rodapé propriamente): logo + redes sociais da Viviam (se houver — confirmar)

**Rascunho de copy (Claude):**
> **Eyebrow:** PRONTA PARA COMEÇAR?
> **Título:** Algumas jornadas começam por uma mensagem.
> **CTA:** Falar com a Viviam no WhatsApp

### 4.8 WhatsApp flutuante (elemento persistente)
**Inspiração Beatriz:** botão verde fixo no canto inferior direito, label "Posso te ajudar?".

**Implementação:** componente `<WhatsAppFloating />` em `app/layout.tsx` ou na page. Botão circular, fundo `#25D366`, ícone WhatsApp branco, label tooltip ao hover. Fica oculto quando o usuário está scrollando rapidamente (opcional).

---

## 5. Comportamento técnico

### 5.1 Responsivo
Mobile-first. Breakpoints Tailwind padrão (sm/md/lg/xl). Testar em 375px, 768px, 1280px.

### 5.2 Performance
- Imagens via `next/image` com lazy loading
- Fontes via `next/font` (sem FOIT)
- Não carregar JS desnecessário (sem GA/Pixel reduz bundle)

### 5.3 SEO básico
- `<title>` e `<meta description>` específicos
- Open Graph tags + imagem (gerar OG card 1200x630 com logo + headline)
- `sitemap.xml` automático (Next.js)
- `robots.txt` permitindo indexação
- `lang="pt-BR"` no `<html>`
- Schema.org básico: `Person` (Viviam) + `Service` (Jornada)

### 5.4 Acessibilidade básica
- Contraste mínimo AA
- Alt text em todas imagens
- Labels nos campos do form
- Focus visible nos elementos interativos

---

## 6. Estrutura de pastas sugerida

```
jornada-reviva/
├── app/
│   ├── layout.tsx           # font loading, metadata global
│   ├── page.tsx             # composição das 7 seções
│   ├── globals.css          # tailwind + variáveis CSS da paleta
│   └── opengraph-image.tsx  # OG dinâmico
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppFloating.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Sobre.tsx
│   │   ├── Modulos.tsx
│   │   ├── Viviam.tsx
│   │   ├── Datas.tsx
│   │   ├── Formulario.tsx
│   │   └── CTAFinal.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Section.tsx
│       ├── Eyebrow.tsx
│       ├── Badge.tsx
│       └── WhatsAppLink.tsx
├── lib/
│   └── whatsapp.ts          # builder do link wa.me
├── public/
│   └── logo/                # 6 variações
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 7. Assets disponíveis

Em `/Reviva/assets/logo/`:
- `logo-square-light.png` — logo em fundo lilás claro
- `logo-circle-mauve.png` — logo em círculo mauve com elemento gráfico extra
- `logo-square-mauve-white-text.png` — versão em fundo mauve com texto branco
- `logo-square-mauve.png` — fundo mauve padrão
- `logo-circle-white.png` — círculo branco com borda mauve
- `logo-icon-only.png` — apenas o ícone, sem tipografia

**Foto da Viviam:** ✅ salva em `assets/foto/viviam-agatti.jpeg`. Atenção: fundo cortina cinza-azulada — ver "Tratamento da foto" na seção 4.4.1 pra opções de integração com a paleta.

**Referência visual (Beatriz Pinaud):** ✅ análise completa salva em `assets/referencia/REFERENCIA-BEATRIZ-PINAUD.md`. Padrões já incorporados nas seções 3 e 4.

---

## 8. Pendências (resolver antes do deploy)

| Item | Quem resolve | Prazo |
|---|---|---|
| Textos finais (todas seções) | Viviam | até fim do dia 29/04 |
| Confirmar abordagem (Constelações Familiares?) | Viviam | até fim do dia |
| Formato da seção "Datas" (turmas/encontros/eventos) | Viviam | até fim do dia |
| Bio + formações da Viviam | Viviam | junto com textos |
| ~~Foto da Viviam (arquivo)~~ | ✅ Resolvido | — |
| ~~Número do WhatsApp do consultório~~ | ✅ Resolvido — `(48) 98458-6556` | — |
| Domínio definitivo | Tom | antes do deploy |
| Redes sociais (links) | Viviam | até fim do dia |
| Arquivo do logo em vetor (SVG/AI) | Viviam (se tiver) | nice-to-have |

---

## 9. Placeholders no código

Pra Claude Code preencher depois (busca/replace):

```
{{WHATSAPP_NUMBER}}     → 5548984586556  (formato internacional, usado em wa.me)
{{WHATSAPP_DISPLAY}}    → (48) 98458-6556 (formato exibido no footer/UI)
{{DOMAIN}}              → ex: jornadareviva.com.br
{{SITE_TITLE}}          → "Jornada Reviva — Viviam Agatti"
{{SITE_DESCRIPTION}}    → meta description
```

---

## 10. Ordem de execução sugerida (pra Claude Code)

1. `npx create-next-app@latest` com TypeScript + Tailwind + App Router
2. Configurar Tailwind: estender paleta com as variáveis da seção 3.1
3. Configurar `next/font` com Cormorant + Inter
4. Criar `lib/whatsapp.ts` com builder do link
5. Construir componentes de UI base (`Button`, `Section`, `WhatsAppLink`)
6. Implementar seções na ordem (Hero → CTAFinal)
7. Compor `app/page.tsx`
8. Adicionar metadata + OG
9. Inicializar repositório Git, push pro GitHub
10. Configurar deploy automático na Hostinger

---

## 11. Critérios de aceite

- [ ] Todas as 7 seções implementadas
- [ ] Responsivo em 375/768/1280px
- [ ] Lighthouse: Performance ≥ 90, A11y ≥ 90, SEO ≥ 95
- [ ] Form abre WhatsApp com dados pré-preenchidos corretamente
- [ ] CTA final abre WhatsApp com mensagem genérica
- [ ] OG image renderiza no compartilhamento
- [ ] Logo carrega rápido (próximo do topo, prioritário)
- [ ] Sem erros no console
- [ ] Deploy funcionando na Hostinger
