import profileMeta from '../data/instagram-profile.json';
import postsMeta from '../data/instagram-posts.json';

type PostsMeta = Record<string, { caption: string; isVideo: boolean }>;

export type InstagramPost = {
  id: string;
  shortcode: string;
  permalink: string;
  imageSrc: string;
  alt: string;
  caption: string;
  isVideo: boolean;
};

export type InstagramProfile = {
  username: string;
  fullName: string;
  followers: number;
  following: number;
  profileImageSrc: string;
  profileUrl: string;
};

export function parseInstagramCaption(caption: string): {
  description: string;
  hashtags: string[];
} {
  const normalized = caption.replace(/\s+/g, ' ').trim();
  if (!normalized) return { description: '', hashtags: [] };

  const hashtagRegex = /#[^\s#]+/gu;
  const hashtags = normalized.match(hashtagRegex) ?? [];
  const description = normalized.replace(hashtagRegex, '').replace(/\s+/g, ' ').trim();
  return { description, hashtags };
}

export const instagramProfile = profileMeta as InstagramProfile;

export const instagramPosts: InstagramPost[] = Object.entries(postsMeta as PostsMeta).map(
  ([shortcode, meta]) => ({
    id: shortcode,
    shortcode,
    permalink: meta.isVideo
      ? `https://www.instagram.com/reel/${shortcode}/`
      : `https://www.instagram.com/p/${shortcode}/`,
    imageSrc: `/images/instagram/${shortcode}.jpg`,
    alt: meta.caption || `Instagram post ${shortcode}`,
    caption: meta.caption,
    isVideo: meta.isVideo,
  }),
);
