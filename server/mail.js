export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function sendResendEmail({ apiKey, from, to, subject, html, replyTo }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('Resend error', res.status, detail);
    throw new Error('Email delivery failed.');
  }
}

export function ownerContactHtml(data) {
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

export function visitorContactHtml(data) {
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

export function ownerTrialHtml(data) {
  return `
    <div style="font-family:DM Sans,Segoe UI,sans-serif;color:#0f1419;line-height:1.6;max-width:560px;">
      <h1 style="font-size:20px;margin:0 0 12px;">New free trial request</h1>
      <p style="margin:0 0 20px;color:#5c6570;">Reply to this email to confirm the spot with ${escapeHtml(data.student_name)}.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#5c6570;width:160px;">Student</td><td style="padding:8px 0;">${escapeHtml(data.student_name)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Class</td><td style="padding:8px 0;">${escapeHtml(data.class_label)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Date</td><td style="padding:8px 0;">${escapeHtml(data.requested_date)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Time</td><td style="padding:8px 0;">${escapeHtml(data.requested_time)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Gender</td><td style="padding:8px 0;">${escapeHtml(data.gender)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Birthday</td><td style="padding:8px 0;">${escapeHtml(data.birthday)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Experience</td><td style="padding:8px 0;">${escapeHtml(data.experience)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Minor</td><td style="padding:8px 0;">${escapeHtml(data.is_minor)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Emergency contact</td><td style="padding:8px 0;">${escapeHtml(data.emergency_contact_name)} (${escapeHtml(data.emergency_contact_relation)})</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(data.emergency_contact_email)}">${escapeHtml(data.emergency_contact_email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Phone</td><td style="padding:8px 0;">${escapeHtml(data.emergency_contact_phone)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Waiver</td><td style="padding:8px 0;">${escapeHtml(data.waiver_accepted)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Photo release</td><td style="padding:8px 0;">${escapeHtml(data.photo_release)}</td></tr>
      </table>
      <h2 style="font-size:16px;margin:24px 0 8px;">Comment</h2>
      <div style="white-space:pre-wrap;background:#fff5f4;border:1px solid #fdeae8;border-radius:12px;padding:16px;">${escapeHtml(data.comment || '—')}</div>
    </div>
  `;
}

export function visitorTrialHtml(data) {
  const first = String(data.student_name || '').split(' ')[0] || 'there';
  return `
    <div style="font-family:DM Sans,Segoe UI,sans-serif;color:#0f1419;line-height:1.6;max-width:560px;">
      <h1 style="font-size:22px;margin:0 0 12px;">We received your trial request</h1>
      <p style="margin:0 0 16px;">Hi ${escapeHtml(first)},</p>
      <p style="margin:0 0 16px;">Thank you for requesting a free trial at Northwest Wushu Academy. This request is <strong>pending confirmation</strong> — we typically reply within <strong>1–2 business days</strong>.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#5c6570;width:160px;">Class</td><td style="padding:8px 0;">${escapeHtml(data.class_label)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Requested date</td><td style="padding:8px 0;">${escapeHtml(data.requested_date)}</td></tr>
        <tr><td style="padding:8px 0;color:#5c6570;">Time</td><td style="padding:8px 0;">${escapeHtml(data.requested_time)}</td></tr>
      </table>
      <p style="margin:24px 0 0;">Please wear comfortable sportswear and athletic shoes. We are excited to meet you!</p>
      <p style="margin:16px 0 0;">— Northwest Wushu Academy<br>Seattle Armory, 305 Harrison St, Seattle, WA 98109</p>
    </div>
  `;
}
