import type { Block, Cell, Landing } from './landingTypes';

/* =============================================================
   Blocos compartilhados
============================================================= */

const SOURCES = ['Google Search Console', 'Google Analytics', 'Google Ads', 'Meta Ads', 'Instagram', 'PageSpeed', 'Palavras-chave', 'Concorrentes', 'Conversões e leads'];

const QUESTIONS = [
  { title: 'Conversão', q: 'Quais páginas recebem visita e não geram contato?' },
  { title: 'SEO', q: 'Que palavra você paga no Google e poderia ganhar de graça?' },
  { title: 'Conteúdo', q: 'Que post engaja mas não leva ninguém pro site?' },
  { title: 'Tráfego pago', q: 'Qual anúncio gasta mais e vende menos?' },
  { title: 'Concorrência', q: 'Onde o concorrente aparece e você não?' },
  { title: 'Funil', q: 'Em que etapa o cliente desiste em silêncio?' },
  { title: 'Busca por IA', q: 'O ChatGPT recomenda você ou outra empresa?' },
  { title: 'Orçamento', q: 'Que público converte e quase não recebe verba?' },
];

const IMPROVEMENTS = [
  { title: 'Textos do site', desc: 'Títulos, descrições e chamadas reescritos' },
  { title: 'Landing pages', desc: 'Páginas novas para cada serviço e público' },
  { title: 'Anúncios', desc: 'Criativos e textos renovados no Google e Meta' },
  { title: 'Conteúdo', desc: 'Carrosséis, vídeos e artigos produzidos' },
  { title: 'Segmentação', desc: 'Públicos e lances ajustados' },
  { title: 'Velocidade', desc: 'Site mais rápido no celular' },
  { title: 'SEO técnico', desc: 'Schema, links internos e sitemap' },
  { title: 'Testes A/B', desc: 'Chamadas e botões testados ao vivo' },
  { title: 'Atendimento', desc: 'Agente de IA respondendo no WhatsApp' },
];

export const machine = (title: string, subtitle: string): Block => ({
  type: 'machine',
  title,
  subtitle,
  sources: SOURCES,
  questions: QUESTIONS,
  improvements: IMPROVEMENTS,
});

const volume = (title = 'Quanto marketing acontece de verdade?', agency = 'R$2.500+ por mês', tuliuPrice = 'A partir de R$97 por mês'): Block => ({
  type: 'volume',
  title,
  subtitle: 'Fazer sozinho, contratar uma agência ou deixar a Tuliu operar. A diferença é quanto acontece de fato a cada mês, e quanto isso custa.',
  options: [
    { label: 'Você mesmo', level: 1, price: 'De graça, mas custa suas noites', desc: 'Você tem as ferramentas, mas não tem tempo nem dados para fazer direito. A maior parte fica na lista de tarefas.' },
    { label: 'Uma agência', level: 3, price: agency, desc: 'Gente boa, mas lenta, cara e dividida entre vários fornecedores. Cada mudança vira orçamento.' },
    { label: 'Tuliu', level: 5, price: tuliuPrice, desc: 'O trabalho de um time de marketing inteiro, executado toda semana, com um único ponto de contato. A IA faz, um especialista aprova.', recommended: true },
  ],
});

const marketCosts: Block = {
  type: 'costs',
  title: 'Quanto custa terceirizar o marketing?',
  subtitle: 'Depende do caminho. Estes são valores de referência do mercado brasileiro, para você comparar com um valor mensal fixo.',
  items: [
    { tag: 'ferramentas + tempo', title: 'Fazer sozinho', desc: 'Só as ferramentas (design, agendamento, SEO, IA) passam fácil de R$200 a R$600 por mês. Fora as suas horas.' },
    { tag: 'por hora ou projeto', title: 'Freelancer', desc: 'Entre R$80 e R$150 por hora. Acessível por tarefa, mas uma pessoa raramente cobre design, SEO, conteúdo e tráfego.' },
    { tag: 'salário + encargos', title: 'Analista de marketing CLT', desc: 'Salário de R$3.500 a R$6.000, e com encargos o custo real chega perto do dobro. Uma pessoa, para uma ou duas das quatro frentes.' },
    { tag: 'setup + mensalidade', title: 'Agência de marketing', desc: 'Site sob medida de R$5.000 a R$20.000, e mensalidade de R$2.500 a R$8.000 para conteúdo, SEO e tráfego.' },
  ],
};

const expertQuote = 'A IA executa o trabalho de um time inteiro, todos os dias, muito mais do que uma pessoa conseguiria. A gente define a estratégia e aprova cada mudança. Você ganha a velocidade da IA com um humano cuidando da qualidade.';

const COMPARE_LABELS: Record<string, string> = {
  'alternativa-chatgpt': 'Fazendo tudo com o ChatGPT? Veja a comparação',
  'alternativa-agencia-de-marketing': 'Comparando com uma agência? Veja a comparação',
  'alternativa-hostinger': 'Pensando em contratar só a hospedagem? Veja a comparação',
  'alternativa-lovable': 'Usando Lovable? Veja a comparação',
  'alternativa-framer': 'Desenhando no Framer? Veja a comparação',
  'alternativa-wix': 'Pensando em Wix ou Squarespace? Veja a comparação',
  'alternativa-wordpress': 'Já está no WordPress? Veja a comparação',
  'alternativa-canva': 'Fazendo tudo no Canva? Veja a comparação',
};

/* Comparativo genérico "X vs Tuliu" */
interface AltInput {
  slug: string;
  tool: string;
  navDesc: string;
  title: string;
  highlight: string;
  subtitle: string;
  needsSubtitle: string;
  needs: { title: string; tag: string; desc: string }[];
  needsSummary: string;
  toolWins: { label: string; values: Cell[] }[];
  whenBetter: string[];
  faq: { q: string; a: string }[];
}

const tuliuRows: { label: string; values: Cell[] }[] = [
  { label: 'SEO, conteúdo e tráfego pago inclusos', values: ['no', 'yes'] },
  { label: 'Hospedagem, domínio e segurança por nossa conta', values: ['partly', 'yes'] },
  { label: 'Otimizado com base nos seus dados, toda semana', values: ['no', 'yes'] },
  { label: 'Uma mudança? Uma mensagem e está no ar', values: ['no', 'yes'] },
  { label: 'Pessoas fazendo o trabalho, não prompts', values: ['no', 'yes'] },
  { label: 'Um valor mensal fixo, sem extras', values: ['partly', 'yes'] },
];

function alt(a: AltInput): Landing {
  return {
    slug: a.slug,
    group: 'comparacao',
    navLabel: `Alternativa ao ${a.tool}`,
    navDesc: a.navDesc,
    metaTitle: `Alternativa ao ${a.tool} | Tuliu faz o site e o marketing por você`,
    metaDescription: a.subtitle,
    hero: { eyebrow: `${a.tool} vs Tuliu`, title: a.title, highlight: a.highlight, subtitle: a.subtitle },
    blocks: [
      { type: 'needs', title: `O que um projeto feito no ${a.tool} ainda precisa.`, subtitle: a.needsSubtitle, items: a.needs, summary: a.needsSummary },
      {
        type: 'table',
        title: `${a.tool} vs Tuliu, linha a linha.`,
        subtitle: `Sem truque: o ${a.tool} ganha de verdade em algumas linhas. A diferença é quem faz o trabalho e para que serve o resultado.`,
        columns: [a.tool, 'Tuliu'],
        rows: [...a.toolWins, ...tuliuRows],
      },
      {
        type: 'when',
        title: `Quando o ${a.tool} é a melhor escolha.`,
        paragraphs: a.whenBetter,
        links: Object.entries(COMPARE_LABELS).filter(([s]) => s !== a.slug).slice(0, 4).map(([s, label]) => ({ label, href: `/${s}` })),
      },
      { type: 'faq', title: `Sobre o ${a.tool} e a Tuliu.`, items: a.faq },
    ],
  };
}

/* =============================================================
   Páginas
============================================================= */

