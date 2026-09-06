export type OperatorVettingStatus = 'NotStarted' | 'Submitted' | 'Passed' | 'Failed';

export interface OperatorGuarantor {
  id?: string;
  fullName: string;
  phoneNumber: string;
  occupation: string;
  idType: string;
  idNumber: string;
}

export interface OperatorDetail {
  id: string;
  fullName: string;
  phoneNumber: string;
  licenseNumber: string;
  licenseCategory?: string;
  yearsOfExperience: number;
  vettingStatus: OperatorVettingStatus;
  passedVetting?: boolean;
  feedback?: string | null;
  guarantors: OperatorGuarantor[];
  licenseDocumentUrl?: string | null;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'string' && v) return v;
  }
  return undefined;
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
  }
  return undefined;
}

export function normalizeVettingStatus(raw: unknown): OperatorVettingStatus {
  const s = typeof raw === 'string' ? raw.toLowerCase().replace(/\s+/g, '') : '';
  if (s === 'passed' || s.includes('pass')) return 'Passed';
  if (s === 'failed' || s.includes('fail')) return 'Failed';
  if (s === 'submitted' || s.includes('review') || s.includes('pending')) return 'Submitted';
  return 'NotStarted';
}

function normalizeGuarantor(raw: unknown): OperatorGuarantor | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const fullName = pickString(r, ['fullName', 'name']);
  const phoneNumber = pickString(r, ['phoneNumber', 'phone']);
  const occupation = pickString(r, ['occupation']);
  const idType = pickString(r, ['idType']);
  const idNumber = pickString(r, ['idNumber']);
  if (!fullName || !phoneNumber || !occupation || !idType || !idNumber) return null;
  return {
    id: pickString(r, ['id']),
    fullName,
    phoneNumber,
    occupation,
    idType,
    idNumber,
  };
}

export function normalizeOperator(raw: unknown): OperatorDetail | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const id = pickString(r, ['id', 'operatorId']);
  if (!id) return null;

  const guarantorsRaw = r.guarantors ?? r.guarantorList;
  const guarantors = Array.isArray(guarantorsRaw)
    ? guarantorsRaw.map(normalizeGuarantor).filter((g): g is OperatorGuarantor => g !== null)
    : [];

  const years =
    pickNumber(r, ['yearsOfExperience', 'experienceYears', 'yearsExperience']) ?? 0;

  const passed =
    typeof r.passedVetting === 'boolean'
      ? r.passedVetting
      : typeof r.hasPassedVetting === 'boolean'
        ? r.hasPassedVetting
        : undefined;

  let status = normalizeVettingStatus(
    r.vettingStatus ?? r.status ?? r.vettingState,
  );
  if (passed === true) status = 'Passed';
  if (passed === false && status === 'NotStarted') status = 'Failed';

  return {
    id,
    fullName: pickString(r, ['fullName', 'name']) ?? 'Operator',
    phoneNumber: pickString(r, ['phoneNumber', 'phone']) ?? '—',
    licenseNumber: pickString(r, ['licenseNumber', 'licenceNumber']) ?? '—',
    licenseCategory: pickString(r, ['licenseCategory', 'licenceCategory']),
    yearsOfExperience: years,
    vettingStatus: status,
    passedVetting: passed ?? status === 'Passed',
    feedback: pickString(r, ['feedback', 'vettingFeedback', 'failureReason']) ?? null,
    guarantors,
    licenseDocumentUrl: pickString(r, ['licenseDocumentUrl', 'licenseUrl']) ?? null,
  };
}

export function normalizeOperatorsList(raw: unknown): OperatorDetail[] {
  const items = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as Record<string, unknown>).items)
      ? ((raw as Record<string, unknown>).items as unknown[])
      : [];
  return items.map(normalizeOperator).filter((o): o is OperatorDetail => o !== null);
}

export function normalizeVettingStatusResponse(raw: unknown): {
  status: OperatorVettingStatus;
  passedVetting: boolean;
  feedback: string | null;
} {
  if (typeof raw === 'string') {
    const status = normalizeVettingStatus(raw);
    return { status, passedVetting: status === 'Passed', feedback: null };
  }
  if (!raw || typeof raw !== 'object') {
    return { status: 'NotStarted', passedVetting: false, feedback: null };
  }
  const r = raw as Record<string, unknown>;
  const status = normalizeVettingStatus(
    r.vettingStatus ?? r.status ?? r.state,
  );
  const passed =
    typeof r.passedVetting === 'boolean'
      ? r.passedVetting
      : typeof r.hasPassedVetting === 'boolean'
        ? r.hasPassedVetting
        : status === 'Passed';
  return {
    status: passed ? 'Passed' : status,
    passedVetting: passed,
    feedback: pickString(r, ['feedback', 'vettingFeedback', 'failureReason', 'message']) ?? null,
  };
}

export const VETTING_STATUS_STYLES: Record<OperatorVettingStatus, string> = {
  NotStarted: 'bg-slate-100 text-slate-600',
  Submitted: 'bg-amber-50 text-amber-800',
  Passed: 'bg-emerald-50 text-emerald-800',
  Failed: 'bg-red-50 text-red-700',
};

export const VETTING_STATUS_LABELS: Record<OperatorVettingStatus, string> = {
  NotStarted: 'Not started',
  Submitted: 'Submitted',
  Passed: 'Passed',
  Failed: 'Failed',
};

export const GUARANTOR_ID_TYPES = [
  'NIN',
  'BVN',
  "Driver's License",
  'International Passport',
  "Voter's Card",
] as const;

export const DEFAULT_LICENSE_CATEGORY = 'E';
