import logoDairyTech from '../assets/clientes/dairy-tech.svg';
import logoProcardiaco from '../assets/clientes/procardiaco.webp';
import logoVitalBrasil from '../assets/clientes/vital-brasil.svg';
import logoPoliforte from '../assets/clientes/poliforte.png';

export interface Metric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  sector: string;
  location: string;
  icon: string;
  logo: string;
  /** Ajuste de tamanho para equilibrar logos com proporções diferentes (1 = padrão) */
  logoScale?: number;
  /** Resultado em uma frase, usado como título do case */
  headline: string;
  challenge: string;
  solution: string;
  /** O que a Tuliu entrega para esse cliente */
  services: string[];
  /** O primeiro é o número de destaque */
  metrics: Metric[];
  /** De onde vêm os números */
  source: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export const cases: CaseStudy[] = [
  {
    id: 'scienco-dairy-tech',
    client: 'Scienco Biotech · Dairy Tech',
    sector: 'Biotecnologia e agro',
    location: 'Lages/SC',
    icon: 'fas fa-flask',
    logo: logoDairyTech,
    logoScale: 1.45,
    headline: 'Mais conversas de venda no WhatsApp, pagando menos por cada uma.',
    challenge:
      'A Scienco Biotech desenvolve testes rápidos para o agro, como o MilkTest®, que identifica leite A2 na própria fazenda em 20 minutos. O público está no campo, muitas vezes no 4G da zona rural, e a página antiga levava mais de 7 segundos para abrir. Boa parte do clique pago se perdia antes de a página aparecer, e eram vários produtos e públicos para cuidar ao mesmo tempo: produtor, laticínio e cooperativa.',
    solution:
      'A Tuliu assumiu o tráfego pago no Meta, com criativos estáticos e em vídeo renovados com frequência, e reconstruiu a landing page do MilkTest® do zero: leve, com carrinho e fechamento do pedido no WhatsApp, e cada conversa ligada à campanha que a gerou. A infraestrutura vem junto, com hospedagem, domínio e SSL cuidados por nós. E, acima de tudo, a Scienco tem um atendimento individual: um profissional experiente acompanha a conta de perto e lidera as decisões de marketing junto com a empresa.',
    services: ['Tráfego pago no Meta', 'Landing page nova', 'Criativos e vídeo', 'Hospedagem, domínio e SSL', 'Atendimento individual'],
    metrics: [
      { value: '-24%', label: 'no custo de cada conversa de venda no WhatsApp, de R$15,00 para R$11,45' },
      { value: '2,3x', label: 'mais cliques por anúncio exibido, de 0,93% para 2,15%' },
      { value: '+1.400', label: 'conversas de venda iniciadas no WhatsApp' },
      { value: '154 → 10', label: 'requisições para abrir a página, da antiga para a nova' },
    ],
    source: 'Meta Ads, de julho a outubro de 2026, comparado ao primeiro semestre na mesma campanha.',
  },
  {
    id: 'procardiaco',
    client: 'Procardíaco',
    sector: 'Saúde · Cardiologia',
    location: 'Pelotas/RS',
    icon: 'fas fa-heart-pulse',
    logo: logoProcardiaco,
    logoScale: 1.5,
    headline: 'Pacientes buscando o exame certo, chegando a menos de R$0,60 por clique.',
    challenge:
      'A clínica de diagnóstico cardiovascular rodava campanhas genéricas, que atraíam curiosos em vez de pacientes. O site antigo também pesava contra: o Google avaliava a página como abaixo da média em 11 de 12 palavras-chave, o que encarecia cada clique e reduzia as exibições.',
    solution:
      'Reestruturamos o Google Ads por exame (ecocardiograma, eletrocardiograma, Holter, MAPA e eco-doppler) e fazemos a limpeza contínua dos termos de busca. Só numa semana, 36 buscas sem intenção de agendar foram bloqueadas. Em paralelo, a Tuliu entregou um site novo, com uma página para cada exame e pré-agendamento que abre o WhatsApp com a mensagem pronta. Cada lead fica registrado com a campanha de origem, e a clínica recebe um relatório todo mês.',
    services: ['Google Ads', 'Site novo', 'Agendamento pelo WhatsApp', 'Rastreamento de leads', 'Relatório mensal'],
    metrics: [
      { value: '+9.200', label: 'cliques de pessoas buscando exames cardíacos no Google' },
      { value: 'R$0,59', label: 'de custo médio por clique' },
      { value: '5,7%', label: 'de quem vê o anúncio clica nele' },
      { value: '160 mil', label: 'exibições nas buscas da região' },
    ],
    source: 'Google Ads, de janeiro a outubro de 2026.',
  },
  {
    id: 'vital-brasil',
    client: 'Laboratório Vital Brasil',
    sector: 'Saúde · Análises clínicas',
    location: 'Pelotas/RS',
    icon: 'fas fa-vial',
    logo: logoVitalBrasil,
    headline: 'Um laboratório com conteúdo, vídeo e anúncios no ritmo de uma marca grande.',
    challenge:
      'O Vital Brasil oferece rotinas de saúde preventiva, como pacotes de exames para mulher, homem, crianças e longevidade. A equipe é enxuta e o conteúdo digital ficava nas mãos de uma pessoa só. Faltava constância nas redes, vídeo e um jeito simples de vender as rotinas pela internet.',
    solution:
      'A Tuliu cuida da produção de carrosséis, dos roteiros e da edição de vídeo, incluindo vídeos com o próprio dono do laboratório falando direto para a câmera e a cobertura de congressos. As campanhas no Meta Ads acompanham o calendário de saúde, como Outubro Rosa e Novembro Azul. E a loja online leva o paciente da escolha da rotina até o pagamento e o agendamento.',
    services: ['Conteúdo para Instagram', 'Roteiro e edição de vídeo', 'Tráfego pago no Meta', 'Loja online'],
    metrics: [
      { value: '372 mil', label: 'exibições dos anúncios no Meta' },
      { value: '66 mil', label: 'pessoas alcançadas na região' },
      { value: '+6.300', label: 'cliques para o site e para o WhatsApp' },
    ],
    source: 'Meta Ads, de janeiro a outubro de 2026.',
    testimonial: {
      quote:
        'A Tuliu nos mostrou que é possível ter um marketing de alto nível sem montar um time grande. Os agentes trabalham enquanto a gente foca no que sabe fazer: cuidar da saúde das pessoas.',
      author: 'Marco Salleh',
      role: 'Sócio fundador, Laboratório Vital Brasil',
    },
  },
  {
    id: 'poliforte',
    client: 'Poliforte',
    sector: 'Construção industrial',
    location: 'Cocal do Sul/SC',
    icon: 'fas fa-industry',
    logo: logoPoliforte,
    headline: 'Cada pedido de orçamento com origem conhecida, do anúncio no Google ao WhatsApp.',
    challenge:
      'Com mais de 800 obras e 300 clientes pelo Brasil, a Poliforte tinha a reputação, mas não sabia de onde vinha cada pedido de orçamento. O site em WordPress era pesado, o rastreamento não era confiável e, sem dados, não havia como investir em anúncios com segurança.',
    solution:
      'A Tuliu começou pela base. O site saiu do WordPress e virou um site leve, numa hospedagem confiável, com mais de um domínio apontando para ele e uma página de captação de orçamento. Montamos um rastreamento avançado: cada clique no WhatsApp gera um evento, classificado pela origem (botão flutuante, topo, chamadas das páginas, links e formulário), que chega ao Google Analytics e ao Google Ads. Também preparamos o site para ser lido e citado por IAs como ChatGPT e Perplexity. Com isso no lugar, entrou a campanha: VT em motion design, banners de display e remarketing no Google, e posts para o Instagram.',
    services: ['Rastreamento avançado', 'Google Ads', 'Site e hospedagem', 'Múltiplos domínios', 'SEO para IA', 'Motion design'],
    metrics: [
      { value: '5', label: 'origens de contato no WhatsApp medidas separadamente' },
      { value: '-48%', label: 'no peso do site ao sair do WordPress, de 140 MB para 73 MB' },
      { value: '26', label: 'banners de display em 13 tamanhos, mais o VT em 3 cortes' },
    ],
    source: 'Estrutura, rastreamento e peças entregues pela Tuliu em 2026.',
  },
];