export const landings: Landing[] = [
  /* ---------------- SERVIÇOS ---------------- */
  {
    slug: 'seo-feito-por-ia',
    group: 'servico',
    navLabel: 'SEO feito por IA',
    navDesc: 'Seu site subindo no Google, otimizado toda semana',
    metaTitle: 'SEO feito por IA, aprovado por especialistas | Tuliu',
    metaDescription: 'A IA analisa seus dados do Google todo dia e otimiza seu site. Especialistas aprovam cada mudança. No plano Business, a partir de R$497/mês.',
    priceFrom: 'R$497/mês',
    hero: {
      eyebrow: 'SEO com IA',
      title: 'A IA faz o seu SEO',
      highlight: 'melhor do que uma pessoa.',
      subtitle: 'SEO bom são centenas de pequenas decisões por semana: qual palavra, qual título, qual página. Ninguém dá conta na mão. A IA cruza todos os seus dados e ajusta o site continuamente, e um especialista aprova antes de ir pro ar.',
      ticker: {
        title: 'SEO rodando, toda semana',
        items: ['Título reescrito · /servicos', 'Página nova · palavra com potencial', 'Schema adicionado · 8 páginas', 'Links internos · página fraca reforçada', 'Velocidade melhorada · celular', 'Página local criada · sua cidade'],
      },
    },
    blocks: [
      {
        type: 'machine',
        title: 'SEO automatizado, guiado pelos seus dados.',
        subtitle: 'A IA junta todas as fontes e faz perguntas que você nunca conseguiria responder na mão. Depois melhora o site, com cada mudança revisada pelo nosso time de SEO.',
        sources: ['Search Console', 'Palavras-chave', 'Backlinks', 'Concorrentes', 'Analytics', 'PageSpeed', 'Seu conteúdo'],
        questions: [
          { title: 'Palavras na página 2', q: 'Quais termos estão a um ajuste da primeira página?' },
          { title: 'Títulos', q: 'Que títulos aparecem muito e recebem poucos cliques?' },
          { title: 'Conteúdo', q: 'Que página ranqueia mas não responde a dúvida?' },
          { title: 'SEO técnico', q: 'Que página cai por velocidade ou rastreio?' },
          { title: 'Concorrência', q: 'Que palavra o concorrente ganha e você não?' },
          { title: 'Links internos', q: 'Que página forte pode puxar uma fraca?' },
          { title: 'Pesquisa', q: 'Que dúvida do cliente ainda não tem página?' },
          { title: 'SEO local', q: 'Que cidade ou região você está deixando livre?' },
        ],
        improvements: [
          { title: 'Títulos e meta', desc: 'Reescritos para mais cliques' },
          { title: 'Schema', desc: 'Dados estruturados para resultados ricos' },
          { title: 'Página nova', desc: 'Escrita para uma palavra que dá pra ganhar' },
          { title: 'Links internos', desc: 'Colocados para levantar páginas fracas' },
          { title: 'Texto da página', desc: 'Expandido para cobrir a busca inteira' },
          { title: 'Velocidade', desc: 'Página mais leve, técnica arrumada' },
          { title: 'Páginas locais', desc: 'Uma por cidade que você atende' },
          { title: 'Sitemap', desc: 'Atualizado e enviado ao Google' },
        ],
      },
      { type: 'expert', title: 'Um especialista em SEO cuida da qualidade.', quote: 'A IA roda centenas de checagens por semana, muito mais do que eu faria na mão. Eu defino a estratégia e aprovo cada mudança, então nada vai pro ar sem fazer sentido.' },
      {
        type: 'volume',
        title: 'Quanto SEO acontece de verdade?',
        subtitle: 'Fazer sozinho, contratar uma agência de SEO ou deixar a IA rodar. A diferença é quantas melhorias acontecem por mês e quanto custam.',
        options: [
          { label: 'Você mesmo', level: 1, price: 'De graça, mas toma tempo', desc: 'Você pede pra uma IA escrever, mas sem dados para guiar. Chute bem escrito continua sendo chute.' },
          { label: 'Agência de SEO', level: 2, price: 'R$1.500+ por mês', desc: 'Usa dados, mas não tem braço para executar em volume. Relatório bonito, poucas mudanças no ar.' },
          { label: 'Tuliu', level: 5, price: 'A partir de R$497 por mês', desc: 'Todos os seus dados, analisados e aplicados em escala, com revisão de um especialista.', recommended: true },
        ],
      },
      { type: 'cases', title: 'Quem já está crescendo com a Tuliu.', subtitle: 'Empresas reais, com operação digital rodando todos os dias.' },
      {
        type: 'prose',
        title: 'SEO rende mais junto com o resto.',
        paragraphs: [
          'SEO sozinho não traz cliente. Ele traz visita. O que transforma visita em contato é a página certa, a chamada certa e o anúncio certo apontando pro mesmo lugar.',
          'Por isso a mesma IA também cuida do seu SEO para IA (pra você aparecer nas respostas do ChatGPT e do Perplexity), da sua conversão, do seu conteúdo e do seu tráfego pago. Uma máquina, várias frentes, um ponto de contato no WhatsApp.',
        ],
        link: { label: 'Ver como aparecer no ChatGPT', href: '/seo-ia/' },
      },
      { type: 'related', title: 'Outras frentes da máquina.', hrefs: ['gestao-de-trafego-com-ia', 'conteudo-com-ia', 'criar-site-com-ia'] },
      {
        type: 'faq',
        title: 'Sobre SEO com IA na Tuliu.',
        items: [
          { q: 'IA não vai gerar texto genérico e o Google punir?', a: 'O Google pune conteúdo inútil, não conteúdo feito com IA. A diferença está nos dados: nossa IA escreve a partir das buscas reais do seu público, do que seus concorrentes ranqueiam e do que seu negócio realmente faz. E um especialista revisa antes de publicar.' },
          { q: 'Em quanto tempo vejo resultado?', a: 'SEO é cumulativo. As primeiras melhorias técnicas e de título costumam mostrar efeito em semanas. Ganhar posições em palavras disputadas leva meses. O que muda com a Tuliu é que algo acontece toda semana, então o resultado vem mais cedo.' },
          { q: 'Preciso trocar meu site?', a: 'Não. A gente pode otimizar o site que você já tem, ou construir um novo se ele estiver segurando o seu crescimento. Você decide.' },
          { q: 'Vocês mexem no meu Google Search Console?', a: 'Com o seu acesso, sim. É de lá que vêm os dados que guiam a IA. Você continua dono de todas as contas.' },
          { q: 'Quanto custa?', a: 'O SEO semanal faz parte do plano Business, a partir de R$497 por mês, junto com site sob medida e gestão de tráfego. Sem fidelidade.' },
        ],
      },
    ],
  },
  {
    slug: 'terceirizar-marketing',
    group: 'servico',
    navLabel: 'Terceirizar o marketing',
    navDesc: 'Um time inteiro, um valor fixo, um contato',
    metaTitle: 'Terceirizar o marketing digital sem agência cara | Tuliu',
    metaDescription: 'Terceirize site, SEO, conteúdo e tráfego pago para uma só empresa. IA e especialistas por um valor mensal fixo, a partir de R$97/mês.',
    hero: {
      eyebrow: 'Terceirizar o marketing',
      title: 'Terceirize todo o seu marketing para uma só empresa,',
      highlight: 'sem pagar preço de agência.',
      subtitle: 'Fazer o marketing sozinho custa noites que você não tem. Agência entrega qualidade, mas cobra caro e anda devagar. A Tuliu faz o trabalho de um time completo de marketing, com IA e especialistas, por um valor mensal fixo.',
      ticker: {
        title: 'Máquina de marketing, ao vivo',
        items: ['Landing page no ar · /servicos', 'Carrossel publicado · Instagram', 'Anúncio otimizado · Google Ads', 'Vídeo editado · Reels', 'Títulos reescritos · 12 páginas', 'Agente de IA ajustado · WhatsApp'],
      },
    },
    blocks: [
      volume(),
      {
        type: 'reasons',
        title: 'Terceirizar ou continuar fazendo sozinho?',
        subtitle: 'Quase todo mundo começa fazendo sozinho. É aqui que costuma quebrar, e quando vale a pena continuar.',
        items: [
          { title: 'O marketing perde para o dia a dia', desc: 'Não porque você acha pouco importante, mas porque o orçamento que precisa sair hoje sempre ganha de um post que traz cliente daqui a três meses. Marketing só funciona quando algo acontece toda semana, e é isso que fica pra trás numa semana corrida.' },
          { title: 'Não é uma profissão, são quatro', desc: 'Tecnologia, texto, anúncio e design são quatro ofícios diferentes. Um generalista faz os quatro razoavelmente, e razoável é exatamente o suficiente para não ser encontrado.' },
          { title: 'Sem dados, você decide no chute', desc: 'Que página melhorar primeiro? Qual anúncio cortar? A resposta está no seu Search Console e no seu Gerenciador de Anúncios. Ninguém vê, a menos que alguém olhe toda semana e aja.' },
          { title: 'A conta de fazer sozinho nunca chega discriminada', desc: 'Parece de graça porque não chega boleto. Mas suas noites estão nessa conta, e os clientes que foram para o concorrente também.' },
          { title: 'Terceirizar não é largar', desc: 'Você entrega a execução, não a direção. Você diz de onde os clientes devem vir, a gente descobre como, e você vê o que mudou toda semana.' },
        ],
        aside: { title: 'E quando manter dentro de casa', text: 'Seu marketing já funciona, você tem tempo de verdade e os clientes estão chegando? Então terceirizar é dinheiro jogado fora. A conta só vira quando nada acontece há meses, ou quando a sua hora vale mais do que a hora gasta tentando descobrir.' },
      },
      {
        type: 'bundle',
        title: 'O que você entrega de uma vez.',
        subtitle: 'Terceirizar o marketing normalmente significa lidar com quatro fornecedores: quem faz o site, quem faz SEO, quem escreve e quem cuida dos anúncios. Na Tuliu é uma empresa, um valor e um contato no WhatsApp.',
        chips: ['Site e landing pages', 'SEO', 'SEO para IA', 'Conteúdo e vídeos', 'Google Ads', 'Meta Ads', 'Agentes de IA', 'Automações', 'Hospedagem e manutenção'],
        cards: [
          { icon: 'fas fa-layer-group', title: 'Uma empresa no lugar de quatro', desc: 'Sem coordenar agência de site, agência de SEO, redator e gestor de tráfego. Tudo num lugar só.' },
          { icon: 'fas fa-receipt', title: 'Um valor mensal fixo', desc: 'Sem taxa de criação, sem cobrança por hora. Planos a partir de R$97 por mês, com site, tráfego e SEO juntos a partir de R$497.' },
          { icon: 'fab fa-whatsapp', title: 'Um contato no WhatsApp', desc: 'Você manda o que precisa, por texto ou áudio, e a gente coloca no ar. Como falar com o seu próprio time.' },
        ],
      },
      marketCosts,
      {
        type: 'steps',
        title: 'Como funciona a passagem de bastão.',
        items: [
          { title: 'Diagnóstico com seu site na tela', desc: 'A gente olha seu mercado, seus concorrentes e de onde vêm seus clientes hoje. Daí sai o que fazer primeiro e qual plano faz sentido.' },
          { title: 'A gente assume a operação', desc: 'Seu site, seus textos e sua marca são o ponto de partida. Você não redigita nada e continua dono do domínio e das contas.' },
          { title: 'Algo acontece toda semana', desc: 'A IA trabalha no site, no conteúdo e nos anúncios, e enfileira melhorias. Um especialista aprova antes de ir pro ar.' },
          { title: 'Você manda mensagem, a gente publica', desc: 'Uma página nova, preço diferente, uma promoção pra semana que vem: manda no WhatsApp e está no ar. Sem chamado, sem orçamento.' },
        ],
      },
      { type: 'expert', title: 'Você entrega o trabalho. Uma pessoa mantém o controle.', quote: expertQuote },
      {
        type: 'faq',
        title: 'Sobre terceirizar o marketing.',
        items: [
          { q: 'Quanto custa a hora de uma agência de marketing?', a: 'Um freelancer cobra entre R$80 e R$150 por hora. Agências normalmente trabalham com mensalidade, de R$2.500 a R$8.000, mais o site cobrado à parte. Na Tuliu não existe hora: você paga um valor mensal fixo a partir de R$97, com o trabalho já incluso.' },
          { q: 'Devo terceirizar o meu marketing?', a: 'Vale a pena no momento em que o marketing fica parado com frequência, ou quando a sua hora vale mais do que o que você economiza fazendo sozinho. Se você tem tempo, conhecimento e o marketing já traz clientes, continue.' },
          { q: 'Perco o controle da minha marca?', a: 'Não. Você define a direção e aprova o que quiser. A gente executa e mostra o que mudou toda semana.' },
          { q: 'Tem fidelidade?', a: 'Não. Os planos são mensais ou anuais, sem contrato de fidelidade. Se não fizer sentido, você cancela.' },
          { q: 'Vocês atendem qualquer segmento?', a: 'Atendemos pequenas e médias empresas de serviços, saúde, B2B, educação e varejo local. No diagnóstico a gente diz com sinceridade se faz sentido pro seu caso.' },
        ],
      },
    ],
  },
  {
    slug: 'gestao-de-trafego-com-ia',
    group: 'servico',
    navLabel: 'Tráfego pago com IA',
    navDesc: 'Google Ads e Meta Ads ajustados toda semana',
    metaTitle: 'Gestão de tráfego pago com IA, Google e Meta Ads | Tuliu',
    metaDescription: 'Campanhas de Google Ads e Meta Ads criadas, ajustadas e conectadas à página certa. IA e gestores de tráfego a partir de R$497/mês.',
    priceFrom: 'R$497/mês',
    hero: {
      eyebrow: 'Tráfego pago',
      title: 'Anúncios que se ajustam toda semana,',
      highlight: 'sem gestor caro.',
      subtitle: 'A maioria das campanhas morre do mesmo jeito: alguém sobe, ninguém olha, a verba vai embora. A Tuliu cria suas campanhas no Google e na Meta, conecta cada anúncio à página certa e ajusta lances, públicos e criativos com base no que vende.',
      ticker: {
        title: 'Campanhas rodando, toda semana',
        items: ['Lance +14% · palavra que converte', 'Criativo novo · Meta Ads', 'Termo negativado · busca sem intenção', 'Landing page nova · um anúncio, uma página', 'Público ajustado · remarketing', 'Orçamento redistribuído · melhor campanha'],
      },
    },
    blocks: [
      {
        type: 'features',
        title: 'O anúncio e a página, juntos.',
        subtitle: 'Anúncio bom apontando pra página genérica queima dinheiro. Por isso a gente cuida dos dois.',
        items: [
          { icon: 'fab fa-google', title: 'Google Ads', desc: 'Pesquisa, Performance Max e remarketing, com palavras negativas e lances revisados toda semana.' },
          { icon: 'fab fa-meta', title: 'Meta Ads', desc: 'Campanhas no Instagram e Facebook com criativos renovados antes de cansar o público.' },
          { icon: 'fas fa-file-lines', title: 'Uma página por anúncio', desc: 'Cada campanha ganha a landing page que responde exatamente o que o anúncio prometeu.' },
          { icon: 'fas fa-photo-film', title: 'Criativos produzidos', desc: 'Imagens, carrosséis e vídeos curtos feitos pelo nosso time, no padrão da sua marca.' },
          { icon: 'fas fa-chart-line', title: 'Custo por lead visível', desc: 'Cada contato registrado por campanha e por origem. Você sabe o que vale mais verba.' },
          { icon: 'fas fa-robot', title: 'Atendimento que não deixa esfriar', desc: 'Um agente de IA responde no WhatsApp na hora, mesmo de madrugada, e passa o lead quente pra você.' },
        ],
      },
      machine('Uma máquina que aprende com cada real investido.', 'A IA junta os dados de anúncio, site e atendimento e encontra onde a verba está escorrendo. Depois ajusta, com aprovação de um gestor de tráfego.'),
      volume('Quanta otimização acontece de verdade?', 'R$1.500+ por mês, fora a verba', 'A partir de R$497 por mês, fora a verba'),
      { type: 'cases', title: 'Tráfego pago rodando de verdade.', subtitle: 'Empresas que deixaram de depender de um gestor sozinho.', ids: ['scienco-dairy-tech', 'procardiaco'] },
      { type: 'related', title: 'Outras frentes da máquina.', hrefs: ['seo-feito-por-ia', 'conteudo-com-ia', 'agentes-de-ia'] },
      {
        type: 'faq',
        title: 'Sobre tráfego pago na Tuliu.',
        items: [
          { q: 'A verba de anúncio está inclusa no plano?', a: 'Não. A verba é paga direto ao Google e à Meta, no seu cartão e na sua conta. O plano cobre o trabalho de criar, gerenciar e otimizar.' },
          { q: 'Qual verba mínima vocês recomendam?', a: 'Depende do mercado e da cidade. No diagnóstico a gente estima quanto faz sentido investir para ter dados suficientes e começar a otimizar.' },
          { q: 'As contas ficam no meu nome?', a: 'Sempre. Você é dono das contas de anúncio, do pixel e dos dados. A gente acessa como parceiro.' },
          { q: 'Vocês fazem os criativos?', a: 'Sim. Imagens, carrosséis e vídeos curtos entram no trabalho, produzidos com IA e revisados pelo nosso time.' },
        ],
      },
    ],
  },
  {
    slug: 'criar-site-com-ia',
    group: 'servico',
    navLabel: 'Site feito com IA',
    navDesc: 'Site sob medida, publicado e mantido por nós',
    metaTitle: 'Criar site com IA, feito por especialistas | Tuliu',
    metaDescription: 'Site sob medida feito com IA, hospedado, com domínio, SSL e e-mail inclusos, e otimizado toda semana. A partir de R$97/mês, sem taxa de criação.',
    hero: {
      eyebrow: 'Site com IA',
      title: 'Um site feito com IA,',
      highlight: 'sem você precisar mexer em nada.',
      subtitle: 'Gerar um site em minutos ficou fácil. Difícil é fazer ele ser encontrado, passar confiança e vender um pouco mais a cada mês. A Tuliu cria seu site sob medida com a velocidade da IA, e depois continua trabalhando nele.',
      ticker: {
        title: 'Seu site, sempre melhorando',
        items: ['Seção de depoimentos adicionada', 'Botão de WhatsApp testado · versão B venceu', 'Página de serviço criada', 'Imagens comprimidas · site 40% mais leve', 'Formulário encurtado · 7 para 4 campos', 'SSL renovado automaticamente'],
      },
    },
    blocks: [
      {
        type: 'features',
        title: 'Tudo incluso, desde o primeiro dia.',
        subtitle: 'Sem taxa de criação. O site entra na mensalidade, junto com tudo que ele precisa para funcionar.',
        items: [
          { icon: 'fas fa-pen-ruler', title: 'Design sob medida', desc: 'Na identidade da sua marca, ou uma repaginada no site que você já tem.' },
          { icon: 'fas fa-globe', title: 'Domínio, hospedagem e SSL', desc: 'Registro, DNS e certificado sempre ativos. Você não toca em nada técnico.' },
          { icon: 'fas fa-envelope', title: 'E-mail profissional', desc: 'Contas com o domínio da sua empresa, prontas para usar.' },
          { icon: 'fas fa-mobile-screen', title: 'Rápido no celular', desc: 'Leve, responsivo e pronto para o Google desde o lançamento.' },
          { icon: 'fas fa-credit-card', title: 'Pagamentos e agendamentos', desc: 'Botão de pagamento, sinal, agenda e integrações conectadas ao site.' },
          { icon: 'fab fa-whatsapp', title: 'Mudanças pelo WhatsApp', desc: 'Pediu, a gente faz. Normalmente no ar no mesmo dia.' },
        ],
      },
      { type: 'steps', title: 'Do zero ao site no ar.', items: [
        { title: 'Conversa rápida', desc: 'Você conta o que vende, para quem e como o cliente chega até você.' },
        { title: 'Primeira versão em dias', desc: 'A IA acelera estrutura, textos e layout. Nosso time de design refina.' },
        { title: 'Ajustes e publicação', desc: 'Você aprova, a gente publica no seu domínio com tudo configurado.' },
        { title: 'Melhoria contínua', desc: 'Depois do lançamento, o site continua sendo otimizado com base em dados.' },
      ] },
      { type: 'related', title: 'Comparando com outras ferramentas?', hrefs: ['alternativa-lovable', 'alternativa-wix', 'alternativa-framer'] },
      {
        type: 'faq',
        title: 'Sobre o site da Tuliu.',
        items: [
          { q: 'O site é meu?', a: 'O domínio e todo o conteúdo são seus. Se um dia sair, a gente te entrega o domínio e os textos para levar para onde quiser.' },
          { q: 'Vocês fazem loja virtual?', a: 'Para pagamentos simples, sinal e assinaturas, sim. Para um e-commerce com centenas de produtos, a gente indica a melhor plataforma no diagnóstico.' },
          { q: 'Quanto tempo leva?', a: 'A primeira versão costuma ficar pronta em poucos dias. Projetos maiores, com várias páginas, levam um pouco mais.' },
          { q: 'Tem taxa de criação?', a: 'Não. O site entra na mensalidade a partir de R$97 por mês.' },
        ],
      },
    ],
  },
  {
    slug: 'conteudo-com-ia',
    group: 'servico',
    navLabel: 'Conteúdo e vídeos',
    navDesc: 'Carrosséis, Reels e artigos produzidos toda semana',
    metaTitle: 'Produção de conteúdo e vídeos com IA para empresas | Tuliu',
    metaDescription: 'Pautas, carrosséis, Reels editados e artigos para o seu negócio, produzidos com IA e revisados pelo nosso time. A partir de R$97/mês.',
    hero: {
      eyebrow: 'Conteúdo com IA',
      title: 'Conteúdo toda semana,',
      highlight: 'sem você virar produtor.',
      subtitle: 'Postar com constância é o que separa quem é lembrado de quem é esquecido. A Tuliu pesquisa as pautas, escreve, desenha os carrosséis e edita os vídeos. Você só aprova.',
      ticker: {
        title: 'Produção da semana',
        items: ['Pauta aprovada · tendência do setor', 'Carrossel desenhado · 8 slides', 'Reel editado · legendas e cortes', 'Artigo publicado · dúvida de cliente', 'Legenda escrita · tom da marca', 'Post agendado · melhor horário'],
      },
    },
    blocks: [
      {
        type: 'features',
        title: 'Uma linha de produção de conteúdo.',
        items: [
          { icon: 'fas fa-lightbulb', title: 'Pautas com dados', desc: 'Agentes de IA monitoram notícias, concorrentes e dúvidas do seu público e sugerem o que postar.' },
          { icon: 'fas fa-images', title: 'Carrosséis', desc: 'Texto editorial e design na identidade da sua marca, prontos para publicar.' },
          { icon: 'fas fa-film', title: 'Edição de vídeos', desc: 'Você grava no celular, a gente corta, legenda e entrega o Reel pronto.' },
          { icon: 'fas fa-newspaper', title: 'Artigos para o site', desc: 'Conteúdo que responde o que seu cliente busca no Google e no ChatGPT.' },
          { icon: 'fas fa-calendar-check', title: 'Calendário', desc: 'Tudo organizado e agendado. Você vê o mês inteiro antes de acontecer.' },
          { icon: 'fas fa-user-check', title: 'Revisão humana', desc: 'Nada vai pro ar sem passar pelo nosso time. IA na velocidade, gente na qualidade.' },
        ],
      },
      volume('Quanto conteúdo sai de verdade?', 'R$2.000+ por mês'),
      { type: 'cases', title: 'Conteúdo rodando com IA.', subtitle: 'Empresas que deixaram de depender de inspiração para postar.', ids: ['vital-brasil', 'poliforte'] },
      { type: 'related', title: 'Outras frentes da máquina.', hrefs: ['gestao-de-trafego-com-ia', 'seo-feito-por-ia', 'agentes-de-ia'] },
      {
        type: 'faq',
        title: 'Sobre conteúdo na Tuliu.',
        items: [
          { q: 'Preciso aparecer nos vídeos?', a: 'Não é obrigatório, mas ajuda. A gente orienta o que gravar em poucos minutos, e o resto é com a gente.' },
          { q: 'O conteúdo vai soar genérico?', a: 'A gente monta o tom de voz da sua marca antes de começar, e cada peça é revisada por uma pessoa. O objetivo é soar como você, não como um robô.' },
          { q: 'Vocês publicam por mim?', a: 'Sim, se você quiser. A gente agenda e publica nos horários com melhor resposta.' },
        ],
      },
    ],
  },
  {
    slug: 'identidade-de-marca',
    group: 'servico',
    navLabel: 'Identidade de marca',
    navDesc: 'Marca pronta em dias, para quem está começando',
    metaTitle: 'Identidade de marca rápida para negócios novos | Tuliu',
    metaDescription: 'Logo, cores, tipografia, site e posts para Instagram em até 7 dias. Identidade de marca rápida e acessível para quem está começando um negócio.',
    hero: {
      eyebrow: 'Identidade de marca',
      title: 'Sua marca pronta em dias,',
      highlight: 'para começar a vender logo.',
      subtitle: 'Quem está abrindo um negócio não pode esperar meses nem gastar o que não tem. A Tuliu cria a identidade da sua marca com IA e direção de especialistas: logo, cores, tipografia, site e posts para o Instagram, prontos em até 7 dias.',
      ticker: {
        title: 'Sua marca tomando forma',
        items: ['Território da marca definido', 'Símbolo e logotipo desenhados', 'Paleta e tipografia escolhidas', 'Site no ar na nova identidade', '18 posts prontos para o Instagram', 'Cartão e assinatura de e-mail'],
      },
    },
    blocks: [
      {
        type: 'features',
        title: 'Tudo que uma marca nova precisa para começar.',
        subtitle: 'Uma identidade enxuta e bem feita, pensada para colocar o negócio na rua rápido. Sem processos de meses, sem relatórios de cem páginas.',
        items: [
          { icon: 'fas fa-pen-nib', title: 'Símbolo e logotipo', desc: 'Todas as versões e cores, com cessão total dos direitos de uso por contrato.' },
          { icon: 'fas fa-swatchbook', title: 'Guia da marca', desc: 'Paleta, tipografia, tom de voz e regras de uso, num guia direto ao ponto.' },
          { icon: 'fas fa-file-export', title: 'Arquivos finais', desc: 'SVG, PNG e PDF prontos para usar, mais favicon e avatar para as redes.' },
          { icon: 'fas fa-laptop-code', title: 'Site na nova identidade', desc: 'Site de até 10 páginas no ar, preparado para o Google e para as IAs.' },
          { icon: 'fab fa-instagram', title: 'Posts para o Instagram', desc: '18 posts e carrosséis prontos, mais modelos editáveis e link de bio.' },
          { icon: 'fas fa-id-card', title: 'Papelaria digital', desc: 'Cartão de visita, assinatura de e-mail, papel timbrado e modelos.' },
        ],
      },
      {
        type: 'reasons',
        title: 'Por que uma identidade rápida faz sentido no começo.',
        subtitle: 'Uma oferta exclusiva, pensada para quem precisa sair do papel com baixo custo.',
        items: [
          { title: 'Seu negócio precisa existir antes de ser perfeito', desc: 'No começo, o que importa é ter uma marca profissional para vender, abrir conta, postar e ser encontrado. Ajustes finos vêm com o tempo e com os clientes.' },
          { title: 'IA acelera, especialista garante a qualidade', desc: 'A IA explora caminhos visuais em horas. Nosso time de direção escolhe, refina e entrega o que tem cara de marca de verdade.' },
          { title: 'Tudo conversa desde o primeiro dia', desc: 'Logo, site e posts nascem juntos, na mesma identidade. Nada de remendar peças feitas por fornecedores diferentes.' },
          { title: 'Valor fechado e parcelado', desc: 'Você sabe quanto vai pagar antes de começar, com parcelamento no cartão ou no Pix e entrega em até 7 dias após a confirmação.' },
        ],
        aside: { title: 'E quando você precisa de mais', text: 'Para empresas já estabelecidas que precisam de um reposicionamento profundo, com pesquisa, estratégia e plataforma de marca completa, indicamos um projeto de branding com nossa parceira Mira Brand Studio.' },
      },
      { type: 'steps', title: 'Da ideia à marca no ar.', items: [
        { title: 'Conversa sobre o negócio', desc: 'Você conta o que vende, para quem e o que quer transmitir.' },
        { title: 'Território e caminhos', desc: 'A IA explora possibilidades e nosso time define a direção da marca.' },
        { title: 'Você navega pela marca', desc: 'Antes de decidir, você vê a identidade aplicada no site e nos posts.' },
        { title: 'Tudo entregue e no ar', desc: 'Arquivos, guia, site e posts prontos em até 7 dias após a confirmação.' },
      ] },
      { type: 'cases', title: 'Marcas com presença à altura.', subtitle: 'Identidade visual aplicada em todos os canais, do vídeo ao display.', ids: ['poliforte'] },
      { type: 'related', title: 'Depois da marca, o crescimento.', hrefs: ['criar-site-com-ia', 'conteudo-com-ia', 'terceirizar-marketing'] },
      {
        type: 'faq',
        title: 'Sobre a identidade de marca.',
        items: [
          { q: 'Para quem é esse serviço?', a: 'Para quem está começando um negócio novo, ou para quem nunca teve uma marca profissional e precisa de uma rápido, sem gastar o que um projeto completo de branding custa.' },
          { q: 'Em quanto tempo fica pronto?', a: 'Em até 7 dias após a confirmação, com rodadas de ajuste incluídas.' },
          { q: 'Os direitos da marca ficam comigo?', a: 'Sim. Você recebe a cessão total dos direitos de uso por contrato escrito.' },
          { q: 'Posso ver antes de pagar?', a: 'Em muitos casos, sim: você navega pela identidade aplicada antes de decidir. Na conversa a gente explica como funciona para o seu caso.' },
          { q: 'É a mesma coisa que um projeto de branding?', a: 'Não. É uma identidade enxuta e rápida, feita para colocar o negócio na rua. Projetos de branding completos, com pesquisa e estratégia aprofundadas, são outro tipo de trabalho.' },
        ],
      },
    ],
  },
  {
    slug: 'agentes-de-ia',
    group: 'servico',
    navLabel: 'Agentes de IA e automações',
    navDesc: 'Atendimento, vendas e processos rodando sozinhos',
    metaTitle: 'Agentes de IA e automações de marketing para empresas | Tuliu',
    metaDescription: 'Agentes de IA que atendem no WhatsApp, qualificam leads e automatizam processos de marketing. Implementados e mantidos pela Tuliu.',
    hero: {
      eyebrow: 'Agentes de IA',
      title: 'Um time que atende, qualifica e vende',
      highlight: 'enquanto você dorme.',
      subtitle: 'Lead que espera resposta esfria. A Tuliu implementa agentes de IA no seu WhatsApp e no seu site, conectados ao seu CRM e à sua agenda, e automatiza as tarefas repetitivas do marketing.',
      ticker: {
        title: 'Agentes trabalhando agora',
        items: ['Lead respondido em 12s · WhatsApp', 'Consulta agendada · agenda conectada', 'Lead qualificado · enviado ao CRM', 'Follow-up automático · 3 dias sem resposta', 'Cobrança enviada · link de pagamento', 'Relatório semanal · gerado e enviado'],
      },
    },
    blocks: [
      {
        type: 'features',
        title: 'O que um agente faz pelo seu negócio.',
        items: [
          { icon: 'fab fa-whatsapp', title: 'Atendimento 24h', desc: 'Responde dúvidas, preços e horários na hora, no tom da sua marca.' },
          { icon: 'fas fa-filter', title: 'Qualificação de leads', desc: 'Faz as perguntas certas e passa pra você só quem está pronto pra comprar.' },
          { icon: 'fas fa-calendar-days', title: 'Agendamento', desc: 'Marca consultas e reuniões direto na sua agenda.' },
          { icon: 'fas fa-plug', title: 'Integrações', desc: 'CRM, pagamentos, planilhas e e-mail conectados, sem manual.' },
          { icon: 'fas fa-gears', title: 'Automações de marketing', desc: 'Follow-ups, relatórios e fluxos de conteúdo rodando nos bastidores.' },
          { icon: 'fas fa-shield-halved', title: 'Supervisão humana', desc: 'Nosso time acompanha as conversas e ajusta o agente continuamente.' },
        ],
      },
      { type: 'cases', title: 'Agentes e automações em produção.', subtitle: 'Processos que deixaram de ser manuais.', ids: ['procardiaco', 'scienco-dairy-tech'] },
      { type: 'related', title: 'Outras frentes da máquina.', hrefs: ['gestao-de-trafego-com-ia', 'criar-site-com-ia', 'terceirizar-marketing'] },
      {
        type: 'faq',
        title: 'Sobre agentes de IA.',
        items: [
          { q: 'O cliente percebe que é uma IA?', a: 'A gente recomenda deixar claro que é um assistente virtual. A experiência é natural, rápida, e passa para um humano quando precisa.' },
          { q: 'Funciona no meu número de WhatsApp?', a: 'Sim, usando a API oficial do WhatsApp Business. A gente cuida da configuração.' },
          { q: 'Em qual plano entra?', a: 'Agentes de IA e automações sob medida fazem parte do plano Enterprise, a partir de R$2.000 por mês.' },
        ],
      },
    ],
  },

  /* ---------------- COMPARAÇÕES ---------------- */
  {
    slug: 'alternativa-agencia-de-marketing',
    group: 'comparacao',
    featured: true,
    navLabel: 'Alternativa à agência',
    navDesc: 'Site e marketing em um só lugar, sem orçamento por mudança',
    metaTitle: 'Alternativa à agência de marketing: site e marketing em um só | Tuliu',
    metaDescription: 'Para ter site você paga uma agência. Para crescer, outra. A Tuliu faz o trabalho das duas, com IA e especialistas, por um valor mensal fixo.',
    hero: {
      eyebrow: 'Agências vs Tuliu',
      title: 'A alternativa à agência de marketing:',
      highlight: 'site e marketing em um só lugar.',
      subtitle: 'Para ter um site bom você paga uma agência. Para crescer depois, outra. A Tuliu faz o trabalho das duas, com IA e especialistas, por um valor mensal fixo.',
    },
    blocks: [
      {
        type: 'features',
        title: 'Todas as alternativas a uma agência, por quem faz o trabalho.',
        subtitle: 'A pergunta raramente é se a agência é boa. É qual parte do trabalho você entrega, e o que volta pra sua mesa depois.',
        items: [
          { icon: 'fas fa-user', title: 'Você mesmo, com ferramentas de IA', desc: 'ChatGPT pros textos, Canva pros posts, um construtor pro site. Barato em reais, caro em noites. Só funciona enquanto sobra tempo.' },
          { icon: 'fas fa-id-badge', title: 'Analista de marketing CLT', desc: 'Alguém que conhece seu negócio de perto. Mas custa salário, encargos e contratação, e raramente faz site ou tráfego.' },
          { icon: 'fas fa-laptop-code', title: 'Freelancer de site', desc: 'Entrega o site por um valor único, às vezes melhor que agência. Depois acabou: conteúdo, SEO e manutenção voltam pra você.' },
          { icon: 'fas fa-bullhorn', title: 'Freelancer de tráfego ou social media', desc: 'Cuida de uma frente, algumas horas por semana. Não mexe no site, e você vira o gerente de todos.' },
          { icon: 'fas fa-building', title: 'Agência full service', desc: 'Tudo sob um teto, com estratégia e time. Mas custa milhares por mês, orçamento por mudança e dias a semanas de espera.' },
          { icon: 'fas fa-bolt', title: 'Tuliu', desc: 'O trabalho de uma agência de site e de uma agência de marketing, por um valor fixo e sem taxa de criação. Uma mensagem, no ar no mesmo dia.' },
        ],
      },
      {
        type: 'costs',
        title: 'Quanto uma agência custa de verdade.',
        subtitle: 'Agências fazem trabalho bom. Mas a conta raramente é uma linha só, e raramente é pequena.',
        items: [
          { tag: 'valor único', title: 'Criar o site', desc: 'Uma agência cobra de R$5.000 a R$20.000 por um site sob medida. E de novo a cada grande mudança.' },
          { tag: 'mensal', title: 'Mensalidade de marketing', desc: 'SEO, conteúdo e tráfego por agência costumam custar de R$2.500 a R$8.000 por mês.' },
          { tag: 'prazo', title: 'Esperar pelas pessoas', desc: 'Uma mudança passa por atendimento, planejamento e orçamento. Dias a semanas, não uma mensagem.' },
          { tag: 'fragmentado', title: 'Dividido entre fornecedores', desc: 'Agência de site, de SEO, redator, gestor de tráfego: você paga e briefa cada um separado.' },
        ],
        summary: 'Some tudo: milhares no site, mais a mensalidade, mais o seu tempo coordenando fornecedores.',
      },
      {
        type: 'table',
        title: 'Agência vs Tuliu, linha a linha.',
        subtitle: 'Sem truque: a agência ganha de verdade em algumas linhas. A diferença é preço, velocidade e ter tudo num só lugar.',
        columns: ['Agência de marketing', 'Agência de sites', 'Tuliu'],
        rows: [
          { label: 'Faz o seu site', values: ['partly', 'yes', 'yes'] },
          { label: 'Faz SEO, conteúdo e anúncios', values: ['yes', 'no', 'yes'] },
          { label: 'Tudo com uma empresa só', values: ['partly', 'no', 'yes'] },
          { label: 'Valor mensal baixo e fixo', values: ['no', 'no', 'yes'] },
          { label: 'Sem taxa de criação de site', values: ['no', 'no', 'yes'] },
          { label: 'No ar em dias, sem orçamento', values: ['no', 'no', 'yes'] },
          { label: 'Uma mudança? Uma mensagem, no ar no mesmo dia', values: ['no', 'no', 'yes'] },
          { label: 'Otimizado com dados toda semana', values: ['partly', 'no', 'yes'] },
          { label: 'Estratégia presencial e profunda', values: ['yes', 'partly', 'partly'] },
          { label: 'App, portal ou e-commerce grande', values: ['partly', 'yes', 'no'] },
        ],
      },
      {
        type: 'when',
        title: 'Quando uma agência é a melhor escolha.',
        paragraphs: [
          'Agência não é ruim, é outra coisa. Escolha uma agência se você tem um projeto grande e complexo (e-commerce com centenas de produtos, portal de membros, aplicativo), quer um processo de estratégia profundo com gente vivendo a sua marca por meses, ou espera um time dedicado presencialmente.',
          'A Tuliu é a alternativa para quem quer o trabalho de uma agência de marketing e de sites, mas sem orçamento por mudança, sem prazo de semanas, sem conta de milhares por mês e sem gerenciar fornecedores.',
        ],
        links: [
          { label: 'Decidindo se terceiriza o marketing? Veja o guia', href: '/terceirizar-marketing' },
          { label: 'Pensando em contratar só a hospedagem? Veja a comparação', href: '/alternativa-hostinger' },
          { label: 'Prefere um site feito com IA? Veja a comparação', href: '/criar-site-com-ia' },
          { label: 'Usando Lovable? Veja a comparação', href: '/alternativa-lovable' },
          { label: 'Pensando em WordPress? Veja a comparação', href: '/alternativa-wordpress' },
        ],
      },
      {
        type: 'faq',
        title: 'Sobre agências e a Tuliu.',
        items: [
          { q: 'Quanto custa uma agência de marketing por mês?', a: 'Uma mensalidade para SEO, conteúdo e tráfego costuma ficar entre R$2.500 e R$8.000, fora o site, que sai de R$5.000 a R$20.000. Na Tuliu é um valor fixo a partir de R$97 por mês.' },
          { q: 'Como a Tuliu consegue cobrar tão menos?', a: 'A IA faz a parte operacional que numa agência consome horas de várias pessoas. Nosso time fica com estratégia e revisão, que é onde o olhar humano faz diferença.' },
          { q: 'Tenho contrato com uma agência. Posso migrar?', a: 'Pode. A gente usa seu site, seus textos e sua marca como base. O contrato atual pode simplesmente terminar enquanto a gente prepara tudo.' },
          { q: 'Vocês fazem white label para agências?', a: 'Sim. Agências podem usar a Tuliu nos bastidores e entregar com a própria marca. Fale com a gente no WhatsApp.' },
        ],
      },
    ],
  },
  {
    slug: 'alternativa-hostinger',
    group: 'comparacao',
    featured: true,
    navLabel: 'Alternativa à Hostinger',
    navDesc: 'O site pronto e cuidado, não só o espaço para ele',
    metaTitle: 'Alternativa à Hostinger: site, domínio e hospedagem cuidados por você | Tuliu',
    metaDescription: 'Na Hostinger você aluga o espaço e faz o resto. Na Tuliu, domínio, hospedagem, SSL, e-mail, o site e o marketing vêm prontos e cuidados por um time, a partir de R$97 por mês.',
    hero: {
      eyebrow: 'Hostinger vs Tuliu',
      title: 'A alternativa à Hostinger:',
      highlight: 'o site pronto, não só o espaço.',
      subtitle: 'Na Hostinger você aluga o espaço e o resto fica com você: montar o site, configurar o domínio e o e-mail, manter tudo atualizado e fazer ele trazer cliente. Na Tuliu, isso tudo vem pronto e cuidado por um time, num valor mensal fixo.',
    },
    blocks: [
      {
        type: 'needs',
        title: 'O que um plano de hospedagem não faz por você.',
        subtitle: 'A hospedagem é o terreno. A casa, a manutenção e a vizinhança encontrar você continuam sendo trabalho seu.',
        items: [
          { tag: 'com você', title: 'Montar o site', desc: 'Construtor com IA ou WordPress ajudam, mas escolher a estrutura, escrever cada página e deixar bonito leva noites e fins de semana.' },
          { tag: 'técnico', title: 'Domínio, DNS, SSL e e-mail', desc: 'Apontar domínio, configurar registros, criar contas de e-mail e resolver quando algo para de funcionar. Tudo no painel, tudo com você.' },
          { tag: 'contínuo', title: 'Manter tudo de pé', desc: 'Atualizações, plugins, backups e segurança. Quando quebra, o suporte explica o caminho, mas quem resolve é você.' },
          { tag: 'à parte', title: 'Trazer clientes', desc: 'SEO, conteúdo e anúncios não fazem parte de nenhum plano de hospedagem. O site fica no ar, mas ninguém chega.' },
        ],
        summary: 'A hospedagem mantém o site no ar. Fazer ele existir, funcionar e vender continua sendo trabalho seu.',
      },
      {
        type: 'costs',
        title: 'Quanto um site na hospedagem custa de verdade.',
        subtitle: 'O preço do plano é a parte pequena da conta. Estes são valores de referência do mercado brasileiro.',
        items: [
          { tag: 'promocional', title: 'O plano em si', desc: 'O preço de entrada costuma valer só no primeiro período. Na renovação, a mensalidade sobe, e o domínio grátis vira cobrança anual.' },
          { tag: 'valor único', title: 'Quem faz o site', desc: 'Um freelancer cobra de R$1.500 a R$5.000 por um site simples. Uma agência, de R$5.000 a R$20.000. Ou são as suas noites.' },
          { tag: 'mensal', title: 'Manutenção', desc: 'Atualizar, corrigir e mexer no conteúdo depois do lançamento. Ou alguém cobra por hora, ou fica parado.' },
          { tag: 'à parte', title: 'Marketing', desc: 'SEO, conteúdo e tráfego pago com freelancer ou agência custam de R$1.000 a R$8.000 por mês.' },
        ],
        summary: 'Some tudo: o plano depois da promoção, quem faz o site, quem mantém e quem traz cliente. Na Tuliu é um valor só, a partir de R$97 por mês.',
      },
      {
        type: 'table',
        title: 'Hostinger vs Tuliu, linha a linha.',
        subtitle: 'Sem truque: a Hostinger ganha de verdade em algumas linhas. A diferença é que lá você aluga a estrutura, e aqui você recebe o resultado.',
        columns: ['Hostinger', 'Tuliu'],
        rows: [
          { label: 'Só hospedagem, pelo menor preço', values: ['yes', 'partly'] },
          { label: 'Painel técnico com acesso total', values: ['yes', 'partly'] },
          { label: 'Vários sites no mesmo plano', values: ['yes', 'partly'] },
          { label: 'Domínio, SSL e e-mail configurados para você', values: ['no', 'yes'] },
          { label: 'Site criado e publicado por especialistas', values: ['no', 'yes'] },
          { label: 'Atualizações, backups e segurança sem você mexer', values: ['partly', 'yes'] },
          { label: 'SEO, conteúdo e tráfego pago inclusos', values: ['no', 'yes'] },
          { label: 'Uma mudança? Uma mensagem no WhatsApp e está no ar', values: ['no', 'yes'] },
          { label: 'Suporte que resolve, não que ensina o caminho', values: ['partly', 'yes'] },
          { label: 'Um valor mensal fixo, sem surpresa na renovação', values: ['partly', 'yes'] },
        ],
      },
      {
        type: 'when',
        title: 'Quando a Hostinger é a melhor escolha.',
        paragraphs: [
          'A Hostinger é ótima no que se propõe. Escolha uma hospedagem se você é desenvolvedor ou tem alguém técnico no time, quer controle total do servidor, gosta de montar e manter o próprio site, ou precisa hospedar vários projetos pelo menor preço possível.',
          'A Tuliu é para quem não quer virar técnico de site. Você recebe domínio, hospedagem, SSL, e-mail e o site prontos, cuidados por um time, com o marketing rodando junto. Você assume o marketing do seu negócio sem cair no operacional.',
        ],
        links: [
          { label: 'Comparando com uma agência? Veja a comparação', href: '/alternativa-agencia-de-marketing' },
          { label: 'Pensando em Wix ou Squarespace? Veja a comparação', href: '/alternativa-wix' },
          { label: 'Já está no WordPress? Veja a comparação', href: '/alternativa-wordpress' },
          { label: 'Quer um site feito com IA? Veja como funciona', href: '/criar-site-com-ia' },
        ],
      },
      {
        type: 'faq',
        title: 'Sobre a Hostinger e a Tuliu.',
        items: [
          { q: 'Meu site já está na Hostinger. Vocês assumem?', a: 'Sim. A gente migra o site, o domínio e os e-mails, redireciona as páginas antigas para não perder posições no Google e cuida de tudo daqui pra frente.' },
          { q: 'A Tuliu não é mais cara que uma hospedagem?', a: 'Se você comparar só com o espaço no servidor, sim. Mas no valor da Tuliu já estão o site, a configuração, a manutenção e o marketing. Na hospedagem, cada uma dessas partes é paga à parte ou feita por você.' },
          { q: 'Onde meu site fica hospedado?', a: 'Em servidores de alta performance, com SSL e backups, gerenciados pelo nosso time. Você não precisa acessar painel nenhum.' },
          { q: 'Vou ter e-mail com o domínio da minha empresa?', a: 'Sim. Os e-mails profissionais estão inclusos desde o plano de entrada, já configurados e prontos para usar.' },
          { q: 'E se eu quiser mudar alguma coisa no site?', a: 'Manda uma mensagem no WhatsApp, por texto ou áudio. A gente faz e coloca no ar, sem orçamento por mudança.' },
        ],
      },
    ],
  },
  alt({
    slug: 'alternativa-chatgpt',
    tool: 'ChatGPT',
    navDesc: 'A IA escreve. Quem decide, publica e mede?',
    title: 'O ChatGPT escreve.',
    highlight: 'A Tuliu faz o marketing acontecer.',
    subtitle: 'Com o ChatGPT qualquer um gera um texto, uma ideia de post ou um rascunho de site em segundos. O que ele não faz é decidir o que importa, colocar no ar, acompanhar os números e corrigir a rota toda semana. A Tuliu usa a mesma IA, mas com um time fazendo o trabalho por você.',
    needsSubtitle: 'A IA ficou barata e é igual para todo mundo. O que separa quem cresce de quem fica parado é a execução.',
    needs: [
      { tag: 'estratégia', title: 'Saber o que pedir', desc: 'Resposta boa depende de pergunta boa. Sem estratégia e sem dados, o ChatGPT devolve o óbvio que o seu concorrente também recebe.' },
      { tag: 'execução', title: 'Colocar no ar', desc: 'O texto pronto ainda precisa virar página, post, anúncio ou e-mail. Publicar, configurar e integrar continua sendo trabalho seu.' },
      { tag: 'contínuo', title: 'Fazer toda semana', desc: 'Marketing funciona com constância. Um prompt resolve uma tarde. Quem faz o próximo, e o outro, e o outro?' },
      { tag: 'dados', title: 'Medir e corrigir', desc: 'O ChatGPT não vê seu Google Ads, seu Search Console nem seus leads. Sem dados, não dá para saber o que está funcionando.' },
      { tag: 'qualidade', title: 'Um olhar experiente', desc: 'IA erra com confiança. Um especialista percebe o que está fora do tom, fora da lei ou simplesmente não vende.' },
      { tag: 'tempo', title: 'Suas noites', desc: 'Fazer sozinho com IA ainda é fazer sozinho. O tempo que você passa escrevendo prompts sai do seu negócio.' },
    ],
    needsSummary: 'O ChatGPT é uma ferramenta incrível. Mas ferramenta não é time: alguém ainda precisa pensar, executar, publicar e medir.',
    toolWins: [
      { label: 'Gera textos e ideias na hora', values: ['yes', 'yes'] },
      { label: 'Custo muito baixo por mês', values: ['yes', 'partly'] },
      { label: 'Você controla cada palavra', values: ['yes', 'partly'] },
    ],
    whenBetter: [
      'Continue só com o ChatGPT se você gosta de colocar a mão na massa, tem tempo de verdade para isso e já sabe exatamente o que precisa fazer no seu marketing. Ele vai acelerar muito o seu trabalho.',
      'A Tuliu é para quem quer o resultado e não o trabalho: um time que usa a mesma IA, decide com base nos seus dados, coloca no ar e melhora toda semana, enquanto você cuida do negócio.',
    ],
    faq: [
      { q: 'A Tuliu usa o ChatGPT?', a: 'Usamos os melhores modelos de IA do mercado, incluindo os da OpenAI, Anthropic e Google, escolhidos para cada tarefa. A diferença é que existe um time decidindo, revisando e executando por você.' },
      { q: 'Posso continuar usando o ChatGPT?', a: 'Claro. Muitos clientes usam para ideias do dia a dia. A Tuliu cuida da operação: site, conteúdo, anúncios e atendimento rodando de forma constante.' },
      { q: 'Por que pagar se a IA é quase de graça?', a: 'Porque a IA é a parte barata. O que custa é o tempo e o conhecimento para transformar a IA em resultado toda semana. É isso que a Tuliu entrega, a partir de R$97 por mês.' },
    ],
  }),
  alt({
    slug: 'alternativa-lovable',
    tool: 'Lovable',
    navDesc: 'O site gerado é o começo. Quem faz o resto?',
    title: 'A alternativa ao Lovable',
    highlight: 'que também é encontrada.',
    subtitle: 'O Lovable gera uma primeira versão bonita em minutos. Depois disso, você vira o desenvolvedor, o profissional de marketing e o responsável pela manutenção. A Tuliu usa a mesma velocidade da IA, mas nosso time faz o trabalho.',
    needsSubtitle: 'Gerar o site é a parte fácil. Transformar o rascunho em algo que é encontrado e vende é trabalho contínuo, não um prompt.',
    needs: [
      { tag: 'contínuo', title: 'Ser encontrado (SEO)', desc: 'Um site gerado não sobe no Google sozinho. Palavras, estrutura, velocidade e schema são trabalho contínuo.' },
      { tag: 'mensal', title: 'Conteúdo que não para', desc: 'Gerar texto uma vez é fácil. Site que vende precisa de páginas novas, respostas e histórias, mês após mês.' },
      { tag: 'à parte', title: 'Trazer visitantes (anúncios)', desc: 'Site bonito sem tráfego não vende. Montar e otimizar Google e Meta Ads é um ofício próprio.' },
      { tag: 'com você', title: 'Manutenção e tecnologia', desc: 'Hospedagem, domínio, atualizações, segurança, bugs: depois de gerar, tudo isso é seu.' },
      { tag: 'semanal', title: 'Conversão e otimização', desc: 'O que funciona e o que não funciona? Um prompt não testa botões, títulos e formulários.' },
      { tag: 'especialista', title: 'Um olhar humano', desc: 'A IA chuta. Um profissional experiente vê o que o prompt deixou passar.' },
    ],
    needsSummary: 'O Lovable entrega o ponto de partida. Tudo que vem depois para ser encontrado e vender continua sendo trabalho seu, ou de quem você contratar.',
    toolWins: [
      { label: 'Primeira versão em minutos', values: ['yes', 'partly'] },
      { label: 'Controle total do código', values: ['yes', 'partly'] },
      { label: 'Ótimo para apps e protótipos', values: ['yes', 'no'] },
    ],
    whenBetter: [
      'O Lovable não é um produto ruim, é outra coisa. Escolha o Lovable se você quer construir e escrever prompts você mesmo, manter o código nas suas mãos, ou criar algo que não é um site comum: um app, um protótipo, uma ferramenta interna.',
      'A Tuliu é a alternativa para quem não quer construir nem gerenciar um site, mas quer um que seja encontrado, passe confiança e venda um pouco mais a cada mês, sem mexer nele.',
    ],
    faq: [
      { q: 'A Tuliu também usa IA?', a: 'Sim. Nossa IA trabalha no seu site todos os dias: analisa, escreve, otimiza. A diferença é que nosso time revisa e coloca no ar o que faz sentido. Você ganha a velocidade da IA sem escrever prompt nem entender de tecnologia.' },
      { q: 'Um site que comecei no Lovable pode ser assumido pela Tuliu?', a: 'Sim. A gente usa seu conteúdo e sua identidade como base e coloca no ar no seu domínio. Você não precisa migrar nada.' },
      { q: 'A Tuliu serve para um app ou ferramenta sob medida?', a: 'Para uma aplicação com login, painel e lógica complexa, o Lovable ou um desenvolvedor fazem mais sentido. A Tuliu é para sites que fazem o negócio crescer.' },
    ],
  }),
  alt({
    slug: 'alternativa-framer',
    tool: 'Framer',
    navDesc: 'Design lindo. E quem faz o marketing?',
    title: 'A alternativa ao Framer',
    highlight: 'para quem quer resultado, não ferramenta.',
    subtitle: 'O Framer faz sites lindos para quem sabe desenhar. Mas design é só o começo: alguém precisa escrever, otimizar, anunciar e manter. A Tuliu entrega o site bonito e faz o marketing em volta dele.',
    needsSubtitle: 'Um site bonito no Framer ainda precisa de tudo que faz ele trazer cliente.',
    needs: [
      { tag: 'contínuo', title: 'SEO de verdade', desc: 'O Framer dá a base técnica. Escolher palavras, criar páginas e ganhar posições é trabalho de toda semana.' },
      { tag: 'mensal', title: 'Conteúdo e textos', desc: 'Template bonito com texto genérico não convence ninguém. Copy que vende é um ofício à parte.' },
      { tag: 'à parte', title: 'Anúncios', desc: 'Google e Meta Ads, criativos e landing pages por campanha não fazem parte da ferramenta.' },
      { tag: 'com você', title: 'Tempo de design', desc: 'Cada mudança depende de alguém abrir o editor. Se essa pessoa é você, vira mais uma tarefa.' },
    ],
    needsSummary: 'O Framer é uma ótima ferramenta de design. O marketing que transforma o site em clientes continua com você.',
    toolWins: [
      { label: 'Liberdade total de design', values: ['yes', 'partly'] },
      { label: 'Animações avançadas no editor', values: ['yes', 'partly'] },
    ],
    whenBetter: [
      'Escolha o Framer se você é designer, ama ajustar cada pixel e tem tempo para cuidar do site. A liberdade do editor é exatamente o que você precisa.',
      'A Tuliu é para quem quer um site com design forte sem abrir editor nenhum, e com SEO, conteúdo e anúncios trabalhando juntos.',
    ],
    faq: [
      { q: 'Meu site está no Framer. Vocês assumem?', a: 'Sim. A gente usa seu design e conteúdo como base e passa a operar e otimizar o site.' },
      { q: 'O design da Tuliu é bom?', a: 'Nosso time de design trabalha sob medida, na sua identidade. Veja os cases para ter uma ideia.' },
    ],
  }),
  alt({
    slug: 'alternativa-wix',
    tool: 'Wix',
    navDesc: 'Wix e Squarespace mantêm o site no ar. E o resto?',
    title: 'A alternativa ao Wix e Squarespace',
    highlight: 'com o marketing incluso.',
    subtitle: 'Wix e Squarespace cuidam da hospedagem e das atualizações. As páginas, os textos e a visibilidade continuam sendo seus. A Tuliu faz o site e o trabalho que faz ele vender.',
    needsSubtitle: 'O construtor resolve a parte técnica. O que faz o cliente chegar fica com você.',
    needs: [
      { tag: 'com você', title: 'Montar e preencher', desc: 'Escolher template, escrever cada página e arrumar as imagens leva noites e fins de semana.' },
      { tag: 'contínuo', title: 'Ser encontrado', desc: 'O plugin de SEO não escolhe suas palavras nem cria as páginas que o Google quer ver.' },
      { tag: 'à parte', title: 'Anúncios e conteúdo', desc: 'Tráfego pago, redes sociais e artigos não fazem parte da assinatura.' },
      { tag: 'semanal', title: 'Melhorar com dados', desc: 'Ninguém olha o que funciona e o que não funciona, a menos que você olhe.' },
    ],
    needsSummary: 'A assinatura do construtor mantém o site no ar. Fazer ele trazer clientes continua sendo trabalho seu.',
    toolWins: [
      { label: 'Você mesmo edita na hora', values: ['yes', 'partly'] },
      { label: 'Loja virtual pronta na ferramenta', values: ['yes', 'partly'] },
    ],
    whenBetter: [
      'Escolha Wix ou Squarespace se você gosta de montar o site sozinho, tem tempo para isso e o site é mais um cartão de visitas do que um canal de vendas.',
      'A Tuliu é para quem quer o site como canal de clientes, feito e otimizado por quem entende de marketing.',
    ],
    faq: [
      { q: 'Posso trazer meu domínio do Wix?', a: 'Sim. A gente transfere ou aponta o domínio, e cuida de tudo na migração.' },
      { q: 'Vou perder posições no Google na migração?', a: 'A gente redireciona as páginas antigas corretamente para preservar o que você já conquistou.' },
    ],
  }),
  alt({
    slug: 'alternativa-wordpress',
    tool: 'WordPress',
    navDesc: 'Sem plugin quebrando, sem atualização pendente',
    title: 'A alternativa ao WordPress',
    highlight: 'sem plugin, sem dor de cabeça.',
    subtitle: 'O WordPress pode tudo, desde que alguém cuide de tema, plugins, atualizações e segurança. A Tuliu entrega um site rápido e seguro, e faz o marketing em volta dele.',
    needsSubtitle: 'O WordPress é poderoso, mas cobra manutenção constante.',
    needs: [
      { tag: 'contínuo', title: 'Atualizações e plugins', desc: 'Tema, plugins e núcleo pedindo atualização, e cada uma pode quebrar algo.' },
      { tag: 'risco', title: 'Segurança', desc: 'WordPress desatualizado é alvo fácil. Backup e proteção são sua responsabilidade.' },
      { tag: 'técnico', title: 'Velocidade', desc: 'Plugin em cima de plugin deixa o site lento, e o Google percebe.' },
      { tag: 'à parte', title: 'Marketing', desc: 'SEO, conteúdo e anúncios continuam precisando de alguém.' },
    ],
    needsSummary: 'O WordPress dá a ferramenta. Manter e fazer vender continua sendo trabalho de alguém.',
    toolWins: [
      { label: 'Milhares de plugins e temas', values: ['yes', 'no'] },
      { label: 'Ideal para blogs gigantes e portais', values: ['yes', 'partly'] },
    ],
    whenBetter: [
      'Escolha o WordPress se você tem um time técnico, precisa de um ecossistema específico de plugins ou opera um portal de conteúdo muito grande.',
      'A Tuliu é para quem quer um site rápido, seguro e que vende, sem pensar em atualização de plugin nunca mais.',
    ],
    faq: [
      { q: 'Vocês migram meu WordPress?', a: 'Sim. Conteúdo, páginas e redirecionamentos, sem você redigitar nada.' },
      { q: 'E o meu blog?', a: 'Seus artigos vêm junto, e a gente continua produzindo novos com base no que seu público busca.' },
    ],
  }),
  alt({
    slug: 'alternativa-canva',
    tool: 'Canva',
    navDesc: 'O Canva faz a peça. Quem faz o marketing?',
    title: 'O Canva faz a peça.',
    highlight: 'A Tuliu faz o marketing.',
    subtitle: 'O Canva deixou o design acessível para todo mundo. Mas uma arte bonita não decide o que postar, não escreve a legenda que vende, não sobe anúncio nem leva ninguém para o seu site. A Tuliu faz tudo isso por você.',
    needsSubtitle: 'Ter a ferramenta de design é o começo. O marketing é tudo que acontece em volta dela.',
    needs: [
      { tag: 'estratégia', title: 'Saber o que postar', desc: 'Pauta sem dado é chute. Alguém precisa olhar o que seu público busca e o que funciona.' },
      { tag: 'texto', title: 'Copy que vende', desc: 'Design chama a atenção. O texto é o que convence e leva ao contato.' },
      { tag: 'vídeo', title: 'Edição de vídeos', desc: 'Reels e vídeos curtos pedem roteiro, cortes e legendas, não só um template.' },
      { tag: 'à parte', title: 'Site, SEO e anúncios', desc: 'Post bonito sem site que converte e sem tráfego não vira cliente.' },
    ],
    needsSummary: 'O Canva entrega a ferramenta. Pensar, produzir, publicar e otimizar continua sendo trabalho seu.',
    toolWins: [
      { label: 'Você mesmo cria peças na hora', values: ['yes', 'partly'] },
      { label: 'Milhares de templates prontos', values: ['yes', 'no'] },
    ],
    whenBetter: [
      'Continue no Canva se você gosta de criar, tem tempo para isso e o seu marketing já traz clientes. É uma ferramenta excelente.',
      'A Tuliu é para quem quer o conteúdo saindo toda semana, conectado ao site e aos anúncios, sem gastar as próprias noites.',
    ],
    faq: [
      { q: 'Vocês usam Canva?', a: 'Usamos o que entrega o melhor resultado, incluindo IA generativa de imagem e vídeo. O importante é a peça sair na identidade da sua marca.' },
      { q: 'Posso continuar fazendo alguns posts?', a: 'Claro. Muitos clientes postam bastidores por conta própria e deixam a produção principal com a gente.' },
    ],
  }),

  /* ---------------- SEGMENTOS ---------------- */
  {
    slug: 'marketing-para-pequenas-empresas',
    group: 'segmento',
    navLabel: 'Pequenas empresas',
    navDesc: 'Um departamento de marketing no preço de pequena empresa',
    metaTitle: 'Marketing com IA para pequenas empresas, sem montar time | Tuliu',
    metaDescription: 'A Tuliu é o departamento de marketing da sua pequena empresa: a IA faz o trabalho, um especialista aprova, você manda mensagem no WhatsApp.',
    hero: {
      eyebrow: 'Para pequenas empresas',
      title: 'Marketing com IA para pequenas empresas,',
      highlight: 'sem montar um time.',
      subtitle: 'Empresa grande contrata um time para operar a IA. Você não tem esse time. A Tuliu é o seu departamento de marketing: a IA faz o trabalho, um especialista aprova, e você só manda mensagem no WhatsApp.',
      ticker: {
        title: 'Este mês, sem você pedir',
        items: ['Página de orçamento criada', 'Termos de busca atualizados', 'Anúncios reescritos', 'Texto do botão testado', 'Carrossel publicado', 'Horário de atendimento atualizado'],
      },
    },
    blocks: [
      {
        type: 'prose',
        title: 'A ferramenta nunca foi o seu problema.',
        paragraphs: [
          'Você já tem a mesma IA que as grandes empresas. O ChatGPT custa cem reais, não cem mil. A inteligência ficou barata e é igual para todo mundo, então não é na ferramenta que você fica para trás.',
          'O que uma grande empresa tem e você não tem não é uma ferramenta mais esperta. É um departamento de marketing: gente que opera tudo isso todo dia, em cima dos dados da própria empresa. Para a pequena empresa, o gargalo nunca foi a ferramenta ou a ideia. É a execução.',
          'Até agora, comprar essa execução pronta significava pagar preço de agência. Por isso a gente construiu o departamento, não mais uma ferramenta, num preço de pequena empresa.',
        ],
      },
      volume('Quanto marketing acontece de verdade?', 'a partir de R$3.000 por mês'),
      {
        type: 'bundle',
        title: 'O time inteiro, em um plano.',
        subtitle: 'Um time de marketing é design, SEO, conteúdo, anúncios, conversão e tecnologia. Aqui estão todos em um plano, um valor e um contato no WhatsApp.',
        chips: ['Site', 'SEO', 'SEO para IA', 'Conteúdo e vídeos', 'Google Ads', 'Meta Ads', 'Agentes de IA', 'Tecnologia e manutenção'],
        cards: [
          { icon: 'fas fa-users', title: 'Todas as funções, sem seis salários', desc: 'Contratar SEO, gestor de tráfego, redator e designer separados passa fácil de dez mil por mês. Aqui o time inteiro cabe numa mensalidade.' },
          { icon: 'fas fa-database', title: 'Nos seus dados, não na média', desc: 'A IA trabalha no seu site, seus clientes e seu mercado. Nada de conteúdo genérico que poderia ser do concorrente.' },
          { icon: 'fab fa-whatsapp', title: 'Você manda mensagem, a gente faz', desc: 'Sem painel para aprender. Por texto ou áudio, como falar com o seu próprio time.' },
        ],
      },
      marketCosts,
      { type: 'cases', title: 'Pequenas empresas, números reais.', subtitle: 'Não é teoria. São empresas como a sua.' },
      { type: 'faq', title: 'Sobre marketing para pequenas empresas.', items: [
        { q: 'Minha empresa é muito pequena para isso?', a: 'O plano Starter foi feito justamente para quem está começando: site, domínio, e-mail e a base digital rodando por R$97 por mês.' },
        { q: 'Preciso entender de marketing?', a: 'Não. Você conhece seu negócio, a gente traduz isso em marketing. Suas decisões são sobre o negócio, não sobre ferramenta.' },
        { q: 'E se eu não tiver tempo nem para aprovar?', a: 'Você pode deixar no automático. A gente segue a estratégia combinada e te mostra o que mudou.' },
      ] },
    ],
  },
  {
    slug: 'marketing-para-b2b',
    group: 'segmento',
    navLabel: 'Empresas B2B',
    navDesc: 'Marketing para vendas com orçamento e vários decisores',
    metaTitle: 'Marketing para empresas B2B que vendem por orçamento | Tuliu',
    metaDescription: 'Marketing B2B que acompanha a decisão inteira: uma página por serviço, formulário de orçamento, conteúdo para cada decisor e leads mensuráveis.',
    hero: {
      eyebrow: 'Para empresas B2B',
      title: 'Um sim não basta.',
      highlight: 'Precisam ser três.',
      subtitle: 'Você não vende por tabela de preço. Tem pedido, orçamento, reunião e depois algumas pessoas dentro da empresa que precisam concordar. Marketing que para no primeiro clique nunca chega nos outros dois. O nosso continua rodando enquanto a decisão demorar.',
      ticker: {
        title: 'Máquina B2B, ao vivo',
        items: ['Página nova · /servico-especifico', 'Formulário encurtado · 7 para 4 campos', 'Lance +14% · termo com intenção', 'Case publicado · seu setor', 'Artigo · quanto custa, como funciona', 'Remarketing · decisor que voltou'],
      },
    },
    blocks: [
      {
        type: 'prose',
        title: 'Nada fecha no primeiro dia. Esse é o trabalho.',
        paragraphs: [
          'Alguém encontra você, lê um pouco e sai sem fazer nada. Seis semanas depois volta, dessa vez com um colega, e só então o pedido de orçamento chega. É nesse intervalo que a maioria do marketing desiste em silêncio.',
          'Então a gente constrói para o intervalo inteiro. Uma página por serviço, para cada busca cair num lugar específico. Um formulário curto o bastante para ser usado. E conteúdo que responde o que o segundo e o terceiro leitor querem saber: quanto custa mais ou menos, como funciona, o que acontece se der errado.',
        ],
      },
      {
        type: 'features',
        title: 'O que a gente faz por uma empresa B2B.',
        subtitle: 'Quatro coisas, e elas se conectam.',
        items: [
          { icon: 'fas fa-file-signature', title: 'Uma página por serviço, com orçamento', desc: 'Cada serviço ganha a própria página e o próprio formulário. Ninguém precisa descobrir em qual dos seus seis serviços a dúvida se encaixa.' },
          { icon: 'fas fa-people-group', title: 'Escrito para mais de um leitor', desc: 'Quem pesquisa raramente é quem assina. As páginas respondem também o que o gestor e o comprador perguntam.' },
          { icon: 'fas fa-repeat', title: 'Algo rodando toda semana', desc: 'Uma página, um texto, um anúncio. Decisão que leva meses não se ganha com uma campanha, se ganha estando presente na semana nove.' },
          { icon: 'fas fa-chart-column', title: 'Pedidos que você consegue contar', desc: 'Cada pedido cai no seu e-mail e nos números, por serviço e por origem. Você sabe quanto custa um lead.' },
        ],
      },
      { type: 'cases', title: 'Empresas B2B, pedidos reais.', subtitle: 'Operações que dependem de orçamento e relacionamento.', ids: ['scienco-dairy-tech', 'poliforte'] },
      { type: 'faq', title: 'Sobre marketing para B2B.', items: [
        { q: 'Não podemos colocar preço no site.', a: 'Não precisa, e geralmente atrapalha tentar. Uma faixa de preço, um ponto de partida ou um exemplo de projeto parecido já mantém a pessoa lendo. Nada é o que faz ela ir embora.' },
        { q: 'Nosso ciclo de venda é de seis meses. Dá pra medir?', a: 'A gente mede o pedido, não a assinatura, porque é a parte que o marketing controla. Registramos de onde veio cada pedido, então meses depois você ainda sabe qual página trouxe o negócio.' },
        { q: 'Nosso mercado é pequeno.', a: 'Mercado pequeno pede precisão, não volume. Menos palavras, mais específicas, e conteúdo que fala com quem decide.' },
      ] },
    ],
  },
  {
    slug: 'marketing-para-saude',
    group: 'segmento',
    navLabel: 'Clínicas e saúde',
    navDesc: 'Pacientes chegando sem você virar influenciador',
    metaTitle: 'Marketing para clínicas, laboratórios e saúde | Tuliu',
    metaDescription: 'Site, conteúdo, Google Ads e agendamento com IA para clínicas e laboratórios, dentro das regras do seu conselho. A partir de R$97/mês.',
    hero: {
      eyebrow: 'Para clínicas e saúde',
      title: 'Agenda cheia,',
      highlight: 'sem você virar influenciador.',
      subtitle: 'Você estudou para cuidar de pessoas, não para editar Reels. A Tuliu cuida do site, do conteúdo, dos anúncios e do atendimento automático, respeitando as regras do seu conselho, para os pacientes encontrarem você.',
      ticker: {
        title: 'Clínica em movimento',
        items: ['Consulta agendada · agente de IA', 'Página de exame criada', 'Carrossel educativo publicado', 'Anúncio local ajustado · bairro', 'Avaliação do Google respondida', 'Lembrete enviado · paciente'],
      },
    },
    blocks: [
      {
        type: 'features',
        title: 'O que a Tuliu faz por uma clínica.',
        items: [
          { icon: 'fas fa-location-dot', title: 'Aparecer na sua região', desc: 'Google Meu Negócio, páginas por especialidade e anúncios locais para quem busca perto de você.' },
          { icon: 'fas fa-book-medical', title: 'Conteúdo educativo', desc: 'Posts e vídeos que geram confiança, revisados para respeitar as normas do seu conselho.' },
          { icon: 'fas fa-calendar-check', title: 'Agendamento automático', desc: 'Agente de IA que responde no WhatsApp e marca consulta direto na agenda.' },
          { icon: 'fas fa-laptop-medical', title: 'Processos digitais', desc: 'Requisições, orçamentos e formulários online no lugar do papel.' },
        ],
      },
      { type: 'cases', title: 'Saúde rodando com a Tuliu.', subtitle: 'Laboratórios e clínicas que modernizaram a operação.', ids: ['procardiaco', 'vital-brasil'] },
      { type: 'faq', title: 'Sobre marketing para saúde.', items: [
        { q: 'Vocês respeitam as regras do CFM, CFO e outros conselhos?', a: 'Sim. O conteúdo é educativo, sem promessa de resultado e sem antes e depois proibido. Você aprova o que quiser antes de publicar.' },
        { q: 'O agente de IA pode dar orientação médica?', a: 'Não. Ele responde dúvidas administrativas, valores, horários e agenda. Qualquer questão clínica vai para a sua equipe.' },
      ] },
    ],
  },
  {
    slug: 'marketing-para-prestadores-de-servico',
    group: 'segmento',
    navLabel: 'Prestadores de serviço',
    navDesc: 'Mais pedidos de orçamento, menos tempo no celular',
    metaTitle: 'Marketing para prestadores de serviço e empresas locais | Tuliu',
    metaDescription: 'Site com orçamento por serviço, Google Ads local e atendimento automático no WhatsApp para prestadores de serviço. A partir de R$97/mês.',
    hero: {
      eyebrow: 'Para prestadores de serviço',
      title: 'Mais pedidos de orçamento,',
      highlight: 'menos tempo no celular.',
      subtitle: 'Quem precisa do seu serviço busca no Google, compara três empresas e chama a que responde primeiro. A Tuliu faz você aparecer, convencer e responder na hora.',
      ticker: {
        title: 'Pedidos chegando',
        items: ['Orçamento recebido · página de serviço', 'Lead respondido em 15s · WhatsApp', 'Página por bairro criada', 'Anúncio local ajustado', 'Avaliação nova destacada no site', 'Fotos de obra publicadas'],
      },
    },
    blocks: [
      {
        type: 'features',
        title: 'Feito para quem vive de orçamento.',
        items: [
          { icon: 'fas fa-file-invoice-dollar', title: 'Uma página por serviço', desc: 'Cada serviço com sua página, fotos, perguntas frequentes e botão de orçamento.' },
          { icon: 'fas fa-map-location-dot', title: 'Anúncios na sua região', desc: 'Google Ads e Meta Ads só para quem está na área que você atende.' },
          { icon: 'fas fa-bolt', title: 'Resposta na hora', desc: 'Agente de IA atende no WhatsApp, coleta as informações e te passa o orçamento pronto pra fechar.' },
          { icon: 'fas fa-star', title: 'Prova social', desc: 'Avaliações e fotos de trabalhos reais trabalhando a seu favor no site e nas redes.' },
        ],
      },
      volume(),
      { type: 'cases', title: 'Quem já está crescendo.', subtitle: 'Empresas reais com operação digital rodando.' },
      { type: 'faq', title: 'Sobre marketing para prestadores de serviço.', items: [
        { q: 'Atendo só a minha cidade. Funciona?', a: 'Funciona melhor ainda. Marketing local é mais barato e mais preciso: menos concorrência, cliente mais perto.' },
        { q: 'Não tenho fotos dos meus trabalhos.', a: 'A gente orienta como fotografar com o celular e trata as imagens. Enquanto isso, o site sai com o que você já tem.' },
      ] },
    ],
  },

  /* ---------------- SOBRE ---------------- */
  {
    slug: 'sobre',
    group: 'sobre',
    navLabel: 'Sobre a Tuliu',
    navDesc: 'A agência, repensada',
    metaTitle: 'Sobre a Tuliu | A agência de marketing, repensada com IA',
    metaDescription: 'A Tuliu construiu uma operação de marketing com IA que faz o trabalho de uma agência tradicional. Mais rápida, melhor e por uma fração do preço.',
    hero: {
      eyebrow: 'Sobre a Tuliu',
      title: 'A agência,',
      highlight: 'repensada.',
      subtitle: 'A gente construiu uma operação de marketing com IA que assume o trabalho de uma agência tradicional. Mais rápida, melhor e por uma fração do preço. A IA roda a máquina. Os especialistas mantêm ela afiada.',
    },
    blocks: [
      {
        type: 'origin',
        eyebrow: 'Por que Tuliu',
        title: 'Novos elementos para um novo momento.',
        element: { number: 69, symbol: 'Tm', name: 'Túlio', mass: '168,934', family: 'Terras raras' },
        paragraphs: [
          'O nome Tuliu vem do túlio, thulium em inglês: o elemento 69 da tabela periódica. Ele faz parte das terras raras, um grupo de 17 elementos que quase ninguém conhece pelo nome, mas que está dentro de quase toda tecnologia que mudou o mundo nas últimas décadas. Celular, fibra ótica, motor elétrico, laser de cirurgia.',
          'O próprio túlio ganhou esse nome por causa de Thule, como os antigos chamavam a terra mais distante do mapa. O ponto onde o mundo conhecido terminava e começava o que ainda não tinha nome.',
          'É desse lugar que a Tuliu nasce. A IA mudou o jeito de fazer marketing e o manual antigo não dá mais conta. Um momento novo pede elementos novos: tecnologia, dados e especialistas combinados numa operação que antes não existia.',
          'E assim como você não precisa entender de terras raras para usar um celular, também não precisa entender de IA para ter um marketing que funciona. A tecnologia fica nos bastidores. Você assume o marketing do seu negócio e cresce sem cair no operacional.',
        ],
        pillars: [
          { title: 'Novos elementos', desc: 'IA, dados e gente experiente trabalhando juntos, como uma liga que fica mais forte do que cada parte sozinha.' },
          { title: 'Novas tecnologias', desc: 'Cada avanço que vale a pena entra na operação. Você não precisa acompanhar nenhum deles para se beneficiar.' },
          { title: 'Uma nova era', desc: 'Pequenas e médias empresas com acesso ao que antes só uma grande empresa conseguia pagar.' },
        ],
      },
      {
        type: 'prose',
        title: 'A agência tradicional é o manual de ontem.',
        paragraphs: [
          'Ferramentas de fazer sozinho te dão o controle, mas também a responsabilidade. Na agência, você paga por hora. Na Tuliu, a experiência fica no comando, junto com uma tecnologia que acelera o trabalho.',
          'Desde 2020 a Tuliu já entregou mais de 100 projetos digitais. Hoje a operação inteira gira em volta da IA, para entregar a pequenas e médias empresas o que antes só uma grande empresa conseguia pagar.',
        ],
      },
      {
        type: 'features',
        title: 'No que a gente acredita.',
        items: [
          { icon: 'fas fa-users', title: 'Time grande, preço pequeno', desc: 'SEO, conteúdo, design, análise de dados, tráfego e testes. O trabalho de um departamento inteiro, em uma assinatura.' },
          { icon: 'fas fa-microchip', title: 'Feito para IA desde o início', desc: 'Não são ferramentas antigas com IA colada depois. A operação foi construída para absorver cada avanço novo.' },
          { icon: 'fas fa-chart-simple', title: 'Dados, não achismo', desc: 'Cada melhoria vem de números reais: comportamento, posições de busca, taxa de conversão.' },
          { icon: 'fas fa-arrows-rotate', title: 'Melhor todo mês, não uma vez', desc: 'A agência tradicional entrega e acabou. A gente continua trabalhando no seu marketing mesmo quando você não pede nada.' },
        ],
      },
      { type: 'expert', title: 'A IA faz o trabalho. O time mantém afiado.', quote: expertQuote },
      { type: 'cases', title: 'Quem confia na Tuliu.', subtitle: 'Alguns dos negócios que operam com a gente.' },
    ],
  },
];

