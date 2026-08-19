const STORAGE_KEY = 'nw_wushu_trial';

export type TrialData = {
  step?: number;
  fullName?: string;
  gender?: string;
  birthday?: string;
  experience?: string;
  comment?: string;
  isMinor?: string;
  guardianName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  classType?: string;
  selectedDate?: string;
  waiverAccepted?: boolean;
  photoRelease?: string;
};

export function getTrialData(): TrialData {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') as TrialData;
  } catch {
    return {};
  }
}

export function saveTrialData(partial: Partial<TrialData>): TrialData {
  const next = { ...getTrialData(), ...partial };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearTrialData(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export type TrialConfirm = {
  selectedDate?: string;
  classType?: string;
  time?: string;
  classLabel?: string;
  guardianEmail?: string;
  fullName?: string;
};

export function getTrialConfirm(): TrialConfirm {
  try {
    return JSON.parse(sessionStorage.getItem('nw_wushu_trial_confirm') || '{}') as TrialConfirm;
  } catch {
    return {};
  }
}

export function saveTrialConfirm(data: TrialConfirm): void {
  sessionStorage.setItem('nw_wushu_trial_confirm', JSON.stringify(data));
}
