# Northwest Wushu Academy Website

Modern marketing site for [Northwest Wushu](https://nwwushu.com) — class info, contact, and multi-step **free trial** sign-up.

Built with **Vite + React** and an **Express** API. Hosted on **Render**.

## Local development

```bash
npm install
cp .env.example .env
# Add RESEND_API_KEY to .env (optional in local dev — forms still complete)
npm run dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321). Vite proxies `/api` to Express on port 3000.

## Production (Render)

One Node web service builds the React app and serves it from Express, including:

- `POST /api/contact` — owner notification + visitor confirmation via Resend
- `POST /api/trial` — trial request emails via Resend
- `GET /api/trial-spots` — Saturday capacity for the booking calendar
- All existing page URLs (`/about/`, `/trial/booking/`, `/location/#summer`, …)

### Render setup

1. Push this repo to GitHub.
2. In [Render](https://dashboard.render.com): **New → Blueprint** and select the repo, or **New → Web Service** with:
   - **Build:** `npm ci && npm run build`
   - **Start:** `npm start`
   - **Health check:** `/api/health`
3. Set environment variables:
   - `RESEND_API_KEY`
   - `OWNER_EMAIL=northwestwushu.2008@gmail.com`
   - `FROM_EMAIL=Northwest Wushu <onboarding@resend.dev>` (or your verified Resend domain)
   - `ALLOWED_ORIGINS=https://your-service.onrender.com,https://nwwushu.com`

After deploy, point `nwwushu.com` at the Render service in DNS (Render → Custom Domain).

Without `RESEND_API_KEY`, local development still finishes the contact and trial flows; production returns an error until the key is set.

## Instagram feed

The homepage uses cached thumbnails in `public/images/instagram/`. After new posts, update those files (and `posts-meta.json` / `profile-meta.json`) and redeploy.

## Content to replace before launch

- Coach bios in `client/src/data/coaches.ts`
- Waiver / photo release in `client/src/data/waivers.ts`
- School policy in `client/src/pages/PolicyPage.tsx`
- Discord / YouTube URLs in `client/src/data/site.ts`
