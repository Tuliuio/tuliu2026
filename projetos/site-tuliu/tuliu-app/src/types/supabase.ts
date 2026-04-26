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
  status: 'active' | 'canceled' | 'suspended';
  role: 'client' | 'admin';
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

/* Auth */

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}
/* Auth */

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}
