const STORAGE_KEY = 'nw_wushu_trial_stepper';

function getInitialScale(seg, prev, current, direction) {
  if (direction === 'forward') {
    if (seg < prev) return 1;
    if (seg === prev) return 0;
    return 0;
  }
  if (direction === 'back') {
    if (seg < current) return 1;
    if (seg === prev - 1) return 1;
    return 0;
  }
  return seg < current ? 1 : 0;
}

function initStepper() {
  const nav = document.querySelector('nav.stepper[data-current]');
  if (!nav) return;

  const current = Number(nav.dataset.current);
  const stored = sessionStorage.getItem(STORAGE_KEY);
  const prev = stored !== null ? Number(stored) : current;

  let direction = nav.dataset.direction;
  if (!direction) {
    direction = current > prev ? 'forward' : current < prev ? 'back' : 'none';
    nav.dataset.direction = direction;
  }

  nav.querySelectorAll('.stepper__line[data-segment]').forEach((line) => {
    const seg = Number(line.dataset.segment);
    const fill = line.querySelector('.stepper__line-fill');
    if (!fill) return;

    const targetScale = seg < current ? 1 : 0;

    if (direction !== 'none' && !fill.style.getPropertyValue('--scale')) {
      fill.style.setProperty(
        '--scale',
        String(getInitialScale(seg, prev, current, direction)),
      );
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.setProperty('--scale', String(targetScale));
      });
    });
  });

  if (direction !== 'none') {
    nav.classList.add('stepper--animate');
    nav.querySelector('.stepper__dot--active')?.classList.add('stepper__dot--enter');
  }

  sessionStorage.setItem(STORAGE_KEY, String(current));
}

initStepper();
document.addEventListener('astro:page-load', initStepper);
