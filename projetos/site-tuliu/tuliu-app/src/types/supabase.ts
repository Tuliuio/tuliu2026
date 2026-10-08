/* Tables */

export interface Plan {
  id: string;
  name: 'Starter' | 'Business' | 'Enterprise';
  tier: 'starter' | 'business' | 'enterprise';
  billing: 'monthly' | 'annual';
  price: number;
  limits: {
    domains: number | 'unlimited';
    sites: number | 'unlimited';
    emails: number | 'unlimited';
    automations: number | 'unlimited';
    agents: number | 'unlimited';
    integrations: number | 'unlimited';
  };
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  company: string;
  email: string;
  plan_id: string;
  plan?: Plan;
  custom_price?: number | null;
  status: 'active' | 'canceled' | 'suspended';
  role: 'client' | 'admin';
  asaas_customer_id?: string | null;
  asaas_subscription_id?: string | null;
  onboarding_completed: boolean;
  onboarding_data?: {
    segment?: string;
    objective?: string;
    hasDomain?: string;
    domain?: string;
    assets?: string[];
  } | null;
  created_at: string;
  updated_at: string;
}

export type AssetType = 'domain' | 'subdomain' | 'website' | 'webapp' | 'email' | 'automation' | 'agent' | 'integration';
export type AssetStatus = 'active' | 'inactive' | 'pending';

export interface Asset {
  id: string;
  client_id: string;
  type: AssetType;
  name: string;
  status: AssetStatus;
  url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

/* Campanhas e atualizações: o que a Tuliu está fazendo por cada cliente */

export type CampaignChannel = 'meta' | 'google' | 'site' | 'conteudo' | 'video' | 'seo' | 'email' | 'outro';
export type CampaignStage = 'planejamento' | 'criacao' | 'aprovacao' | 'no_ar' | 'otimizando' | 'concluida';

export interface Campaign {
  id: string;
  client_id: string;
  name: string;
  channel: CampaignChannel;
  stage: CampaignStage;
  summary?: string | null;
  link_url?: string | null;
  /** Números da campanha. Hoje preenchidos pela Tuliu, depois sincronizados do Meta e do Google */
  metrics?: Record<string, string | number> | null;
  started_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type UpdateKind = 'entrega' | 'campanha' | 'relatorio' | 'aprovacao' | 'alerta' | 'novidade';
export type UpdateStatus = 'em_andamento' | 'em_revisao' | 'aguardando_voce' | 'no_ar' | 'concluido';

export interface ClientUpdate {
  id: string;
  client_id: string;
  campaign_id?: string | null;
  kind: UpdateKind;
  status: UpdateStatus;
  title: string;
  body?: string | null;
  link_url?: string | null;
  link_label?: string | null;
  created_by: string;
  read_at?: string | null;
  created_at: string;
}

/* Auth */

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}
