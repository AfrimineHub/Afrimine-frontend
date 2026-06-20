import { formatBuyerAmount } from '@/features/buyer/dashboardUtils';
import { formatRelativeTime } from '@/lib/utils/formatRelativeTime';

export function formatAdminAmount(amount: number, currency?: string | null): string {
  return formatBuyerAmount(amount, currency);
}

export function formatAdminDate(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatAdminDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatAdminRelativeTime(value: string | null | undefined): string {
  if (!value) return 'Recently';
  return formatRelativeTime(value) || 'Recently';
}

export function getInitials(name: string | null | undefined): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function titleCaseStatus(status: string | null | undefined): string {
  if (!status?.trim()) return '—';
  return status
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function mapListingStatusLabel(status: string | null | undefined): string {
  const normalized = (status ?? '').toLowerCase();
  if (normalized.includes('pending')) return 'Pending';
  if (normalized.includes('active') || normalized.includes('approved')) return 'Approved';
  if (normalized.includes('reject')) return 'Rejected';
  if (normalized.includes('flag')) return 'Flagged';
  return titleCaseStatus(status);
}

export function mapUserRoleLabel(role: string | null | undefined): string {
  const normalized = (role ?? '').toLowerCase();
  if (normalized.includes('vendor') || normalized.includes('supplier')) return 'Vendor';
  if (normalized.includes('buyer')) return 'Buyer';
  if (normalized.includes('investor')) return 'Investor';
  if (normalized.includes('admin')) return 'Admin';
  return titleCaseStatus(role);
}

export function mapKycStatusLabel(status: string | null | undefined): string {
  const normalized = (status ?? '').toLowerCase();
  if (normalized.includes('verified')) return 'Verified';
  if (normalized.includes('pending')) return 'Pending';
  if (normalized.includes('reject')) return 'Rejected';
  if (normalized.includes('not')) return 'Not Started';
  return titleCaseStatus(status);
}

export function mapAccountStatusLabel(status: string | null | undefined): string {
  const normalized = (status ?? '').toLowerCase();
  if (normalized.includes('active')) return 'Active';
  if (normalized.includes('suspend')) return 'Suspended';
  if (normalized.includes('ban')) return 'Banned';
  return titleCaseStatus(status);
}

export function avatarColorClass(seed: string): string {
  const palette = [
    'bg-blue-50 text-blue-600',
    'bg-indigo-50 text-indigo-600',
    'bg-emerald-50 text-emerald-600',
    'bg-teal-50 text-teal-600',
    'bg-purple-50 text-purple-600',
    'bg-orange-50 text-orange-600',
    'bg-pink-50 text-pink-600',
    'bg-rose-50 text-rose-600',
  ];
  const index = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length;
  return palette[index];
}
