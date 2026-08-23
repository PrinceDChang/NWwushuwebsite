import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ownerContactHtml,
  ownerTrialHtml,
  sendResendEmail,
  visitorContactHtml,
  visitorTrialHtml,
} from './mail.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const clientDist = join(rootDir, 'dist/client');
const spotsPath = join(rootDir, 'public/data/trial-spots.json');

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 5000;

function parseAllowedOrigins() {
  const fromEnv = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const extras = [
    process.env.RENDER_EXTERNAL_URL,
    'http://127.0.0.1:4321',
    'http://localhost:4321',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
  ].filter(Boolean);

  return [...new Set([...fromEnv, ...extras])];
}

const allowedOrigins = parseAllowedOrigins();

function originAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  try {
    const url = new URL(origin);
    return url.hostname === '127.0.0.1' || url.hostname === 'localhost';
  } catch {
    return false;
  }
}

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));
app.use(
  cors({
    origin(origin, callback) {
      if (originAllowed(origin)) callback(null, true);
      else callback(new Error('Origin not allowed'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/trial-spots', async (_req, res) => {
  try {
    const raw = await readFile(spotsPath, 'utf8');
    res.type('application/json').send(raw);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load trial spots.' });
  }
});

app.post('/api/contact', async (req, res) => {
  const origin = req.get('origin');
  if (origin && !originAllowed(origin)) {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }

  const payload = req.body || {};
  if (String(payload._gotcha || '').trim()) {
    return res.status(400).json({ error: 'Invalid submission.' });
  }

  const first_name = String(payload.first_name || '').trim();
  const last_name = String(payload.last_name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const interest = String(payload.interest || '').trim();
  const message = String(payload.message || '').trim();

  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'First and last name are required.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (!interest) {
    return res.status(400).json({ error: 'Please select an interest.' });
  }
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (!isProd) {
      console.log('[dev] contact skipped (no RESEND_API_KEY)', { first_name, last_name, email, interest });
      return res.json({ ok: true, dev: true });
    }
    return res.status(503).json({ error: 'Email service is not configured.' });
  }

  const owner = process.env.OWNER_EMAIL || 'northwestwushu.2008@gmail.com';
  const from = process.env.FROM_EMAIL || 'Northwest Wushu <onboarding@resend.dev>';
  const data = { first_name, last_name, email, phone, interest, message };
  const fullName = `${first_name} ${last_name}`;

  try {
    await sendResendEmail({
      apiKey,
      from,
      to: owner,
      replyTo: email,
      subject: `Contact: ${interest} — ${fullName}`,
      html: ownerContactHtml(data),
    });
  } catch {
    return res.status(502).json({
      error: 'Could not send your message. Please try again or email us directly.',
    });
  }

  // Confirmation to the visitor is best-effort (Resend sandbox / domain limits).
  try {
    await sendResendEmail({
      apiKey,
      from,
      to: email,
      replyTo: owner,
      subject: 'We received your message — Northwest Wushu Academy',
      html: visitorContactHtml(data),
    });
  } catch (err) {
    console.error('Visitor contact confirmation email failed', err);
  }

  return res.json({ ok: true });
});

app.post('/api/trial', async (req, res) => {
  const origin = req.get('origin');
  if (origin && !originAllowed(origin)) {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }

  const payload = req.body || {};
  const student_name = String(payload.student_name || '').trim();
  const emergency_contact_email = String(payload.emergency_contact_email || payload.email || '')
    .trim()
    .toLowerCase();
  const class_type = String(payload.class_type || '').trim();
  const requested_date = String(payload.requested_date || '').trim();

  if (!student_name || !EMAIL_RE.test(emergency_contact_email) || !class_type || !requested_date) {
    return res.status(400).json({ error: 'Please complete the trial form and try again.' });
  }

  const data = {
    student_name,
    gender: String(payload.gender || '').trim(),
    birthday: String(payload.birthday || '').trim(),
    experience: String(payload.experience || '').trim(),
    comment: String(payload.comment || '').trim(),
    is_minor: String(payload.is_minor || '').trim(),
    emergency_contact_name: String(payload.emergency_contact_name || '').trim(),
    emergency_contact_email,
    emergency_contact_phone: String(payload.emergency_contact_phone || '').trim(),
    emergency_contact_relation: String(payload.emergency_contact_relation || '').trim(),
    class_type,
    class_label: String(payload.class_label || '').trim(),
    requested_date,
    requested_time: String(payload.requested_time || '').trim(),
    waiver_accepted: String(payload.waiver_accepted || '').trim(),
    photo_release: String(payload.photo_release || '').trim(),
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (!isProd) {
      console.log('[dev] trial skipped (no RESEND_API_KEY)', data);
      return res.json({ ok: true, dev: true });
    }
    return res.status(503).json({ error: 'Email service is not configured.' });
  }

  const owner = process.env.OWNER_EMAIL || 'northwestwushu.2008@gmail.com';
  const from = process.env.FROM_EMAIL || 'Northwest Wushu <onboarding@resend.dev>';

  try {
    await sendResendEmail({
      apiKey,
      from,
      to: owner,
      replyTo: emergency_contact_email,
      subject: `Trial request: ${student_name}`,
      html: ownerTrialHtml(data),
    });
  } catch {
    return res.status(502).json({
      error: 'Something went wrong. Please try again or email us directly.',
    });
  }

  // Confirmation to the visitor is best-effort (Resend sandbox / domain limits).
  try {
    await sendResendEmail({
      apiKey,
      from,
      to: emergency_contact_email,
      replyTo: owner,
      subject: 'We received your trial request — Northwest Wushu Academy',
      html: visitorTrialHtml(data),
    });
  } catch (err) {
    console.error('Visitor trial confirmation email failed', err);
  }

  return res.json({ ok: true });
});

if (isProd) {
  app.use(express.static(clientDist, { index: false, maxAge: '1h' }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    if (extname(req.path)) return next();
    res.sendFile(join(clientDist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  if (err?.message === 'Origin not allowed') {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Server error.' });
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Northwest Wushu server listening on ${port} (${isProd ? 'production' : 'api-only'})`);
});

server.on('error', (err) => {
  if (err?.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other process or set PORT in .env.`);
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});
