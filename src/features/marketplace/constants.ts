export const MARKETPLACE_PATH = '/marketplace';
export const EQUIPMENT_PATH = '/equipment';

export function buildEquipmentDetailPath(assetId: string): string {
  return `${EQUIPMENT_PATH}/${assetId}`;
}