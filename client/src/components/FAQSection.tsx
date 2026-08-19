import type { FAQItem } from '../data/faq';
import { cx } from '../lib/cx';

type FAQSectionProps = {
  items: FAQItem[];
  title?: string;
  variant?: 'dark' | 'light';
  id?: string;
};

export default function FAQSection({
  items,
  title = 'Frequently Asked Questions',
  variant = 'dark',
  id = 'faq',
}: FAQSectionProps) {
  return (
    <section
      className={cx('section', variant === 'dark' ? 'faq-section--dark' : 'section--alt')}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container container--narrow">
        <h2 id={`${id}-heading`} className="section__title text-center">
          {title}
        </h2>
        <div className={cx('faq', variant === 'light' && 'faq--light')}>
          {items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p className="faq__answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
