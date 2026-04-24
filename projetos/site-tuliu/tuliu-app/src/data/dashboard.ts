import type { Client } from '../types/dashboard';

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'João Silva',
    company: 'Empresa X',
    email: 'joao@empresax.com',
    plan: {
      tier: 'business',
      name: 'Business',
      billing: 'monthly',
      price: 497,
      limits: {
        domains: 3,
        sites: 5,
        emails: 'unlimited',
        automations: 5,
        agents: 1,
      },
    },
    assets: [
      // Domínios
      {
        id: 'asset-1',
        type: 'domain',
        name: 'empresax.com.br',
        status: 'active',
        url: 'https://empresax.com.br',
        description: 'Domínio principal',
      },
      {
        id: 'asset-2',
        type: 'domain',
        name: 'empresax-digital.com.br',
        status: 'active',
        url: 'https://empresax-digital.com.br',
      },
      // Websites
      {
        id: 'asset-3',
        type: 'website',
        name: 'Site Principal',
        status: 'active',
        url: 'https://empresax.com.br',
      },
      {
        id: 'asset-4',
        type: 'website',
        name: 'Blog',
        status: 'active',
        url: 'https://blog.empresax.com.br',
      },
      {
        id: 'asset-5',
        type: 'website',
        name: 'Landing Page — Nova Campanha',
        status: 'pending',
      },
      // E-mails
      {
        id: 'asset-6',
        type: 'email',
        name: 'contato@empresax.com.br',
        status: 'active',
      },
      {
        id: 'asset-7',
        type: 'email',
        name: 'vendas@empresax.com.br',
        status: 'active',
      },
      {
        id: 'asset-8',
        type: 'email',
        name: 'suporte@empresax.com.br',
        status: 'inactive',
      },
      // Automações
      {
        id: 'asset-9',
        type: 'automation',
        name: 'Lead Nurturing',
        status: 'active',
        description: 'Sequência de e-mails automáticos',
      },
      {
        id: 'asset-10',
        type: 'automation',
        name: 'Notificação de Pedidos',
        status: 'active',
      },
      // Agentes IA
      {
        id: 'asset-11',
        type: 'agent',
        name: 'Agente de Atendimento',
        status: 'active',
        description: 'Responde dúvidas dos clientes',
      },
      // Subdomínios
      {
        id: 'asset-12',
        type: 'subdomain',
        name: 'app.empresax.com.br',
        status: 'active',
        url: 'https://app.empresax.com.br',
      },
    ],
  },
  {
    id: 'client-2',
    name: 'Maria Santos',
    company: 'Startup Y',
    email: 'maria@startupy.com',
    plan: {
      tier: 'starter',
      name: 'Starter',
      billing: 'monthly',
      price: 97,
      limits: {
        domains: 1,
        sites: 1,
        emails: 10,
        automations: 0,
        agents: 0,
      },
    },
    assets: [
      {
        id: 'asset-101',
        type: 'domain',
        name: 'startupy.com',
        status: 'active',
        url: 'https://startupy.com',
      },
      {
        id: 'asset-102',
        type: 'website',
        name: 'Site Principal',
        status: 'active',
        url: 'https://startupy.com',
      },
      {
        id: 'asset-103',
        type: 'email',
        name: 'contato@startupy.com',
        status: 'active',
      },
      {
        id: 'asset-104',
        type: 'email',
        name: 'info@startupy.com',
        status: 'inactive',
      },
    ],
  },
];

export function getClientById(id: string): Client | undefined {
  return mockClients.find((client) => client.id === id);
}

export const currentClientId = 'client-1';
export const currentClient = getClientById(currentClientId)!;
