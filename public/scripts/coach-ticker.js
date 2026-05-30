function initCoachTicker() {
  const root = document.getElementById('coach-feature-ticker');
  if (!root || root.dataset.tickerReady === 'true') return;
  root.dataset.tickerReady = 'true';

  const photos = [...root.querySelectorAll('.coach-ticker__photo')];
  const panels = [...root.querySelectorAll('.coach-ticker__content-panel')];
  const timers = [...root.querySelectorAll('.coach-timer')];
  const intervalMs = Number(root.dataset.interval) || 10000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = photos.findIndex((photo) => photo.classList.contains('coach-ticker__photo--active'));
  if (index < 0) index = 0;

  let isPaused = false;
  let manualPaused = false;
  let interactionPaused = false;
  let fallbackTimer = null;

  function resetTimerStates() {
    timers.forEach((timer) => timer.classList.remove('coach-timer--complete'));
  }

  function allTimersComplete() {
    return timers.every((timer) => timer.classList.contains('coach-timer--complete'));
  }

  function restartActiveTimerAnimation() {
    const active = timers[index];
    if (!active || reducedMotion) return;
    const circle = active.querySelector('.coach-timer__circle');
    if (!circle) return;
    circle.style.animation = 'none';
    circle.style.setProperty('--coach-timer-fill', '0deg');
    void circle.offsetWidth;
    circle.style.animation = '';
    circle.style.removeProperty('--coach-timer-fill');
  }

  function setSlide(nextIndex) {
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

  function advanceFromTimer(completedIndex) {
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
      clearInterval(fallbackTimer);
      fallbackTimer = null;
    }
  }

  function startFallback() {
    stopFallback();
    if (reducedMotion && !isPaused && photos.length > 1) {
      fallbackTimer = setInterval(next, intervalMs);
    }
  }

  function setPaused(paused) {
    isPaused = paused;
    root.classList.toggle('is-paused', paused);
    if (paused) {
      stopFallback();
    } else {
      restartActiveTimerAnimation();
      startFallback();
    }
  }

  function updatePlayPauseButton() {
    const playPauseBtn = root.querySelector('.coach-ticker__play-pause');
    if (!playPauseBtn) return;
    playPauseBtn.classList.toggle('is-playing', !manualPaused);
    playPauseBtn.setAttribute('aria-pressed', manualPaused ? 'true' : 'false');
    playPauseBtn.setAttribute('aria-label', manualPaused ? 'Play slideshow' : 'Pause slideshow');
    root.classList.toggle('is-manually-paused', manualPaused);
  }

  function syncPauseState() {
    setPaused(manualPaused || interactionPaused);
  }

  timers.forEach((timer) => {
    const circle = timer.querySelector('.coach-timer__circle');

    timer.addEventListener('click', () => {
      const target = Number(timer.dataset.slide);
      if (!Number.isNaN(target)) {
        resetTimerStates();
        setSlide(target);
        if (!isPaused) restartActiveTimerAnimation();
      }
    });

    circle?.addEventListener('animationend', (event) => {
      if (event.target !== circle) return;
      if (isPaused || reducedMotion) return;
      if (!timer.classList.contains('coach-timer--active')) return;
      advanceFromTimer(index);
    });
  });

  root.addEventListener('click', (event) => {
    if (!event.target.closest('.coach-ticker__play-pause')) return;
    manualPaused = !manualPaused;
    updatePlayPauseButton();
    syncPauseState();
  });

  root.addEventListener('mouseenter', () => {
    interactionPaused = true;
    syncPauseState();
  });
  root.addEventListener('mouseleave', () => {
    interactionPaused = false;
    syncPauseState();
  });
  root.addEventListener('focusin', (event) => {
    if (event.target.closest('.coach-ticker__play-pause')) return;
    interactionPaused = true;
    syncPauseState();
  });
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) {
      interactionPaused = false;
      syncPauseState();
    }
  });

  updatePlayPauseButton();
  setSlide(index);
  startFallback();
}

initCoachTicker();
document.addEventListener('astro:page-load', initCoachTicker);
