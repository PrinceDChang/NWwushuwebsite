import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import PageHero from '../../components/PageHero';
import TrialStepper from '../../components/TrialStepper';
import { site } from '../../data/site';
import { cx } from '../../lib/cx';
import { clearTrialData, getTrialData, saveTrialConfirm, saveTrialData } from '../../lib/trialStorage';

const SLOTS = {
  kids: { label: 'Kids Wushu', time: '10:00 AM – 11:00 AM' },
  adult: { label: 'Teen & Adult Wushu', time: '11:00 AM – 1:00 PM' },
} as const;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type SpotsData = {
  capacity: number;
  booked: { kids: Record<string, number>; adult: Record<string, number> };
};

function toISODateLocal(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function spotsLabel(left: number) {
  if (left <= 0) return 'Class full';
  if (left === 1) return '1 spot left';
  return `${left} spots left`;
}

export default function TrialBookingPage() {
  const navigate = useNavigate();
  const trialData = useMemo(() => getTrialData(), []);
  const hasAccess = Boolean(trialData.step && trialData.step >= 2);
  const [classType, setClassType] = useState<'kids' | 'adult'>(
    trialData.classType === 'adult' ? 'adult' : 'kids',
  );
  const [spotsData, setSpotsData] = useState<SpotsData>({
    capacity: site.maxClassSize,
    booked: { kids: {}, adult: {} },
  });
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(trialData.selectedDate || null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!hasAccess) navigate('/trial/agreements/', { replace: true });
  }, [hasAccess, navigate]);

  useEffect(() => {
    fetch('/api/trial-spots')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setSpotsData({
          capacity: Number(data.capacity) || site.maxClassSize,
          booked: {
            kids: data.booked?.kids || {},
            adult: data.booked?.adult || {},
          },
        });
      })
      .catch(() => {
        fetch('/data/trial-spots.json')
          .then((res) => (res.ok ? res.json() : Promise.reject()))
          .then((data) => {
            setSpotsData({
              capacity: Number(data.capacity) || site.maxClassSize,
              booked: {
                kids: data.booked?.kids || {},
                adult: data.booked?.adult || {},
              },
            });
          })
          .catch(() => undefined);
      });
  }, []);

  function spotsLeft(iso: string | null, type = classType) {
    if (!iso) return spotsData.capacity;
    const booked = Number(spotsData.booked?.[type]?.[iso] || 0);
    return Math.max(0, spotsData.capacity - booked);
  }

  const left = spotsLeft(selectedDate);
  const locked = !selectedDate;
  const full = Boolean(selectedDate) && left <= 0;
  const slot = SLOTS[classType];

  const calendarDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cells: Array<{ day?: number; iso?: string; disabled: boolean; left?: number }> = [];
    for (let i = 0; i < startPad; i++) cells.push({ disabled: true });
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewYear, viewMonth, day);
      const iso = toISODateLocal(date);
      const isSaturday = date.getDay() === 6;
      const isFuture = date >= today;
      if (isSaturday && isFuture) {
        cells.push({ day, iso, disabled: spotsLeft(iso) <= 0, left: spotsLeft(iso) });
      } else {
        cells.push({ day, disabled: true });
      }
    }
    return cells;
  }, [viewYear, viewMonth, classType, spotsData]);

  function selectedLabel() {
    if (!selectedDate) return 'Select a date above to continue';
    const date = new Date(`${selectedDate}T12:00:00`);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  function noteText() {
    const cap = spotsData.capacity;
    if (!selectedDate) {
      return `We will confirm your spot within ${site.replyTime}. Max ${cap} students per class.`;
    }
    if (left <= 0) {
      return `This class is full (${cap} of ${cap} spots taken). Please pick another Saturday.`;
    }
    return `${left} of ${cap} spots left this Saturday. We will confirm your request within ${site.replyTime}.`;
  }

  async function submit() {
    const current = getTrialData();
    if (!current.step || current.step < 2) {
      navigate('/trial/agreements/');
      return;
    }
    if (!selectedDate) {
      alert('Please select a Saturday for your trial.');
      return;
    }
    if (spotsLeft(selectedDate, classType) <= 0) {
      alert('That class is full. Please pick another Saturday.');
      return;
    }

    setSending(true);
    const payload = {
      student_name: current.fullName,
      gender: current.gender,
      birthday: current.birthday,
      experience: current.experience,
      comment: current.comment || '',
      is_minor: current.isMinor,
      emergency_contact_name: current.guardianName || '',
      emergency_contact_email: current.guardianEmail || '',
      emergency_contact_phone: current.guardianPhone || '',
      emergency_contact_relation: current.guardianRelation || '',
      class_type: classType,
      class_label: slot.label,
      requested_date: selectedDate,
      requested_time: slot.time,
      waiver_accepted: 'yes',
      photo_release: current.photoRelease,
      email: current.guardianEmail,
    };

    try {
      const res = await fetch('/api/trial', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submit failed');
      saveTrialData({ step: 3, classType });
      saveTrialConfirm({
        ...getTrialData(),
        selectedDate,
        classType,
        time: slot.time,
        classLabel: slot.label,
        guardianEmail: current.guardianEmail,
        fullName: current.fullName,
      });
      clearTrialData();
      navigate('/trial/confirmation/');
    } catch {
      alert('Something went wrong. Please try again or email us directly.');
      setSending(false);
    }
  }

  if (!hasAccess) return null;

  return (
    <Layout title="Free Trial — Schedule">
      <PageHero title="Free Trial Sign Up" variant="image" imageSrc="/images/studio-training.jpg" />

      <div className="container">
        <TrialStepper current={3} />

        <form id="trial-booking-form" className="trial-booking">
          <div className="trial-booking__columns">
            <div className="trial-booking__col">
              <p className="trial-booking__step-label">
                <span>1</span> Confirm lesson
              </p>
              <h2 className="section__title">Trial lesson</h2>
              <p>1 session · Free first wushu class</p>
              <fieldset className="form-field">
                <legend className="required">Class type</legend>
                <label>
                  <input
                    type="radio"
                    name="classType"
                    value="kids"
                    checked={classType === 'kids'}
                    onChange={() => {
                      setClassType('kids');
                      saveTrialData({ classType: 'kids' });
                    }}
                  />
                  Child (Kids Wushu · 10:00–11:00 AM)
                </label>
                <label>
                  <input
                    type="radio"
                    name="classType"
                    value="adult"
                    checked={classType === 'adult'}
                    onChange={() => {
                      setClassType('adult');
                      saveTrialData({ classType: 'adult' });
                    }}
                  />
                  Teen &amp; Adult (11:00 AM–1:00 PM)
                </label>
              </fieldset>
            </div>

            <div className="trial-booking__col trial-booking__col--date">
              <p className="trial-booking__step-label">
                <span>2</span> Select the date
              </p>
              <div className="calendar" role="group" aria-label="Choose a trial date">
                <div className="calendar__header">
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    aria-label="Previous month"
                    onClick={() => {
                      if (viewMonth === 0) {
                        setViewMonth(11);
                        setViewYear((y) => y - 1);
                      } else setViewMonth((m) => m - 1);
                    }}
                  >
                    ←
                  </button>
                  <strong aria-live="polite">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </strong>
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    aria-label="Next month"
                    onClick={() => {
                      if (viewMonth === 11) {
                        setViewMonth(0);
                        setViewYear((y) => y + 1);
                      } else setViewMonth((m) => m + 1);
                    }}
                  >
                    →
                  </button>
                </div>
                <div className="calendar__grid">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <span key={d} className="calendar__dow">
                      {d}
                    </span>
                  ))}
                  {calendarDays.map((cell, i) => {
                    if (!cell.day) {
                      return (
                        <span key={`e-${i}`} className="calendar__day calendar__day--empty" aria-hidden="true" />
                      );
                    }
                    if (!cell.iso) {
                      return (
                        <button key={`d-${i}`} type="button" className="calendar__day" disabled aria-hidden="true">
                          {cell.day}
                        </button>
                      );
                    }
                    const selected = cell.iso === selectedDate;
                    return (
                      <button
                        key={cell.iso}
                        type="button"
                        className={cx(
                          'calendar__day',
                          'calendar__day--sat',
                          selected && 'calendar__day--selected',
                          cell.disabled && 'calendar__day--full',
                        )}
                        disabled={cell.disabled}
                        aria-pressed={selected}
                        aria-label={`${new Date(`${cell.iso}T12:00:00`).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}, ${spotsLabel(cell.left ?? 0)}`}
                        onClick={() => {
                          setSelectedDate(cell.iso!);
                          saveTrialData({ selectedDate: cell.iso });
                        }}
                      >
                        <span className="calendar__day-num">{cell.day}</span>
                        <span className="calendar__day-spots">{(cell.left ?? 0) <= 0 ? 'Full' : cell.left}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="calendar__hint">Trial classes meet on Saturdays. Pick an available Saturday.</p>
              </div>
              <input type="hidden" name="selectedDate" value={selectedDate || ''} />
            </div>

            <div
              className={cx('trial-booking__col', locked && 'trial-booking__col--locked')}
              id="trial-step-3"
              aria-disabled={locked}
            >
              <p className="trial-booking__step-label">
                <span>3</span> Time slot
              </p>
              <h2 className="section__title">Selected date</h2>
              <p id="selected-date-label" className="text-muted">
                {selectedLabel()}
              </p>
              <button
                type="button"
                className={cx('time-slot', full && 'time-slot--full')}
                disabled={locked || full}
                aria-pressed={!(locked || full)}
              >
                <span className="time-slot__time">{slot.time}</span>
                <span
                  className="time-slot__spots"
                  data-level={!selectedDate ? 'idle' : left <= 0 ? 'full' : left <= 5 ? 'low' : 'open'}
                >
                  {selectedDate ? spotsLabel(left) : 'Select a date to see remaining spots'}
                </span>
              </button>
              <p className="text-muted trial-booking__note">{noteText()}</p>
            </div>
          </div>

          <div className="form-actions form-actions--end trial-booking__actions">
            <button type="button" className="btn btn--outline" onClick={() => navigate('/trial/agreements/')}>
              ← Back
            </button>
            <button
              type="button"
              className="btn btn--primary"
              disabled={locked || full || sending}
              onClick={submit}
            >
              {sending ? 'Sending…' : 'Submit request'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
