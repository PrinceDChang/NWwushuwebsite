import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { site } from '../data/site';
import { cx } from '../lib/cx';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';
import StickyTrialCTA from './StickyTrialCTA';

type LayoutProps = {
  title: string;
  description?: string;
  showStickyCta?: boolean;
  bodyClass?: string;
  children: ReactNode;
};

export default function Layout({
  title,
  description = site.description,
  showStickyCta = true,
  bodyClass = '',
  children,
}: LayoutProps) {
  useScrollReveal();

  useEffect(() => {
    document.title = title === site.shortName ? title : `${title} | ${site.shortName}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
  }, [title, description]);

  useEffect(() => {
    document.body.className = cx(showStickyCta && 'has-sticky-cta', bodyClass);
    return () => {
      document.body.className = '';
    };
  }, [showStickyCta, bodyClass]);

  return (
    <>
      <div className="site-bg" aria-hidden="true">
        <div className="site-bg__ambient"></div>
        <div className="site-bg__glow site-bg__glow--1"></div>
        <div className="site-bg__glow site-bg__glow--2"></div>
        <div className="site-bg__glow site-bg__glow--3"></div>
        <div className="site-bg__glow site-bg__glow--4"></div>
        <div className="site-bg__grain"></div>
      </div>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      {showStickyCta && <StickyTrialCTA />}
    </>
  );
}
