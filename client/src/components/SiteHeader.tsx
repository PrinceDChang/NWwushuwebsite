import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { site, trialBanner } from '../data/site';
import { cx } from '../lib/cx';

const nav = [
  { href: '/about/', label: 'About' },
  { href: '/schedule/', label: 'Schedule' },
  { href: '/location/', label: 'Location' },
  { href: '/contact/', label: 'Contact' },
];

export default function SiteHeader() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;

    const threshold = 24;
    let ticking = false;

    const update = () => {
      ticking = false;
      header.classList.toggle('site-header--scrolled', window.scrollY > threshold);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    const onPointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setMenuOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    const base = href.replace(/\/$/, '');
    return pathname === href || pathname === base || pathname.startsWith(`${base}/`);
  };

  const renderLink = (item: (typeof nav)[number]) => (
    <NavLink
      key={item.href}
      to={item.href}
      className={cx('site-header__link', isActive(item.href) && 'site-header__link--active')}
      aria-current={isActive(item.href) ? 'page' : undefined}
      onClick={() => setMenuOpen(false)}
    >
      {item.label}
    </NavLink>
  );

  return (
    <header className={cx('site-header', menuOpen && 'site-header--menu-open')} data-site-header>
      <div className="site-header__shape" aria-hidden="true">
        <div className="site-header__ambient"></div>
        <div className="site-header__shape-line"></div>
      </div>

      <div className="container site-header__inner">
        <button
          ref={toggleRef}
          type="button"
          className="site-header__menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="site-header__menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav className="site-header__nav site-header__nav--left" aria-label="Primary left">
          {nav.slice(0, 2).map(renderLink)}
        </nav>

        <Link to="/" className="site-header__logo" aria-label={`${site.name} home`}>
          <img src="/images/logo.png" alt="" width={44} height={44} />
        </Link>

        <div className="site-header__right">
          <nav className="site-header__nav site-header__nav--right" aria-label="Primary right">
            {nav.slice(2).map(renderLink)}
          </nav>

          <Link
            to={trialBanner.href}
            className="site-header__trial btn btn--primary btn--small"
            title={trialBanner.text}
            onClick={() => setMenuOpen(false)}
          >
            {trialBanner.buttonText}
          </Link>
        </div>
      </div>

      <div
        className={cx('site-header__backdrop', menuOpen && 'site-header__backdrop--open')}
        aria-hidden="true"
      />

      <nav
        ref={panelRef}
        id={menuId}
        className={cx('site-header__panel', menuOpen && 'site-header__panel--open')}
        aria-label="Primary"
        hidden={!menuOpen}
      >
        <div className="container site-header__panel-inner">{nav.map(renderLink)}</div>
      </nav>
    </header>
  );
}
