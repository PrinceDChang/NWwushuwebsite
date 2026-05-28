# Northwest Wushu Academy Website

Modern marketing site for [Northwest Wushu](https://northwestwushu.com) — class info, contact, and multi-step **free trial** sign-up.

Built with [Astro](https://astro.build) and deployed to **GitHub Pages**.

## Local development

```bash
npm install
cp .env.example .env
# Add Formspree form IDs to .env
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Formspree setup

1. Create a free account at [formspree.io](https://formspree.io).
2. Create two forms:
   - **Contact** → notifications to `northwestwushu.2008@gmail.com`
   - **Trial signup** → same inbox
3. Enable **auto-reply** on both (Settings → Autoresponse) so parents get confirmation.
4. Copy each form’s ID into `.env`:

```env
PUBLIC_FORMSPREE_CONTACT_ID=abcd1234
PUBLIC_FORMSPREE_TRIAL_ID=efgh5678
```

5. For production, add the same keys as GitHub repository **Secrets** (Settings → Secrets → Actions).

## GitHub Pages + custom domain

1. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys.
2. In the repo: **Settings → Pages → Build and deployment** → Source: **GitHub Actions**.
3. **Settings → Pages → Custom domain** → `northwestwushu.com`.
4. At your domain registrar, add DNS records GitHub shows (usually `A` + `CNAME` for `www`).
5. `public/CNAME` already contains `northwestwushu.com`.

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
