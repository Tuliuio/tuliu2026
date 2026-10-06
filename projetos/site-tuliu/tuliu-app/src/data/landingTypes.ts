export type Cell = 'yes' | 'partly' | 'no';

export type LandingGroup = 'servico' | 'comparacao' | 'segmento' | 'sobre';

export interface IconCard {
  icon: string;
  title: string;
  desc: string;
}

export type Block =
  | { type: 'machine'; title: string; subtitle: string; sources: string[]; questions: { title: string; q: string }[]; improvements: { title: string; desc: string }[] }
  | { type: 'volume'; title: string; subtitle: string; options: { label: string; level: number; price: string; desc: string; recommended?: boolean }[] }
  | { type: 'reasons'; title: string; subtitle?: string; items: { title: string; desc: string }[]; aside?: { title: string; text: string } }
  | { type: 'bundle'; title: string; subtitle: string; chips: string[]; cards: IconCard[] }
  | { type: 'costs'; title: string; subtitle: string; items: { title: string; tag: string; desc: string }[]; summary?: string }
  | { type: 'table'; title: string; subtitle: string; columns: string[]; rows: { label: string; values: Cell[] }[] }
  | { type: 'when'; title: string; paragraphs: string[]; links?: { label: string; href: string }[] }
  | { type: 'steps'; title: string; items: { title: string; desc: string }[] }
  | { type: 'expert'; title: string; quote: string }
  | { type: 'cases'; title: string; subtitle: string; ids?: string[] }
  | { type: 'prose'; title: string; paragraphs: string[]; link?: { label: string; href: string } }
  | { type: 'features'; title: string; subtitle?: string; items: IconCard[] }
  | { type: 'needs'; title: string; subtitle: string; items: { title: string; tag: string; desc: string }[]; summary: string }
  | { type: 'related'; title: string; subtitle?: string; hrefs: string[] }
  | { type: 'faq'; title: string; items: { q: string; a: string }[] };

export interface Landing {
  slug: string;
  group: LandingGroup;
  navLabel: string;
  navDesc: string;
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    highlight?: string;
    subtitle: string;
    ticker?: { title: string; items: string[] };
  };
  blocks: Block[];
}
