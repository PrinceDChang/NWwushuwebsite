import { useState } from 'react';
import { wushuAspects } from '../data/wushuAspects';
import { cx } from '../lib/cx';

export default function WushuAspectsCarousel() {
  const [index, setIndex] = useState(0);
  const count = wushuAspects.length;
  const active = wushuAspects[index];

  function go(delta: number) {
    setIndex((current) => (current + delta + count) % count);
  }

  function goTo(slideIndex: number) {
    setIndex(slideIndex);
  }

  return (
    <div
      className="wushu-aspects container"
      aria-roledescription="carousel"
      aria-label="Aspects of wushu"
    >
      <svg className="wushu-aspects__icon-defs" aria-hidden="true" width={0} height={0} focusable="false">
        <defs>
          <linearGradient id="wushu-aspect-ctrl-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e59a4d" />
            <stop offset="22%" stopColor="#d87457" />
            <stop offset="50%" stopColor="#d04a45" />
            <stop offset="78%" stopColor="#c92822" />
            <stop offset="100%" stopColor="#b91514" />
          </linearGradient>
        </defs>
      </svg>

      <button
        type="button"
        className="wushu-aspects__nav wushu-aspects__nav--prev"
        aria-label="Previous aspect"
        onClick={() => go(-1)}
      >
        <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
          <path
            d="M8.75 2.4 4.15 7l4.6 4.6"
            fill="none"
            stroke="url(#wushu-aspect-ctrl-gradient)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="wushu-aspects__main">
        <div className="about-split wushu-aspects__split">
          <div className="about-split__media">
            {wushuAspects.map((aspect, slideIndex) => (
              <img
                key={aspect.id}
                src={aspect.imageSrc}
                alt={aspect.imageAlt}
                width={1024}
                height={576}
                loading={slideIndex === 0 ? 'eager' : 'lazy'}
                className={cx(
                  'wushu-aspects__image',
                  slideIndex === index && 'wushu-aspects__image--active',
                )}
                aria-hidden={slideIndex === index ? undefined : true}
              />
            ))}
          </div>

          <div className="about-split__content wushu-aspects__content">
            {wushuAspects.map((aspect, slideIndex) => (
              <article
                key={aspect.id}
                className={cx(
                  'wushu-aspects__panel',
                  slideIndex === index && 'wushu-aspects__panel--active',
                )}
                aria-hidden={slideIndex === index ? 'false' : 'true'}
              >
                <h2 className="section__title">{aspect.title}</h2>
                {aspect.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </div>

        <div className="wushu-aspects__tabs" role="tablist" aria-label="Wushu aspects">
          {wushuAspects.map((aspect, slideIndex) => (
            <button
              key={aspect.id}
              type="button"
              role="tab"
              className={cx(
                'wushu-aspects__tab',
                slideIndex === index && 'wushu-aspects__tab--active',
              )}
              aria-selected={slideIndex === index}
              tabIndex={slideIndex === index ? 0 : -1}
              onClick={() => goTo(slideIndex)}
            >
              {aspect.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="wushu-aspects__nav wushu-aspects__nav--next"
        aria-label="Next aspect"
        onClick={() => go(1)}
      >
        <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
          <path
            d="M5.25 2.4 9.85 7l-4.6 4.6"
            fill="none"
            stroke="url(#wushu-aspect-ctrl-gradient)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <p className="visually-hidden" aria-live="polite">
        {active.label}: slide {index + 1} of {count}
      </p>
    </div>
  );
}
