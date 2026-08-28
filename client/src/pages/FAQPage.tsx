import { Link } from 'react-router-dom';
import CTABand from '../components/CTABand';
import FAQSection from '../components/FAQSection';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import { faqItems } from '../data/faq';
import { site } from '../data/site';

export default function FAQPage() {
  return (
    <Layout title="FAQ" description={`Frequently asked questions about ${site.name}.`}>
      <PageHero
        title="FAQ"
        subtitle="Answers to common questions about classes, trials, and training at Northwest Wushu."
        variant="image"
        imageSrc="/images/faq-hero.jpg"
        imageAlt="Northwest Wushu students in traditional uniforms posing for a Lunar New Year performance"
        imagePosition="center 10%"
        imageParallax
      />
      <FAQSection
        items={faqItems}
        variant="light"
        id="faq"
        title="Frequently Asked Questions"
        afterList={
          <aside className="faq-contact" aria-labelledby="faq-contact-heading">
            <h2 id="faq-contact-heading" className="faq-contact__title">
              Can’t find your answer?
            </h2>
            <p className="faq-contact__text">
              Ask a more personal question and we’ll reply by email.
            </p>
            <Link
              to="/contact/?from=faq&topic=General%20Question#contact-form"
              className="btn btn--primary faq-contact__btn"
            >
              Ask a question
            </Link>
          </aside>
        }
      />
      <CTABand />
    </Layout>
  );
}
