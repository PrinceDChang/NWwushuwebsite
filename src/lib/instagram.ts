import { mkdir, readFile, readdir, stat, unlink, writeFile } from 'node:fs/promises';
import https from 'node:https';
import { join } from 'node:path';
import fallbackPostsMeta from '../data/instagram-captions.json';

/** Post shape used by the homepage Instagram grid. */
export type InstagramPost = {
  id: string;
  shortcode: string;
  permalink: string;
  /** Site-relative path, e.g. /images/instagram/ABC123.jpg */
  imageSrc: string;
  alt: string;
  /** Full Instagram caption (description + hashtags). */
  caption: string;
  isVideo: boolean;
};

/** Splits a caption into body text and hashtag tokens. */
export function parseInstagramCaption(caption: string): {
  description: string;
  hashtags: string[];
} {
  const normalized = caption.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return { description: '', hashtags: [] };
  }

  const hashtagRegex = /#[^\s#]+/gu;
  const hashtags = normalized.match(hashtagRegex) ?? [];
  const description = normalized.replace(hashtagRegex, '').replace(/\s+/g, ' ').trim();
  return { description, hashtags };
}

export type InstagramProfile = {
  username: string;
  fullName: string;
  followers: number;
  following: number;
  profileImageSrc: string;
  profileUrl: string;
};

export type InstagramFeedData = {
  profile: InstagramProfile | null;
  posts: InstagramPost[];
};

const IG_APP_ID = '936619743392459';
const PROFILE_API = 'https://www.instagram.com/api/v1/users/web_profile_info/';
const CACHE_DIR = join(process.cwd(), 'public/images/instagram');
const PROFILE_META_FILE = join(CACHE_DIR, 'profile-meta.json');
const POSTS_META_FILE = join(CACHE_DIR, 'posts-meta.json');
/** Re-use cached files newer than this (dev hot reload). */
const CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000;

type IgCaptionEdge = { node: { text: string } };
type IgUser = {
  username: string;
  full_name: string;
  profile_pic_url_hd?: string;
  profile_pic_url?: string;
  edge_followed_by?: { count: number };
  edge_follow?: { count: number };
  edge_owner_to_timeline_media?: { edges?: { node: IgMediaNode }[] };
};
type IgMediaNode = {
  id: string;
  shortcode: string;
  display_url?: string;
  thumbnail_src?: string;
  is_video?: boolean;
  accessibility_caption?: string | null;
  edge_media_to_caption?: { edges: IgCaptionEdge[] };
};

function getCaption(node: IgMediaNode): string {
  const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text;
  if (caption) return caption.replace(/\s+/g, ' ').trim();
  if (node.accessibility_caption) return node.accessibility_caption.replace(/\s+/g, ' ').trim();
  return '';
}

function captionAlt(caption: string): string {
  if (!caption) return 'Instagram post';
  const { description } = parseInstagramCaption(caption);
  const text = description || caption;
  return text.slice(0, 200);
}

function extensionFromContentType(contentType: string | undefined, url: string): string {
  if (contentType?.includes('webp')) return '.webp';
  if (contentType?.includes('png')) return '.png';
  if (contentType?.includes('jpeg') || contentType?.includes('jpg')) return '.jpg';
  if (url.includes('.webp')) return '.webp';
  if (url.includes('.png')) return '.png';
  return '.jpg';
}

/** Node fetch adds Sec-Fetch headers Instagram rejects; use https directly. */
function httpsGet(
  url: string,
  options: { headers?: Record<string, string>; binary?: boolean } = {},
): Promise<{ statusCode: number; headers: https.IncomingHttpHeaders; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: options.headers ?? {} }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        httpsGet(next, options).then(resolve).catch(reject);
        return;
      }

      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode ?? 0,
          headers: res.headers,
          body: Buffer.concat(chunks),
        });
      });
    });
    req.on('error', reject);
  });
}

