import { Link } from 'react-router-dom';

export default function StickyTrialCTA() {
  return (
    <Link to="/trial/" className="btn btn--primary sticky-cta" role="complementary" aria-label="Book free trial class">
      Free trial class
    </Link>
  );
}
