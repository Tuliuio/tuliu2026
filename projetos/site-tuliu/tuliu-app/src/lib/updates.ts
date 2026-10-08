import type { CampaignChannel, CampaignStage, ClientUpdate, UpdateKind, UpdateStatus } from '../types/supabase';

export const KIND_META: Record<UpdateKind, { label: string; icon: string }> = {
  entrega: { label: 'Entrega', icon: 'fas fa-box-open' },
  campanha: { label: 'Campanha', icon: 'fas fa-bullhorn' },
  relatorio: { label: 'Relatório', icon: 'fas fa-chart-simple' },
  aprovacao: { label: 'Aprovação', icon: 'fas fa-circle-check' },
  alerta: { label: 'Atenção', icon: 'fas fa-triangle-exclamation' },
  novidade: { label: 'Novidade', icon: 'fas fa-wand-magic-sparkles' },
};

export const STATUS_META: Record<UpdateStatus, { label: string; tone: 'violet' | 'amber' | 'green' | 'gray' }> = {
  em_andamento: { label: 'Em andamento', tone: 'violet' },
  em_revisao: { label: 'Em revisão', tone: 'violet' },
  aguardando_voce: { label: 'Aguardando você', tone: 'amber' },
  no_ar: { label: 'No ar', tone: 'green' },
  concluido: { label: 'Concluído', tone: 'gray' },
};

export const CHANNEL_META: Record<CampaignChannel, { label: string; icon: string }> = {
  meta: { label: 'Meta Ads', icon: 'fab fa-meta' },
  google: { label: 'Google Ads', icon: 'fab fa-google' },
  site: { label: 'Site', icon: 'fas fa-laptop-code' },
  conteudo: { label: 'Conteúdo', icon: 'fas fa-images' },
  video: { label: 'Vídeo', icon: 'fas fa-film' },
  seo: { label: 'SEO', icon: 'fas fa-magnifying-glass-chart' },
  email: { label: 'E-mail', icon: 'fas fa-envelope' },
  outro: { label: 'Outro', icon: 'fas fa-layer-group' },
};

/** Etapas na ordem em que a campanha avança. "concluida" fica fora da régua */
export const STAGES: { id: CampaignStage; label: string }[] = [
  { id: 'planejamento', label: 'Planejamento' },
  { id: 'criacao', label: 'Criação' },
  { id: 'aprovacao', label: 'Aprovação' },
  { id: 'no_ar', label: 'No ar' },
  { id: 'otimizando', label: 'Otimizando' },
];

export const STAGE_LABEL: Record<CampaignStage, string> = {
  ...Object.fromEntries(STAGES.map((s) => [s.id, s.label])),
  concluida: 'Concluída',
} as Record<CampaignStage, string>;

export function stageIndex(stage: CampaignStage): number {
  return stage === 'concluida' ? STAGES.length : STAGES.findIndex((s) => s.id === stage);
}

/** "agora", "há 3 h", "ontem", "12 de out." */
export function relativeDate(iso: string): string {
  const date = new Date(iso);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'agora';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  if (diff < 172800) return 'ontem';
  if (diff < 604800) return `há ${Math.floor(diff / 86400)} dias`;
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

/** Link que leva o cliente direto para o card no painel */
export function updateDeepLink(updateId: string): string {
  return `https://tuliu.io/dashboard?atualizacao=${updateId}`;
}

/** Mensagem pronta para enviar ao cliente no WhatsApp */
export function whatsappMessage(update: Pick<ClientUpdate, 'id' | 'title'>, firstName?: string): string {
  const greeting = firstName ? `Oi, ${firstName}!` : 'Oi!';
  return `${greeting} Tem novidade no seu painel da Tuliu: *${update.title}*.\n\nDá uma olhada aqui: ${updateDeepLink(update.id)}`;
}

/** wa.me com a mensagem pronta. Sem telefone, abre o WhatsApp para escolher o contato */
export function whatsappLink(message: string, phone?: string | null): string {
  const digits = (phone ?? '').replace(/\D/g, '');
  const number = digits && !digits.startsWith('55') && digits.length <= 11 ? `55${digits}` : digits;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
