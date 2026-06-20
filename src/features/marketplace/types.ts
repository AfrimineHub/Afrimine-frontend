export interface MarketplaceFilters {
  location: string;
  mineral: string;
  listingType: string;
  verifiedOnly: boolean;
}

export const DEFAULT_MARKETPLACE_FILTERS: MarketplaceFilters = {
  location: '',
  mineral: '',
  listingType: '',
  verifiedOnly: false,
};
