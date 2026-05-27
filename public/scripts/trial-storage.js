const STORAGE_KEY = 'nw_wushu_trial';

export function getTrialData() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveTrialData(partial) {
  const next = { ...getTrialData(), ...partial };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearTrialData() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function requireStep(minStep) {
  const data = getTrialData();
  if (!data.step || data.step < minStep) {
    const routes = { 2: '/trial/', 3: '/trial/agreements/' };
    window.location.href = routes[minStep] || '/trial/';
    return null;
  }
  return data;
}
