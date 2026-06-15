export interface Env {
  RESEND_API_KEY: string;
  OWNER_EMAIL: string;
  FROM_EMAIL: string;
  ALLOWED_ORIGINS: string;
}

interface ContactPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
  _gotcha?: string;
}

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 5000;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function parseAllowedOrigins(raw: string): string[] {
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(origin: string | null, allowedOrigins: string[]): HeadersInit {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  origin: string | null,
  allowedOrigins: string[],
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin, allowedOrigins),
    },
  });
}

function validatePayload(payload: ContactPayload): { ok: true; data: Required<Pick<ContactPayload, 'first_name' | 'last_name' | 'email' | 'interest' | 'message'>> & { phone: string } } | { ok: false; error: string } {
  if (payload._gotcha?.trim()) {
    return { ok: false, error: 'Invalid submission.' };
  }

  const first_name = payload.first_name?.trim() ?? '';
  const last_name = payload.last_name?.trim() ?? '';
  const email = payload.email?.trim().toLowerCase() ?? '';
  const phone = payload.phone?.trim() ?? '';
  const interest = payload.interest?.trim() ?? '';
  const message = payload.message?.trim() ?? '';

  if (!first_name || !last_name) {
    return { ok: false, error: 'First and last name are required.' };
  }

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: 'A valid email address is required.' };
  }

  if (!interest) {
    return { ok: false, error: 'Please select an interest.' };
  }

  if (!message) {
    return { ok: false, error: 'Message is required.' };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` };
  }

  return {
    ok: true,
    data: { first_name, last_name, email, phone, interest, message },
  };
}

async function sendEmail(env: Env, payload: ResendEmailPayload): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('Resend error', res.status, detail);
    throw new Error('Email delivery failed.');
  }
}

function ownerEmailHtml(data: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}): string {
  const fullName = `${data.first_name} ${data.last_name}`;
  const phoneRow = data.phone
    ? `<tr><td style="padding:8px 0;color:#5c6570;">Phone</td><td style="padding:8px 0;"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td></tr>`
    : '';

  return `
    <div style="font-family:DM Sans,Segoe UI,sans-serif;color:#0f1419;line-height:1.6;max-width:560px;">
      <h1 style="font-size:20px;margin:0 0 12px;">New contact form message</h1>
      <p style="margin:0 0 20px;color:#5c6570;">Reply to this email to respond directly to ${escapeHtml(fullName)}.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#5c6570;width:120px;">Name</td><td style="padding:8px 0;">${escapeHtml(fullName)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        ${phoneRow}
        <tr><td style="padding:8px 0;color:#5c6570;">Interest</td><td style="padding:8px 0;">${escapeHtml(data.interest)}</td></tr>
      </table>
      <h2 style="font-size:16px;margin:24px 0 8px;">Message</h2>
      <div style="white-space:pre-wrap;background:#fff5f4;border:1px solid #fdeae8;border-radius:12px;padding:16px;">${escapeHtml(data.message)}</div>
    </div>
  `;
}

function confirmationEmailHtml(data: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}): string {
  const fullName = `${data.first_name} ${data.last_name}`;
  const phoneRow = data.phone
    ? `<tr><td style="padding:8px 0;color:#5c6570;">Phone</td><td style="padding:8px 0;">${escapeHtml(data.phone)}</td></tr>`
    : '';

  return `
    <div style="font-family:DM Sans,Segoe UI,sans-serif;color:#0f1419;line-height:1.6;max-width:560px;">
      <h1 style="font-size:22px;margin:0 0 12px;">We received your message</h1>
      <p style="margin:0 0 16px;">Hi ${escapeHtml(data.first_name)},</p>
      <p style="margin:0 0 16px;">Thank you for reaching out to Northwest Wushu Academy. We received your message and typically reply within <strong>1–2 business days</strong>.</p>
      <h2 style="font-size:16px;margin:24px 0 8px;">What you sent</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#5c6570;width:120px;">Name</td><td style="padding:8px 0;">${escapeHtml(fullName)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Email</td><td style="padding:8px 0;">${escapeHtml(data.email)}</td></tr>
        ${phoneRow}
        <tr><td style="padding:8px 0;color:#5c6570;">Interest</td><td style="padding:8px 0;">${escapeHtml(data.interest)}</td></tr>
      </table>
      <h2 style="font-size:16px;margin:24px 0 8px;">Message</h2>
      <div style="white-space:pre-wrap;background:#fff5f4;border:1px solid #fdeae8;border-radius:12px;padding:16px;">${escapeHtml(data.message)}</div>
      <p style="margin:24px 0 0;color:#5c6570;">If you need to add anything, reply to this email or contact us at <a href="mailto:northwestwushu.2008@gmail.com">northwestwushu.2008@gmail.com</a>.</p>
      <p style="margin:16px 0 0;">— Northwest Wushu Academy<br>Seattle Armory, 305 Harrison St, Seattle, WA 98109</p>
    </div>
  `;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin, allowedOrigins),
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed.' }, 405, origin, allowedOrigins);
    }

    if (origin && !allowedOrigins.includes(origin)) {
      return jsonResponse({ error: 'Origin not allowed.' }, 403, origin, allowedOrigins);
    }

    if (!env.RESEND_API_KEY) {
      return jsonResponse({ error: 'Email service is not configured.' }, 503, origin, allowedOrigins);
    }

    let payload: ContactPayload;
    try {
      payload = (await request.json()) as ContactPayload;
    } catch {
      return jsonResponse({ error: 'Invalid JSON body.' }, 400, origin, allowedOrigins);
    }

    const validated = validatePayload(payload);
    if (!validated.ok) {
      return jsonResponse({ error: validated.error }, 400, origin, allowedOrigins);
    }

    const data = validated.data;
    const fullName = `${data.first_name} ${data.last_name}`;

    try {
      await sendEmail(env, {
        from: env.FROM_EMAIL,
        to: [env.OWNER_EMAIL],
        reply_to: data.email,
        subject: `Contact: ${data.interest} — ${fullName}`,
        html: ownerEmailHtml(data),
      });

      await sendEmail(env, {
        from: env.FROM_EMAIL,
        to: [data.email],
        reply_to: env.OWNER_EMAIL,
        subject: 'We received your message — Northwest Wushu Academy',
        html: confirmationEmailHtml(data),
      });
    } catch {
      return jsonResponse(
        { error: 'Could not send your message. Please try again or email us directly.' },
        502,
        origin,
        allowedOrigins,
      );
    }

    return jsonResponse({ ok: true }, 200, origin, allowedOrigins);
  },
};
