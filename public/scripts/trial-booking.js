import { saveTrialData, getTrialData, clearTrialData } from './trial-storage.js';

const nwBase = () => (typeof window !== 'undefined' && window.NW_BASE) || '/';

const isLocalDev =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

function finishTrialBooking({ current, type, slot, selectedDate }) {
  saveTrialData({
    step: 3,
    classType: type,
    submittedAt: new Date().toISOString(),
  });
  const confirm = {
    ...getTrialData(),
    selectedDate,
    classType: type,
    time: slot.time,
    classLabel: slot.label,
    guardianEmail: current.guardianEmail,
    fullName: current.fullName,
  };
  sessionStorage.setItem('nw_wushu_trial_confirm', JSON.stringify(confirm));
  clearTrialData();
  window.location.href = `${nwBase()}trial/confirmation/`;
}

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
  const defaultCapacity = Number(form.dataset.classCapacity) || 25;

  let spotsData = { capacity: defaultCapacity, booked: { kids: {}, adult: {} } };
  let viewYear = new Date().getFullYear();
  let viewMonth = new Date().getMonth();
  let selectedDate = trialData.selectedDate || null;

  const monthLabel = document.getElementById('cal-month');
  const grid = document.getElementById('cal-grid');
  const selectedLabel = document.getElementById('selected-date-label');
  const selectedInput = document.getElementById('selected-date-input');
  const timeSlotBtn = document.getElementById('time-slot');
  const timeSlotTime = document.getElementById('time-slot-time');
  const timeSlotSpots = document.getElementById('time-slot-spots');
  const spotsNote = document.getElementById('trial-spots-note');
  const submitBtn = document.getElementById('submit-trial');
  const step3Col = document.getElementById('trial-step-3');

  const spotsUrl = `${nwBase()}data/trial-spots.json`;
  fetch(spotsUrl)
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((data) => {
      spotsData = {
        capacity: Number(data.capacity) || defaultCapacity,
        booked: {
          kids: data.booked?.kids || {},
          adult: data.booked?.adult || {},
        },
      };
      renderCalendar();
      updateSpotsUI();
      updateStep3State();
    })
    .catch(() => {
      /* keep default empty bookings — all spots open */
    });

  function currentClassType() {
    return form.querySelector('input[name="classType"]:checked')?.value || 'kids';
  }

  function spotsLeft(iso, type = currentClassType()) {
    if (!iso) return spotsData.capacity;
    const booked = Number(spotsData.booked?.[type]?.[iso] || 0);
    return Math.max(0, spotsData.capacity - booked);
  }

  function spotsLabel(left) {
    if (left <= 0) return 'Class full';
    if (left === 1) return '1 spot left';
    return `${left} spots left`;
  }

  classRadios.forEach((r) => {
    if (r.value === classType) r.checked = true;
    r.addEventListener('change', () => {
      updateSlotLabel(r.value);
      renderCalendar();
      updateSpotsUI();
      updateStep3State();
    });
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
    if (timeSlotTime) timeSlotTime.textContent = slot.time;
    if (timeSlotBtn) timeSlotBtn.dataset.time = slot.time;
    saveTrialData({ classType: type });
    updateSpotsUI();
  }

  function updateSpotsUI() {
    const left = spotsLeft(selectedDate);
    const cap = spotsData.capacity;

    if (timeSlotSpots) {
      timeSlotSpots.textContent = selectedDate
        ? spotsLabel(left)
        : 'Select a date to see remaining spots';
      timeSlotSpots.dataset.level =
        !selectedDate ? 'idle' : left <= 0 ? 'full' : left <= 5 ? 'low' : 'open';
    }

    timeSlotBtn?.classList.toggle('time-slot--full', Boolean(selectedDate) && left <= 0);

    if (spotsNote) {
      if (!selectedDate) {
        spotsNote.textContent = `We will confirm your spot within ${form.dataset.replyTime || '1–2 business days'}. Max ${cap} students per class.`;
      } else if (left <= 0) {
        spotsNote.textContent = `This class is full (${cap} of ${cap} spots taken). Please pick another Saturday.`;
      } else {
        spotsNote.textContent = `${left} of ${cap} spots left this Saturday. We will confirm your request within ${form.dataset.replyTime || '1–2 business days'}.`;
      }
    }
  }

  function updateStep3State() {
    const locked = !selectedDate;
    const left = spotsLeft(selectedDate);
    const full = Boolean(selectedDate) && left <= 0;
    step3Col?.classList.toggle('trial-booking__col--locked', locked);
    step3Col?.setAttribute('aria-disabled', locked ? 'true' : 'false');

    if (submitBtn) submitBtn.disabled = locked || full;
    if (timeSlotBtn) {
      timeSlotBtn.disabled = locked || full;
      timeSlotBtn.setAttribute('aria-pressed', locked || full ? 'false' : 'true');
    }

    if (selectedInput) selectedInput.value = selectedDate || '';

    if (locked && selectedLabel) {
      selectedLabel.textContent = 'Select a date above to continue';
    }

    updateSpotsUI();
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
        const left = spotsLeft(iso);
        btn.classList.add('calendar__day--sat');
        btn.dataset.date = iso;
        btn.innerHTML = `<span class="calendar__day-num">${day}</span><span class="calendar__day-spots">${left <= 0 ? 'Full' : left}</span>`;
        const pretty = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        btn.setAttribute('aria-label', `${pretty}, ${spotsLabel(left)}`);
        if (left <= 0) {
          btn.classList.add('calendar__day--full');
          btn.disabled = true;
        }
        if (iso === selectedDate) {
          btn.classList.add('calendar__day--selected');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.setAttribute('aria-pressed', 'false');
        }
        if (left > 0) btn.onclick = () => selectDate(iso, date);
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

    if (spotsLeft(selectedDate, type) <= 0) {
      alert('That class is full. Please pick another Saturday.');
      return;
    }

    const formMissing = !formId || formId.startsWith('your_');
    if (formMissing && !isLocalDev) {
      alert('Trial form is not configured yet. Add PUBLIC_FORMSPREE_TRIAL_ID to your .env file.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const slot = SLOTS[type];

    if (formMissing && isLocalDev) {
      finishTrialBooking({ current, type, slot, selectedDate });
      return;
    }

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
      finishTrialBooking({ current, type, slot, selectedDate });
    } catch (err) {
      alert('Something went wrong. Please try again or email us directly.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit request';
    }
  });

  renderCalendar();
}
