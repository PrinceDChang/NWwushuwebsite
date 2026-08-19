import { Link, useSearchParams } from 'react-router-dom';
import ConfirmCardIcon from '../../components/ConfirmCardIcon';
import FAQSection from '../../components/FAQSection';
import Layout from '../../components/Layout';
import PageHero from '../../components/PageHero';
import { faqItems } from '../../data/faq';
import { site } from '../../data/site';

export default function ContactThankYouPage() {
  const [params] = useSearchParams();
  const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const email = params.get('email')?.trim() || (isLocalDev && params.get('preview') === '1' ? 'demo@example.com' : '');

  return (
    <Layout title="Message Received" showStickyCta={false}>
      <PageHero
        title="Contact Us"
        variant="image"
        imageSrc="/images/contact-team.jpg"
        imageAlt="Northwest Wushu team in competition uniforms at Seattle International Martial Arts"
        imagePosition="center 22%"
        heroScale={1.25}
      />

      <section className="section">
        <div className="container container--narrow contact-thank-you">
          <p className="contact-thank-you__lead">We received your message!</p>
          <p className="contact-thank-you__intro text-muted text-center">
            Thank you for reaching out to Northwest Wushu. A member of our team will review your question and get back
            to you within <strong>{site.replyTime}</strong>.
          </p>

          <div className="confirm-card">
            <ConfirmCardIcon />
            <h2 className="contact-thank-you__card-title">Your message is on its way</h2>
            {email ? (
              <p className="contact-thank-you__email text-muted">
                A confirmation email has been sent to <strong>{email}</strong>.
              </p>
            ) : (
              <p className="contact-thank-you__email-fallback text-muted">
                If you included an email address, you should receive a confirmation shortly.
              </p>
            )}
            <ul className="contact-thank-you__next">
              <li>Check your inbox &amp; spam for our reply.</li>
              <li>
                Add <a href={`mailto:${site.email}`}>{site.email}</a> to your contacts so our emails reach you.
              </li>
            </ul>
          </div>

          <div className="contact-thank-you__actions">
            <Link to="/" className="btn btn--primary">
              Go back to homepage
            </Link>
            <Link to="/contact/" className="btn btn--outline">
              Send another message
            </Link>
          </div>
        </div>
      </section>

      <FAQSection items={faqItems.slice(0, 6)} variant="dark" />
    </Layout>
  );
}
