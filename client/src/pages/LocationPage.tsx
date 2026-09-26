import CTABand from '../components/CTABand';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import { site } from '../data/site';

function mapsDirectionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

function MapsDirectionsLink({
  address,
  name,
  className,
}: {
  address: string;
  name: string;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={mapsDirectionsUrl(address)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Get directions to ${name}`}
    >
      Get directions
    </a>
  );
}

export default function LocationPage() {
  const { address, mapsEmbed, location } = site;

  return (
    <Layout title="Location">
      <PageHero
        title="Location"
        subtitle={address.full}
        subtitleId="location-hero-address"
        variant="image"
        imageSrc={location.heroImageSrc}
        imageAlt={location.heroImageAlt}
        imagePosition={location.heroImagePosition}
        imageParallax
        heroScale={1.25}
      >
        <p className="location-hero-place" id="location-hero-place">
          <em>{location.neighborhood}</em>
        </p>
        <p className="location-hero-directions">
          <MapsDirectionsLink
            address={address.full}
            name={address.name}
            className="location-hero-directions__link"
          />
        </p>
      </PageHero>

      <section className="section section--alt">
        <div className="container">
          <h2 className="section__title">{location.spaceTitle}</h2>
          <div className="location-split">
            <div className="location-split__media">
              <img src={location.imageSrc} alt={location.imageAlt} width={650} height={433} loading="lazy" />
            </div>
            <ul className="location-tips">
              {location.tips.map((tip) => {
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

      <section className="section">
        <div className="container">
          <div className="map-block">
            <p className="map-block__actions">
              <MapsDirectionsLink
                address={address.full}
                name={address.name}
                className="map-directions-link"
              />
            </p>
            <div className="map-wrap">
              <iframe
                title={location.mapsTitle}
                src={mapsEmbed}
                width="100%"
                height={400}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <CTABand />
    </Layout>
  );
}
