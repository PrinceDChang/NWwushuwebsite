import { clearTrialData } from './trial-storage.js';

const nwBase = () => (typeof window !== 'undefined' && window.NW_BASE) || '/';
const LOCATION = 'Seattle Armory, 305 Harrison St, Seattle, WA 98109';

const TIME_RANGES = {
  kids: { start: [10, 0], end: [11, 0] },
  adult: { start: [11, 0], end: [13, 0] },
};

let data = {};
try {
  data = JSON.parse(sessionStorage.getItem('nw_wushu_trial_confirm') || '{}');
} catch {
  data = {};
}

const isLocalDev =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

function nextSaturdayISO() {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilSaturday);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

if (!data.selectedDate && isLocalDev && new URLSearchParams(window.location.search).get('preview') === '1') {
  data = {
    selectedDate: nextSaturdayISO(),
    classType: 'kids',
    time: '10:00 AM – 11:00 AM',
    classLabel: 'Kids Wushu',
    guardianEmail: 'demo@example.com',
    fullName: 'Demo Student',
  };
  sessionStorage.setItem('nw_wushu_trial_confirm', JSON.stringify(data));
}

if (!data.selectedDate) {
  window.location.href = `${nwBase()}trial/`;
}

const dateEl = document.getElementById('confirm-date');
const timeEl = document.getElementById('confirm-time');
const classEl = document.getElementById('confirm-class');
const emailPartEl = document.getElementById('confirm-email-part');
const emailValueEl = document.getElementById('confirm-email-value');
const googleCal = document.getElementById('cal-google');
const appleCal = document.getElementById('cal-apple');
const microsoftCal = document.getElementById('cal-microsoft');

function getEventTimes() {
  const type = data.classType === 'adult' ? 'adult' : 'kids';
  const range = TIME_RANGES[type];
  const [y, m, d] = data.selectedDate.split('-').map(Number);
  return {
    start: new Date(y, m - 1, d, range.start[0], range.start[1]),
    end: new Date(y, m - 1, d, range.end[0], range.end[1]),
  };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function toLocalStamp(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

function toIsoLocal(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function buildEventMeta() {
  const { start, end } = getEventTimes();
  const title = 'Northwest Wushu Trial Lesson';
  const details = [
    data.classLabel || 'Trial class',
    data.fullName ? `Student: ${data.fullName}` : '',
    'Status: Pending confirmation from Northwest Wushu.',
    'Wear comfortable sportswear and athletic shoes.',
  ]
    .filter(Boolean)
    .join('\n');

  return { start, end, title, details };
}

function buildGoogleCalendarUrl() {
  const { start, end, title, details } = buildEventMeta();
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toLocalStamp(start)}/${toLocalStamp(end)}`,
    details,
    location: LOCATION,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildOutlookCalendarUrl() {
  const { start, end, title, details } = buildEventMeta();
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title,
    body: details,
    location: LOCATION,
    startdt: toIsoLocal(start),
    enddt: toIsoLocal(end),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function downloadAppleCalendar() {
  const { start, end, title, details } = buildEventMeta();
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Northwest Wushu//Trial Confirmation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:nw-wushu-trial-${data.selectedDate}@northwestwushu`,
    `DTSTAMP:${toLocalStamp(new Date())}`,
    `DTSTART:${toLocalStamp(start)}`,
    `DTEND:${toLocalStamp(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
    `LOCATION:${LOCATION}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nw-wushu-trial.ics';
  a.click();
  URL.revokeObjectURL(url);
}

if (data.selectedDate && dateEl) {
  const d = new Date(data.selectedDate + 'T12:00:00');
  dateEl.textContent = d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

if (data.time && timeEl) timeEl.textContent = data.time;
if (data.classLabel && classEl) classEl.textContent = data.classLabel;

const email = data.guardianEmail?.trim();
if (email && emailPartEl && emailValueEl) {
  emailValueEl.textContent = email;
  emailPartEl.hidden = false;
}

if (googleCal) {
  googleCal.href = buildGoogleCalendarUrl();
  googleCal.target = '_blank';
  googleCal.rel = 'noopener noreferrer';
}

if (microsoftCal) {
  microsoftCal.href = buildOutlookCalendarUrl();
  microsoftCal.target = '_blank';
  microsoftCal.rel = 'noopener noreferrer';
}

appleCal?.addEventListener('click', downloadAppleCalendar);

clearTrialData();
