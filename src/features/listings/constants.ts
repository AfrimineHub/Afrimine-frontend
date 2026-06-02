export const LISTING_CATEGORY_TYPES = {
  mineral: 'mineral',
  equipment: 'equipment',
  miningSite: 'mining_site',
  manpower: 'manpower',
} as const;

export type ListingCategoryType = (typeof LISTING_CATEGORY_TYPES)[keyof typeof LISTING_CATEGORY_TYPES];

export const LISTING_CATEGORY_OPTIONS: {
  value: ListingCategoryType;
  label: string;
  description: string;
}[] = [
  {
    value: LISTING_CATEGORY_TYPES.mineral,
    label: 'Minerals',
    description: 'Ores, concentrates, precious metals, and bulk mineral commodities',
  },
  {
    value: LISTING_CATEGORY_TYPES.equipment,
    label: 'Heavy Equipment',
    description: 'Excavators, crushers, drills, and other mining machinery',
  },
  {
    value: LISTING_CATEGORY_TYPES.miningSite,
    label: 'Mining Sites',
    description: 'Leases, concessions, and operational mine sites for sale or partnership',
  },
  {
    value: LISTING_CATEGORY_TYPES.manpower,
    label: 'Manpower',
    description: 'Skilled labor, contractors, and technical mining services',
  },
];

export const LISTING_STATUS = {
  draft: 'draft',
  pendingReview: 'pending_review',
  active: 'active',
  rejected: 'rejected',
  archived: 'archived',
} as const;

export type ListingStatus = (typeof LISTING_STATUS)[keyof typeof LISTING_STATUS];

export const PRICE_UNITS = [
  { label: 'Per kilogram', value: 'per_kg' },
  { label: 'Per ton', value: 'per_ton' },
  { label: 'Per carat', value: 'per_carat' },
  { label: 'Per unit', value: 'per_unit' },
  { label: 'Per month (lease)', value: 'per_month' },
  { label: 'Fixed price', value: 'fixed' },
] as const;

export const CURRENCIES = [
  { label: 'NGN (₦)', value: 'NGN' },
  { label: 'USD ($)', value: 'USD' },
] as const;

export const MINERAL_TYPES = [
  'Gold', 'Silver', 'Copper', 'Diamond', 'Lithium', 'Platinum', 'Iron Ore', 'Cobalt', 'Other',
].map((m) => ({ label: m, value: m.toLowerCase().replace(/\s+/g, '_') }));

export const LEASE_TYPES = [
  { label: 'Lease', value: 'lease' },
  { label: 'Sale', value: 'sale' },
  { label: 'Joint venture', value: 'joint_venture' },
];

export const EQUIPMENT_CONDITIONS = [
  { label: 'New', value: 'new' },
  { label: 'Used — excellent', value: 'used_excellent' },
  { label: 'Used — good', value: 'used_good' },
  { label: 'For parts', value: 'for_parts' },
];
