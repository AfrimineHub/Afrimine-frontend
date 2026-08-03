import type { ListingCardData } from './components/ListingCard';
import type { MarketplaceEquipmentDto } from './equipmentTypes';

const CATEGORY_BADGE_COLOR = 'bg-amber-600';

function formatNaira(amount: number): string {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `NGN ${amount.toLocaleString()}`;
  }
}

export function mapEquipmentToCard(asset: MarketplaceEquipmentDto): ListingCardData {
  const isAvailable = asset.status.trim().toLowerCase() === 'available';

  return {
    id: asset.id,
    title: `${asset.brand} ${asset.model}`.trim(),
    category: asset.machineType,
    badgeColor: CATEGORY_BADGE_COLOR,
    // The browse endpoint does not return supplier city, so show availability
    // explicitly instead of placing raw status text under a location icon.
    metaText: isAvailable ? 'Available now' : asset.status,
    metaKind: 'status',
    spec: `${asset.engineHours.toLocaleString()} hrs`,
    subSpec: `${asset.yearOfManufacture}`,
    price: `${formatNaira(asset.dailyRentalRate)}/day`,
    imageUrl: asset.frontPhotoUrl ?? '',
  };
}