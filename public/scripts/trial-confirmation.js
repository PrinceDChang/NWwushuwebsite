import { clearTrialData } from './trial-storage.js';

let data = {};
try {
  data = JSON.parse(sessionStorage.getItem('nw_wushu_trial_confirm') || '{}');
} catch {
  data = {};
}

const dateEl = document.getElementById('confirm-date');
const timeEl = document.getElementById('confirm-time');
const classEl = document.getElementById('confirm-class');

if (data.selectedDate && dateEl) {
  const d = new Date(data.selectedDate + 'T12:00:00');
  dateEl.textContent = d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
if (data.time && timeEl) timeEl.textContent = data.time;
if (data.classLabel && classEl) classEl.textContent = data.classLabel;

const icsBtn = document.getElementById('add-calendar');
icsBtn?.addEventListener('click', () => {
  if (!data.selectedDate) return;
  const start = data.selectedDate.replace(/-/g, '');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'SUMMARY:Northwest Wushu Trial Lesson',
    `DESCRIPTION:${data.classLabel || 'Trial'} - Pending confirmation`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${start}`,
    'LOCATION:Seattle Armory, 305 Harrison St, Seattle, WA 98109',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nw-wushu-trial.ics';
  a.click();
  URL.revokeObjectURL(url);
});

clearTrialData();
