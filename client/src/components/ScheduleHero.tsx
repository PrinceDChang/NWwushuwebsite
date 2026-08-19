import { cx } from '../lib/cx';

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
const timeSlots = [
  '8 – 9 AM',
  '9 – 10 AM',
  '10 – 11 AM',
  '11 – 12 PM',
  '12 – 1 PM',
  '1 – 2 PM',
  '2 – 3 PM',
] as const;

export default function ScheduleHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="page-hero page-hero--schedule-calendar" aria-label={title}>
      <div className="schedule-calendar" aria-hidden="true">
        <table className="schedule-calendar__table">
          <thead>
            <tr>
              <th className="schedule-calendar__corner" scope="col"></th>
              {days.map((day) => (
                <th
                  key={day}
                  scope="col"
                  className={cx('schedule-calendar__day', `schedule-calendar__day--${day.toLowerCase()}`)}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot}>
                <th scope="row" className="schedule-calendar__time">
                  {slot}
                </th>
                {days.map((day) => {
                  if (day === 'SAT' && slot === '12 – 1 PM') return null;

                  if (day === 'SAT' && slot === '10 – 11 AM') {
                    return (
                      <td
                        key={day}
                        className="schedule-calendar__cell schedule-calendar__cell--sat schedule-calendar__cell--event"
                      >
                        <span className="schedule-calendar__event schedule-calendar__event--kids">Kids Class</span>
                      </td>
                    );
                  }

                  if (day === 'SAT' && slot === '11 – 12 PM') {
                    return (
                      <td
                        key={day}
                        className="schedule-calendar__cell schedule-calendar__cell--sat schedule-calendar__cell--event"
                        rowSpan={2}
                      >
                        <span className="schedule-calendar__event schedule-calendar__event--adult">Adult Class</span>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={day}
                      className={cx(
                        'schedule-calendar__cell',
                        `schedule-calendar__cell--${day.toLowerCase()}`,
                      )}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="schedule-calendar__note">*more lessons may be added in the future</p>

      <div className="container page-hero__content">
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}
