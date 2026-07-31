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
  return {
    id: asset.id,
    title: `${asset.brand} ${asset.model}`.trim(),
    category: asset.machineType,
    badgeColor: CATEGORY_BADGE_COLOR,
    // The browse endpoint doesn't return a location per item (only supplier-city
    // filtering) — show status instead until that's added to the response.
    location: asset.status,
    spec: `${asset.engineHours.toLocaleString()} hrs`,
    subSpec: `${asset.yearOfManufacture}`,
    price: `${formatNaira(asset.dailyRentalRate)}/day`,
    imageUrl: asset.frontPhotoUrl ?? '',
  };
}