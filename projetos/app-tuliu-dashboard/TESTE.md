# Guia de Teste — App Dashboard Tuliu

## Pré-requisitos

- Node.js 16+
- Supabase project criado e tabelas setup (SQL já rodou)
- `.env` files preenchidos em `frontend/` e `backend/`

---

## 1. Instalar e rodar

**Terminal 1 — Backend:**
```bash
cd projetos/app-tuliu-dashboard/backend
npm install
npm run dev
```
Você vai ver: `Server running at http://localhost:3001`

**Terminal 2 — Frontend:**
```bash
cd projetos/app-tuliu-dashboard/frontend
npm install
npm run dev
```
Você vai ver: `http://localhost:5173`

---

## 2. Criar usuário Admin

1. Acesse [Supabase Console](https://supabase.com) → seu projeto
2. Vá em **Authentication → Users**
3. Clique **Add user**
4. Preencha:
   - Email: `admin@tuliu.io`
   - Password: qualquer coisa (ex: `admin123`)
5. Clique **Create user**

Depois, vá em **SQL Editor** e rode:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@tuliu.io';
```

---

## 3. Testar fluxo Admin

1. Abra http://localhost:5173
2. Faça login com `admin@tuliu.io` / `admin123`
3. Você vai pra **Admin Dashboard**

### 3a. Criar cliente
- Clique **Novo Cliente**
- Preencha:
  - Email: `cliente1@example.com`
  - Nome: `Cliente Teste`
  - Senha: `cliente123`
- Clique **Criar Cliente**

### 3b. Criar serviço pro cliente
- Vá na aba **Serviços**
- Clique **Novo Serviço**
- Selecione o cliente que criou
- Escolha tipo (ex: Domain)
- Preencha nome, descrição, data de vencimento
- Clique **Criar Serviço**

---

## 4. Testar fluxo Cliente

1. **Logout** (botão no header)
2. Faça login com `cliente1@example.com` / `cliente123`
3. Você vai pra **Client Dashboard**
4. Você vê os serviços que criou no passo 3b
5. Clique **Solicitar Renovação** em um serviço

---

## 5. Testar renovação como Admin

1. **Logout**
2. Faça login com `admin@tuliu.io` / `admin123`
3. Vá na aba **Renovações**
4. Você vê o pedido que fez no passo 4
5. Clique **Processar**
6. O pedido desaparece da lista (status muda pra processed)

---

## Checklist de testes

- [ ] Backend roda na porta 3001
- [ ] Frontend roda na porta 5173
- [ ] Login como admin funciona
- [ ] Login como cliente funciona
- [ ] Admin consegue criar cliente
- [ ] Admin consegue criar serviço
- [ ] Cliente vê seus serviços
- [ ] Cliente consegue solicitar renovação
- [ ] Admin vê renovações pendentes
- [ ] Admin consegue marcar como processada

---

## Troubleshooting

**"Cannot POST /api/clients"**
- Certifique-se que backend está rodando em http://localhost:3001

**"Invalid token"**
- Verifique que `.env` tem o `SUPABASE_SERVICE_KEY` correto

**"RLS policy error"**
- Verifique que as políticas de RLS foram criadas pelo SQL

**"Missing Supabase URL"**
- Verifique `.env` do frontend com `VITE_SUPABASE_URL`

---

Se tudo passar, bora pro deploy! 🚀
