export type AssetType = 'domain' | 'subdomain' | 'website' | 'webapp' | 'email' | 'automation' | 'agent';
export type AssetStatus = 'active' | 'inactive' | 'pending';

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  status: AssetStatus;
  url?: string;
  description?: string;
}

export type PlanTier = 'starter' | 'business' | 'enterprise';

export interface PlanLimits {
  domains: number | 'unlimited';
  sites: number | 'unlimited';
  emails: number | 'unlimited';
  automations: number | 'unlimited';
  agents: number | 'unlimited';
}

export interface ClientPlan {
  tier: PlanTier;
  name: 'Starter' | 'Business' | 'Enterprise';
  billing: 'monthly' | 'annual';
  price: number;
  limits: PlanLimits;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  plan: ClientPlan;
  assets: Asset[];
}
