import { createContext } from 'react';

export const PRICE_FROM = 'R$97/mês';

// Preço de entrada da página atual (SEO começa no Business, por exemplo)
export const PriceContext = createContext(PRICE_FROM);
