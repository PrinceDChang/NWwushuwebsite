import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/contact/ContactPage';
import ContactThankYouPage from './pages/contact/ThankYouPage';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import PolicyPage from './pages/PolicyPage';
import SchedulePage from './pages/SchedulePage';
import TrialAgreementsPage from './pages/trial/TrialAgreementsPage';
import TrialBookingPage from './pages/trial/TrialBookingPage';
import TrialConfirmationPage from './pages/trial/TrialConfirmationPage';
import TrialStep1Page from './pages/trial/TrialStep1Page';
import WaiversPage from './pages/WaiversPage';

function TrailingSlash() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    if (pathname !== '/' && !pathname.endsWith('/')) {
      window.history.replaceState(null, '', `${pathname}/${search}${hash}`);
    }
  }, [pathname, search, hash]);
  return null;
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
        <Route path="/trial/agreements/*" element={<TrialAgreementsPage />} />
        <Route path="/trial/booking/*" element={<TrialBookingPage />} />
        <Route path="/trial/confirmation/*" element={<TrialConfirmationPage />} />
        <Route path="/trial/*" element={<TrialStep1Page />} />
        <Route path="/policy/*" element={<PolicyPage />} />
        <Route path="/waivers/*" element={<WaiversPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
