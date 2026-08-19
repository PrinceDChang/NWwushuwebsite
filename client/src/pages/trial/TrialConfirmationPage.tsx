import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ConfirmCardIcon from '../../components/ConfirmCardIcon';
import FAQSection from '../../components/FAQSection';
import Layout from '../../components/Layout';
import PageHero from '../../components/PageHero';
import TrialStepper from '../../components/TrialStepper';
import { faqItems } from '../../data/faq';
import { clearTrialData, getTrialConfirm, saveTrialConfirm } from '../../lib/trialStorage';

const LOCATION = 'Seattle Armory, 305 Harrison St, Seattle, WA 98109';
const TIME_RANGES = {
  kids: { start: [10, 0], end: [11, 0] },
  adult: { start: [11, 0], end: [13, 0] },
};

function nextSaturdayISO() {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilSaturday);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toLocalStamp(date: Date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

function toIsoLocal(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

export default function TrialConfirmationPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const data = useMemo(() => {
    let stored = getTrialConfirm();
    if (!stored.selectedDate && isLocalDev && params.get('preview') === '1') {
      stored = {
        selectedDate: nextSaturdayISO(),
        classType: 'kids',
        time: '10:00 AM – 11:00 AM',
        classLabel: 'Kids Wushu',
        guardianEmail: 'demo@example.com',
        fullName: 'Demo Student',
      };
      saveTrialConfirm(stored);
    }
    return stored;
  }, [isLocalDev, params]);

  useEffect(() => {
    if (!data.selectedDate) navigate('/trial/', { replace: true });
    else clearTrialData();
  }, [data.selectedDate, navigate]);

  if (!data.selectedDate) return null;

  const type = data.classType === 'adult' ? 'adult' : 'kids';
  const range = TIME_RANGES[type];
  const [y, m, d] = data.selectedDate.split('-').map(Number);
  const start = new Date(y, m - 1, d, range.start[0], range.start[1]);
  const end = new Date(y, m - 1, d, range.end[0], range.end[1]);
  const title = 'Northwest Wushu Trial Lesson';
  const details = [
    data.classLabel || 'Trial class',
    data.fullName ? `Student: ${data.fullName}` : '',
    'Status: Pending confirmation from Northwest Wushu.',
    'Wear comfortable sportswear and athletic shoes.',
  ]
    .filter(Boolean)
    .join('\n');

  const googleParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toLocalStamp(start)}/${toLocalStamp(end)}`,
    details,
    location: LOCATION,
  });
  const outlookParams = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title,
    body: details,
    location: LOCATION,
    startdt: toIsoLocal(start),
    enddt: toIsoLocal(end),
  });

  function downloadAppleCalendar() {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Northwest Wushu//Trial Confirmation//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:nw-wushu-trial-${data.selectedDate}@northwestwushu`,
      `DTSTAMP:${toLocalStamp(new Date())}`,
      `DTSTART:${toLocalStamp(start)}`,
      `DTEND:${toLocalStamp(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
      `LOCATION:${LOCATION}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nw-wushu-trial.ics';
    a.click();
    URL.revokeObjectURL(url);
  }

  const dateText = new Date(`${data.selectedDate}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const email = data.guardianEmail?.trim();

  return (
    <Layout title="Trial Request Received" showStickyCta={false}>
      <PageHero title="Free Trial Sign Up" variant="image" imageSrc="/images/studio-training.jpg" />

      <div className="container container--narrow trial-confirm">
        <TrialStepper current={3} />

        <p className="trial-confirm__lead">Your trial request is in!</p>
        <p className="trial-confirm__intro text-muted text-center">
          <span>We received your request</span>
          {email ? (
            <span>
              {' '}
              and a confirmation email has been sent to <strong>{email}</strong>
            </span>
          ) : null}
          .
        </p>

        <div className="confirm-card">
          <ConfirmCardIcon />
          <h2 className="trial-confirm__card-title">Scheduled trial lesson</h2>
          <p className="trial-confirm__class">{data.classLabel || '—'}</p>
          <p className="trial-confirm__date">{dateText}</p>
          <p className="trial-confirm__time">{data.time || '—'}</p>
          <p className="trial-confirm__note">
            Please wear comfortable sportswear and athletic shoes. We are excited to meet you!
          </p>
        </div>

        <section className="trial-confirm__calendar" aria-labelledby="calendar-heading">
          <h2 id="calendar-heading" className="trial-confirm__calendar-title">
            Add to your calendar
          </h2>
          <p className="trial-confirm__calendar-lead text-muted">Save your trial lesson to your calendar</p>
          <div className="trial-confirm__calendar-actions">
            <a
              className="btn btn--outline btn--small trial-confirm__cal-btn"
              href={`https://calendar.google.com/calendar/render?${googleParams.toString()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="trial-confirm__cal-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google Calendar
            </a>
            <button type="button" className="btn btn--outline btn--small trial-confirm__cal-btn" onClick={downloadAppleCalendar}>
              <svg className="trial-confirm__cal-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                />
              </svg>
              Apple Calendar
            </button>
            <a
              className="btn btn--outline btn--small trial-confirm__cal-btn"
              href={`https://outlook.live.com/calendar/0/deeplink/compose?${outlookParams.toString()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="trial-confirm__cal-icon" viewBox="0 0 24 24" aria-hidden="true">
                <rect fill="#F25022" x="1" y="1" width="10" height="10" rx="0.5" />
                <rect fill="#7FBA00" x="13" y="1" width="10" height="10" rx="0.5" />
                <rect fill="#00A4EF" x="1" y="13" width="10" height="10" rx="0.5" />
                <rect fill="#FFB900" x="13" y="13" width="10" height="10" rx="0.5" />
              </svg>
              Microsoft Outlook
            </a>
          </div>
        </section>

        <p className="text-center trial-confirm__home">
          <Link to="/" className="btn btn--primary">
            Go back to homepage
          </Link>
        </p>
      </div>

      <FAQSection items={faqItems.slice(0, 6)} variant="dark" />
    </Layout>
  );
}
