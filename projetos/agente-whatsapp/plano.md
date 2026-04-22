# Plano: Agente WhatsApp Tuliu

## Contexto

Tom precisa de um agente inteligente que integre WhatsApp (Evolution API), Supabase e o contexto estruturado da Tuliu no VS Code. O objetivo é poder emitir comandos conversacionais em português ("Claude, analise o cliente X e dispare um resumo") e o agente executar: consultar dados, gerar mensagens personalizadas e enviar via WhatsApp. A solução deve ser arquitetada pra evoluir para uma dashboard de clientes (Tuliu.io) no futuro.

**Decisões do usuário:**
- Credenciais Evolution API prontas — usuário vai preencher o `.env`
- Supabase vazio — schema precisa ser criado do zero
- Interface inicial: terminal/Claude Code

---

## Arquitetura

```
agent/
├── src/
│   ├── index.ts        # CLI entrypoint: node agent/src/index.ts "comando"
│   ├── agent.ts        # Claude API com tool_use — o "cérebro"
│   ├── config.ts       # Carrega variáveis do .env
│   └── tools/
│       ├── supabase.ts # Ferramentas de leitura/escrita no banco
│       ├── whatsapp.ts # Envio de mensagens via Evolution API
│       └── context.ts  # Lê arquivos de contexto da Tuliu (_contexto/, projetos/)
├── supabase/
│   └── schema.sql      # Schema inicial do banco
├── package.json
└── tsconfig.json
```

**Stack:** Node.js + TypeScript (alinhado com o resto do workspace)

---

## Schema Supabase (criar do zero)

```sql
-- Clientes da Tuliu
clients (
  id uuid primary key,
  name text,
  phone text,           -- ex: "5511999999999" (formato Evolution API)
  email text,
  company text,
  status text,          -- active | inactive | prospect
  notes text,
  created_at timestamptz
)

-- Projetos por cliente
projects (
  id uuid primary key,
  client_id uuid references clients(id),
  name text,
  type text,            -- branding | site | automacao | consultoria
  status text,          -- briefing | proposta | execucao | entregue
  value numeric,
  started_at date,
  ended_at date
)

-- Log de mensagens WhatsApp
messages_log (
  id uuid primary key,
  client_id uuid references clients(id),
  direction text,       -- sent | received
  content text,
  sent_at timestamptz,
  metadata jsonb        -- dados extras da Evolution API
)
```

---

## Ferramentas do Agente (tools para Claude API)

| Tool | O que faz |
|------|-----------|
| `list_clients` | Lista todos os clientes do Supabase |
| `get_client` | Busca dados de um cliente específico |
| `query_supabase` | Executa query SQL arbitrária |
| `send_whatsapp` | Envia mensagem via Evolution API |
| `log_message` | Salva mensagem enviada no `messages_log` |
| `read_context` | Lê arquivos `_contexto/`, `marca/design-guide.md` |
| `read_project_files` | Lê arquivos da pasta `projetos/[cliente]/` |

---

## Fluxo de Execução

```
Usuário: node agent/src/index.ts "Agradeça ao Eduardo pela confiança e envie a cobrança"
         ↓
index.ts → agent.ts (envia pro Claude API com lista de tools)
         ↓
Claude API decide quais tools chamar:
  1. get_client("Eduardo") → busca phone, projeto, valor
  2. read_project_files("eduardo") → pega contexto do projeto
  3. send_whatsapp(phone, mensagem_gerada) → dispara
  4. log_message(client_id, conteúdo) → salva no banco
         ↓
Terminal mostra: ✓ Mensagem enviada para Eduardo (+55...)
```

---

## Arquivos a Criar

### 1. `agent/package.json`
Dependências: `@anthropic-ai/sdk`, `@supabase/supabase-js`, `axios` (Evolution API), `dotenv`, `typescript`, `tsx`

### 2. `agent/src/config.ts`
Carrega e valida variáveis do `.env` (ANTHROPIC_API_KEY, EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE_NAME, SUPABASE_URL, SUPABASE_ANON_KEY)

### 3. `agent/src/tools/supabase.ts`
Inicializa `createClient` do Supabase. Implementa `list_clients`, `get_client`, `query_supabase`, `log_message`.

### 4. `agent/src/tools/whatsapp.ts`
Usa axios para chamar `POST /message/sendText/{instance}` da Evolution API. Implementa `send_whatsapp`.

### 5. `agent/src/tools/context.ts`
Usa `fs.readFile` para carregar arquivos de `_contexto/` e `projetos/`. Implementa `read_context`, `read_project_files`.

### 6. `agent/src/agent.ts`
Loop Claude API com `tool_use`. Envia o comando do usuário + system prompt com contexto da Tuliu. Processa tool_calls até chegar em `end_turn`. Inclui prompt caching nas mensagens fixas.

### 7. `agent/src/index.ts`
CLI: lê `process.argv[2]` como comando, chama `runAgent(command)`, imprime resultado.

### 8. `agent/supabase/schema.sql`
Schema SQL das 3 tabelas acima, pronto pra rodar no Supabase SQL editor.

---

## Atualizar `.env`

Adicionar os campos faltantes:
```
EVOLUTION_API_KEY=<chave real>
EVOLUTION_API_URL=<url da instância>
EVOLUTION_INSTANCE_NAME=<nome>
ANTHROPIC_API_KEY=<chave>
SUPABASE_URL=https://oiasgnppxketqzgqhztu.supabase.co
SUPABASE_ANON_KEY=<anon key>
```

---

## Verificação / Testes

1. `cd agent && npm install` — instala dependências
2. `npx tsx src/index.ts "Liste meus clientes"` — testa Supabase (esperado: lista vazia por enquanto)
3. Adicionar 1 cliente manualmente no Supabase Studio
4. `npx tsx src/index.ts "Envie oi para [nome do cliente]"` — testa Evolution API
5. Verificar mensagem chegou no WhatsApp + registro em `messages_log`

---

## Evolução Futura (fora do escopo agora)

- Webhook server para receber respostas do WhatsApp
- Dashboard Tuliu.co: expõe os dados do Supabase via API REST
- Skill Claude Code: `/whatsapp` como atalho de skill
- Integração Stripe: cobranças automáticas referenciadas no contexto
