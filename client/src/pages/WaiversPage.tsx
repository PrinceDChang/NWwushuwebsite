import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import { photoReleaseText, waiverText } from '../data/waivers';

export default function WaiversPage() {
  return (
    <Layout title="Waivers">
      <PageHero title="Waivers" />

      <section className="section">
        <div className="container container--narrow legal-page">
          <p>
            Waivers are completed digitally during <Link to="/trial/">free trial sign-up</Link>. Below are the current
            documents for your records.
          </p>

          <h2>Liability waiver</h2>
          <div className="legal-scroll" style={{ maxHeight: 'none' }}>
            {waiverText.split('\n').map((line, i) => (
              <p key={`w-${i}`}>{line}</p>
            ))}
          </div>

          <h2>Photo release</h2>
          <div className="legal-scroll" style={{ maxHeight: 'none' }}>
            {photoReleaseText.split('\n').map((line, i) => (
              <p key={`p-${i}`}>{line}</p>
            ))}
          </div>

          <p style={{ marginTop: '2rem' }}>
            <Link to="/trial/" className="btn btn--primary">
              Sign up for a free trial
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
