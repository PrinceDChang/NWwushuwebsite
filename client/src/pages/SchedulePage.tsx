import CTABand from '../components/CTABand';
import Layout from '../components/Layout';
import ScheduleHero from '../components/ScheduleHero';
import { scheduleEvents } from '../data/scheduleEvents';
import { site } from '../data/site';

export default function SchedulePage() {
  return (
    <Layout title="Schedule" bodyClass="page-schedule" showStickyCta={false}>
      <ScheduleHero title="Schedule" subtitle="Same class times every week" />

      <section className="section schedule-page__footnote">
        <div className="container" style={{ maxWidth: '40rem' }}>
          <p className="text-muted text-center" style={{ margin: 0 }}>
            This weekly timetable repeats year-round. All group classes meet on <strong>Saturdays</strong> at the
            Seattle Armory. We will confirm trial bookings within {site.replyTime}.
          </p>
        </div>
      </section>

      <section
        className="section section--alt schedule-events"
        id="events"
        aria-labelledby="schedule-events-heading"
      >
        <div className="container schedule-events__inner">
          <h2 id="schedule-events-heading" className="section__title schedule-events__title">
            Events &amp; Holidays 2026–27
          </h2>
          <p className="schedule-events__lede text-muted">
            Special sessions, performances, and days the school is closed.
          </p>

          {scheduleEvents.length === 0 ? (
            <p className="schedule-events__empty">No upcoming events/holidays</p>
          ) : (
            <ul className="schedule-events__list">
              {scheduleEvents.map((event) => (
                <li key={event.id} className="schedule-events__item">
                  <time className="schedule-events__date">{event.dateLabel}</time>
                  <div className="schedule-events__body">
                    <h3 className="schedule-events__name">{event.title}</h3>
                    {event.detail && <p className="schedule-events__detail">{event.detail}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CTABand />
    </Layout>
  );
}
