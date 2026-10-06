// Link para a página de diagnóstico, guardando de onde o visitante veio e o plano de interesse.
export const diagHref = (origem: string, plano?: string | null) =>
  `/diagnostico?origem=${encodeURIComponent(origem)}${plano ? `&plano=${encodeURIComponent(plano)}` : ''}`;
