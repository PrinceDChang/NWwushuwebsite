import { site } from '../data/site';
import { instagramPosts, instagramProfile, parseInstagramCaption } from '../lib/instagram';

const followerFormatter = new Intl.NumberFormat('en-US', { notation: 'compact' });

export default function InstagramSection() {
  const profile = instagramProfile;
  const posts = instagramPosts.slice(0, 6);
  const profileUrl = profile.profileUrl ?? site.instagram;
  const username = profile.username ?? site.instagramHandle.replace(/^@/, '');
  const displayHandle = `@${username}`;

  return (
    <>
      <div className="instagram-profile">
        <a className="instagram-profile__identity" href={profileUrl} target="_blank" rel="noopener noreferrer">
          {profile.profileImageSrc ? (
            <img
              className="instagram-profile__avatar"
              src={profile.profileImageSrc}
              alt=""
              width={72}
              height={72}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="instagram-profile__avatar instagram-profile__avatar--placeholder" aria-hidden="true">
              IG
            </span>
          )}
          <span className="instagram-profile__meta">
            <span className="instagram-profile__username">{displayHandle}</span>
            <span className="instagram-profile__stats">
              <strong>{followerFormatter.format(profile.followers)}</strong> followers
              <span className="instagram-profile__stats-sep" aria-hidden="true">
                ·
              </span>
              <strong>{followerFormatter.format(profile.following)}</strong> following
            </span>
          </span>
        </a>
        <a
          className="btn btn--primary instagram-profile__follow"
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="instagram-profile__follow-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.427.403a4.92 4.92 0 0 1 1.77 1.153 4.92 4.92 0 0 1 1.153 1.77c.163.457.349 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.427a4.92 4.92 0 0 1-1.153 1.77 4.92 4.92 0 0 1-1.77 1.153c-.457.163-1.257.349-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.427-.403a4.92 4.92 0 0 1-1.77-1.153 4.92 4.92 0 0 1-1.153-1.77c-.163-.457-.349-1.257-.403-2.427-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.427a4.92 4.92 0 0 1 1.153-1.77 4.92 4.92 0 0 1 1.77-1.153c.457-.163 1.257.349 2.427.403 1.266.058 1.646.07 4.85.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63a6.87 6.87 0 0 0-2.49 1.62A6.87 6.87 0 0 0 .63 4.14C.333 4.905.132 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a6.87 6.87 0 0 0 1.62 2.49 6.87 6.87 0 0 0 2.49 1.62c.765.297 1.636.498 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.261 2.913-.558a6.87 6.87 0 0 0 2.49-1.62 6.87 6.87 0 0 0 1.62-2.49c.297-.765.498-1.636.558-2.913.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.261-2.148-.558-2.913a6.87 6.87 0 0 0-1.62-2.49 6.87 6.87 0 0 0-2.49-1.62c-.765-.297-1.636-.498-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 1 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
            />
          </svg>
          Follow
        </a>
      </div>

      {posts.length > 0 ? (
        <ul className="instagram-grid" role="list">
          {posts.map((post) => {
            const { description, hashtags } = parseInstagramCaption(post.caption);
            const hasOverlay = Boolean(description || hashtags.length > 0);
            const ariaLabel = [
              description,
              hashtags.length > 0 ? hashtags.join(' ') : '',
              post.isVideo ? 'Video' : '',
              'View on Instagram',
            ]
              .filter(Boolean)
              .join('. ');

            return (
              <li key={post.id}>
                <a
                  className="instagram-grid__link"
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ariaLabel}
                >
                  <img
                    className="instagram-grid__img"
                    src={post.imageSrc}
                    alt={post.alt}
                    width={400}
                    height={400}
                    loading="lazy"
                    decoding="async"
                  />
                  {hasOverlay && (
                    <span className="instagram-grid__overlay">
                      {description && <span className="instagram-grid__caption">{description}</span>}
                      {hashtags.length > 0 && (
                        <span className="instagram-grid__tags">
                          {hashtags.map((tag) => (
                            <span className="instagram-grid__tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  )}
                  {post.isVideo && (
                    <span className="instagram-grid__badge" aria-hidden="true">
                      ▶
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="instagram-embed instagram-embed--fallback">
          <p>
            No recent posts to show. Follow us on{' '}
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              {site.instagramHandle}
            </a>
            .
          </p>
        </div>
      )}
    </>
  );
}
