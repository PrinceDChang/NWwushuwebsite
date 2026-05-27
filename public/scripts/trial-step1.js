import { saveTrialData, getTrialData } from './trial-storage.js';

const params = new URLSearchParams(window.location.search);
const classPref = params.get('class');
if (classPref === 'kids' || classPref === 'adult') {
  saveTrialData({ classType: classPref });
}

const form = document.getElementById('trial-step1-form');
const existing = getTrialData();

if (existing.fullName) form.fullName.value = existing.fullName;
if (existing.gender) form.gender.value = existing.gender;
if (existing.birthday) form.birthday.value = existing.birthday;
if (existing.experience) form.experience.value = existing.experience;
if (existing.comment) form.comment.value = existing.comment;
if (existing.guardianName) form.guardianName.value = existing.guardianName;
if (existing.guardianEmail) form.guardianEmail.value = existing.guardianEmail;
if (existing.guardianPhone) form.guardianPhone.value = existing.guardianPhone;
if (existing.guardianRelation) form.guardianRelation.value = existing.guardianRelation;
if (existing.isMinor === 'yes') form.isMinor.checked = true;

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const isMinor = form.isMinor.checked;

  if (isMinor && fd.get('guardianRelation')?.toString().toLowerCase() === 'self') {
    alert('For participants under 18, emergency contact must be a parent or guardian.');
    return;
  }

  saveTrialData({
    step: 1,
    fullName: fd.get('fullName'),
    gender: fd.get('gender'),
    birthday: fd.get('birthday'),
    experience: fd.get('experience'),
    comment: fd.get('comment'),
    isMinor: isMinor ? 'yes' : 'no',
    guardianName: fd.get('guardianName'),
    guardianEmail: fd.get('guardianEmail'),
    guardianPhone: fd.get('guardianPhone'),
    guardianRelation: fd.get('guardianRelation'),
  });

  window.location.href = '/trial/agreements/';
});
