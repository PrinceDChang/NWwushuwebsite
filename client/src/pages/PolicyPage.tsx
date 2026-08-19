import Layout from '../components/Layout';
import PageHero from '../components/PageHero';

export default function PolicyPage() {
  return (
    <Layout title="School Policy">
      <PageHero title="School Policy" />

      <section className="section">
        <div className="container container--narrow legal-page">
          <p className="text-muted">Last updated: placeholder — replace before launch.</p>

          <h2>Attendance &amp; conduct</h2>
          <p>
            Students are expected to arrive on time, follow coach instructions, and treat training partners with
            respect. Unsafe behavior may result in removal from class.
          </p>

          <h2>Studio rules</h2>
          <ul>
            <li>No street shoes on the mats.</li>
            <li>Remove jewelry that could cause injury.</li>
            <li>Bring water; stay home if you are ill.</li>
          </ul>

          <h2>Cancellations</h2>
          <p>
            If you cannot attend a confirmed trial or class, notify us as soon as possible at{' '}
            <a href="mailto:northwestwushu.2008@gmail.com">northwestwushu.2008@gmail.com</a>.
          </p>

          <p className="text-muted">[Placeholder — add attorney- or school-approved policy text before launch.]</p>
        </div>
      </section>
    </Layout>
  );
}