export const landingBySlug: Record<string, Landing> = Object.fromEntries(landings.map((l) => [l.slug, l]));

export const landingGroups: { group: Landing['group']; label: string; title: string; desc: string; link: { label: string; href: string } }[] = [
  { group: 'servico', label: 'Serviços', title: 'Tudo que a máquina faz', desc: 'Site, SEO, conteúdo, tráfego e IA em uma só operação, com especialistas aprovando cada entrega.', link: { label: 'Ver a máquina completa', href: '/#maquina' } },
  { group: 'comparacao', label: 'Comparar', title: 'Tuliu vs o que você usa hoje', desc: 'Comparações honestas, linha a linha. Inclusive onde a outra opção ganha.', link: { label: 'Ver a tabela completa', href: '/#comparativo' } },
  { group: 'segmento', label: 'Para quem', title: 'O que fazemos no seu mercado', desc: 'A máquina é a mesma. A estratégia muda para cada tipo de negócio.', link: { label: 'Ver todos os resultados', href: '/cases' } },
];

export const navIcons: Record<string, string> = {
  'seo-feito-por-ia': 'fas fa-magnifying-glass-chart',
  'terceirizar-marketing': 'fas fa-people-arrows',
  'gestao-de-trafego-com-ia': 'fas fa-bullseye',
  'criar-site-com-ia': 'fas fa-laptop-code',
  'conteudo-com-ia': 'fas fa-photo-film',
  'identidade-de-marca': 'fas fa-gem',
  'agentes-de-ia': 'fas fa-robot',
  'alternativa-chatgpt': 'fas fa-comment-dots',
  'alternativa-agencia-de-marketing': 'fas fa-building',
  'alternativa-hostinger': 'fas fa-server',
  'alternativa-lovable': 'fas fa-heart',
  'alternativa-framer': 'fas fa-vector-square',
  'alternativa-wix': 'fas fa-cubes',
  'alternativa-wordpress': 'fab fa-wordpress-simple',
  'alternativa-canva': 'fas fa-palette',
  'marketing-para-pequenas-empresas': 'fas fa-store',
  'marketing-para-b2b': 'fas fa-handshake',
  'marketing-para-saude': 'fas fa-stethoscope',
  'marketing-para-prestadores-de-servico': 'fas fa-screwdriver-wrench',
  sobre: 'fas fa-circle-info',
};
