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
          <circle cx="7" cy="8.5" r="2.25" />
          <path d="M7 11v5.5" />
          <circle cx="12" cy="6.25" r="2.25" />
          <path d="M12 8.75v7.75" />
          <circle cx="17" cy="9.75" r="2.25" />
          <path d="M17 12.25v4.25" />
          <path d="M4.5 18.5h15" />
          <path d="M9 15.5h6" />
        </svg>
      )}
      {variant === 'tradition' && (
        <svg {...svgAttrs}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 3.5v17" />
          <path d="M7.25 9.25c-1.6 1.35-2.25 3.1-2.25 4.75s.65 3.4 2.25 4.75" />
          <path d="M8.75 12c-1.35 1.1-1.85 2.45-1.85 3.75" />
          <path d="M14 9.25h5.25" />
          <path d="M14 12h5.25" />
          <path d="M14 14.75h5.25" />
          <path d="M16.75 9.25v5.5" />
        </svg>
      )}
      {variant === 'location' && (
        <svg {...svgAttrs}>
          <path d="M12 21.5s6.5-4.35 6.5-10.25a6.5 6.5 0 1 0-13 0c0 5.9 6.5 10.25 6.5 10.25z" />
          <circle cx="12" cy="11.25" r="2.25" />
          <path d="M12 6.75V9" />
          <path d="M10.15 9h3.7l-.85 2.35h-2L10.15 9z" />
        </svg>
      )}
    </div>
  );
}
