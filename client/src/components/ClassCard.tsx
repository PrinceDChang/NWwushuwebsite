import { Link } from 'react-router-dom';
import type { WushuClass } from '../data/classes';
import { cx } from '../lib/cx';

export default function ClassCard({
  classInfo,
  variant = 'default',
}: {
  classInfo: WushuClass;
  variant?: 'default' | 'overlay';
}) {
  return (
    <article className={cx('card class-card', variant === 'overlay' && 'class-card--overlay')}>
      <div className="class-card__meta">
        <h2 className="class-card__title">{classInfo.title}</h2>
        <p className="text-muted">
          <strong>{classInfo.ages}</strong>
        </p>
        <p>{classInfo.description}</p>
        <p className="class-card__price">{classInfo.priceNote}</p>
      </div>
      <div className="class-card__schedule">
        <p>
          <strong>{classInfo.day}</strong>
          <br />
          {classInfo.time}
        </p>
        <Link to={classInfo.signupHref} className="btn btn--primary btn--small">
          Sign Up
        </Link>
      </div>
    </article>
  );
}
