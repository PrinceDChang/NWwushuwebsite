import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CTABand from '../../components/CTABand';
import EmailField from '../../components/EmailField';
import FAQSection from '../../components/FAQSection';
import Layout from '../../components/Layout';
import PageHero from '../../components/PageHero';
import { faqItems } from '../../data/faq';
import { site } from '../../data/site';

const CONTACT_TOPICS = [
  'Free Trial Class',
  'General Question',
  'Schedule / Classes',
  'Location / Directions',
  'Other',
] as const;

export default function ContactPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState('');
  const topicFromUrl = params.get('topic');
  const defaultTopic =
    topicFromUrl && (CONTACT_TOPICS as readonly string[]).includes(topicFromUrl)
      ? topicFromUrl
      : '';
  const fromFaq = params.get('from') === 'faq';

  useEffect(() => {
    if (window.location.hash !== '#contact-form') return;
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setFormError('');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    setSending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || 'fail');
      navigate(`/contact/thank-you/?email=${encodeURIComponent(String(body.email || ''))}`);
    } catch (err) {
      const message =
        err instanceof Error && err.message && err.message !== 'fail'
          ? err.message
          : 'Could not send your message. Please email northwestwushu.2008@gmail.com directly.';
      setFormError(message);
      setSending(false);
    }
  }

  return (
    <Layout title="Contact">
      <PageHero
        title="Contact Us"
        variant="image"
        imageSrc="/images/contact-team.jpg"
        imageAlt="Northwest Wushu team in competition uniforms at Seattle International Martial Arts"
        imagePosition="center 22%"
        heroScale={1.25}
      />

      <section className="section">
        <div className="container container--narrow">
          <p className="text-muted text-center" style={{ marginBottom: '0.35rem' }}>
            We typically reply within <strong>{site.replyTime}</strong>.
          </p>
          <p className="text-muted text-center" style={{ marginBottom: '2rem' }}>
            or email us direct at{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>

          <h2 className="section__title">Send a message</h2>
          <p className="form-required-note">Required fields are marked with an asterisk (*).</p>
          <form id="contact-form" className="form-grid" onSubmit={onSubmit}>
            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
            <div className="form-grid form-grid--2">
              <div className="form-field">
                <label className="required" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  placeholder="Your first name"
                />
              </div>
              <div className="form-field">
                <label className="required" htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  placeholder="Your last name"
                />
              </div>
            </div>
            <div className="form-field">
              <label className="required" htmlFor="email">
                Email
              </label>
              <EmailField id="email" name="email" required />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Phone (optional)</label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="form-field">
              <label className="required" htmlFor="interest">
                Topic
              </label>
              <select id="interest" name="interest" required defaultValue={defaultTopic}>
                <option value="" disabled hidden>
                  Select a topic
                </option>
                {CONTACT_TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="required" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                placeholder={
                  fromFaq
                    ? 'What’s your question? Include any details that will help us reply.'
                    : 'Tell us about your experience level and goals…'
                }
              />
            </div>
            <div className="form-actions form-actions--end">
              <button type="submit" className="btn btn--primary" disabled={sending}>
                {sending ? 'Sending…' : 'Send message'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <FAQSection items={faqItems} variant="light" id="contact-faq" />
      <CTABand />
    </Layout>
  );
}
