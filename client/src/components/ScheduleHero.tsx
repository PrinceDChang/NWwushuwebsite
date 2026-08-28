import { useEffect, useId, useRef, useState, type CSSProperties, type HTMLAttributes, type MouseEvent } from 'react';
import { classes, type ClassType, type WushuClass } from '../data/classes';
import { cx } from '../lib/cx';
import ClassCard from './ClassCard';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const timeSlots = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM'] as const;

const HOVER_DELAY_MS = 4000;
const LEAVE_GRACE_MS = 200;
const SUPPRESS_AFTER_CLOSE_MS = 180;
const RING_SIZE = 36;
const RING_RADIUS = 14;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const classById = Object.fromEntries(classes.map((c) => [c.id, c])) as Record<ClassType, WushuClass>;

type HoverRingState = {
  id: ClassType;
  x: number;
  y: number;
  key: number;
};

export default function ScheduleHero({ title, subtitle }: { title: string; subtitle?: string }) {
  const [animateIn, setAnimateIn] = useState(false);
  const [overlayId, setOverlayId] = useState<ClassType | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobileSchedule, setIsMobileSchedule] = useState(
    () => window.matchMedia('(max-width: 640px)').matches,
  );
  const [hoverRing, setHoverRing] = useState<HoverRingState | null>(null);
  const hoverTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  /** Brief lockout after overlay closes so it doesn't reopen instantly. */
  const suppressUntilRef = useRef(0);
  const overlayOpenRef = useRef(false);
  const activeHoverIdRef = useRef<ClassType | null>(null);

  useEffect(() => {
    overlayOpenRef.current = overlayId != null;
    if (overlayId != null) {
      clearHoverTimer();
      clearLeaveTimer();
      clearHoverRing();
      activeHoverIdRef.current = null;
    }
  }, [overlayId]);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 640px)');
    const onMotion = () => setReduceMotion(motion.matches);
    const onCompact = () => setIsMobileSchedule(compact.matches);
    onMotion();
    onCompact();
    motion.addEventListener('change', onMotion);
    compact.addEventListener('change', onCompact);

    const timer = window.setTimeout(() => setAnimateIn(true), motion.matches ? 0 : 180);

    return () => {
      motion.removeEventListener('change', onMotion);
      compact.removeEventListener('change', onCompact);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isMobileSchedule && overlayId) setOverlayId(null);
  }, [isMobileSchedule, overlayId]);

  useEffect(() => {
    if (!overlayId) return;

    const previouslyFocused = triggerRef.current;
    const panel = panelRef.current;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        suppressUntilRef.current = Date.now() + SUPPRESS_AFTER_CLOSE_MS;
        clearHoverTimer();
        clearLeaveTimer();
        setHoverRing(null);
        activeHoverIdRef.current = null;
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
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [overlayId]);

  function clearHoverTimer() {
    if (hoverTimer.current != null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }

  function clearLeaveTimer() {
    if (leaveTimer.current != null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }

  function clearHoverRing() {
    setHoverRing(null);
  }

  function isHoverSuppressed() {
    return Date.now() < suppressUntilRef.current;
  }

  function startHoverReveal(
    id: ClassType,
    trigger: HTMLButtonElement,
    point: { x: number; y: number },
  ) {
    if (!isMobileSchedule || overlayOpenRef.current || isHoverSuppressed()) return;

    clearLeaveTimer();

    // Already counting down for this class — keep progress, just update cursor.
    if (activeHoverIdRef.current === id && hoverTimer.current != null) {
      triggerRef.current = trigger;
      setHoverRing((current) =>
        current ? { ...current, x: point.x, y: point.y } : current,
      );
      return;
    }

    clearHoverTimer();
    triggerRef.current = trigger;
    activeHoverIdRef.current = id;

    if (reduceMotion) {
      clearHoverRing();
      openOverlay(id, trigger);
      return;
    }

    setHoverRing({ id, x: point.x, y: point.y, key: Date.now() });

    hoverTimer.current = window.setTimeout(() => {
      hoverTimer.current = null;
      activeHoverIdRef.current = null;
      if (overlayOpenRef.current || isHoverSuppressed()) {
        clearHoverRing();
        return;
      }
      clearHoverRing();
      openOverlay(id, trigger);
    }, HOVER_DELAY_MS);
  }

  function moveHoverRing(event: MouseEvent<HTMLElement>) {
    if (overlayOpenRef.current || isHoverSuppressed()) return;
    clearLeaveTimer();
    setHoverRing((current) =>
      current ? { ...current, x: event.clientX, y: event.clientY } : current,
    );
  }

  function scheduleCancelHoverReveal() {
    clearLeaveTimer();
    leaveTimer.current = window.setTimeout(() => {
      leaveTimer.current = null;
      clearHoverTimer();
      clearHoverRing();
      activeHoverIdRef.current = null;
    }, LEAVE_GRACE_MS);
  }

  function openOverlay(id: ClassType, trigger?: HTMLButtonElement | null) {
    if (!isMobileSchedule) return;
    clearHoverTimer();
    clearLeaveTimer();
    clearHoverRing();
    activeHoverIdRef.current = null;
    suppressUntilRef.current = Date.now() + SUPPRESS_AFTER_CLOSE_MS;
    if (trigger) triggerRef.current = trigger;
    else if (document.activeElement instanceof HTMLButtonElement) {
      triggerRef.current = document.activeElement;
    }
    setOverlayId(id);
  }

  function closeOverlay() {
    clearHoverTimer();
    clearLeaveTimer();
    clearHoverRing();
    activeHoverIdRef.current = null;
    suppressUntilRef.current = Date.now() + SUPPRESS_AFTER_CLOSE_MS;
    setOverlayId(null);
  }

  function bindClassHover(id: ClassType) {
    if (!isMobileSchedule) return {};
    return {
      onMouseEnter: (event: MouseEvent<HTMLElement>) => {
        const trigger =
          event.currentTarget.querySelector<HTMLButtonElement>('.schedule-calendar__event') ??
          (event.currentTarget as HTMLButtonElement);
        startHoverReveal(id, trigger, { x: event.clientX, y: event.clientY });
      },
      onMouseMove: moveHoverRing,
      onMouseLeave: scheduleCancelHoverReveal,
    };
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
      <div className="container page-hero__content page-hero__content--schedule">
        <h1 id={titleId} className="hero-title hero-title--schedule">
          {title}
        </h1>
        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
      </div>

      <div
        className="schedule-calendar"
        {...(overlayId ? ({ inert: '' } as HTMLAttributes<HTMLDivElement>) : {})}
      >
        <div className="schedule-calendar__card">
          <p className="schedule-calendar__recurrence">
            <span className="schedule-calendar__recurrence-label">Every week</span>
            <span className="schedule-calendar__recurrence-detail">
              {isMobileSchedule ? 'Saturdays' : 'Sunday – Saturday'}
            </span>
          </p>
          <table
            className="schedule-calendar__table"
            aria-label="Repeating weekly class schedule. Classes meet at the same times every week, not during a specific calendar week."
          >
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
                    <span className="visually-hidden">Every </span>
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
                          !isMobileSchedule && 'schedule-calendar__cell--static',
                        )}
                        {...bindClassHover('kids')}
                      >
                        {isMobileSchedule ? (
                          <button
                            type="button"
                            className="schedule-calendar__event schedule-calendar__event--kids"
                            style={{ ['--schedule-delay' as string]: '1100ms' }}
                            aria-expanded={overlayId === 'kids'}
                            aria-controls="schedule-class-overlay"
                            onClick={(event) => openOverlay('kids', event.currentTarget)}
                          >
                            <span>Kids Class</span>
                            <span className="schedule-calendar__event-time">10 – 11 AM</span>
                          </button>
                        ) : (
                          <div
                            className="schedule-calendar__event schedule-calendar__event--kids schedule-calendar__event--expanded"
                            style={{ ['--schedule-delay' as string]: '1100ms' }}
                          >
                            <span>Kids Class</span>
                            <span className="schedule-calendar__event-time">10 – 11 AM</span>
                          </div>
                        )}
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
                          !isMobileSchedule && 'schedule-calendar__cell--static',
                        )}
                        rowSpan={2}
                        {...bindClassHover('adult')}
                      >
                        {isMobileSchedule ? (
                          <button
                            type="button"
                            className="schedule-calendar__event schedule-calendar__event--adult"
                            style={{ ['--schedule-delay' as string]: '1240ms' }}
                            aria-expanded={overlayId === 'adult'}
                            aria-controls="schedule-class-overlay"
                            onClick={(event) => openOverlay('adult', event.currentTarget)}
                          >
                            <span>Adult Class</span>
                            <span className="schedule-calendar__event-time">11 AM – 1 PM</span>
                          </button>
                        ) : (
                          <div
                            className="schedule-calendar__event schedule-calendar__event--adult schedule-calendar__event--expanded"
                            style={{ ['--schedule-delay' as string]: '1240ms' }}
                          >
                            <span>Adult Class</span>
                            <span className="schedule-calendar__event-time">11 AM – 1 PM</span>
                          </div>
                        )}
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
      </div>

      <p className="schedule-calendar__note">*more lessons may be added in the future</p>
      {isMobileSchedule && (
        <p className="schedule-calendar__hint">
          <span className="schedule-calendar__hint-mobile">Tap a class for details</span>
        </p>
      )}

      {!isMobileSchedule && (
        <div className="schedule-class-details">
          {classes.map((classInfo) => (
            <ClassCard key={classInfo.id} classInfo={classInfo} variant="schedule" />
          ))}
        </div>
      )}

      {isMobileSchedule && hoverRing && (
        <div
          className={cx(
            'schedule-hover-ring',
            hoverRing.id === 'kids' && 'schedule-hover-ring--kids',
            hoverRing.id === 'adult' && 'schedule-hover-ring--adult',
          )}
          style={{
            left: hoverRing.x,
            top: hoverRing.y,
            width: RING_SIZE,
            height: RING_SIZE,
          }}
          aria-hidden="true"
        >
          <svg
            key={hoverRing.key}
            className="schedule-hover-ring__svg"
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            width={RING_SIZE}
            height={RING_SIZE}
          >
            <circle
              className="schedule-hover-ring__track"
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
            />
            <circle
              className="schedule-hover-ring__progress"
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              style={
                {
                  ['--ring-circumference' as string]: RING_CIRCUMFERENCE,
                  ['--ring-duration' as string]: `${HOVER_DELAY_MS}ms`,
                } as CSSProperties
              }
            />
          </svg>
        </div>
      )}

      {isMobileSchedule && (
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
          onMouseEnter={() => {
            clearHoverTimer();
            clearLeaveTimer();
            clearHoverRing();
            activeHoverIdRef.current = null;
          }}
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
      )}
    </section>
  );
}
