import { Link } from 'react-router-dom';
import CTABand from '../components/CTABand';
import FeatureIcon from '../components/FeatureIcon';
import InstagramSection from '../components/InstagramSection';
import Layout from '../components/Layout';
import { site } from '../data/site';

const heroVideoId = 'Q32L4Rx_040';
const heroVideoPoster = `https://i.ytimg.com/vi/${heroVideoId}/maxresdefault.jpg`;

export default function HomePage() {
  return (
    <Layout title={site.shortName}>
      <section className="home-hero">
        <div className="home-hero__video" aria-hidden="true">
          <video
            className="home-hero__media"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroVideoPoster}
          >
            <source src="/videos/hero-showreel.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="home-hero__overlay" aria-hidden="true"></div>
        <div className="container home-hero__inner">
          <h1 className="home-hero__title">Northwest Wushu</h1>
          <p className="home-hero__tagline">{site.tagline}</p>
          <p className="home-hero__intro">
            New to wushu? We welcome kids, teens, and adults — no experience needed. Your first class is free.
          </p>
          <div className="home-hero__actions">
            <Link to="/trial/" className="btn btn--primary">
              Try your first class for free
            </Link>
            <Link to="/about/#what-is-wushu" className="btn btn--secondary">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="features">
            <div className="feature">
              <FeatureIcon variant="levels" />
              <h2 className="feature__title">All Levels Welcome</h2>
              <p>From first-timers to competitive athletes.</p>
            </div>
            <div className="feature">
              <FeatureIcon variant="tradition" />
              <h2 className="feature__title">Traditional &amp; Modern</h2>
              <p>Shanxi team methods through modern wushu training.</p>
            </div>
            <div className="feature">
              <FeatureIcon variant="location" />
              <h2 className="feature__title">Seattle Location</h2>
              <p>
                {site.address.street}, {site.address.name}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container home-split">
          <div className="home-split__media">
            <img
              src="/images/wushu-seattle-skyline.jpg"
              alt="Wushu practitioner with staff on a hill overlooking the Seattle skyline at sunrise"
              width={600}
              height={400}
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="section__title">What is Wushu?</h2>
            <p>
              Wushu is a modern, standardized form of Chinese martial arts that combines traditional combat techniques
              with athletic movement and acrobatics. Training builds strength, flexibility, coordination, and discipline
              for all ages.
            </p>
            <div className="home-split__cta">
              <Link to="/about/#what-is-wushu" className="btn btn--primary">
                Read more on our About page →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTABand />

      <section className="section section--alt" id="instagram" aria-labelledby="instagram-heading">
        <div className="container">
          <h2 id="instagram-heading" className="section__title text-center">
            Follow us on Instagram
          </h2>
          <InstagramSection />
        </div>
      </section>
    </Layout>
  );
}
