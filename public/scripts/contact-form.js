const form = document.getElementById('contact-form');
const formId = form?.dataset.formspreeId;

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!formId || formId.startsWith('your_')) {
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

  try {
    const res = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('fail');
    window.location.href = '/contact/thank-you/';
  } catch {
    alert('Could not send your message. Please email northwestwushu.2008@gmail.com directly.');
    submit.disabled = false;
    submit.textContent = 'Send Message';
  }
});
