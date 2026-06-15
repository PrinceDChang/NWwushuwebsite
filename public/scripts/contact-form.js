import { initEmailAutocomplete } from './email-autocomplete.js';

const form = document.getElementById('contact-form');
const apiUrl = form?.dataset.contactApiUrl?.replace(/\/$/, '');
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

  const apiMissing = !apiUrl || apiUrl.includes('your_');
  if (apiMissing && !isLocalDev) {
    alert('Contact form is not configured yet. Add PUBLIC_CONTACT_API_URL to your .env file.');
    return;
  }

  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Sending…';

  const fd = new FormData(form);
  const body = Object.fromEntries(fd.entries());

  if (apiMissing && isLocalDev) {
    redirectToThankYou(body.email || 'demo@example.com');
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/contact`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.error || 'fail');
    }

    redirectToThankYou(body.email);
  } catch (err) {
    const message =
      err instanceof Error && err.message && err.message !== 'fail'
        ? err.message
        : 'Could not send your message. Please email northwestwushu.2008@gmail.com directly.';
    alert(message);
    submit.disabled = false;
    submit.textContent = 'Send message';
  }
});
