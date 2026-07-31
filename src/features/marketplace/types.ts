export interface MarketplaceFilters {
  location: string;
  machineType: string;
  maxDailyRate: string;
  availableOnly: boolean;
}

export const DEFAULT_MARKETPLACE_FILTERS: MarketplaceFilters = {
  location: '',
  machineType: '',
  maxDailyRate: '',
  availableOnly: true,
};
