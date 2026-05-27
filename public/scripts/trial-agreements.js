import { requireStep, saveTrialData, getTrialData } from './trial-storage.js';

if (!requireStep(1)) {
  /* redirected */
} else {
  const form = document.getElementById('trial-agreements-form');
  const data = getTrialData();
  if (data.waiverAccepted) form.waiverAccepted.checked = true;
  if (data.photoRelease) form.photoRelease.value = data.photoRelease;

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.waiverAccepted.checked) {
      alert('You must accept the waiver to continue.');
      return;
    }
    const photo = form.photoRelease.value;
    if (!photo) {
      alert('Please choose a photo release option.');
      return;
    }
    saveTrialData({
      step: 2,
      waiverAccepted: true,
      photoRelease: photo,
    });
    window.location.href = '/trial/booking/';
  });

  document.getElementById('back-btn')?.addEventListener('click', () => {
    window.location.href = '/trial/';
  });
}
