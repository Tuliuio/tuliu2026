# App Dashboard Tuliu

## O que é

Plataforma SaaS interna da Tuliu onde clientes fazem login e acessam seus serviços (domínios, sites, agentes, automações, apps web, scripts). Admin gerencia clientes e serviços. MVP com autenticação Supabase, duas dashboards (cliente + admin) e ações de renovação.

## Tipo

Produto próprio — App/SaaS

## Escopo MVP

**Frontend:**
- Login com Supabase Auth
- Dashboard Cliente (lista de serviços, status, botão renovar)
- Dashboard Admin (CRUD clientes, CRUD serviços, visualizar pedidos de renovação)

**Backend:**
- API REST (endpoints pra clientes, serviços, renovações)
- Lógica de renovação (registra pedido, não processa pagamento)

**Database:**
- Schema Supabase (users, clients, services, renewals)
- Autenticação via Supabase (roles: admin/client)

## Stack

- Frontend: Vite + React (TypeScript)
- Backend: Node.js + Express
- Database: Supabase (PostgreSQL)
- Deploy: Hostinger VPS
- Domínio: app.tuliu.io

## Contexto

- Parte do roadmap SaaS Tuliu
- Sem prazo específico, foco em MVP funcional
- Integra com agente WhatsApp futuramente (notifica cliente de acesso)
- Tom gerencia dados de clientes (cadastra via admin)

## Arquivos importantes

- (será preenchido conforme avança)

## Regras específicas

- Stack moderna, sem legacy code
- Autenticação via Supabase, não custom
- Renovação = registra pedido, não processa pagamento (manual)
- Design: seguir marca/design-guide.md (indigo/magenta, Inter, minimalista)