function httpsGetJson<T>(url: string): Promise<T> {
  return httpsGet(url, {
    headers: {
      'X-IG-App-ID': IG_APP_ID,
      'User-Agent': 'Mozilla/5.0 (compatible; NorthwestWushu/1.0)',
      Accept: 'application/json',
    },
  }).then(({ statusCode, body }) => {
    if (statusCode !== 200) {
      throw new Error(`Instagram profile fetch failed (${statusCode})`);
    }
    try {
      return JSON.parse(body.toString('utf8')) as T;
    } catch {
      throw new Error('Instagram profile response was not JSON');
    }
  });
}

async function isCacheFresh(filePath: string): Promise<boolean> {
  try {
    const { mtimeMs } = await stat(filePath);
    return Date.now() - mtimeMs < CACHE_MAX_AGE_MS;
  } catch {
    return false;
  }
}

/** Downloads a remote image into public/images/instagram (same-origin, no hotlink block). */
async function cacheRemoteImage(
  filenameBase: string,
  remoteUrl: string,
  { refresh = false }: { refresh?: boolean } = {},
): Promise<string> {
  await mkdir(CACHE_DIR, { recursive: true });

  const files = await readdir(CACHE_DIR).catch(() => [] as string[]);
  const cached = files.find((name) => name.startsWith(`${filenameBase}.`));
  if (cached && !refresh) {
    const filePath = join(CACHE_DIR, cached);
    if (await isCacheFresh(filePath)) {
      return `/images/instagram/${cached}`;
    }
  }

  const { statusCode, headers, body } = await httpsGet(remoteUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; NorthwestWushu/1.0)',
      Referer: 'https://www.instagram.com/',
      Accept: 'image/*',
    },
    binary: true,
  });

  if (statusCode !== 200 || body.length === 0) {
    throw new Error(`Failed to download Instagram image (${statusCode})`);
  }

  const ext = extensionFromContentType(headers['content-type'], remoteUrl);
  const filename = `${filenameBase}${ext}`;
  const filePath = join(CACHE_DIR, filename);

  // Remove stale file if extension changed
  if (cached && cached !== filename) {
    await unlink(join(CACHE_DIR, cached)).catch(() => {});
  }

  await writeFile(filePath, body);
  return `/images/instagram/${filename}`;
}

async function cachePostImage(shortcode: string, remoteUrl: string): Promise<string> {
  return cacheRemoteImage(shortcode, remoteUrl);
}

async function fetchIgUser(handle: string): Promise<IgUser | null> {
  const url = `${PROFILE_API}?username=${encodeURIComponent(handle)}`;
  const json = await httpsGetJson<{ data?: { user?: IgUser } }>(url);
  return json.data?.user ?? null;
}

async function saveProfileMeta(profile: InstagramProfile): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(PROFILE_META_FILE, JSON.stringify(profile, null, 2));
}

type PostsMeta = Record<string, { caption: string; isVideo: boolean }>;

async function savePostsMeta(posts: InstagramPost[]): Promise<void> {
  const meta: PostsMeta = {};
  for (const post of posts) {
    meta[post.shortcode] = { caption: post.caption, isVideo: post.isVideo };
  }
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(POSTS_META_FILE, JSON.stringify(meta, null, 2));
}

async function loadPostsMeta(): Promise<PostsMeta> {
  const meta: PostsMeta = { ...(fallbackPostsMeta as PostsMeta) };
  try {
    const raw = await readFile(POSTS_META_FILE, 'utf8');
    Object.assign(meta, JSON.parse(raw) as PostsMeta);
  } catch {
    // Use committed fallback captions only
  }
  return meta;
}

async function loadProfileMeta(): Promise<InstagramProfile | null> {
  try {
    const raw = await readFile(PROFILE_META_FILE, 'utf8');
    const parsed = JSON.parse(raw) as InstagramProfile;
    if (!parsed.username) return null;
    if (parsed.profileImageSrc.startsWith('/')) return parsed;
    parsed.profileImageSrc = '/images/instagram/profile.jpg';
    return parsed;
  } catch {
    return null;
  }
}

