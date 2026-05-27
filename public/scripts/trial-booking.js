import { requireStep, saveTrialData, getTrialData, clearTrialData } from './trial-storage.js';

const SLOTS = {
  kids: { label: 'Kids Wushu', time: '10:00 AM – 11:00 AM' },
  adult: { label: 'Teen & Adult Wushu', time: '11:00 AM – 1:00 PM' },
};

if (!requireStep(2)) {
  /* redirected */
} else {
  const data = getTrialData();
  const form = document.getElementById('trial-booking-form');
  const formId = form?.dataset.formspreeId;
  const classType = data.classType || 'kids';
  const classRadios = form?.querySelectorAll('input[name="classType"]');

  classRadios?.forEach((r) => {
    if (r.value === classType) r.checked = true;
    r.addEventListener('change', () => updateSlotLabel(r.value));
  });

  updateSlotLabel(classType);

  let viewYear = new Date().getFullYear();
  let viewMonth = new Date().getMonth();
  let selectedDate = data.selectedDate || null;

  const monthLabel = document.getElementById('cal-month');
  const grid = document.getElementById('cal-grid');
  const selectedLabel = document.getElementById('selected-date-label');
  const timeSlotBtn = document.getElementById('time-slot');
  const submitBtn = document.getElementById('submit-trial');

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
      timeSlotBtn.setAttribute('aria-pressed', 'true');
    }
    saveTrialData({ classType: type });
  }

  function renderCalendar() {
    const first = new Date(viewYear, viewMonth, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    monthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;
    grid.innerHTML = '';

    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach((d) => {
      const el = document.createElement('span');
      el.className = 'calendar__dow';
      el.textContent = d;
      grid.appendChild(el);
    });

    for (let i = 0; i < startPad; i++) {
      const empty = document.createElement('span');
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

      if (date.getDay() === 6 && date >= today) {
        btn.classList.add('calendar__day--sat');
        const iso = date.toISOString().slice(0, 10);
        if (iso === selectedDate) btn.classList.add('calendar__day--selected');
        btn.addEventListener('click', () => selectDate(iso, date));
      } else {
        btn.disabled = true;
      }
      grid.appendChild(btn);
    }

    if (selectedDate) {
      const d = new Date(selectedDate + 'T12:00:00');
      updateSelectedLabel(d);
    }
  }

  function selectDate(iso, date) {
    selectedDate = iso;
    saveTrialData({ selectedDate: iso });
    renderCalendar();
    updateSelectedLabel(date);
  }

  function updateSelectedLabel(date) {
    const opts = { weekday: 'long', month: 'long', day: 'numeric' };
    selectedLabel.textContent = date.toLocaleDateString('en-US', opts);
  }

  document.getElementById('back-btn')?.addEventListener('click', () => {
    window.location.href = '/trial/agreements/';
  });

  submitBtn?.addEventListener('click', async () => {
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
      window.location.href = '/trial/confirmation/';
    } catch (err) {
      alert('Something went wrong. Please try again or email us directly.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit request';
    }
  });

  renderCalendar();
}
