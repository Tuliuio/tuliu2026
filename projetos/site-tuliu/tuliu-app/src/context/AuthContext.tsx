import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Client } from '../types/supabase';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  user: any | null;
  client: Client | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, company: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user session on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        console.log('[Auth] Starting session fetch...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[Auth] Error from getSession:', error);
        }

        console.log('[Auth] Session result:', session?.user?.email || 'no session');
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('[Auth] Fetching client data for:', session.user.id);
          await fetchClientData(session.user.id);
        } else {
          console.log('[Auth] No session, skipping client fetch');
        }
      } catch (error) {
        console.error('[Auth] Unexpected error in getSession:', error);
      } finally {
        console.log('[Auth] Session fetch complete, loading = false');
        setLoading(false);
      }
    };

    getSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchClientData(session.user.id);
      } else {
        setClient(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchClientData = async (userId: string) => {
    try {
      console.log('[Auth] Fetching client for userId:', userId);
      const { data, error } = await supabase
        .from('clients')
        .select('id, user_id, name, company, email, plan_id, status, role, created_at, updated_at')
        .eq('user_id', userId);

      console.log('[Auth] Query result:', data);
      console.log('[Auth] Query error:', error);

      if (error) {
        console.error('[Auth] Error fetching client:', error.message, error.code);
        return;
      }

      if (!data || data.length === 0) {
        console.warn('[Auth] No client found for user:', userId);
        console.log('[Auth] Attempting raw query to see if table has any data...');
        // Try without filter to see if table has data
        const { data: allClients, error: allError } = await supabase
          .from('clients')
          .select('id, user_id, name, company')
          .limit(10);
        console.log('[Auth] All clients in table:', allClients);
        console.log('[Auth] All clients error:', allError);
        return;
      }

      const clientData = data[0];
      console.log('[Auth] Client data found:', clientData);

      // Fetch the plan separately
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('id', clientData.plan_id);

      if (planError) {
        console.error('[Auth] Error fetching plan:', planError.message);
        setClient(clientData as Client);
        return;
      }

      console.log('[Auth] Plan fetched:', planData?.[0]);
      setClient({ ...clientData, plan: planData?.[0] } as Client);
      console.log('[Auth] Client state updated');
    } catch (error) {
      console.error('[Auth] Unexpected error in fetchClientData:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    console.log('[Auth] Login successful');
  };

  const signup = async (email: string, password: string, name: string, company: string) => {
    try {
      console.log('[Auth] Starting signup for:', email);
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company,
          },
        },
      });

      if (signupError) throw signupError;
      if (!authData.user) throw new Error('User creation failed');
      console.log('[Auth] Auth user created:', authData.user.id);

      // Wait a moment for the trigger to create the client record
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('[Auth] Signup error:', error instanceof Error ? error.message : error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('[Auth] Starting logout');

      // Clear local state first
      setSession(null);
      setUser(null);
      setClient(null);

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[Auth] Logout error:', error);
        // Even if error, we already cleared state above
      }
      console.log('[Auth] Logged out successfully');
    } catch (error) {
      console.error('[Auth] Unexpected error in logout:', error);
      // Still clear state even on error
      setSession(null);
      setUser(null);
      setClient(null);
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, user, client, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
