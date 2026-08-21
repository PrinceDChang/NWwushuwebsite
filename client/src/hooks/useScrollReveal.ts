import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const REVEAL_CHILD_SELECTOR = [
  '.feature',
  '.card',
  '.coach-card',
  '.program-card',
  '.class-card',
  '.confirm-card',
  '.home-split',
  '.form-grid',
  '.trial-booking',
  '.instagram-grid > li',
  '.faq-section details',
  '.location-tabs',
  '.coach-ticker',
  '.programs-showcase__header',
  '[data-programs-reveal]',
].join(', ');

function collectRevealElements(root: HTMLElement): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  const elements: HTMLElement[] = [];

  const add = (el: HTMLElement | null) => {
    if (!el || seen.has(el)) return;
    // Calendar hero has its own entrance animation.
    if (el.classList.contains('page-hero--schedule-calendar')) return;
    if (el.closest('.page-hero--schedule-calendar')) return;
    seen.add(el);
    elements.push(el);
  };

  Array.from(root.children).forEach((child) => {
    if (!(child instanceof HTMLElement)) return;
    add(child);
    child.querySelectorAll(REVEAL_CHILD_SELECTOR).forEach((node) => {
      if (node instanceof HTMLElement) add(node);
    });
  });

  return elements;
}

/**
 * On each route change: scroll to top, then reveal page content
 * top-to-bottom as sections enter the viewport while scrolling.
 */
export function useScrollReveal(rootId = 'main') {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let observer: IntersectionObserver | null = null;
    let cancelled = false;
    const marked: HTMLElement[] = [];

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (cancelled) return;
        const root = document.getElementById(rootId);
        if (!root) return;

        const elements = collectRevealElements(root);

        elements.forEach((el) => {
          el.classList.add('scroll-reveal');
          el.classList.remove('scroll-reveal--visible');
          el.style.setProperty('--reveal-index', '0');
          marked.push(el);
        });

        if (reduceMotion) {
          elements.forEach((el) => el.classList.add('scroll-reveal--visible'));
          return;
        }

        observer = new IntersectionObserver(
          (entries) => {
            let batch = 0;
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const target = entry.target as HTMLElement;
              target.style.setProperty('--reveal-index', String(batch));
              batch += 1;
              void target.offsetWidth;
              target.classList.add('scroll-reveal--visible');
              if (target.hasAttribute('data-programs-reveal')) {
                target.classList.add('is-inview');
              }
              observer?.unobserve(target);
            });
          },
          {
            root: null,
            rootMargin: '0px 0px -6% 0px',
            threshold: 0.08,
          },
        );

        elements.forEach((el) => observer?.observe(el));
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      marked.forEach((el) => {
        el.classList.remove('scroll-reveal', 'scroll-reveal--visible');
        el.style.removeProperty('--reveal-index');
      });
    };
  }, [pathname, rootId]);
}
