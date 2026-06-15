# Northwest Wushu Academy Website

Modern marketing site for [Northwest Wushu](https://nwwushu.com) — class info, contact, and multi-step **free trial** sign-up.

Built with [Astro](https://astro.build) and deployed to **GitHub Pages**.

## Local development

```bash
npm install
cp .env.example .env
# Add Formspree form IDs to .env
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Contact form backend

The contact page uses a **Cloudflare Worker** API (not Formspree) to send:

- A confirmation email to the person who submitted the form
- A notification to `northwestwushu.2008@gmail.com` with **Reply-To** set so you can answer directly

See [`workers/contact-api/README.md`](workers/contact-api/README.md) for deploy steps.

Quick start:

```bash
cd workers/contact-api
npm install
npx wrangler login
npx wrangler secret put RESEND_API_KEY
npm run deploy
```

Add the Worker URL to `.env`:

```env
PUBLIC_CONTACT_API_URL=https://your-worker.workers.dev
```

For local API testing, run `npm run dev` inside `workers/contact-api` and set `PUBLIC_CONTACT_API_URL=http://localhost:8787`.

## Formspree setup (trial flow only)

1. Create a free account at [formspree.io](https://formspree.io).
2. Create a form for **Trial signup** → notifications to `northwestwushu.2008@gmail.com`
3. Enable **auto-reply** (Settings → Autoresponse) so parents get confirmation.
4. Copy the form ID into `.env`:

```env
PUBLIC_FORMSPREE_TRIAL_ID=efgh5678
```

5. For production, add the same key as a GitHub repository **Secret** (Settings → Secrets → Actions).

## GitHub Pages + custom domain

1. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys.
2. In the repo: **Settings → Pages → Build and deployment** → Source: **GitHub Actions**.
3. **Settings → Pages → Custom domain** → `nwwushu.com`.
4. At your domain registrar, add DNS records GitHub shows (usually `A` + `CNAME` for `www`).
5. `public/CNAME` contains `nwwushu.com`.

## Instagram feed

The homepage loads recent posts from **@northwestwushu** at build time. Thumbnails are downloaded into `public/images/instagram/` so they display reliably (Instagram’s CDN blocks hotlinking and URLs expire quickly).

After new Instagram posts, run `npm run build` or `npm run sync:instagram` and redeploy. Commit the cached images if you want the site to build without hitting Instagram’s API.

If the feed is empty in CI, Instagram may be rate-limiting the build — re-run the deploy or try again later.

## Content to replace before launch

- Coach bios in `src/data/coaches.ts`
- Waiver / photo release in `src/data/waivers.ts`
- School policy in `src/pages/policy.astro`
- Discord / YouTube URLs in `src/data/site.ts`
- Location interior photos on `src/pages/location.astro`

## Project structure

```
src/
  components/   # Header, footer, FAQ, CTA, etc.
  data/         # FAQ, classes, coaches, site config
  layouts/      # Base layout
  pages/        # All routes
public/
  images/       # Logo and class photos
  scripts/      # Trial flow + contact form (client-side)
```

## Trial sign-up flow

1. `/trial/` — student + emergency contact
2. `/trial/agreements/` — waiver + photo release
3. `/trial/booking/` — pick class type + Saturday (hybrid: request, staff confirms)
4. `/trial/confirmation/` — pending confirmation + FAQ

Submissions are stored in Formspree (upgrade for spreadsheet/dashboard export).
