export const supplierOnboardingApiPaths = {
  profile: 'suppliers/profile',
  location: 'suppliers/location',
  documents: 'suppliers/documents',
  submit: 'suppliers/submit',
  me: 'suppliers/me',
  status: 'suppliers/status',
} as const;

export const supplierAssetApiPaths = {
  assets: 'assets',
  asset: (assetId: string) => `assets/${assetId}`,
  assetPhotos: (assetId: string) => `assets/${assetId}/photos`,
} as const;