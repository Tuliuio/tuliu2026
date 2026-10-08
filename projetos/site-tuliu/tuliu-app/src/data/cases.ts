import logoDairyTech from '../assets/clientes/dairy-tech.svg';
import logoProcardiaco from '../assets/clientes/procardiaco.webp';
import logoVitalBrasil from '../assets/clientes/vital-brasil.svg';
import logoPoliforte from '../assets/clientes/poliforte.png';
import logoSparz from '../assets/clientes/sparz.png';
import logoAdapto from '../assets/clientes/adapto.svg';
import logoCruzDeMalta from '../assets/clientes/cruz-de-malta.png';

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
  {
    id: 'sparz',
    client: 'Sparz',
    sector: 'Tecnologia · Redes 4G/5G',
    location: 'Brasil',
    icon: 'fas fa-tower-cell',
    logo: logoSparz,
    headline: 'Uma empresa de tecnologia com site à altura do produto, em três idiomas.',
    challenge:
      'A Sparz desenvolve o core de redes 4G e 5G privativas, uma tecnologia brasileira para provedores e empresas de setores como indústria, mineração, agro e energia. Produto complexo, venda consultiva e clientes fora do Brasil: o site precisava explicar bem cada solução, falar com cada setor e gerar contatos qualificados em mais de um idioma.',
    solution:
      'A Tuliu construiu o site do zero, com uma página para cada solução e para cada setor atendido, em português, inglês e espanhol. Cada contato do formulário chega ao time comercial e segue direto para o WhatsApp. Montamos também dois ambientes, um de homologação e outro de produção, para que toda mudança seja revisada e aprovada antes de ir ao ar.',
    services: ['Site sob medida', 'Três idiomas', 'Páginas por solução e setor', 'Captação de leads', 'Homologação e produção'],
    metrics: [
      { value: '3', label: 'idiomas no mesmo site: português, inglês e espanhol' },
      { value: '12', label: 'páginas dedicadas: 4 soluções e 8 setores atendidos' },
      { value: '2', label: 'ambientes, para aprovar cada mudança antes de publicar' },
    ],
    source: 'Projeto entregue pela Tuliu em 2026.',
  },
  {
    id: 'adapto',
    client: 'Adapto',
    sector: 'Indústria · Impressão 3D',
    location: 'São José/SC',
    icon: 'fas fa-cube',
    logo: logoAdapto,
    headline: 'Impressão 3D para empresas, explicada em um site e em vídeo.',
    challenge:
      'A Adapto faz manufatura aditiva, a impressão 3D aplicada a peças e soluções para empresas. Para quem não conhece a tecnologia, é difícil entender o que dá para fazer e por onde começar. A marca precisava de uma presença que mostrasse o processo e transformasse curiosidade em pedido de orçamento.',
    solution:
      'A Tuliu criou o site da Adapto com o processo explicado em três passos, para quem é a solução e um formulário de contato direto. Para as redes, produzimos um Reel em motion design com os cases da empresa e trilha original, feito para mostrar em segundos o que a impressão 3D resolve no dia a dia de uma empresa.',
    services: ['Site sob medida', 'Motion design', 'Edição de vídeo', 'Trilha original', 'Hospedagem e domínio'],
    metrics: [
      { value: '3 passos', label: 'para o cliente entender o processo, do pedido à entrega' },
      { value: '1 Reel', label: 'em motion design com os cases da Adapto e trilha própria' },
      { value: 'Site + vídeo', label: 'na mesma linguagem visual, do site às redes' },
    ],
    source: 'Projeto entregue pela Tuliu em 2026.',
  },
  {
    id: 'cruz-de-malta',
    client: 'Restaurante Cruz de Malta',
    sector: 'Gastronomia',
    location: 'Pelotas/RS',
    icon: 'fas fa-utensils',
    logo: logoCruzDeMalta,
    logoScale: 1.9,
    headline: 'Um restaurante de 1967 com o próprio canal de pedidos, sem depender de plataforma.',
    challenge:
      'Servindo Pelotas à mesa desde 1967, o Cruz de Malta passou por uma reformulação completa da marca. Os pedidos de entrega dependiam de uma plataforma de terceiros, e a nova identidade precisava chegar também ao digital: ao Instagram, ao cardápio e ao jeito de pedir.',
    solution:
      'Junto com a Mira Brand Studio, que criou a nova marca, a Tuliu desenvolveu o canal digital do restaurante. Um link na bio com pedido, reserva e mapa, e um app de pedidos próprio com o cardápio completo, fotos, carrinho e fechamento direto no WhatsApp da casa, já com a mensagem formatada. O cardápio é conferido automaticamente a cada publicação, e a hospedagem é cuidada por nós.',
    services: ['App de pedidos', 'Link na bio', 'Cardápio digital', 'Pedido pelo WhatsApp', 'Hospedagem'],
    metrics: [
      { value: '176', label: 'pratos no cardápio digital, organizados em 18 categorias' },
      { value: '119', label: 'fotos de pratos no app de pedidos' },
      { value: '0', label: 'intermediários entre o cliente e a cozinha: o pedido cai no WhatsApp da casa' },
    ],
    source: 'Projeto entregue pela Tuliu em 2026, com a marca da Mira Brand Studio.',
  },
];
