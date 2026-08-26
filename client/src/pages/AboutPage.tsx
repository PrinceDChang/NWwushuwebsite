import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CoachFeatureTicker from '../components/CoachFeatureTicker';
import CTABand from '../components/CTABand';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import WushuAspectsCarousel from '../components/WushuAspectsCarousel';
import { coaches } from '../data/coaches';
import { site } from '../data/site';
import { cx } from '../lib/cx';

const ABOUT_SECTIONS = [
  { id: 'what-is-wushu', label: 'Wushu' },
  { id: 'coaches', label: 'Coaches' },
  { id: 'programs', label: 'Programs' },
  { id: 'pricing', label: 'Pricing' },
] as const;

type AboutSectionId = (typeof ABOUT_SECTIONS)[number]['id'];

export default function AboutPage() {
  const programsRef = useRef<HTMLElement>(null);
  const subnavRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<AboutSectionId>('what-is-wushu');
  const [subnavStuck, setSubnavStuck] = useState(false);

  useEffect(() => {
    const nav = subnavRef.current;
    if (!nav) return;

    const updateStuck = () => {
      const header = document.querySelector('.site-header');
      const headerBottom = header instanceof HTMLElement ? header.getBoundingClientRect().bottom : 64;
      // Treat as stuck once the bar has docked under the header (Wushu and below).
      setSubnavStuck(nav.getBoundingClientRect().top <= headerBottom + 1);
    };

    updateStuck();
    window.addEventListener('scroll', updateStuck, { passive: true });
    window.addEventListener('resize', updateStuck);
    return () => {
      window.removeEventListener('scroll', updateStuck);
      window.removeEventListener('resize', updateStuck);
    };
  }, []);

  useEffect(() => {
    const sectionIds = ABOUT_SECTIONS.map((s) => s.id);

    const updateActive = () => {
      const header = document.querySelector('.site-header');
      const subnav = subnavRef.current;
      const headerH = header instanceof HTMLElement ? header.getBoundingClientRect().height : 64;
      const subnavH = subnav ? subnav.getBoundingClientRect().height : 0;
      const probe = headerH + subnavH + 12;

      let current: AboutSectionId = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) {
          current = id;
        }
      }
      setActiveSection((prev) => (prev === current ? prev : current));
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    window.addEventListener('hashchange', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
      window.removeEventListener('hashchange', updateActive);
    };
  }, []);

  useEffect(() => {
    const section = programsRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parallaxLayer = section.querySelector('[data-programs-parallax]');
    const revealEls = Array.from(section.querySelectorAll('[data-programs-reveal]'));

    if (!reduceMotion) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-inview');
              io.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12 },
      );
      revealEls.forEach((el) => io.observe(el));
      if (reduceMotion || !parallaxLayer) {
        return () => io.disconnect();
      }

      let raf = 0;
      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const rect = section.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          const total = rect.height + vh;
          const passed = vh - rect.top;
          const progress = Math.min(1, Math.max(0, passed / total));
          const maxShift = Math.max(140, rect.height * 0.28);
          const offset = maxShift - progress * 2 * maxShift;
          const img = parallaxLayer.querySelector('img');
          if (img) {
            img.style.transform = `translate3d(0, calc(-20% + ${offset}px), 0)`;
          }
        });
      };

      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      return () => {
        io.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        if (raf) cancelAnimationFrame(raf);
      };
    }

    revealEls.forEach((el) => el.classList.add('is-inview'));
    return undefined;
  }, []);

  return (
    <Layout title="About" description={`About ${site.name}`}>
      <PageHero
        title="About Northwest Wushu"
        subtitle="Seattle's home for traditional Chinese martial arts since 2008."
        variant="image"
        imageSrc="/images/about-group-outdoor.jpg"
        imagePosition="center 60%"
        heroScale={1.2}
      />

      <nav
        ref={subnavRef}
        className={cx('about-subnav', subnavStuck && 'about-subnav--stuck')}
        aria-label="About sections"
      >
        <div className="container">
          {ABOUT_SECTIONS.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={cx(isActive && 'about-subnav__link--active')}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => setActiveSection(id)}
              >
                {label}
              </a>
            );
          })}
        </div>
      </nav>

      <section className="section" id="what-is-wushu">
        <WushuAspectsCarousel />
      </section>

      <section className="section coaches-banner" id="coaches" aria-labelledby="coaches-heading">
        <div className="container">
          <h2 id="coaches-heading" className="coaches-banner__title">
            Coaches
          </h2>
        </div>
      </section>

      <section className="section">
        <CoachFeatureTicker />

        <div className="container coach-grid">
          {coaches.map((coach) => (
            <article
              key={coach.name}
              className={cx('coach-card', coach.comingSoon && 'coach-card--coming-soon')}
            >
              {coach.comingSoon ? (
                <div className="coach-card__media coach-card__media--placeholder">
                  <div aria-hidden="true">
                    <svg
                      className="coach-card__silhouette"
                      viewBox="0 0 120 160"
                      preserveAspectRatio="xMidYMax meet"
                      focusable="false"
                    >
                      <defs>
                        <linearGradient id="coach-placeholder-gradient" x1="15%" y1="0%" x2="85%" y2="100%">
                          <stop offset="0%" stopColor="#e59a4d" />
                          <stop offset="50%" stopColor="#d04a45" />
                          <stop offset="100%" stopColor="#b91514" />
                        </linearGradient>
                      </defs>
                      <circle cx="60" cy="36" r="18" fill="url(#coach-placeholder-gradient)" />
                      <path
                        d="M60 56c-20 0-36 14-40 36v68h80V92c-4-22-20-36-40-36z"
                        fill="url(#coach-placeholder-gradient)"
                      />
                    </svg>
                  </div>
                  <span className="coach-card__placeholder-label">Coming Soon</span>
                </div>
              ) : (
                coach.image && (
                  <div className="coach-card__media">
                    <img
                      src={coach.image}
                      alt={coach.name}
                      width={600}
                      height={400}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )
              )}
              <div className="coach-card__body">
                {coach.role && <p className="coach-role-label">{coach.role}</p>}
                <h3 className="coach-card__name">{coach.name}</h3>
                <p>{coach.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        ref={programsRef}
        className="programs-showcase"
        id="programs"
        aria-labelledby="programs-heading"
      >
        <svg className="programs-showcase__defs" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id="programs-photo-arc" clipPathUnits="objectBoundingBox">
              <path d="M0,0 H1 V0.76 Q0.5,1 0,0.76 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="programs-showcase__bg" aria-hidden="true">
          <div className="programs-showcase__media-clip">
            <div className="programs-showcase__bg-parallax" data-programs-parallax>
              <img src="/images/programs-group.png" alt="" width={1600} height={900} loading="lazy" decoding="async" />
            </div>
            <div className="programs-showcase__overlay"></div>
          </div>
          <div className="programs-showcase__white-floor"></div>
        </div>

        <div className="container programs-showcase__inner">
          <header className="programs-showcase__header" data-programs-reveal>
            <h2 id="programs-heading" className="programs-showcase__title">
              Our Programs
            </h2>
            <p className="programs-showcase__lead">
              Training for kids, teens, and adults at Northwest Wushu — from first steps in wushu to forms, weapons,
              and competition-ready conditioning.
            </p>
          </header>

          <div className="programs-showcase__cards">
            <article className="program-card" data-programs-reveal>
              <img
                src="/images/class-kids.jpg"
                alt="Kids wushu class practicing together on red mats"
                width={600}
                height={400}
                loading="lazy"
              />
              <h3>Kids Class</h3>
              <p>
                Saturday 10:00–11:00 AM · Ages 6–12. Foundations, coordination, and confidence in a supportive group
                setting.
              </p>
              <Link to="/trial/?class=kids" className="btn btn--primary btn--small">
                Sign up for free trial
              </Link>
            </article>

            <article className="program-card" data-programs-reveal>
              <img
                src="/images/class-teens-adults.jpg"
                alt="Teen and adult class stretching on the training floor"
                width={600}
                height={400}
                loading="lazy"
              />
              <h3>Teen &amp; Adult</h3>
              <p>
                Saturday 11:00 AM–1:00 PM · Ages 13+. Forms, weapons, and conditioning for beginners through experienced
                athletes.
              </p>
              <Link to="/trial/?class=adult" className="btn btn--primary btn--small">
                Sign up for free trial
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section
        className="section section--alt programs-pricing"
        id="pricing"
        aria-labelledby="pricing-heading"
      >
        <div className="container container--narrow programs-pricing__inner">
          <h2 id="pricing-heading" className="section__title">
            Class Pricing
          </h2>
          <p className="programs-pricing__lead">
            After your free trial, continue with drop-in classes or a quarterly package.
          </p>
          <ul className="programs-pricing__rates">
            <li>
              <span className="programs-pricing__amount">$30</span>
              <span className="programs-pricing__label">per class</span>
            </li>
            <li>
              <span className="programs-pricing__amount">$300</span>
              <span className="programs-pricing__label">per quarter (10 classes)</span>
            </li>
          </ul>
        </div>
      </section>

      <CTABand />
    </Layout>
  );
}
