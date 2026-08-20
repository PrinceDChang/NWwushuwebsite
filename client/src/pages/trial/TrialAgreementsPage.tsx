import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import PageHero from '../../components/PageHero';
import TrialStepper from '../../components/TrialStepper';
import { photoReleaseText, waiverText } from '../../data/waivers';
import { getTrialData, saveTrialData } from '../../lib/trialStorage';

export default function TrialAgreementsPage() {
  const navigate = useNavigate();
  const data = getTrialData();
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!data.step || data.step < 1) {
      navigate('/trial/', { replace: true });
    }
  }, [data.step, navigate]);

  if (!data.step || data.step < 1) return null;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setFormError('');
    const waiver = form.querySelector<HTMLInputElement>('input[name="waiverAccepted"]');
    const photo = form.querySelector<HTMLInputElement>('input[name="photoRelease"]:checked');
    if (!waiver?.checked) {
      setFormError('You must accept the waiver to continue.');
      return;
    }
    if (!photo?.value) {
      setFormError('Please choose a photo release option.');
      return;
    }
    saveTrialData({
      step: 2,
      waiverAccepted: true,
      photoRelease: photo.value,
    });
    navigate('/trial/booking/');
  }

  return (
    <Layout title="Free Trial — Waivers" bodyClass="trial-page">
      <PageHero title="Free Trial Sign Up" variant="image" imageSrc="/images/studio-training.jpg" />

      <div className="container container--narrow trial-flow">
        <TrialStepper current={2} />

        <form id="trial-agreements-form" className="form-grid" onSubmit={onSubmit}>
          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}
          <h2 className="section__title">Waiver</h2>
          <div className="legal-scroll" tabIndex={0} role="region" aria-label="Waiver text">
            {waiverText.split('\n').map((line, i) => (
              <p key={`w-${i}`} style={{ margin: '0 0 0.5rem' }}>
                {line}
              </p>
            ))}
          </div>
          <label>
            <input type="checkbox" name="waiverAccepted" required defaultChecked={Boolean(data.waiverAccepted)} />
            I understand and have read and agree to the waiver
          </label>

          <h2 className="section__title">Photo release</h2>
          <div className="legal-scroll" tabIndex={0} role="region" aria-label="Photo release text">
            {photoReleaseText.split('\n').map((line, i) => (
              <p key={`p-${i}`} style={{ margin: '0 0 0.5rem' }}>
                {line}
              </p>
            ))}
          </div>
          <fieldset className="form-field">
            <legend className="required">Photo release choice</legend>
            <label>
              <input
                type="radio"
                name="photoRelease"
                value="agree"
                required
                defaultChecked={data.photoRelease === 'agree'}
              />
              I agree to the photo release
            </label>
            <label>
              <input
                type="radio"
                name="photoRelease"
                value="decline"
                defaultChecked={data.photoRelease === 'decline'}
              />
              I do not consent to the photo release
            </label>
          </fieldset>

          <div className="form-actions">
            <button type="button" className="btn btn--outline" onClick={() => navigate('/trial/')}>
              ← Back
            </button>
            <button type="submit" className="btn btn--primary">
              Next →
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
