type FeatureIconProps = {
  variant: 'levels' | 'tradition' | 'location';
};

const svgAttrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'feature__icon-svg',
  'aria-hidden': true,
};

export default function FeatureIcon({ variant }: FeatureIconProps) {
  return (
    <div className="feature__icon" aria-hidden="true">
      {variant === 'levels' && (
        <svg {...svgAttrs}>
          {/* Three people standing side by side */}
          <circle cx="6.5" cy="6.5" r="2.1" />
          <path d="M6.5 9.1v5.4" />
          <path d="M6.5 14.5l-2.4 5" />
          <path d="M6.5 14.5l2.4 5" />
          <path d="M4.6 11.4h3.8" />

          <circle cx="12" cy="5.75" r="2.25" />
          <path d="M12 8.5v6.2" />
          <path d="M12 14.7l-2.55 5.05" />
          <path d="M12 14.7l2.55 5.05" />
          <path d="M9.85 11.1h4.3" />

          <circle cx="17.5" cy="6.5" r="2.1" />
          <path d="M17.5 9.1v5.4" />
          <path d="M17.5 14.5l-2.4 5" />
          <path d="M17.5 14.5l2.4 5" />
          <path d="M15.6 11.4h3.8" />
        </svg>
      )}
      {variant === 'tradition' && (
        <svg {...svgAttrs}>
          {/* 中 — shorter central frame with a through vertical stroke */}
          <rect x="6.5" y="8" width="11" height="8" rx="0.5" />
          <path d="M12 3.25v17.5" />
        </svg>
      )}
      {variant === 'location' && (
        <svg {...svgAttrs}>
          {/* Classic map pin */}
          <path d="M12 21.25s6.75-5.1 6.75-11a6.75 6.75 0 1 0-13.5 0c0 5.9 6.75 11 6.75 11z" />
          <circle cx="12" cy="10.25" r="2.5" />
        </svg>
      )}
    </div>
  );
}
