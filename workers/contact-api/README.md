# Contact form API

Serverless backend for the contact page. Sends two emails on each submission:

1. **Owner notification** → `northwestwushu.2008@gmail.com` with `Reply-To` set to the visitor’s email
2. **Visitor confirmation** → the address they entered on the form

Runs on [Cloudflare Workers](https://workers.cloudflare.com/) so it works alongside the static GitHub Pages site.

## Prerequisites

1. A free [Cloudflare](https://dash.cloudflare.com/) account
2. A free [Resend](https://resend.com/) account and API key
3. A verified sending domain in Resend (recommended: `nwwushu.com`)  
   Until verified, Resend only delivers to the email on your Resend account.

## Setup

```bash
cd workers/contact-api
npm install
npx wrangler login
npx wrangler secret put RESEND_API_KEY
npm run deploy
```

After deploy, copy the Worker URL (e.g. `https://nw-wushu-contact-api.your-subdomain.workers.dev`).

## Site configuration

In the project root `.env`:

```env
PUBLIC_CONTACT_API_URL=https://nw-wushu-contact-api.your-subdomain.workers.dev
```

For production, add the same variable to your GitHub Actions secrets or build environment.

## Local development

Run the Worker locally:

```bash
cd workers/contact-api
npm run dev
```

Then in the root `.env`:

```env
PUBLIC_CONTACT_API_URL=http://localhost:8787
```

Restart `npm run dev` for the Astro site so it picks up the new env var.

## Configuration

Edit `wrangler.toml` to change:

| Variable | Purpose |
|----------|---------|
| `OWNER_EMAIL` | Inbox for new contact messages |
| `FROM_EMAIL` | Sender shown on both emails (must match a verified Resend domain) |
| `ALLOWED_ORIGINS` | Comma-separated site URLs allowed to call the API |

## API

`POST /contact`

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "phone": "+1 555 000 0000",
  "interest": "General Question",
  "message": "Hello!",
  "_gotcha": ""
}
```

Success: `200 { "ok": true }`

Errors: `400`, `403`, `502` with `{ "error": "..." }`