async function buildProfile(user: IgUser): Promise<InstagramProfile | null> {
  const remotePic = user.profile_pic_url_hd ?? user.profile_pic_url;
  if (!user.username || !remotePic) return null;

  let profileImageSrc = remotePic;
  try {
    profileImageSrc = await cacheRemoteImage('profile', remotePic);
  } catch {
    // Use last cached avatar if download fails
    try {
      await stat(join(CACHE_DIR, 'profile.jpg'));
      profileImageSrc = '/images/instagram/profile.jpg';
    } catch {
      // Fall back to remote URL if caching fails
    }
  }

  const profile: InstagramProfile = {
    username: user.username,
    fullName: user.full_name || user.username,
    followers: user.edge_followed_by?.count ?? 0,
    following: user.edge_follow?.count ?? 0,
    profileImageSrc,
    profileUrl: `https://www.instagram.com/${user.username}/`,
  };

  await saveProfileMeta(profile).catch(() => {});
  return profile;
}

function toPost(node: IgMediaNode): Omit<InstagramPost, 'imageSrc'> & { remoteImageUrl: string } | null {
  const remoteImageUrl = node.display_url ?? node.thumbnail_src;
  if (!remoteImageUrl || !node.shortcode) return null;

  const caption = getCaption(node);

  return {
    id: node.id,
    shortcode: node.shortcode,
    permalink: `https://www.instagram.com/p/${node.shortcode}/`,
    remoteImageUrl,
    caption,
    alt: captionAlt(caption),
    isVideo: Boolean(node.is_video),
  };
}

async function loadCachedPosts(limit: number): Promise<InstagramPost[]> {
  const files = await readdir(CACHE_DIR).catch(() => [] as string[]);
  const meta = await loadPostsMeta();
  const posts: InstagramPost[] = [];

  for (const file of files) {
    if (file.startsWith('profile') || file.endsWith('.json') || file === '.gitkeep') continue;
    const shortcode = file.replace(/\.[^.]+$/, '');
    if (!shortcode) continue;

    const caption = meta[shortcode]?.caption ?? '';
    posts.push({
      id: shortcode,
      shortcode,
      permalink: `https://www.instagram.com/p/${shortcode}/`,
      imageSrc: `/images/instagram/${file}`,
      caption,
      alt: captionAlt(caption),
      isVideo: meta[shortcode]?.isVideo ?? false,
    });
    if (posts.length >= limit) break;
  }

  return posts;
}

async function buildPosts(user: IgUser, limit: number): Promise<InstagramPost[]> {
  const edges = user.edge_owner_to_timeline_media?.edges ?? [];
  const posts: InstagramPost[] = [];

  for (const { node } of edges) {
    const draft = toPost(node);
    if (!draft) continue;

    try {
      const imageSrc = await cachePostImage(draft.shortcode, draft.remoteImageUrl);
      posts.push({
        id: draft.id,
        shortcode: draft.shortcode,
        permalink: draft.permalink,
        imageSrc,
        caption: draft.caption,
        alt: draft.alt,
        isVideo: draft.isVideo,
      });
    } catch {
      // Skip posts we cannot cache (CDN block, etc.)
    }

    if (posts.length >= limit) break;
  }

  if (posts.length > 0) {
    await savePostsMeta(posts).catch(() => {});
  }

  return posts;
}

/** Profile + recent posts in one API request; thumbnails cached locally. */
export async function fetchInstagramFeed(
  username: string,
  limit = 6,
): Promise<InstagramFeedData> {
  const handle = username.replace(/^@/, '');
  const cachedProfile = await loadProfileMeta();

  try {
    const user = await fetchIgUser(handle);
    if (!user) {
      return { profile: cachedProfile, posts: [] };
    }

    const [profile, posts] = await Promise.all([buildProfile(user), buildPosts(user, limit)]);
    const resolvedPosts = posts.length > 0 ? posts : await loadCachedPosts(limit);
    return { profile: profile ?? cachedProfile, posts: resolvedPosts };
  } catch {
    const posts = await loadCachedPosts(limit);
    return { profile: cachedProfile, posts };
  }
}

/** @deprecated Use fetchInstagramFeed */
export async function fetchInstagramPosts(
  username: string,
  limit = 6,
): Promise<InstagramPost[]> {
  const { posts } = await fetchInstagramFeed(username, limit);
  return posts;
}
