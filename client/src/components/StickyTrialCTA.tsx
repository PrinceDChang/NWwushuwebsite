import { site } from '../data/site';

export default function StickyTrialCTA() {
  return (
    <aside className="sticky-cta" aria-label="Trial class">
      <a
        href={site.trialSignupUrl}
        className="btn btn--primary"
        aria-label="Book free trial class"
        target="_blank"
        rel="noopener noreferrer"
      >
        Free trial class
      </a>
    </aside>
  );
}
