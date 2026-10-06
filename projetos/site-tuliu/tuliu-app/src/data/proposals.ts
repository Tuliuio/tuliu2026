// Propostas acessíveis pela página /proposta.
// Guardamos só o hash de "marca|primeiro nome|4 últimos dígitos do telefone", nunca os dados em si.
// Para adicionar uma proposta: node scripts/proposal-key.mjs "Marca" "Nome" 1234
// Atenção: é um portão de acesso profissional, não autenticação. A URL da proposta continua pública (noindex).
export interface ProposalEntry {
  key: string;
  href: string;
}

export const proposals: ProposalEntry[] = [
  // Fiorire · Suelen Lodetti
  { key: '5abf3be230ba6a10fe60b2dd6ef952ebd9091778aedcfc27319a86ed23ad106d', href: '/propostas/fiorire/' },
];

const norm = (v: string) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

export async function findProposal(brand: string, name: string, digits: string): Promise<ProposalEntry | null> {
  const firstName = norm(name.trim().split(/\s+/)[0] ?? '');
  const raw = `${norm(brand)}|${firstName}|${digits}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const key = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return proposals.find((p) => p.key === key) ?? null;
}
