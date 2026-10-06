// Gera a chave de acesso de uma proposta para src/data/proposals.ts.
// Uso: node scripts/proposal-key.mjs "Nome da marca" "Primeiro nome" 1234
import { createHash } from 'node:crypto';

const norm = (v) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

const [brand, name, digits] = process.argv.slice(2);
if (!brand || !name || !/^\d{4}$/.test(digits ?? '')) {
  console.error('Uso: node scripts/proposal-key.mjs "Nome da marca" "Primeiro nome" 1234');
  process.exit(1);
}
const firstName = norm(name.trim().split(/\s+/)[0]);
console.log(createHash('sha256').update(`${norm(brand)}|${firstName}|${digits}`).digest('hex'));
