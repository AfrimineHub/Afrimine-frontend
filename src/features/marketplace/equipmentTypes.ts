export const MACHINE_TYPES = [
  { value: 0, label: 'Excavator' },
  { value: 1, label: 'Bulldozer' },
  { value: 2, label: 'Payloader' },
  { value: 3, label: 'Tipper' },
  { value: 4, label: 'Grader' },
  { value: 5, label: 'Crane' },
  { value: 6, label: 'Compactor' },
] as const;

export interface MarketplaceEquipmentQueryParams {
  q?: string;
  machineType?: number; // 0=Excavator ... 6=Compactor, see MACHINE_TYPES
  location?: string; // supplier base city, e.g. "Jos", "Abuja"
  maxDailyRate?: number; // NGN
  availableOnly?: boolean; // default true server-side
  page?: number;
  pageSize?: number;
}

export interface MarketplaceEquipmentDto {
  id: string;
  machineType: string;
  brand: string;
  model: string;
  yearOfManufacture: number;
  engineHours: number;
  hasCertifiedOperator: boolean;
  status: string;
  dailyRentalRate: number;
  mobilizationFeePerKm: number;
  frontPhotoUrl?: string | null;
  sidePhotoUrl?: string | null;
  serialPlatePhotoUrl?: string | null;
  description?: string | null;
  createdAt: string;
}

export interface MarketplaceEquipmentPagedResult {
  items: MarketplaceEquipmentDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// The list response doesn't carry location/supplier/currency — asset detail
// may add more; adjust here once /assets/{id} response shape is confirmed.
export interface AssetDetailDto extends MarketplaceEquipmentDto {
  supplierName?: string | null;
  supplierPhone?: string | null;
  location?: string | null;
}

export interface AssetPricingQueryParams {
  totalDays: number;
  distanceKm?: number;
  currency?: string;
}

// Unconfirmed response shape — /assets/{id}/pricing has no documented schema yet.
export interface AssetPricingDto {
  dailyRentalRate: number;
  totalDays: number;
  rentalSubtotal: number;
  mobilizationFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
}

export const LOGISTICS_TYPE_OPTIONS = [
  { value: 0, label: 'Supplier-owned logistics' },
  { value: 1, label: 'Third-party logistics' },
] as const;

export interface CreateBookingPayload {
  assetId: string;
  startDate: string; // ISO date-time
  endDate: string; // ISO date-time
  siteAddress: string;
  siteLatitude?: number;
  siteLongitude?: number;
  distanceKm: number;
  currency?: string;
  minerPhone: string;
  logisticsType: number;
}