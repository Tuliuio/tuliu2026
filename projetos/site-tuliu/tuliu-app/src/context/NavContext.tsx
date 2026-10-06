import { createContext, useContext } from 'react';
import type { MouseEvent } from 'react';

// Navegação interna da SPA por caminho ("/seo-feito-por-ia", "/#precos", "/cases").
export const NavContext = createContext<(href: string) => void>(() => {});

export function useGo() {
  return useContext(NavContext);
}

// Props para um <a> que navega pela SPA sem recarregar, mas mantém o href real (SEO e abrir em nova aba).
export function useLinkProps() {
  const go = useGo();
  return (href: string) => ({
    href,
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      go(href);
    },
  });
}
