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
      <FAQSection items={faqItems} variant="light" id="faq" title="Frequently Asked Questions" />
    </Layout>
  );
}
