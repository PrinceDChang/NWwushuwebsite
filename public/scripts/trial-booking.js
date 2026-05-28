import { saveTrialData, getTrialData, clearTrialData } from './trial-storage.js';

const nwBase = () => (typeof window !== 'undefined' && window.NW_BASE) || '/';

const SLOTS = {
  kids: { label: 'Kids Wushu', time: '10:00 AM – 11:00 AM' },
  adult: { label: 'Teen & Adult Wushu', time: '11:00 AM – 1:00 PM' },
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toISODateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const trialData = getTrialData();
const hasAccess = Boolean(trialData.step && trialData.step >= 2);

if (!hasAccess) {
  window.location.href = `${nwBase()}trial/agreements/`;
}

const form = document.getElementById('trial-booking-form');
if (!form) {
  /* not on booking page */
} else {
  const formId = form.dataset.formspreeId;
  const classType = trialData.classType || 'kids';
  const classRadios = form.querySelectorAll('input[name="classType"]');

  let viewYear = new Date().getFullYear();
  let viewMonth = new Date().getMonth();
  let selectedDate = trialData.selectedDate || null;

  const monthLabel = document.getElementById('cal-month');
  const grid = document.getElementById('cal-grid');
  const selectedLabel = document.getElementById('selected-date-label');
  const selectedInput = document.getElementById('selected-date-input');
  const timeSlotBtn = document.getElementById('time-slot');
  const submitBtn = document.getElementById('submit-trial');
  const step3Col = document.getElementById('trial-step-3');

  classRadios.forEach((r) => {
    if (r.value === classType) r.checked = true;
    r.addEventListener('change', () => updateSlotLabel(r.value));
  });

  updateSlotLabel(classType);
  updateStep3State();

  document.getElementById('cal-prev')?.addEventListener('click', () => {
    viewMonth -= 1;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    }
    renderCalendar();
  });

  document.getElementById('cal-next')?.addEventListener('click', () => {
    viewMonth += 1;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    }
    renderCalendar();
  });

  function updateSlotLabel(type) {
    const slot = SLOTS[type] || SLOTS.kids;
    if (timeSlotBtn) {
      timeSlotBtn.textContent = slot.time;
      timeSlotBtn.dataset.time = slot.time;
    }
    saveTrialData({ classType: type });
  }

  function updateStep3State() {
    const locked = !selectedDate;
    step3Col?.classList.toggle('trial-booking__col--locked', locked);
    step3Col?.setAttribute('aria-disabled', locked ? 'true' : 'false');

    if (submitBtn) submitBtn.disabled = locked;
    if (timeSlotBtn) {
      timeSlotBtn.disabled = locked;
      timeSlotBtn.setAttribute('aria-pressed', locked ? 'false' : 'true');
    }

    if (selectedInput) selectedInput.value = selectedDate || '';

    if (locked && selectedLabel) {
      selectedLabel.textContent = 'Select a date above to continue';
    }
  }

  function renderCalendar() {
    if (!monthLabel || !grid) return;

    const first = new Date(viewYear, viewMonth, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    monthLabel.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
    grid.innerHTML = '';

    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach((d) => {
      const el = document.createElement('span');
      el.className = 'calendar__dow';
      el.textContent = d;
      grid.appendChild(el);
    });

    for (let i = 0; i < startPad; i++) {
      const empty = document.createElement('span');
      empty.className = 'calendar__day calendar__day--empty';
      empty.setAttribute('aria-hidden', 'true');
      grid.appendChild(empty);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewYear, viewMonth, day);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'calendar__day';
      btn.textContent = String(day);

      const iso = toISODateLocal(date);
      const isSaturday = date.getDay() === 6;
      const isFuture = date >= today;

      if (isSaturday && isFuture) {
        btn.classList.add('calendar__day--sat');
        btn.dataset.date = iso;
        btn.setAttribute('aria-label', date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
        if (iso === selectedDate) {
          btn.classList.add('calendar__day--selected');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.setAttribute('aria-pressed', 'false');
        }
        btn.onclick = () => selectDate(iso, date);
      } else {
        btn.disabled = true;
        btn.setAttribute('aria-hidden', 'true');
      }

      grid.appendChild(btn);
    }

    if (selectedDate) {
      const d = new Date(selectedDate + 'T12:00:00');
      if (!Number.isNaN(d.getTime())) updateSelectedLabel(d);
    }
  }

  function selectDate(iso, date) {
    selectedDate = iso;
    saveTrialData({ selectedDate: iso });
    renderCalendar();
    updateSelectedLabel(date);
    updateStep3State();
  }

  function updateSelectedLabel(date) {
    if (!selectedLabel) return;
    const opts = { weekday: 'long', month: 'long', day: 'numeric' };
    selectedLabel.textContent = date.toLocaleDateString('en-US', opts);
  }

  document.getElementById('back-btn')?.addEventListener('click', () => {
    window.location.href = `${nwBase()}trial/agreements/`;
  });

  submitBtn?.addEventListener('click', async () => {
    if (!hasAccess) {
      window.location.href = `${nwBase()}trial/agreements/`;
      return;
    }

    const current = getTrialData();
    const type = form.querySelector('input[name="classType"]:checked')?.value || 'kids';
    if (!selectedDate) {
      alert('Please select a Saturday for your trial.');
      return;
    }
    if (!formId || formId.startsWith('your_')) {
      alert('Trial form is not configured yet. Add PUBLIC_FORMSPREE_TRIAL_ID to your .env file.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const slot = SLOTS[type];
    const payload = {
      _subject: `Trial request: ${current.fullName}`,
      form_type: 'trial',
      student_name: current.fullName,
      gender: current.gender,
      birthday: current.birthday,
      experience: current.experience,
      comment: current.comment || '',
      is_minor: current.isMinor,
      emergency_contact_name: current.guardianName || '',
      emergency_contact_email: current.guardianEmail || '',
      emergency_contact_phone: current.guardianPhone || '',
      emergency_contact_relation: current.guardianRelation || '',
      class_type: type,
      class_label: slot.label,
      requested_date: selectedDate,
      requested_time: slot.time,
      waiver_accepted: 'yes',
      photo_release: current.photoRelease,
      email: current.guardianEmail,
      _replyto: current.guardianEmail,
    };

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submit failed');
      saveTrialData({
        step: 3,
        classType: type,
        submittedAt: new Date().toISOString(),
      });
      const confirm = {
        ...getTrialData(),
        selectedDate,
        time: slot.time,
        classLabel: slot.label,
      };
      sessionStorage.setItem('nw_wushu_trial_confirm', JSON.stringify(confirm));
      clearTrialData();
      window.location.href = `${nwBase()}trial/confirmation/`;
    } catch (err) {
      alert('Something went wrong. Please try again or email us directly.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit request';
    }
  });

  renderCalendar();
}
