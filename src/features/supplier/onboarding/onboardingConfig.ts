export const supplierOnboardingApiPaths = {
  profile: '/api/v1/suppliers/profile',
  location: '/api/v1/suppliers/location',
  documents: '/api/v1/suppliers/documents',
  submit: '/api/v1/suppliers/submit',
  me: '/api/v1/suppliers/me',
  status: '/api/v1/suppliers/status',
} as const;

export const supplierAssetApiPaths = {
  assets: '/api/v1/assets',
  asset: (assetId: string) => `/api/v1/assets/${assetId}`,
  assetPhotos: (assetId: string) => `/api/v1/assets/${assetId}/photos`,
} as const;