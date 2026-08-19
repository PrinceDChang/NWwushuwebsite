import { Link } from 'react-router-dom';
import { site } from '../data/site';

const socialLinks = [
  { label: 'Instagram', href: site.instagram, icon: 'instagram' as const },
  { label: 'Discord', href: site.discord, icon: 'discord' as const },
  { label: 'YouTube', href: site.youtube, icon: 'youtube' as const },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <h2 className="site-footer__heading">Quick Links</h2>
          <ul className="site-footer__list">
            <li>
              <Link to="/policy/">School Policy</Link>
            </li>
            <li>
              <Link to="/waivers/">Waivers</Link>
            </li>
            <li>
              <Link to="/contact/">Contact Us</Link>
            </li>
            <li>
              <Link to="/trial/">Free Trial Sign Up</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="site-footer__heading">Location</h2>
          <p>
            {site.address.name}
            <br />
            {site.address.street}
            <br />
            {site.address.city}, {site.address.state} {site.address.zip}
          </p>
        </div>
        <div>
          <h2 className="site-footer__heading">Email</h2>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <ul className="site-footer__social" aria-label="Social media">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="site-footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  {link.icon === 'instagram' && (
                    <svg className="site-footer__social-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.427.403a4.92 4.92 0 0 1 1.77 1.153 4.92 4.92 0 0 1 1.153 1.77c.163.457.349 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.427a4.92 4.92 0 0 1-1.153 1.77 4.92 4.92 0 0 1-1.77 1.153c-.457.163-1.257.349-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.427-.403a4.92 4.92 0 0 1-1.77-1.153 4.92 4.92 0 0 1-1.153-1.77c-.163-.457-.349-1.257-.403-2.427-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.427a4.92 4.92 0 0 1 1.153-1.77 4.92 4.92 0 0 1 1.77-1.153c.457-.163 1.257.349 2.427.403 1.266.058 1.646.07 4.85.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63a6.87 6.87 0 0 0-2.49 1.62A6.87 6.87 0 0 0 .63 4.14C.333 4.905.132 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a6.87 6.87 0 0 0 1.62 2.49 6.87 6.87 0 0 0 2.49 1.62c.765.297 1.636.498 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.261 2.913-.558a6.87 6.87 0 0 0 2.49-1.62 6.87 6.87 0 0 0 1.62-2.49c.297-.765.498-1.636.558-2.913.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.261-2.148-.558-2.913a6.87 6.87 0 0 0-1.62-2.49 6.87 6.87 0 0 0-2.49-1.62c-.765-.297-1.636-.498-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 1 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
                      />
                    </svg>
                  )}
                  {link.icon === 'discord' && (
                    <svg className="site-footer__social-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.445.865-.608 1.25-.845-.276-3.68-.276-5.487 0-.164-.393-.406-.874-.618-1.25a.077.077 0 0 0-.078-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.028C.533 9.046-.319 13.58.099 18.058a.082.082 0 0 0 .031.056c2.053 1.508 4.041 2.423 5.993 3.029a.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.042-.106c-.653-.248-1.274-.55-1.872-.892a.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.007.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.077.077 0 0 0 .084.029c1.961-.607 3.95-1.522 6.002-3.029a.077.077 0 0 0 .031-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029zM8.02 15.33c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.955 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419z"
                      />
                    </svg>
                  )}
                  {link.icon === 'youtube' && (
                    <svg className="site-footer__social-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12 9.545 15.568z"
                      />
                    </svg>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="site-footer__copy container">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
