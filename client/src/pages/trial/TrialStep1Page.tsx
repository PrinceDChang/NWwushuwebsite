import { FormEvent, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EmailField from '../../components/EmailField';
import Layout from '../../components/Layout';
import PageHero from '../../components/PageHero';
import TrialStepper from '../../components/TrialStepper';
import { getTrialData, saveTrialData } from '../../lib/trialStorage';

export default function TrialStep1Page() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const existing = useMemo(() => {
    const classPref = params.get('class');
    if (classPref === 'kids' || classPref === 'adult') {
      saveTrialData({ classType: classPref });
    }
    return getTrialData();
  }, [params]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const isMinor = Boolean(form.querySelector<HTMLInputElement>('#isMinor')?.checked);

    if (isMinor && fd.get('guardianRelation')?.toString().toLowerCase() === 'self') {
      alert('For participants under 18, emergency contact must be a parent or guardian.');
      return;
    }

    saveTrialData({
      step: 1,
      fullName: String(fd.get('fullName') || ''),
      gender: String(fd.get('gender') || ''),
      birthday: String(fd.get('birthday') || ''),
      experience: String(fd.get('experience') || ''),
      comment: String(fd.get('comment') || ''),
      isMinor: isMinor ? 'yes' : 'no',
      guardianName: String(fd.get('guardianName') || ''),
      guardianEmail: String(fd.get('guardianEmail') || ''),
      guardianPhone: String(fd.get('guardianPhone') || ''),
      guardianRelation: String(fd.get('guardianRelation') || ''),
    });

    navigate('/trial/agreements/');
  }

  return (
    <Layout title="Free Trial Sign Up" bodyClass="trial-page">
      <PageHero title="Free Trial Sign Up" variant="image" imageSrc="/images/studio-training.jpg" />

      <div className="container container--narrow trial-flow">
        <TrialStepper current={1} />

        <form id="trial-step1-form" className="form-grid" onSubmit={onSubmit}>
          <h2 className="section__title">Personal information</h2>
          <div className="form-field">
            <label className="required" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              autoComplete="name"
              placeholder="Full name"
              defaultValue={existing.fullName}
            />
          </div>
          <div className="form-grid form-grid--2">
            <div className="form-field">
              <label className="required" htmlFor="gender">
                Gender
              </label>
              <select id="gender" name="gender" required defaultValue={existing.gender || ''}>
                <option value="">Select</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div className="form-field">
              <label className="required" htmlFor="birthday">
                Birthday
              </label>
              <input id="birthday" name="birthday" type="date" required defaultValue={existing.birthday} />
            </div>
          </div>
          <div className="form-field">
            <label className="required" htmlFor="experience">
              Athlete experience
            </label>
            <select id="experience" name="experience" required defaultValue={existing.experience || ''}>
              <option value="">Select</option>
              <option value="None">No prior martial arts</option>
              <option value="Some">Some experience</option>
              <option value="Competitive">Competitive / advanced</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="comment">Comment</label>
            <textarea id="comment" name="comment" placeholder="Anything we should know?" defaultValue={existing.comment} />
          </div>

          <div className="form-field">
            <label>
              <input type="checkbox" name="isMinor" id="isMinor" defaultChecked={existing.isMinor === 'yes'} />
              Participant is under 18 — I am the parent or legal guardian completing this form
            </label>
          </div>

          <h2 className="section__title">Emergency contact</h2>
          <div className="form-field">
            <label className="required" htmlFor="guardianName">
              Full name
            </label>
            <input
              id="guardianName"
              name="guardianName"
              required
              autoComplete="name"
              placeholder="Full name"
              defaultValue={existing.guardianName}
            />
          </div>
          <div className="form-field">
            <label className="required" htmlFor="guardianEmail">
              Email
            </label>
            <EmailField id="guardianEmail" name="guardianEmail" required defaultValue={existing.guardianEmail} />
          </div>
          <div className="form-field">
            <label className="required" htmlFor="guardianPhone">
              Phone
            </label>
            <input
              id="guardianPhone"
              name="guardianPhone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              defaultValue={existing.guardianPhone}
            />
          </div>
          <div className="form-field">
            <label className="required" htmlFor="guardianRelation">
              Relationship
            </label>
            <input
              id="guardianRelation"
              name="guardianRelation"
              required
              placeholder="e.g. Parent, Self"
              defaultValue={existing.guardianRelation}
            />
          </div>

          <div className="form-actions form-actions--end">
            <button type="submit" className="btn btn--primary">
              Next →
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
