export type SupplierVerificationStatus =
  | 'draft'
  | 'pending_verification'
  | 'verified'
  | 'rejected';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export interface SupplierIdentity {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  otpVerified: boolean;
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
  frontPhotoName?: string;
  sidePhotoName?: string;
  serialPhotoName?: string;
}

export interface SupplierDocuments {
  cacCertificateName?: string;
}

export interface SupplierOnboardingDraft {
  step: OnboardingStep;
  identity: SupplierIdentity;
  location: SupplierLocation;
  machines: MachineAsset[];
  documents: SupplierDocuments;
  status: SupplierVerificationStatus;
  submittedAt?: string;
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

export const EMPTY_IDENTITY: SupplierIdentity = {
  fullName: '',
  companyName: '',
  phone: '',
  email: '',
  otpVerified: false,
};

export const EMPTY_LOCATION: SupplierLocation = {
  baseCity: '',
  yardAddress: '',
};

export const EMPTY_DOCUMENTS: SupplierDocuments = {};

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

export function createEmptyDraft(): SupplierOnboardingDraft {
  return {
    step: 1,
    identity: { ...EMPTY_IDENTITY },
    location: { ...EMPTY_LOCATION },
    machines: [createEmptyMachine()],
    documents: { ...EMPTY_DOCUMENTS },
    status: 'draft',
  };
}