import { useEffect } from 'react';
import CTABand from '../../components/CTABand';
import FAQSection from '../../components/FAQSection';
import Layout from '../../components/Layout';
import PageHero from '../../components/PageHero';
import { faqItems } from '../../data/faq';
import { site } from '../../data/site';

export default function ContactPage() {
  useEffect(() => {
    if (window.location.hash !== '#contact-form') return;
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

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
        <div className="container contact-embed">
          <p className="text-muted text-center" style={{ marginBottom: '0.35rem' }}>
            We typically reply within <strong>{site.replyTime}</strong>.
          </p>
          <p className="text-muted text-center" style={{ marginBottom: '2rem' }}>
            or email us direct at{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>

          <h2 className="section__title">Send a message</h2>
          <div className="google-form-embed" id="contact-form">
            <iframe
              title="Northwest Wushu contact form"
              src={site.googleFormEmbed}
              loading="lazy"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </section>

      <FAQSection items={faqItems} variant="light" id="contact-faq" />
      <CTABand />
    </Layout>
  );
}
