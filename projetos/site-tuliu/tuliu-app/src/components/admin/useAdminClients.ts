import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export interface AdminClientLite {
  id: string;
  name: string;
  company: string;
  phone: string | null;
}

/** Lista de clientes (sem admins) para os seletores do admin */
export function useAdminClients() {
  const [clients, setClients] = useState<AdminClientLite[]>([]);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, company, phone, role')
      .neq('role', 'admin')
      .order('company');
    if (error) console.error('[Admin] Erro ao carregar clientes:', error.message);
    setClients(((data ?? []) as (AdminClientLite & { role: string })[]).map(({ id, name, company, phone }) => ({ id, name, company: company.trim(), phone })));
  }, []);

  useEffect(() => { load(); }, [load]);

  const savePhone = useCallback(async (clientId: string, phone: string) => {
    const { error } = await supabase.from('clients').update({ phone }).eq('id', clientId);
    if (!error) setClients((prev) => prev.map((c) => (c.id === clientId ? { ...c, phone } : c)));
    return !error;
  }, []);

  return { clients, savePhone, reload: load };
}

export function firstName(name?: string | null): string | undefined {
  const first = (name ?? '').trim().split(/\s+/)[0];
  return first && !first.includes('@') ? first : undefined;
}
