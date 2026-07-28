export const SUPPLIER_BASE_CITIES = [
  { label: 'Abuja', value: 'abuja' },
  { label: 'Jos', value: 'jos' },
  { label: 'Lafia', value: 'lafia' },
  { label: 'Kaduna', value: 'kaduna' },
  { label: 'Lokoja', value: 'lokoja' },
] as const;

export const MACHINE_TYPES = [
  { label: 'Excavator', value: 'excavator' },
  { label: 'Bulldozer', value: 'bulldozer' },
  { label: 'PayLoader', value: 'payloader' },
  { label: 'Tipper', value: 'tipper' },
  { label: 'Grader', value: 'grader' },
  { label: 'Crane', value: 'crane' },
  { label: 'Compactor', value: 'compactor' },
  // { label: 'Other', value: 'other' },
] as const;

export const ONBOARDING_STEPS = [
  { step: 1 as const, title: 'Identity', description: 'Account & verification' },
  { step: 2 as const, title: 'Location', description: 'Yard & operations' },
  { step: 3 as const, title: 'Assets', description: 'Machine details' },
  { step: 4 as const, title: 'Documents', description: 'Photos & proof' },
  { step: 5 as const, title: 'Submit', description: 'Verification' },
];

export const SUPPLIER_ONBOARDING_STORAGE_KEY = 'afrimine.supplier.onboarding';
export const SUPPLIER_ONBOARDING_PATH = '/supplier/onboarding';
export const SUPPLIER_DASHBOARD_PATH = '/supplier-dashboard';
export const SUPPLIER_MACHINES_PATH = '/supplier/machines';
export const SUPPLIER_BOOKINGS_PATH = '/supplier/bookings';

