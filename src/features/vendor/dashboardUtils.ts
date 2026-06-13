export function formatVendorAmount(amount: number, currency?: string | null): string {
  const isUsd = currency?.trim().toUpperCase() === 'USD';
  const symbol = isUsd ? '$' : '₦';
  return `${symbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function formatPercentChange(
  value: number | null | undefined,
  label = 'from previous month',
): string | null {
  if (value == null || Number.isNaN(value)) return null;
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}% ${label}`;
}

export function formatCount(value: number): string {
  return value.toLocaleString();
}
