# Workflow de Diagnósticos — Mira Brand Studio

Documentação completa para criar, validar e publicar diagnósticos de branding.

---

## 1. Estrutura do Projeto

### Caminhos Críticos

```
tuliu2026/                                    # Repositório Git (main)
├── projetos/site-tuliu/
│   └── tuliu-app/                          # App Vite (build: npm run build)
│       ├── public/                         # Assets estáticos (copiados para dist/)
│       │   └── mira/diagnosticos/
│       │       ├── loop/
│       │       │   └── index.html         # Diagnóstico da Loop
│       │       └── thyago/
│       │           └── index.html         # Novo diagnóstico
│       ├── src/                           # Código fonte TypeScript/React
│       ├── vite.config.ts                 # Build config
│       └── package.json
│
├── mira/diagnosticos/                     # 📁 Pasta RAIZ (não publicada!)
│   ├── README.md
│   ├── loop_briefing.md
│   └── thyago_briefing.md                 # Briefing de input
│
├── tsconfig.json                          # Restringe compil. a src/ (NÃO projetos/)
└── [raiz]/public/                         # ❌ Não use! Vite usa tuliu-app/public/


Published URL: https://tuliu.io/mira/diagnosticos/[cliente]/
Deploy: GitHub → Hostinger (automatic via webhook)
```

### Por que essa estrutura?

- **`projetos/site-tuliu/tuliu-app/public/mira/diagnosticos/`** = Publicado  
  → Copiado durante build Vite para `dist/`  
  → Acessível em `https://tuliu.io/mira/diagnosticos/[cliente]/`

- **`mira/diagnosticos/` (raiz)** = Controle de versão + input  
  → Documentação, briefings, templates  
  → NÃO é publicado automaticamente

- **`/public` (raiz)** = ❌ Histórico/tentativa antiga  
  → Ignore. Use apenas `tuliu-app/public/`

---

## 2. Workflow Completo: Criar → Validar → Publicar

### 2.1 Fase 1: Pesquisa & Briefing

```bash
# 1. Consolidar insights em Markdown
#    Local: /mira/diagnosticos/[cliente]_briefing.md
#    Estrutura: contexto → resumo → análise → recomendações

# 2. Validar com cliente (feedback loop)
#    Ajustar briefing conforme necessário
```

**Exemplo:**
```
/mira/diagnosticos/thyago_briefing.md
  - Contexto do projeto
  - Resumo executivo
  - Análise por dimensão
  - Forças, atenções, recomendações
```

---

### 2.2 Fase 2: Design do HTML

```bash
# 1. Criar arquivo HTML padrão
#    Local: /projetos/site-tuliu/tuliu-app/public/mira/diagnosticos/[cliente]/index.html
#    Estrutura: Padrão Mira (CSS inline + HTML5)
#    Template: Baseado em /projetos/site-tuliu/tuliu-app/public/mira/diagnosticos/loop/

# 2. Inserir conteúdo do briefing
#    Capas, seções, boxes, grids, recomendações

# 3. Adicionar logo real
#    Fonte: https://somosmira.com.br/wp-content/uploads/2024/12/cropped-mira-2023_3-1024x424-6.png
#    Não use texto "MIRA", use <img> com logo real
```

**Localização correta:**
```
✅ CORRETO: projetos/site-tuliu/tuliu-app/public/mira/diagnosticos/[cliente]/index.html
❌ ERRADO: /public/mira/diagnosticos/[cliente].html
❌ ERRADO: /mira/diagnosticos/[cliente]/index.html
```

---

### 2.3 Fase 3: Validação Local

```bash
# 1. Servidor local (dev mode)
cd projetos/site-tuliu/tuliu-app
npm run dev

# Acesse: http://localhost:5173/mira/diagnosticos/[cliente]/

# 2. Verificar:
#    - Layout responsivo (mobile, tablet, desktop)
#    - Fontes carregadas (DM Serif Display, DM Sans, Playfair)
#    - Logo renderizando corretamente
#    - Cores e espaçamento
#    - Navegação (links de índice funcionando)
```

---

### 2.4 Fase 4: Git & Deploy

