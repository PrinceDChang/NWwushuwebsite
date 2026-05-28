function initCoachTicker() {
  const root = document.getElementById('coach-feature-ticker');
  if (!root || root.dataset.tickerReady === 'true') return;
  root.dataset.tickerReady = 'true';

  const slides = [...root.querySelectorAll('.coach-ticker__slide')];
  const timers = [...root.querySelectorAll('.coach-timer')];
  const intervalMs = Number(root.dataset.interval) || 10000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = slides.findIndex((slide) => slide.classList.contains('coach-ticker__slide--active'));
  if (index < 0) index = 0;

  let isPaused = false;
  let fallbackTimer = null;

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
    index = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('coach-ticker__slide--active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    timers.forEach((timer, i) => {
      const active = i === index;
      timer.classList.toggle('coach-timer--active', active);
      timer.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    restartActiveTimerAnimation();
  }

  function next() {
    setSlide(index + 1);
  }

  function stopFallback() {
    if (fallbackTimer) {
      clearInterval(fallbackTimer);
      fallbackTimer = null;
    }
  }

  function startFallback() {
    stopFallback();
    if (reducedMotion && !isPaused && slides.length > 1) {
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

  timers.forEach((timer) => {
    const circle = timer.querySelector('.coach-timer__circle');

    timer.addEventListener('click', () => {
      const target = Number(timer.dataset.slide);
      if (!Number.isNaN(target)) {
        setSlide(target);
        if (!isPaused) restartActiveTimerAnimation();
      }
    });

    circle?.addEventListener('animationend', (event) => {
      if (event.target !== circle) return;
      if (isPaused || reducedMotion) return;
      if (!timer.classList.contains('coach-timer--active')) return;
      next();
    });
  });

  root.addEventListener('mouseenter', () => setPaused(true));
  root.addEventListener('mouseleave', () => setPaused(false));
  root.addEventListener('focusin', () => setPaused(true));
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) setPaused(false);
  });

  setSlide(index);
  startFallback();
}

initCoachTicker();
document.addEventListener('astro:page-load', initCoachTicker);
