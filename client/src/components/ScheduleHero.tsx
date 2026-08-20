import { useEffect, useId, useRef, useState, type HTMLAttributes } from 'react';
import { classes, type ClassType, type WushuClass } from '../data/classes';
import { cx } from '../lib/cx';
import ClassCard from './ClassCard';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const timeSlots = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM'] as const;

const HOVER_DELAY_MS = 2000;

const classById = Object.fromEntries(classes.map((c) => [c.id, c])) as Record<ClassType, WushuClass>;

export default function ScheduleHero({ title, subtitle }: { title: string; subtitle?: string }) {
  const [animateIn, setAnimateIn] = useState(false);
  const [overlayId, setOverlayId] = useState<ClassType | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener('change', onChange);

    const timer = window.setTimeout(() => setAnimateIn(true), media.matches ? 0 : 180);

    return () => {
      media.removeEventListener('change', onChange);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!overlayId) return;

    const previouslyFocused = triggerRef.current;
    const panel = panelRef.current;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOverlayId(null);
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previouslyFocused?.focus();
    };
  }, [overlayId]);

  function clearHoverTimer() {
    if (hoverTimer.current != null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }

  function startHoverReveal(id: ClassType, trigger?: HTMLButtonElement | null) {
    clearHoverTimer();
    if (trigger) triggerRef.current = trigger;
    if (reduceMotion) {
      openOverlay(id);
      return;
    }
    hoverTimer.current = window.setTimeout(() => {
      openOverlay(id);
      hoverTimer.current = null;
    }, HOVER_DELAY_MS);
  }

  function cancelHoverReveal() {
    clearHoverTimer();
  }

  function openOverlay(id: ClassType, trigger?: HTMLButtonElement | null) {
    clearHoverTimer();
    if (trigger) triggerRef.current = trigger;
    else if (document.activeElement instanceof HTMLButtonElement) {
      triggerRef.current = document.activeElement;
    }
    setOverlayId(id);
  }

  function closeOverlay() {
    clearHoverTimer();
    setOverlayId(null);
  }

  const activeClass = overlayId ? classById[overlayId] : null;

  return (
    <section
      className={cx(
        'page-hero page-hero--schedule-calendar',
        animateIn && 'page-hero--schedule-calendar-ready',
        overlayId && 'page-hero--schedule-overlay-open',
      )}
      aria-label={title}
      aria-labelledby={titleId}
    >
      <h1 id={titleId} className="visually-hidden">
        {title}
      </h1>

      <div
        className="schedule-calendar"
        {...(overlayId ? ({ inert: '' } as HTMLAttributes<HTMLDivElement>) : {})}
      >
        <table className="schedule-calendar__table">
          <thead>
            <tr>
              <th className="schedule-calendar__corner" scope="col">
                <span className="visually-hidden">Time</span>
              </th>
              {days.map((day, index) => (
                <th
                  key={day}
                  scope="col"
                  className={cx('schedule-calendar__day', `schedule-calendar__day--${day.toLowerCase()}`)}
                  style={{ ['--schedule-delay' as string]: `${index * 70}ms` }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, rowIndex) => (
              <tr key={slot}>
                <th
                  scope="row"
                  className="schedule-calendar__time"
                  style={{ ['--schedule-delay' as string]: `${520 + rowIndex * 70}ms` }}
                >
                  <span>{slot}</span>
                </th>
                {days.map((day) => {
                  if (day === 'Sat' && slot === '12 PM') return null;

                  if (day === 'Sat' && slot === '10 AM') {
                    return (
                      <td
                        key={day}
                        className={cx(
                          'schedule-calendar__cell',
                          'schedule-calendar__cell--sat',
                          'schedule-calendar__cell--event',
                          overlayId === 'kids' && 'schedule-calendar__cell--active',
                        )}
                      >
                        <button
                          type="button"
                          className="schedule-calendar__event schedule-calendar__event--kids"
                          style={{ ['--schedule-delay' as string]: '1100ms' }}
                          aria-expanded={overlayId === 'kids'}
                          aria-controls="schedule-class-overlay"
                          onMouseEnter={(event) => startHoverReveal('kids', event.currentTarget)}
                          onMouseLeave={cancelHoverReveal}
                          onFocus={(event) => startHoverReveal('kids', event.currentTarget)}
                          onBlur={cancelHoverReveal}
                          onClick={(event) => openOverlay('kids', event.currentTarget)}
                        >
                          <span>Kids Class</span>
                          <span className="schedule-calendar__event-time">10 – 11 AM</span>
                        </button>
                      </td>
                    );
                  }

                  if (day === 'Sat' && slot === '11 AM') {
                    return (
                      <td
                        key={day}
                        className={cx(
                          'schedule-calendar__cell',
                          'schedule-calendar__cell--sat',
                          'schedule-calendar__cell--event',
                          overlayId === 'adult' && 'schedule-calendar__cell--active',
                        )}
                        rowSpan={2}
                      >
                        <button
                          type="button"
                          className="schedule-calendar__event schedule-calendar__event--adult"
                          style={{ ['--schedule-delay' as string]: '1240ms' }}
                          aria-expanded={overlayId === 'adult'}
                          aria-controls="schedule-class-overlay"
                          onMouseEnter={(event) => startHoverReveal('adult', event.currentTarget)}
                          onMouseLeave={cancelHoverReveal}
                          onFocus={(event) => startHoverReveal('adult', event.currentTarget)}
                          onBlur={cancelHoverReveal}
                          onClick={(event) => openOverlay('adult', event.currentTarget)}
                        >
                          <span>Adult Class</span>
                          <span className="schedule-calendar__event-time">11 AM – 1 PM</span>
                        </button>
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
      <p className="schedule-calendar__hint">
        Select a class to see details · keyboard: Enter or Space, Escape to close
      </p>

      <div className="container page-hero__content" aria-hidden="true">
        <p className="hero-title hero-title--watermark">{title}</p>
        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
      </div>

      <div
        className={cx('schedule-overlay', activeClass && 'schedule-overlay--open')}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeOverlay();
        }}
      >
        <div
          ref={panelRef}
          id="schedule-class-overlay"
          className="schedule-overlay__panel"
          role="dialog"
          aria-modal="true"
          aria-label={activeClass?.title ?? 'Class details'}
          hidden={!activeClass}
          onMouseEnter={clearHoverTimer}
        >
          {activeClass && (
            <>
              <button
                ref={closeRef}
                type="button"
                className="schedule-overlay__close"
                onClick={closeOverlay}
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              <ClassCard classInfo={activeClass} variant="overlay" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
