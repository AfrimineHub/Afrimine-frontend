export const supplierOperatorsApiPaths = {
  operators: 'operators',
  operator: (operatorId: string) => `operators/${operatorId}`,
  guarantors: (operatorId: string) => `operators/${operatorId}/guarantors`,
  vetting: (operatorId: string) => `operators/${operatorId}/vetting`,
  vettingStatus: (operatorId: string) => `operators/${operatorId}/vetting-status`,
  assignToAsset: (assetId: string) => `assets/${assetId}/operators`,
} as const;
