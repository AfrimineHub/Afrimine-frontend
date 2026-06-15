import type { SubscriptionPlan, SubscriptionPlanDto } from '@/features/subscription/types';

export function formatPlanPrice(amount: number, currency = 'NGN'): string {
  if (amount === 0) return '0';

  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return String(amount);
  }
}

export function mapPlanDtoToPlan(dto: SubscriptionPlanDto): SubscriptionPlan {
  const currency = dto.currency?.trim() || 'NGN';

  return {
    id: dto.id,
    name: dto.name,
    description: dto.description?.trim() || '',
    price: formatPlanPrice(dto.priceMonthly, currency),
    isPopular: dto.isPopular,
    features: dto.features ?? [],
  };
}

export function formatRenewalDate(isoDate: string | null | undefined): string | null {
  if (!isoDate) return null;

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
  }).format(date);
}

export function buildCheckoutReturnUrls() {
  const origin = window.location.origin;
  const base = `${origin}/dashboard/my-subscription`;

  return {
    successUrl: `${base}?checkout=success`,
    cancelUrl: `${base}?checkout=canceled`,
  };
}
