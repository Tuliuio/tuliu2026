-- Create client_settings table for user preferences
CREATE TABLE IF NOT EXISTS client_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id)
);

-- Add RLS policies to client_settings
ALTER TABLE client_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
  ON client_settings FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM clients WHERE id = client_id)
  );

CREATE POLICY "Users can update their own settings"
  ON client_settings FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM clients WHERE id = client_id)
  );

CREATE POLICY "Users can insert their own settings"
  ON client_settings FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM clients WHERE id = client_id)
  );
