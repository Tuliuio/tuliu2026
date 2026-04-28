# Flow (Kanban) - Guia de Implementação

## 📋 Resumo

O Feature "Flow" foi implementado com:
- ✅ Kanban read-only para clientes enterprise
- ✅ Kanban full-CRUD para admin
- ✅ Dark-premium UI para Flow
- ✅ Drag-and-drop com @hello-pangea/dnd
- ✅ RLS no Supabase
- ✅ Responsivo (desktop e mobile)

---

## 🚀 Setup

### 1. Executar SQL no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com) → Seu projeto → SQL Editor
2. Cole todo o conteúdo de `KANBAN_SETUP.sql`
3. Clique **RUN** (ou Ctrl+Enter)
4. Verifique se não há erros

**Resultado esperado:**
- Tabelas `kanban_columns` e `kanban_cards` criadas
- 8 colunas padrão inseridas
- RLS policies ativadas

### 2. Testar no Browser

1. Dev server já está rodando em `http://localhost:5174`
2. Abra `http://localhost:5174` no navegador

**Cliente Enterprise:**
- Login com account enterprise
- Clique em "Dashboard" → Tab "Flow"
- Veja o kanban dark-premium
- Botões "Aprovar" e "Retornar" movem cards entre colunas

**Cliente Starter/Business:**
- Login com account não-enterprise
- Clique em "Dashboard" → Tab "Flow"
- Veja tela "Flow é recurso Enterprise"

**Admin:**
- Login com role = 'admin'
- Clique em "Administrador" → Sidebar "Flow"
- Dropdown de seleção de cliente
- Drag-and-drop de cards
- Botão "+" cria novo card
- Click no card edita/deleta

---

## 📂 Arquivos Criados

```
src/
  types/
    kanban.ts                      # KanbanColumn, KanbanCard interfaces
  components/
    dashboard/
      FlowPage.tsx                 # Client kanban (read-only + approve/return)
      FlowGate.tsx                 # Enterprise-only screen
      KanbanCardItem.tsx           # Card component
      KanbanColumn.tsx             # Column component
    admin/
      AdminFlowPage.tsx            # Admin kanban (full CRUD + drag-drop)
      CardModal.tsx                # Modal criar/editar card
```

## 🔧 Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `App.tsx` | Adicionado tipo `'flow'` na Page union type |
| `DashboardNavbar.tsx` | Tabs Dashboard/Flow no centro do navbar |
| `AdminPage.tsx` | Seção 'flow' que renderiza AdminFlowPage |
| `AdminLayout.tsx` | Menu item "Flow" com ícone fa-columns |
| `index.css` | Estilos responsivos do kanban |
| `package.json` | Dependência @hello-pangea/dnd adicionada |

---

## 🎯 Funcionalidades

### Cliente Enterprise

**FlowPage** (`src/components/dashboard/FlowPage.tsx`):
- 8 colunas: Referências → Backlog → Tasks → Copy → Design → Develop → Deploy → Done
- Cards com: título, descrição, categoria, data de entrega, responsável
- Botões "Aprovar" (move para próxima coluna) e "Retornar" (move para coluna anterior)
- Loading states e empty states
- Dark-premium UI (#0d0d1a, gradiente indigo-violet-pink)
- Scrollável horizontalmente em desktop
- Empilhado verticalmente em mobile

### Cliente Starter/Business

**FlowGate** (`src/components/dashboard/FlowGate.tsx`):
- Tela dark com ícone de cadeado
- Mensagem "Flow é um recurso Enterprise"
- Botões: "Fazer upgrade" e "Falar com especialista"
- Full-page, integrado ao design da plataforma

### Admin

**AdminFlowPage** (`src/components/admin/AdminFlowPage.tsx`):
- Dropdown de seleção de cliente
- Mesmo board do cliente, mas com:
  - Botão "+" em cada coluna para criar novo card
  - Click em card abre `CardModal` para editar/deletar
  - Drag-and-drop entre colunas (atualiza order_index e column_id)
  - Suporta arquivar cards (soft delete via archived_at)

**CardModal** (`src/components/admin/CardModal.tsx`):
- Campos: título*, coluna*, descrição, categoria (dropdown), data, responsável
- Validação: título e coluna obrigatórios
- Modo criar/editar automático baseado em contexto
- Submit atualiza ou insere no Supabase

---

## 🔐 Segurança (RLS)

```sql
kanban_columns:
  - Público (leitura para autenticados)

kanban_cards:
  - Cliente vê só seus cards (client_id = auth.user.id)
  - Cliente pode atualizar seus cards (mover entre colunas)
  - Admin vê/edita todos (role = 'admin')
```

---

## 🎨 Design Tokens

```ts
Dark Premium:
  - Background: #0d0d1a
  - Surface: #111111
  - Text: rgba(255, 255, 255, 0.87)
  - Muted: rgba(255, 255, 255, 0.45)
  - Accent: linear-gradient(135deg, #6366f1, #a855f7, #ec4899)
  - Glow: 0 0 40px rgba(99, 102, 241, 0.15)

Light (Admin):
  - Usa estilos padrão do projeto
  - Cards brancos, borders cinzas
```

---

## 📱 Responsividade

- **Desktop**: Colunas em flex horizontal, scroll-x
- **Mobile (<768px)**: Colunas empilhadas em flex vertical
- CSS media queries em `index.css` e inline styles

---

## 🧪 Checklist de Teste

- [ ] Cliente starter vê FlowGate ao clicar Flow
- [ ] Cliente enterprise vê kanban com cards
- [ ] Cliente pode clicar "Aprovar" → card move para próxima coluna
- [ ] Cliente pode clicar "Retornar" → card volta para coluna anterior
- [ ] Admin acessa Flow pelo menu lateral
- [ ] Admin seleciona cliente → board carrega com seus cards
- [ ] Admin arrasta card → atualiza coluna no Supabase
- [ ] Admin clica "+" → CardModal abre
- [ ] Admin cria novo card → aparece no board
- [ ] Admin clica em card → CardModal abre em modo edit
- [ ] Admin edita card → salva alterações
- [ ] Admin clica delete → card desaparece (archived_at)
- [ ] Mobile: colunas empilhadas verticalmente
- [ ] Mobile: cards responsivos

---

## 🚨 Possíveis Issues

1. **Cards não carregam**: Verificar RLS policies no Supabase
2. **Drag-drop não funciona no admin**: Verificar que @hello-pangea/dnd está instalado
3. **FlowGate aparece para enterprise**: Verificar que `client.plan.tier === 'enterprise'`
4. **Navbar tabs não aparecem**: Refreshar página ou limpar cache
5. **Admin não vê clientes**: Verificar que clientes têm `status: 'active'` no Supabase

---

## 📝 Notas

- Não há realtime subscriptions; dados são fetched ao abrir a página
- Cards deletados são "archived" (soft delete), não removidos do banco
- Order de cards é gerenciada por `order_index` (reordenar ao mover)
- Assignee é um campo text simples (não fk para usuários)
- Data de entrega muda cor do badge conforme proximidade (vermelho < 0d, laranja < 3d, verde >= 3d)

---

## 🔄 Próximas Melhorias (Futuro)

- [ ] Realtime updates com Supabase subscriptions
- [ ] Notificações quando card é movido (para client)
- [ ] Filtros por categoria/assignee
- [ ] Busca de cards
- [ ] Histórico de mudanças (audit log)
- [ ] Comentários nos cards
- [ ] Anexos em cards
- [ ] Integração com Slack/Email ao mover card
