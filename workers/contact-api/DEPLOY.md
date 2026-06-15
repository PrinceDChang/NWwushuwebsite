# Deploy the contact form backend

Follow these steps in order. Each step takes about 2–5 minutes.

---

## Part 1 — Resend (email delivery)

### 1. Create a Resend account
1. Go to [resend.com](https://resend.com) and sign up (free tier is enough).
2. Open **API Keys** → **Create API Key** → name it `nw-wushu-contact`.
3. Copy the key (starts with `re_`). You’ll use it in Part 2.

### 2. Verify your sending domain (required for production)
To email anyone (not just yourself), verify `nwwushu.com`:

1. In Resend: **Domains** → **Add Domain** → enter `nwwushu.com`.
2. Resend shows DNS records (SPF, DKIM, etc.).
3. Add those records at your domain registrar (where you bought `nwwushu.com`).
4. Wait for Resend to show **Verified** (often 5–30 minutes).

After verification, set the sender in `workers/contact-api/wrangler.toml`:

```toml
FROM_EMAIL = "Northwest Wushu <contact@nwwushu.com>"
```

**Before verification:** Resend only delivers to the email you signed up with. Use that email temporarily as `OWNER_EMAIL` for testing, or finish domain verification first.

---

## Part 2 — Cloudflare Worker (API)

Run these in your terminal from the project folder:

```bash
cd "workers/contact-api"
npm install
npx wrangler login
```

`wrangler login` opens a browser — approve access to your Cloudflare account (create one free if needed).

Store your Resend key as a Worker secret:

```bash
npx wrangler secret put RESEND_API_KEY
# Paste your re_... key when prompted
```

Deploy:

```bash
npm run deploy
```

Copy the URL from the output, e.g.:

```
https://nw-wushu-contact-api.your-name.workers.dev
```

Test it (replace with your URL and a real email you can check):

```bash
curl -X POST "https://nw-wushu-contact-api.YOUR-SUBDOMAIN.workers.dev/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "YOUR_EMAIL@example.com",
    "interest": "General Question",
    "message": "Testing the contact API."
  }'
```

You should get `{"ok":true}` and two emails.

---

## Part 3 — Connect the website

### Local development

Create `.env` in the **project root** (copy from `.env.example`):

```env
PUBLIC_CONTACT_API_URL=https://nw-wushu-contact-api.YOUR-SUBDOMAIN.workers.dev
PUBLIC_FORMSPREE_TRIAL_ID=your_trial_form_id
```

Restart the Astro dev server:

```bash
npm run dev
```

Submit the form at [http://localhost:4321/contact/](http://localhost:4321/contact/).

### Production (GitHub Pages)

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret:**
   - Name: `PUBLIC_CONTACT_API_URL`
   - Value: `https://nw-wushu-contact-api.YOUR-SUBDOMAIN.workers.dev`
3. Push to `main` (or re-run the Deploy workflow) so the build picks up the secret.

---

## Part 4 — Allow your live domain (if needed)

If the form works locally but fails on the live site with “Origin not allowed”, add your URL to `workers/contact-api/wrangler.toml`:

```toml
ALLOWED_ORIGINS = "http://localhost:4321,...,https://nwwushu.com,https://www.nwwushu.com"
```

Then redeploy:

```bash
cd workers/contact-api && npm run deploy
```

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| `503 Email service is not configured` | Run `wrangler secret put RESEND_API_KEY` again |
| `403 Origin not allowed` | Add your site URL to `ALLOWED_ORIGINS` and redeploy |
| Emails only reach your Resend signup email | Verify `nwwushu.com` in Resend |
| `Could not send your message` on live site | Check `PUBLIC_CONTACT_API_URL` GitHub secret and redeploy |
| Gmail reply doesn’t go to visitor | Owner email must have `Reply-To` — use Reply in Gmail, not Forward |

---

## Quick reference

| What | Where |
|------|--------|
| Owner inbox | `northwestwushu.2008@gmail.com` (in `wrangler.toml`) |
| API code | `workers/contact-api/src/index.ts` |
| Form script | `public/scripts/contact-form.js` |
| Resend dashboard | [resend.com/emails](https://resend.com/emails) |
