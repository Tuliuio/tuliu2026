# App Dashboard Tuliu

Dashboard SaaS onde clientes acessam seus serviços contratados (domínios, sites, agentes, automações, apps, scripts) e solicitam renovações. Admin gerencia clientes, serviços e pedidos de renovação.

## Setup Local

### 1. Instalar dependências

```bash
# Frontend
cd frontend
npm install

# Backend (em outro terminal)
cd backend
npm install
```

### 2. Verificar .env files

Ambos os projetos já têm `.env` com credenciais Supabase. Se precisar mudar:
- `frontend/.env` — `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- `backend/.env` — `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `PORT`

### 3. Rodar localmente

**Backend (porta 3001):**
```bash
cd backend
npm run dev
```

**Frontend (porta 5173):**
```bash
cd frontend
npm run dev
```

Acesse http://localhost:5173

### 4. Criar primeiro usuário Admin

No Supabase Console:
1. Vá em **Authentication → Users**
2. Clique **Add user**
3. Crie com email `admin@tuliu.io` e senha qualquer
4. Vá em **SQL Editor** e rode:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@tuliu.io';
```

### 5. Testar fluxo

- **Login como admin** → vai pra Dashboard Admin
- **Criar cliente** → Dashboard Admin → Clientes → Novo cliente
- **Associar serviço** → Dashboard Admin → Serviços → Novo serviço
- **Login como cliente** → vê seus serviços e pode solicitar renovação
- **Admin vê renovações** → Dashboard Admin → Renovações → marca como processada

## Estrutura

```
frontend/              # React + Vite
├── src/
│   ├── pages/        # Login, ClientDashboard, AdminDashboard
│   ├── components/   # Reutilizáveis
│   ├── lib/          # Cliente Supabase
│   └── hooks/        # useAuth
│
backend/              # Node.js + Express
├── src/
│   ├── routes/       # Endpoints da API
│   └── middleware/   # Auth JWT
```

## Deploy no Hostinger

Veja `DEPLOY.md` (em breve)

## Stack

- Frontend: React 18 + TypeScript + Vite + React Router
- Backend: Node.js + Express + TypeScript
- DB/Auth: Supabase (PostgreSQL + Supabase Auth)
- Estilo: CSS puro (seguindo design-guide.md)
