export interface BuyerBusinessProfile {
  businessType?: number;
  country: string;
  stateOrRegion: string;
  officeAddress: string;
  website: string;
  onboardingStep?: number;
  isComplete?: boolean;
}

export interface BuyerProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  business: BuyerBusinessProfile;
}

export interface BuyerBusinessProfileInput {
  businessType: number;
  country: string;
  stateOrRegion: string;
  officeAddress: string;
  website?: string;
}
