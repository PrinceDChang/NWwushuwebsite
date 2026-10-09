import { Link } from 'react-router-dom';
import { site } from '../data/site';

export default function CTABand() {
  return (
    <section className="cta-band" aria-labelledby="cta-heading">
      <div className="container text-center">
        <h2 id="cta-heading" className="cta-band__title">
          Ready to Begin Your Journey?
        </h2>
        <p className="cta-band__text">Your first class is free. Come experience the art of Wushu.</p>
        <div className="cta-band__actions">
          <a
            href={site.trialSignupUrl}
            className="btn btn--secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try your first class for free
          </a>
          <Link to="/contact/" className="btn btn--ghost cta-band__ghost">
            Ask a question
          </Link>
        </div>
      </div>
    </section>
  );
}
