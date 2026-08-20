import CTABand from '../components/CTABand';
import Layout from '../components/Layout';
import ScheduleHero from '../components/ScheduleHero';
import { site } from '../data/site';

export default function SchedulePage() {
  return (
    <Layout title="Schedule" bodyClass="page-schedule" showStickyCta={false}>
      <ScheduleHero title="Schedule" />

      <section className="section schedule-page__footnote">
        <div className="container" style={{ maxWidth: '40rem' }}>
          <p className="text-muted text-center" style={{ margin: 0 }}>
            All group classes meet on <strong>Saturdays</strong> at the Seattle Armory. We will confirm trial bookings
            within {site.replyTime}.
          </p>
        </div>
      </section>

      <CTABand />
    </Layout>
  );
}
