export type SupplierVerificationStatus =
  | 'draft'
  | 'pending_verification'
  | 'verified'
  | 'rejected'
  | 'active';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export function clampStep(step: number): OnboardingStep {
  if (step < 1) return 1;
  if (step > 5) return 5;
  return step as OnboardingStep;
}

export interface SupplierIdentity {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  otpVerified: boolean;
  bankName?: string;
  bankCode?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}

export interface SupplierLocation {
  baseCity: string;
  yardAddress: string;
  lat?: number;
  lng?: number;
}

export interface MachineAsset {
  id: string;
  remoteId?: string;
  machineType: string;
  brand: string;
  model: string;
  yearOfManufacture: string;
  engineHours: string;
  includesOperator: boolean;
  dailyRentalRate: string;
  mobilizationFeePerKm: string;
  description?: string;
  status?: string;
  frontPhotoName?: string;
  sidePhotoName?: string;
  serialPhotoName?: string;
}

export interface SupplierDocuments {
  cacCertificateName?: string;
}

export interface SupplierDashboardStats {
  totalMachines: number;
  activeBookings: number;
  currentEarnings: number;
  pendingEscrow: number;
  currency: string;
  machinesTrend?: string;
  bookingsTrend?: string;
}

export interface ActiveLeaseRow {
  id: string;
  machineName: string;
  minerName: string;
  leasePeriod: string;
  nextMilestone: string;
  status: 'pending' | 'active' | 'completed' | 'declined';
}

export function createEmptyMachine(): MachineAsset {
  return {
    id: crypto.randomUUID(),
    machineType: '',
    brand: '',
    model: '',
    yearOfManufacture: '',
    engineHours: '',
    includesOperator: false,
    dailyRentalRate: '',
    mobilizationFeePerKm: '',
  };
}
