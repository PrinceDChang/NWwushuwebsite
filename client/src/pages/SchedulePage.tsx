import ClassCard from '../components/ClassCard';
import CTABand from '../components/CTABand';
import Layout from '../components/Layout';
import ScheduleHero from '../components/ScheduleHero';
import { classes } from '../data/classes';
import { site } from '../data/site';

export default function SchedulePage() {
  return (
    <Layout title="Schedule">
      <ScheduleHero title="Schedule" />

      <section className="section">
        <div className="container" style={{ maxWidth: '48rem' }}>
          <p className="text-muted text-center" style={{ marginBottom: '2rem' }}>
            All group classes meet on <strong>Saturdays</strong> at the Seattle Armory. We will confirm trial bookings
            within {site.replyTime}.
          </p>
          {classes.map((c) => (
            <ClassCard key={c.id} classInfo={c} />
          ))}
        </div>
      </section>

      <CTABand />
    </Layout>
  );
}
