import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CTABand from '../components/CTABand';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import { site } from '../data/site';
import { cx } from '../lib/cx';

const locations = [site.locations.regular, site.locations.summer];
type LocationId = (typeof locations)[number]['id'];

function isLocationId(value: string): value is LocationId {
  return locations.some((item) => item.id === value);
}

export default function LocationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromHash = location.hash.replace('#', '');
  const initial: LocationId = isLocationId(fromHash) ? fromHash : 'regular';
  const [activeId, setActiveId] = useState<LocationId>(initial);
  const active = useMemo(
    () => locations.find((item) => item.id === activeId) ?? locations[0],
    [activeId],
  );

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (isLocationId(hash)) setActiveId(hash);
    else if (!hash) setActiveId('regular');
  }, [location.hash]);

  function setLocation(id: LocationId, updateHash = true) {
    setActiveId(id);
    if (!updateHash) return;
    navigate({ pathname: '/location/', hash: id === 'regular' ? '' : id }, { replace: true });
  }

  return (
    <Layout title="Location">
      <PageHero
        key={active.id}
        title="Location"
        subtitle={active.full}
        subtitleId="location-hero-address"
        variant="image"
        imageSrc={active.heroImageSrc}
        imageAlt={active.heroImageAlt}
        imagePosition={active.heroImagePosition}
        imageParallax
        heroScale={1.25}
      >
        <p className="location-hero-season" id="location-hero-season" hidden={!active.season}>
          <em>June – September</em>
        </p>
      </PageHero>

      <nav className="location-tabs" aria-label="Training locations">
        <div
          className="container location-tabs__inner"
          role="tablist"
          aria-label="Regular or summer location"
          onKeyDown={(event) => {
            const tabs = locations.map((item) => item.id);
            const current = tabs.indexOf(activeId);
            if (current < 0) return;
            let next = current;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % tabs.length;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = tabs.length - 1;
            if (next === current) return;
            event.preventDefault();
            setLocation(tabs[next]);
            window.requestAnimationFrame(() => {
              document.getElementById(`location-tab-${tabs[next]}`)?.focus();
            });
          }}
        >
          {locations.map((item) => {
            const selected = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                className="location-tabs__tab"
                role="tab"
                id={`location-tab-${item.id}`}
                aria-controls={`location-panel-${item.id}`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                data-location={item.id}
                onClick={() => setLocation(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {locations.map((item) => {
        const isActive = item.id === activeId;
        return (
          <div
            key={item.id}
            className={cx('location-panel', isActive && 'location-panel--active')}
            id={`location-panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`location-tab-${item.id}`}
            hidden={!isActive}
          >
            <section className="section">
              <div className="container">
                <div className="map-wrap">
                  <iframe
                    title={item.mapsTitle}
                    src={item.mapsEmbed}
                    width="100%"
                    height={400}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </section>

            <section className="section section--alt">
              <div className="container">
                <h2 className="section__title">{item.spaceTitle}</h2>
                <div className="location-split">
                  <div className="location-split__media">
                    <img src={item.imageSrc} alt={item.imageAlt} width={800} height={600} loading="lazy" />
                  </div>
                  <ul className="location-tips">
                    {item.tips.map((tip) => {
                      const logos = 'logos' in tip ? tip.logos : [];
                      return (
                        <li key={tip.title}>
                          <strong>{tip.title}</strong>
                          {logos.length > 0 ? (
                            <>
                              <span className="location-tips__logos" aria-label="Transit services">
                                {logos.map((logo) => (
                                  <img
                                    key={logo.src}
                                    className="location-tips__logo"
                                    src={logo.src}
                                    alt={logo.alt}
                                    width={120}
                                    height={28}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                ))}
                              </span>
                              <p className="location-tips__text">{tip.text}</p>
                            </>
                          ) : (
                            <> — {tip.text}</>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        );
      })}

      <CTABand />
    </Layout>
  );
}
