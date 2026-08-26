import { useState } from 'react';
import { featuredCoach, featuredCoachSlides } from '../data/coaches';
import { cx } from '../lib/cx';

export default function CoachFeatureTicker() {
  const [index, setIndex] = useState(0);
  const count = featuredCoachSlides.length;

  function go(delta: number) {
    setIndex((current) => (current + delta + count) % count);
  }

  function goTo(slideIndex: number) {
    setIndex(slideIndex);
  }

  return (
    <div
      className="coach-ticker container"
      id="coach-feature-ticker"
      aria-roledescription="carousel"
      aria-label={`About ${featuredCoach.name}`}
    >
      <svg className="coach-ticker__icon-defs" aria-hidden="true" width={0} height={0} focusable="false">
        <defs>
          <linearGradient id="coach-ctrl-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
        className="coach-ticker__nav coach-ticker__nav--prev"
        aria-label="Previous photo"
        onClick={() => go(-1)}
      >
        <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
          <path
            d="M8.75 2.4 4.15 7l4.6 4.6"
            fill="none"
            stroke="url(#coach-ctrl-gradient)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="coach-ticker__layout">
        <div className="coach-ticker__photos">
          {featuredCoachSlides.map((slide, slideIndex) => (
            <div
              key={slide.aspect}
              className={cx('coach-ticker__photo', slideIndex === index && 'coach-ticker__photo--active')}
              data-slide={slideIndex}
              aria-hidden={slideIndex === index ? 'false' : 'true'}
            >
              <img
                src={slide.image}
                alt={slide.imageAlt}
                width={400}
                height={500}
                loading={slideIndex === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        <div className="coach-ticker__content-stack">
          {featuredCoachSlides.map((slide, slideIndex) => (
            <article
              key={slide.aspect}
              className={cx(
                'coach-ticker__content-panel',
                slideIndex === index && 'coach-ticker__content-panel--active',
              )}
              data-slide={slideIndex}
              aria-hidden={slideIndex === index ? 'false' : 'true'}
            >
              {featuredCoach.role && <p className="coach-role-label">{featuredCoach.role}</p>}
              <h3 className="coach-feature__name">{featuredCoach.name}</h3>
              <p className="coach-ticker__aspect">{slide.aspect}</p>
              {slide.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              {slide.youtubeUrl?.trim() ? (
                <p className="coach-ticker__video-link">
                  <a href={slide.youtubeUrl.trim()} target="_blank" rel="noopener noreferrer">
                    Watch on YouTube
                  </a>
                </p>
              ) : slide.youtubeUrl !== undefined ? (
                <p className="coach-ticker__video-placeholder">YouTube video link coming soon.</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="coach-ticker__nav coach-ticker__nav--next"
        aria-label="Next photo"
        onClick={() => go(1)}
      >
        <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
          <path
            d="M5.25 2.4 9.85 7l-4.6 4.6"
            fill="none"
            stroke="url(#coach-ctrl-gradient)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="coach-ticker__dots" role="tablist" aria-label="Coach photo slides">
        {featuredCoachSlides.map((slide, slideIndex) => (
          <button
            key={slide.aspect}
            type="button"
            role="tab"
            className={cx('coach-ticker__dot', slideIndex === index && 'coach-ticker__dot--active')}
            aria-label={`Show slide ${slideIndex + 1} of ${count}: ${slide.aspect}`}
            aria-selected={slideIndex === index}
            tabIndex={slideIndex === index ? 0 : -1}
            onClick={() => goTo(slideIndex)}
          />
        ))}
      </div>

      <p className="visually-hidden" aria-live="polite">
        Slide {index + 1} of {count}
      </p>
    </div>
  );
}