```bash
# 1. Commitar no repositório raiz
cd /Users/tomasnevesmartins/Documents/Tuliu\ OS/Tuliu

git add projetos/site-tuliu/tuliu-app/public/mira/diagnosticos/[cliente]/

git commit -m "feat: add [Cliente] brand diagnosis

- HTML structure with Mira design pattern
- 8 sections: intro, brand, strategy, visual, tech, metrics, insights, recommendations
- Mira logo integrated
- Responsive design

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

git push origin main

# 2. Esperar webhook Hostinger
#    GitHub → Hostinger (automatic)
#    Build: npm run build → outputs dist/
#    Public: Hostinger serves dist/
#    URL: https://tuliu.io/mira/diagnosticos/[cliente]/
```

---

## 3. TypeScript & Build Config

### 3.1 tsconfig.json (CRÍTICO)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "vite-env.d.ts"],
  "exclude": ["node_modules", "projetos", "dist", ".git"]
}
```

**Por quê?**
- `include`: Apenas `src/` (compila código principal)
- `exclude`: `projetos/` (subprojetos independentes com seu próprio tsconfig)
- **Sem isso:** Build falha com erros de TypeScript em projetos/

### 3.2 vite.config.ts

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  }
});
```

**Como funciona:**
1. `npm run build` compila TypeScript + Vite
2. `dist/` é gerado com:
   - `public/` copiado para `dist/` (assets estáticos)
   - `src/` compilado e bundled
3. Hostinger serve `dist/` como raiz

---

## 4. Checklist: Novo Diagnóstico

- [ ] **Briefing consolidado** em `/mira/diagnosticos/[cliente]_briefing.md`
- [ ] **HTML criado** em `/projetos/site-tuliu/tuliu-app/public/mira/diagnosticos/[cliente]/index.html`
- [ ] **Logo real** (não texto) usando URL: `https://somosmira.com.br/wp-content/uploads/2024/12/cropped-mira-2023_3-1024x424-6.png`
- [ ] **Estrutura pasta:** `[cliente]/index.html` (não `[cliente].html`)
- [ ] **Validação local:** `npm run dev` → `http://localhost:5173/mira/diagnosticos/[cliente]/`
- [ ] **Responsividade:** Testado em mobile, tablet, desktop
- [ ] **Git commit** com mensagem descritiva
- [ ] **Git push** para main
- [ ] **Hostinger build** (~2-5 min)
- [ ] **URL pública:** `https://tuliu.io/mira/diagnosticos/[cliente]/` ✅

---

## 5. Problemas Comuns

### "Página não encontrada (404 em /mira/diagnosticos/thyago)"
**Causa:** Build não foi executado ou arquivo está no caminho errado

**Solução:**
1. Verificar caminho: `projetos/site-tuliu/tuliu-app/public/mira/diagnosticos/[cliente]/index.html`
2. Verificar `tsconfig.json` (deve excluir `projetos/`)
3. Aguardar Hostinger rebuild (2-5 min após push)
4. Limpar cache do navegador (Ctrl+Shift+Delete)

### "TypeError: Cannot find module '@/lib/utils'"
**Causa:** `tsconfig.json` incluindo `projetos/` na compilação

**Solução:**
```json
"include": ["src/**/*.ts", "src/**/*.tsx", "vite-env.d.ts"],
"exclude": ["node_modules", "projetos", "dist"]
```

### "Logo não carrega (imagem vermelha quebrada)"
**Causa:** URL incorreta ou sem internet

**Solução:**
- Usar URL HTTPS: `https://somosmira.com.br/wp-content/uploads/...`
- Testar URL no navegador direto
- Se indisponível, fazer upload em `/public/assets/logo.png` e usar caminho relativo

---

## 6. Próximos: Skills & Automação

Futuros scripts para automatizar:

```bash
/create-diagnosis [cliente]
  → Cria estrutura completa
  → Template HTML pronto
  → Git commit automático
  → Validação pré-push

/add-briefing [cliente]
  → Integra Markdown briefing
  → Converte para HTML sections
  → Atualiza TOC
```

---

## Referências

- **Loop Diagnostic:** `/projetos/site-tuliu/tuliu-app/public/mira/diagnosticos/loop/index.html`
- **Vite Docs:** https://vitejs.dev
- **Hostinger Deploy:** Automático via GitHub webhook
- **Brand Logo:** https://somosmira.com.br

