# Conteúdo Instagram Tuliu

Pasta com destaques (stories) para o Instagram da Tuliu explicando os principais serviços.

## 📱 Stories Criados

### 1. **Domínios e Websites**
- **Arquivo:** `story-1-dominios-1080x1920.png`
- **Descrição:** Foca no serviço de registro e configuração de domínios, DNS e SSL
- **Ícone:** Globe (fas fa-globe)
- **Mensagem:** "Registramos e configuramos seu domínio, gerenciamos DNS e mantemos o certificado SSL ativo."

### 2. **Automações**
- **Arquivo:** `story-2-automacoes-1080x1920.png`
- **Descrição:** Destaca automações de processos e marketing
- **Ícone:** Cogs (fas fa-cogs)
- **Mensagem:** "Mapeamos seus processos, conectamos seus sistemas e entregamos automações prontas."

### 3. **Agentes de IA**
- **Arquivo:** `story-3-agentes-ia-1080x1920.png`
- **Descrição:** Apresenta os agentes inteligentes da Tuliu
- **Ícone:** Robot (fas fa-robot)
- **Mensagem:** "Desenvolvemos agentes inteligentes prontos para atender, vender e automatizar."

## 🎨 Design System

- **Dimensões:** 1080 x 1920px (padrão Instagram Stories)
- **Fontes:** Inter (corpo) + Caveat (títulos)
- **Cores:** 
  - Fundo: Gradiente cinza claro (#f8f8f8) para branco
  - Ícones: Preto (#0a071a) em círculo
  - Texto: Preto para títulos, cinza (#555) para descrição
- **Ícones:** Font Awesome 6.5.2

## 📝 Como Evoluir

### Arquivos HTML
Os arquivos originais estão em `stories/`:
- `story-1-dominios.html`
- `story-2-automacoes.html`
- `story-3-agentes-ia.html`

Para fazer alterações:
1. Edite o arquivo `.html` desejado
2. Execute `node generate-stories.js` para regenerar as imagens PNG
3. As imagens atualizadas ficarão na raiz da pasta `/conteudo/`

### Sugestões de Evolução

**Design:**
- Adicionar gradientes mais dinâmicos
- Implementar animações de loader (use `@keyframes` no CSS)
- Incluir elementos gráficos (shapes, patterns)
- Adicionar call-to-action botões interativos

**Conteúdo:**
- Adicionar estatísticas/números de impacto
- Incluir depoimentos de clientes
- Criar variações A/B com diferentes CTAs
- Adicionar contador ou série de stories (1/3, 2/3, 3/3)

**Técnico:**
- Otimizar peso das imagens com compressão
- Criar template base reutilizável
- Adicionar versão em inglês
- Implementar versão com vídeo (MP4)

## 🚀 Publicação

1. Abra Instagram Business
2. Crie um destaque novo ou adicione a um existente
3. Faça upload das imagens PNG na ordem:
   - story-1-dominios
   - story-2-automacoes
   - story-3-agentes-ia
4. Adicione links/stickers personalizados se desejar

## 📦 Estrutura

```
conteudo/
├── README.md (este arquivo)
├── generate-stories.js (script para gerar PNGs)
├── package.json
├── story-1-dominios-1080x1920.png
├── story-2-automacoes-1080x1920.png
├── story-3-agentes-ia-1080x1920.png
└── stories/
    ├── story-1-dominios.html
    ├── story-2-automacoes.html
    └── story-3-agentes-ia.html
```

## 🔧 Requisitos

- Node.js 18+
- Puppeteer (instalado automaticamente com `npm install`)

## 📄 Licença

Uso interno Tuliu
