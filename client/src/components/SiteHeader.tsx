import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { site } from '../data/site';
import { cx } from '../lib/cx';

const aboutLinks = [
  { href: '/about/#what-is-wushu', label: 'About Wushu' },
  { href: '/about/#coaches', label: 'Coaches' },
  { href: '/about/#programs', label: 'Programs' },
  { href: '/about/#pricing', label: 'Pricing' },
] as const;

const primaryNav = [
  { href: '/', label: 'Home', end: true },
  { href: '/schedule/', label: 'Schedule' },
  { href: '/location/', label: 'Location' },
  { href: '/faq/', label: 'FAQ' },
] as const;

export default function SiteHeader() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const menuId = useId();
  const aboutMenuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

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
    setAboutOpen(false);
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

  useEffect(() => {
    if (!aboutOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setAboutOpen(false);
      }
    };

    const onPointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (aboutRef.current?.contains(target)) return;
      setAboutOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
    };
  }, [aboutOpen]);

  const isActive = (href: string, end = false) => {
    if (end) return pathname === '/' || pathname === '';
    const base = href.replace(/\/$/, '');
    return pathname === href || pathname === base || pathname.startsWith(`${base}/`);
  };

  const aboutActive = isActive('/about/');
  const contactActive = isActive('/contact/');

  const renderNavLink = (item: (typeof primaryNav)[number]) => (
    <NavLink
      key={item.href}
      to={item.href}
      end={'end' in item ? item.end : false}
      className={cx('site-header__link', isActive(item.href, 'end' in item && item.end) && 'site-header__link--active')}
      aria-current={isActive(item.href, 'end' in item && item.end) ? 'page' : undefined}
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

        <Link to="/" className="site-header__logo" aria-label={`${site.name} home`}>
          <img src="/images/logo.png" alt="" width={44} height={44} />
        </Link>

        <nav className="site-header__nav" aria-label="Primary">
          {renderNavLink(primaryNav[0])}

          <div
            ref={aboutRef}
            className={cx('site-header__dropdown', aboutOpen && 'site-header__dropdown--open')}
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <NavLink
              to="/about/"
              className={cx('site-header__link', aboutActive && 'site-header__link--active')}
              aria-current={aboutActive ? 'page' : undefined}
              aria-haspopup="menu"
              aria-expanded={aboutOpen}
              aria-controls={aboutMenuId}
              onFocus={() => setAboutOpen(true)}
              onClick={() => setMenuOpen(false)}
            >
              About
            </NavLink>
            <ul id={aboutMenuId} className="site-header__dropdown-menu" role="menu">
              {aboutLinks.map((item) => (
                <li key={item.href} role="none">
                  <Link
                    to={item.href}
                    className="site-header__dropdown-link"
                    role="menuitem"
                    onClick={() => {
                      setAboutOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {primaryNav.slice(1).map(renderNavLink)}
        </nav>

        <div className="site-header__right">
          <NavLink
            to="/contact/"
            className="site-header__contact btn btn--primary btn--small"
            aria-current={contactActive ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>
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
        <div className="container site-header__panel-inner">
          {renderNavLink(primaryNav[0])}
          <div className="site-header__panel-group">
            <NavLink
              to="/about/"
              className={cx('site-header__link', aboutActive && 'site-header__link--active')}
              aria-current={aboutActive ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              About
            </NavLink>
            <div className="site-header__panel-sub">
              {aboutLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="site-header__panel-sublink"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {primaryNav.slice(1).map(renderNavLink)}
          <NavLink
            to="/contact/"
            className={cx('site-header__link', contactActive && 'site-header__link--active')}
            aria-current={contactActive ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
