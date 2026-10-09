import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/contact/ContactPage';
import ContactThankYouPage from './pages/contact/ThankYouPage';
import FAQPage from './pages/FAQPage';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import PolicyPage from './pages/PolicyPage';
import SchedulePage from './pages/SchedulePage';
import WaiversPage from './pages/WaiversPage';
import { site } from './data/site';

function TrailingSlash() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    if (pathname !== '/' && !pathname.endsWith('/')) {
      window.history.replaceState(null, '', `${pathname}/${search}${hash}`);
    }
  }, [pathname, search, hash]);
  return null;
}

function TrialFormRedirect() {
  useEffect(() => {
    window.location.replace(site.trialSignupUrl);
  }, []);
  return (
    <p className="container" style={{ padding: '2rem 1rem' }}>
      <a href={site.trialSignupUrl} target="_blank" rel="noopener noreferrer">
        Continue to free trial sign-up
      </a>
    </p>
  );
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''));
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView();
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <TrailingSlash />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about/*" element={<AboutPage />} />
        <Route path="/schedule/*" element={<SchedulePage />} />
        <Route path="/location/*" element={<LocationPage />} />
        <Route path="/contact/thank-you/*" element={<ContactThankYouPage />} />
        <Route path="/contact/*" element={<ContactPage />} />
        <Route path="/trial/*" element={<TrialFormRedirect />} />
        <Route path="/policy/*" element={<PolicyPage />} />
        <Route path="/waivers/*" element={<WaiversPage />} />
        <Route path="/faq/*" element={<FAQPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
