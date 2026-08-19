import { useEffect, useRef } from 'react';
import { cx } from '../lib/cx';

const STORAGE_KEY = 'nw_wushu_trial_stepper';
const steps = [
  { num: 1, label: 'Your info' },
  { num: 2, label: 'Waivers' },
  { num: 3, label: 'Date & time' },
];

function getInitialScale(seg: number, prev: number, current: number, direction: string) {
  if (direction === 'forward') {
    if (seg < prev) return 1;
    return 0;
  }
  if (direction === 'back') {
    if (seg < current) return 1;
    if (seg === prev - 1) return 1;
    return 0;
  }
  return seg < current ? 1 : 0;
}

export default function TrialStepper({ current }: { current: 1 | 2 | 3 }) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const stored = sessionStorage.getItem(STORAGE_KEY);
    const prev = stored !== null ? Number(stored) : current;
    const direction = current > prev ? 'forward' : current < prev ? 'back' : 'none';
    nav.dataset.direction = direction;

    nav.querySelectorAll<HTMLElement>('.stepper__line[data-segment]').forEach((line) => {
      const seg = Number(line.dataset.segment);
      const fill = line.querySelector<HTMLElement>('.stepper__line-fill');
      if (!fill) return;
      const targetScale = seg < current ? 1 : 0;
      if (direction !== 'none') {
        fill.style.setProperty('--scale', String(getInitialScale(seg, prev, current, direction)));
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
  }, [current]);

  return (
    <nav ref={navRef} className="stepper" data-current={current} aria-label="Trial sign-up progress">
      {steps.map((step, i) => (
        <span key={step.num} style={{ display: 'contents' }}>
          <div className="stepper__step">
            <span
              className={cx(
                'stepper__dot',
                step.num === current && 'stepper__dot--active',
                step.num < current && 'stepper__dot--done',
              )}
              aria-current={step.num === current ? 'step' : undefined}
            >
              {step.num}
            </span>
            <span
              className={cx(
                'stepper__label',
                step.num === current && 'stepper__label--active',
                step.num < current && 'stepper__label--done',
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="stepper__line" data-segment={step.num} aria-hidden="true">
              <span
                className="stepper__line-fill"
                style={{ ['--scale' as string]: step.num < current ? 1 : 0 }}
              />
            </div>
          )}
        </span>
      ))}
    </nav>
  );
}
