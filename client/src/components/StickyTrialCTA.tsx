import { Link } from 'react-router-dom';

export default function StickyTrialCTA() {
  return (
    <aside className="sticky-cta" aria-label="Trial class">
      <Link to="/trial/" className="btn btn--primary" aria-label="Book free trial class">
        Free trial class
      </Link>
    </aside>
  );
}
