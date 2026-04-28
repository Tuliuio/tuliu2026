-- Kanban Setup SQL
-- Execute estas queries no Supabase SQL Editor
-- https://app.supabase.com/project/[seu-projeto]/sql/new

-- 1. Criar tabela kanban_columns
CREATE TABLE kanban_columns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Criar tabela kanban_cards
CREATE TABLE kanban_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  column_id UUID REFERENCES kanban_columns(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category_tag TEXT,
  due_date DATE,
  assignee TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Seed das 8 colunas padrão
INSERT INTO kanban_columns (name, order_index) VALUES
  ('Referências', 1),
  ('Backlog', 2),
  ('Tasks', 3),
  ('Copy', 4),
  ('Design', 5),
  ('Develop', 6),
  ('Deploy', 7),
  ('Done', 8);

-- 4. Habilitar RLS
ALTER TABLE kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;

-- 5. Policy: colunas são leitura pública para autenticados
CREATE POLICY "Authenticated can read columns"
  ON kanban_columns FOR SELECT
  TO authenticated
  USING (true);

-- 6. Policy: cliente vê só seus próprios cards
CREATE POLICY "Client reads own cards"
  ON kanban_cards FOR SELECT
  TO authenticated
  USING (client_id = (SELECT id FROM clients WHERE user_id = auth.uid()));

-- 7. Policy: cliente pode atualizar seus próprios cards (mover entre colunas)
CREATE POLICY "Client update own cards"
  ON kanban_cards FOR UPDATE
  TO authenticated
  USING (client_id = (SELECT id FROM clients WHERE user_id = auth.uid()))
  WITH CHECK (client_id = (SELECT id FROM clients WHERE user_id = auth.uid()));

-- 8. Policy: admin tem acesso completo
CREATE POLICY "Admin full access"
  ON kanban_cards FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM clients WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM clients WHERE user_id = auth.uid() AND role = 'admin'));

-- Verificação: execute estas queries para confirmar que está tudo ok
-- SELECT * FROM kanban_columns ORDER BY order_index;
-- SELECT COUNT(*) FROM kanban_cards;
