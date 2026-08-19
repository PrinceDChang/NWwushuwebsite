import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { cx } from '../lib/cx';

type PageHeroProps = {
  title: string;
  subtitle?: string;
  subtitleId?: string;
  variant?: 'default' | 'image';
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: string;
  imageParallax?: boolean;
  heroScale?: number;
  children?: ReactNode;
};

export default function PageHero({
  title,
  subtitle,
  subtitleId,
  variant = 'default',
  imageSrc,
  imageAlt = '',
  imagePosition = 'center',
  imageParallax = false,
  heroScale = 1,
  children,
}: PageHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const useImageBg = variant === 'image' && Boolean(imageSrc);
  const useParallaxImage = useImageBg && imageParallax;
  const useStaticImage = useImageBg && !imageParallax;

  useEffect(() => {
    if (!useParallaxImage) return;
    const hero = heroRef.current;
    if (!hero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parallaxLayer = hero.querySelector('[data-page-hero-parallax]');
    if (reduceMotion || !parallaxLayer) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = hero.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const total = rect.height + vh;
        const passed = vh - rect.top;
        const progress = Math.min(1, Math.max(0, passed / total));
        const maxShift = Math.max(100, rect.height * 0.22);
        const offset = maxShift - progress * 2 * maxShift;
        const img = parallaxLayer.querySelector('img');
        if (img) {
          img.style.transform = `translate3d(0, calc(5% + ${offset}px), 0)`;
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [useParallaxImage]);

  return (
    <section
      ref={heroRef}
      className={cx(
        'page-hero',
        variant === 'image' && 'page-hero--image',
        useImageBg && 'page-hero--has-bg',
        useParallaxImage && 'page-hero--parallax',
      )}
      style={heroScale !== 1 ? ({ '--page-hero-scale': heroScale } as CSSProperties) : undefined}
    >
      {useStaticImage && (
        <div className="page-hero__bg" aria-hidden="true">
          <img
            className="page-hero__bg-img"
            src={imageSrc}
            alt={imageAlt}
            width={1600}
            height={900}
            loading="eager"
            decoding="async"
            style={{ objectPosition: imagePosition }}
          />
          <div className="page-hero__overlay page-hero__overlay--static"></div>
        </div>
      )}
      {useParallaxImage && (
        <div className="page-hero__bg" aria-hidden="true">
          <div className="page-hero__media-clip">
            <div className="page-hero__parallax" data-page-hero-parallax>
              <img
                src={imageSrc}
                alt={imageAlt}
                width={1600}
                height={900}
                loading="eager"
                decoding="async"
                style={{ objectPosition: imagePosition }}
              />
            </div>
            <div className="page-hero__overlay"></div>
          </div>
        </div>
      )}

      <div className="container page-hero__content">
        <h1 className={variant === 'default' ? 'hero-title' : 'page-hero__title-image'}>{title}</h1>
        {subtitle && (
          <p className="page-hero__subtitle" id={subtitleId}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
