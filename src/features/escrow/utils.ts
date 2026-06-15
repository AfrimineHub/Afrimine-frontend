export function buildOrderCheckoutReturnUrls(orderId: string) {
  const origin = window.location.origin;
  const base = `${origin}/my-order/${orderId}`;

  return {
    successUrl: `${base}?checkout=success`,
    cancelUrl: `${base}?checkout=canceled`,
  };
}

export function formatEscrowStatus(status: string | null | undefined): string {
  if (!status) return 'Unknown';
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
