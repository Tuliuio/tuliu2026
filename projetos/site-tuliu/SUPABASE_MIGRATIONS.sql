-- ════════════════════════════════════════════════════════════
-- SUPABASE MIGRATIONS - Tuliu Dashboard
-- Execute no SQL Editor do Supabase Dashboard
-- ════════════════════════════════════════════════════════════

-- ══ 1. CREATE PLANS TABLE ══
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  tier VARCHAR(50) NOT NULL UNIQUE,
  billing VARCHAR(20) NOT NULL,
  price NUMERIC NOT NULL,
  limits JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ══ 2. CREATE CLIENTS TABLE ══
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  plan_id UUID NOT NULL REFERENCES plans ON DELETE RESTRICT,
  status VARCHAR(50) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ══ 3. CREATE ASSETS TABLE ══
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active' NOT NULL,
  url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ══ 4. INSERT DEFAULT PLANS ══
INSERT INTO plans (name, tier, billing, price, limits)
VALUES
  ('Starter', 'starter', 'monthly', 97, '{"domains": 1, "sites": 1, "emails": 10, "automations": 0, "agents": 0}'),
  ('Business', 'business', 'monthly', 497, '{"domains": 3, "sites": 5, "emails": "unlimited", "automations": 5, "agents": 1}'),
  ('Enterprise', 'enterprise', 'monthly', 0, '{"domains": "unlimited", "sites": "unlimited", "emails": "unlimited", "automations": "unlimited", "agents": "unlimited"}');

-- ══ 5. CREATE INDEXES ══
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_client_id ON assets(client_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);

-- ══ 6. ENABLE RLS (Row Level Security) ══
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- ══ 7. CREATE RLS POLICIES - CLIENTS ══
-- Clientes podem ver seus próprios dados
CREATE POLICY "Clientes podem ver seus próprios dados"
  ON clients
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admin/Owner pode inserir clientes
CREATE POLICY "Usuários autenticados podem criar clientes"
  ON clients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Clientes podem atualizar seus próprios dados
CREATE POLICY "Clientes podem atualizar seus próprios dados"
  ON clients
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ══ 8. CREATE RLS POLICIES - ASSETS ══
-- Clientes podem ver apenas seus próprios ativos
CREATE POLICY "Clientes podem ver seus próprios ativos"
  ON assets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = assets.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Clientes podem criar ativos para sua própria conta
CREATE POLICY "Clientes podem criar ativos"
  ON assets
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Clientes podem atualizar seus próprios ativos
CREATE POLICY "Clientes podem atualizar seus ativos"
  ON assets
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = assets.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- ══ 9. CREATE RLS POLICIES - PLANS ══
-- Todos podem ler planos
CREATE POLICY "Todos podem ler planos"
  ON plans
  FOR SELECT
  USING (true);

-- ════════════════════════════════════════════════════════════
-- DADOS DE TESTE (OPCIONAL)
-- Descomente para inserir dados de teste
-- ════════════════════════════════════════════════════════════

/*
-- Primeiro, crie um usuário de teste via Supabase Auth Dashboard
-- Depois execute (substitua o user_id pelo ID real):

INSERT INTO clients (user_id, name, company, email, plan_id, status)
VALUES (
  'YOUR_USER_ID_HERE',
  'João Silva',
  'Empresa X',
  'joao@empresax.com',
  (SELECT id FROM plans WHERE tier = 'business'),
  'active'
);

-- Depois insira ativos
INSERT INTO assets (client_id, type, name, status, url, description)
SELECT
  id,
  'domain',
  'empresax.com.br',
  'active',
  'https://empresax.com.br',
  'Domínio principal'
FROM clients
WHERE user_id = 'YOUR_USER_ID_HERE'
LIMIT 1;
*/
