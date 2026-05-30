import { initEmailAutocomplete } from './email-autocomplete.js';

const form = document.getElementById('contact-form');
const formId = form?.dataset.formspreeId;
const nwBase = () => (typeof window !== 'undefined' && window.NW_BASE) || '/';

initEmailAutocomplete(document.getElementById('email'));

const isLocalDev =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

function redirectToThankYou(email) {
  const encoded = encodeURIComponent(String(email || ''));
  window.location.href = `${nwBase()}contact/thank-you/?email=${encoded}`;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formMissing = !formId || formId.startsWith('your_');
  if (formMissing && !isLocalDev) {
    alert('Contact form is not configured yet. Add PUBLIC_FORMSPREE_CONTACT_ID to your .env file.');
    return;
  }

  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Sending…';

  const fd = new FormData(form);
  const body = Object.fromEntries(fd.entries());
  body._subject = `Contact: ${body.first_name} ${body.last_name} — ${body.interest}`;
  body._replyto = body.email;

  if (formMissing && isLocalDev) {
    redirectToThankYou(body.email || 'demo@example.com');
    return;
  }

  try {
    const res = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('fail');
    redirectToThankYou(body.email);
  } catch {
    alert('Could not send your message. Please email northwestwushu.2008@gmail.com directly.');
    submit.disabled = false;
    submit.textContent = 'Send message';
  }
});
