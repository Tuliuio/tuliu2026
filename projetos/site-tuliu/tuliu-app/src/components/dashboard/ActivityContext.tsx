import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Campaign, ClientUpdate } from '../../types/supabase';

interface ActivityState {
  updates: ClientUpdate[];
  campaigns: Campaign[];
  loading: boolean;
  unreadCount: number;
  markRead: (ids: string[]) => Promise<void>;
}

const ActivityContext = createContext<ActivityState>({
  updates: [],
  campaigns: [],
  loading: true,
  unreadCount: 0,
  markRead: async () => {},
});

export const useActivity = () => useContext(ActivityContext);

/** Atualizações e campanhas do cliente logado, com atualização em tempo real */
export function ActivityProvider({ children }: { children: ReactNode }) {
  const { client } = useAuth();
  const [updates, setUpdates] = useState<ClientUpdate[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!client) return;
    const [u, c] = await Promise.all([
      supabase.from('client_updates').select('*').eq('client_id', client.id).order('created_at', { ascending: false }).limit(100),
      supabase.from('campaigns').select('*').eq('client_id', client.id).order('updated_at', { ascending: false }),
    ]);
    if (u.error) console.error('[Atividade] Erro ao carregar atualizações:', u.error.message);
    if (c.error) console.error('[Atividade] Erro ao carregar campanhas:', c.error.message);
    setUpdates((u.data as ClientUpdate[]) ?? []);
    setCampaigns((c.data as Campaign[]) ?? []);
    setLoading(false);
  }, [client]);

  useEffect(() => {
    if (!client) return;
    load();
    // Novidade postada pela Tuliu aparece na hora, sem recarregar
    const channel = supabase
      .channel(`atividade-${client.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_updates', filter: `client_id=eq.${client.id}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns', filter: `client_id=eq.${client.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [client, load]);

  const markRead = useCallback(async (ids: string[]) => {
    const pending = ids.filter((id) => updates.find((u) => u.id === id && !u.read_at));
    if (pending.length === 0) return;
    const now = new Date().toISOString();
    setUpdates((prev) => prev.map((u) => (pending.includes(u.id) ? { ...u, read_at: now } : u)));
    const { error } = await supabase.rpc('mark_updates_read', { update_ids: pending });
    if (error) console.error('[Atividade] Erro ao marcar como lido:', error.message);
  }, [updates]);

  const value = useMemo(
    () => ({ updates, campaigns, loading, unreadCount: updates.filter((u) => !u.read_at).length, markRead }),
    [updates, campaigns, loading, markRead],
  );

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}
