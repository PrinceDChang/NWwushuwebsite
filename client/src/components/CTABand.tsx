import { Link } from 'react-router-dom';

export default function CTABand() {
  return (
    <section className="cta-band" aria-labelledby="cta-heading">
      <div className="container text-center">
        <h2 id="cta-heading" className="cta-band__title">
          Ready to Begin Your Journey?
        </h2>
        <p className="cta-band__text">Your first class is free. Come experience the art of Wushu.</p>
        <div className="cta-band__actions">
          <Link to="/trial/" className="btn btn--secondary">
            Try your first class for free
          </Link>
          <Link to="/contact/" className="btn btn--ghost cta-band__ghost">
            Ask a question
          </Link>
        </div>
      </div>
    </section>
  );
}
