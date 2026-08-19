import { useEffect, useRef } from 'react';
import { featuredCoach, featuredCoachSlides } from '../data/coaches';
import { cx } from '../lib/cx';

const slideDurationMs = 9000;

export default function CoachFeatureTicker() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    const photos = [...rootEl.querySelectorAll('.coach-ticker__photo')];
    const panels = [...rootEl.querySelectorAll('.coach-ticker__content-panel')];
    const timers = [...rootEl.querySelectorAll('.coach-timer')];
    const intervalMs = Number(rootEl.dataset.interval) || 10000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let index = photos.findIndex((photo) => photo.classList.contains('coach-ticker__photo--active'));
    if (index < 0) index = 0;

    let isPaused = false;
    let manualPaused = false;
    let interactionPaused = false;
    let fallbackTimer: number | null = null;

    function resetTimerStates() {
      timers.forEach((timer) => timer.classList.remove('coach-timer--complete'));
    }

    function allTimersComplete() {
      return timers.every((timer) => timer.classList.contains('coach-timer--complete'));
    }

    function restartActiveTimerAnimation() {
      const active = timers[index];
      if (!active || reducedMotion) return;
      const circle = active.querySelector<HTMLElement>('.coach-timer__circle');
      if (!circle) return;
      circle.style.animation = 'none';
      circle.style.setProperty('--coach-timer-fill', '0deg');
      void circle.offsetWidth;
      circle.style.animation = '';
      circle.style.removeProperty('--coach-timer-fill');
    }

    function setSlide(nextIndex: number) {
      index = (nextIndex + photos.length) % photos.length;

      photos.forEach((photo, i) => {
        const active = i === index;
        photo.classList.toggle('coach-ticker__photo--active', active);
        photo.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      panels.forEach((panel, i) => {
        const active = i === index;
        panel.classList.toggle('coach-ticker__content-panel--active', active);
        panel.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      timers.forEach((timer, i) => {
        const active = i === index;
        timer.classList.toggle('coach-timer--active', active);
        timer.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      restartActiveTimerAnimation();
    }

    function advanceFromTimer(completedIndex: number) {
      const timer = timers[completedIndex];
      if (timer) timer.classList.add('coach-timer--complete');
      if (allTimersComplete()) {
        resetTimerStates();
        setSlide(0);
        return;
      }
      setSlide(completedIndex + 1);
    }

    function next() {
      advanceFromTimer(index);
    }

    function stopFallback() {
      if (fallbackTimer) {
        window.clearInterval(fallbackTimer);
        fallbackTimer = null;
      }
    }

    function startFallback() {
      stopFallback();
      if (reducedMotion && !isPaused && photos.length > 1) {
        fallbackTimer = window.setInterval(next, intervalMs);
      }
    }

    function setPaused(paused: boolean) {
      isPaused = paused;
      rootEl?.classList.toggle('is-paused', paused);
      if (paused) stopFallback();
      else {
        restartActiveTimerAnimation();
        startFallback();
      }
    }

    function updatePlayPauseButton() {
      const playPauseBtn = rootEl?.querySelector('.coach-ticker__play-pause');
      if (!playPauseBtn) return;
      playPauseBtn.classList.toggle('is-playing', !manualPaused);
      playPauseBtn.setAttribute('aria-pressed', manualPaused ? 'true' : 'false');
      playPauseBtn.setAttribute('aria-label', manualPaused ? 'Play slideshow' : 'Pause slideshow');
      rootEl?.classList.toggle('is-manually-paused', manualPaused);
    }

    function syncPauseState() {
      setPaused(manualPaused || interactionPaused);
    }

    const timerCleanups: Array<() => void> = [];
    timers.forEach((timer) => {
      const circle = timer.querySelector('.coach-timer__circle');
      const onClick = () => {
        const target = Number((timer as HTMLElement).dataset.slide);
        if (!Number.isNaN(target)) {
          resetTimerStates();
          setSlide(target);
          if (!isPaused) restartActiveTimerAnimation();
        }
      };
      timer.addEventListener('click', onClick);
      const onAnim = (event: Event) => {
        if (event.target !== circle) return;
        if (isPaused || reducedMotion) return;
        if (!timer.classList.contains('coach-timer--active')) return;
        advanceFromTimer(index);
      };
      circle?.addEventListener('animationend', onAnim);
      timerCleanups.push(() => {
        timer.removeEventListener('click', onClick);
        circle?.removeEventListener('animationend', onAnim);
      });
    });

    const onRootClick = (event: Event) => {
      if (!(event.target as HTMLElement).closest('.coach-ticker__play-pause')) return;
      manualPaused = !manualPaused;
      updatePlayPauseButton();
      syncPauseState();
    };
    const onEnter = () => {
      interactionPaused = true;
      syncPauseState();
    };
    const onLeave = () => {
      interactionPaused = false;
      syncPauseState();
    };
    const onFocusIn = (event: FocusEvent) => {
      if ((event.target as HTMLElement).closest('.coach-ticker__play-pause')) return;
      interactionPaused = true;
      syncPauseState();
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!rootEl.contains(event.relatedTarget as Node)) {
        interactionPaused = false;
        syncPauseState();
      }
    };

    rootEl.addEventListener('click', onRootClick);
    rootEl.addEventListener('mouseenter', onEnter);
    rootEl.addEventListener('mouseleave', onLeave);
    rootEl.addEventListener('focusin', onFocusIn);
    rootEl.addEventListener('focusout', onFocusOut);

    updatePlayPauseButton();
    setSlide(index);
    startFallback();

    return () => {
      stopFallback();
      timerCleanups.forEach((fn) => fn());
      rootEl.removeEventListener('click', onRootClick);
      rootEl.removeEventListener('mouseenter', onEnter);
      rootEl.removeEventListener('mouseleave', onLeave);
      rootEl.removeEventListener('focusin', onFocusIn);
      rootEl.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="coach-ticker container"
      id="coach-feature-ticker"
      data-interval={slideDurationMs}
      style={{ ['--coach-timer-duration' as string]: `${slideDurationMs}ms` }}
      aria-roledescription="carousel"
      aria-label={`About ${featuredCoach.name}`}
    >
      <div className="coach-ticker__layout">
        <div className="coach-ticker__photos">
          {featuredCoachSlides.map((slide, index) => (
            <div
              key={slide.aspect}
              className={cx('coach-ticker__photo', index === 0 && 'coach-ticker__photo--active')}
              data-slide={index}
              aria-hidden={index === 0 ? 'false' : 'true'}
            >
              <img
                src={slide.image}
                alt={slide.imageAlt}
                width={400}
                height={500}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        <div className="coach-ticker__controls">
          <button
            type="button"
            className="coach-ticker__play-pause is-playing"
            aria-label="Pause slideshow"
            aria-pressed="false"
          >
            <svg className="coach-ticker__icon-defs" aria-hidden="true" width={0} height={0} focusable="false">
              <defs>
                <linearGradient id="coach-ctrl-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e59a4d" />
                  <stop offset="22%" stopColor="#d87457" />
                  <stop offset="50%" stopColor="#d04a45" />
                  <stop offset="78%" stopColor="#c92822" />
                  <stop offset="100%" stopColor="#b91514" />
                </linearGradient>
              </defs>
            </svg>
            <span className="coach-ticker__icon coach-ticker__icon--pause" aria-hidden="true">
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <rect x="2.5" y="1.5" width="3" height="11" rx="0.75" fill="url(#coach-ctrl-gradient)" />
                <rect x="8.5" y="1.5" width="3" height="11" rx="0.75" fill="url(#coach-ctrl-gradient)" />
              </svg>
            </span>
            <span className="coach-ticker__icon coach-ticker__icon--play" aria-hidden="true">
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <path d="M4 2.5 11.5 7 4 11.5V2.5z" fill="url(#coach-ctrl-gradient)" />
              </svg>
            </span>
          </button>

          <div className="coach-ticker__timers" role="tablist" aria-label="Slide progress">
            {featuredCoachSlides.map((slide, index) => (
              <button
                key={slide.aspect}
                type="button"
                className={cx('coach-timer', index === 0 && 'coach-timer--active')}
                data-slide={index}
                role="tab"
                aria-selected={index === 0 ? 'true' : 'false'}
                aria-label={slide.aspect}
              >
                <span className="coach-timer__circle" aria-hidden="true"></span>
              </button>
            ))}
          </div>
        </div>

        <div className="coach-ticker__content-stack">
          {featuredCoachSlides.map((slide, index) => (
            <article
              key={slide.aspect}
              className={cx(
                'coach-ticker__content-panel',
                index === 0 && 'coach-ticker__content-panel--active',
              )}
              data-slide={index}
              aria-hidden={index === 0 ? 'false' : 'true'}
            >
              {featuredCoach.role && <p className="coach-role-label">{featuredCoach.role}</p>}
              <h3 className="coach-feature__name">{featuredCoach.name}</h3>
              <p className="coach-ticker__aspect">{slide.aspect}</p>
              {slide.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              {slide.youtubeUrl?.trim() ? (
                <p className="coach-ticker__video-link">
                  <a href={slide.youtubeUrl.trim()} target="_blank" rel="noopener noreferrer">
                    Watch on YouTube
                  </a>
                </p>
              ) : slide.youtubeUrl !== undefined ? (
                <p className="coach-ticker__video-placeholder">YouTube video link coming soon.</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
