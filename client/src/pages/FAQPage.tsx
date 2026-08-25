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
      />
      <FAQSection items={faqItems} variant="light" id="faq" title="Frequently Asked Questions" />
    </Layout>
  );
}
