import { useSessionQuery } from '@/features/auth/queries';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
  banned: 'bg-red-100 text-red-700',
  deactivated: 'bg-gray-100 text-gray-600',
};

function normalizeStatusLabel(statusText?: string, status?: number): string {
  if (statusText) return statusText;
  switch (status) {
    case 1:
      return 'Active';
    case 0:
      return 'Pending';
    case 2:
      return 'Suspended';
    case 3:
      return 'Banned';
    case 4:
      return 'Deactivated';
    default:
      return 'Unknown';
  }
}

function getStatusStyle(statusText?: string, status?: number): string {
  const key = (statusText ?? '').toLowerCase();
  if (STATUS_STYLES[key]) return STATUS_STYLES[key];

  switch (status) {
    case 1:
      return STATUS_STYLES.active;
    case 0:
      return STATUS_STYLES.pending;
    case 2:
    case 3:
      return STATUS_STYLES.suspended;
    case 4:
      return STATUS_STYLES.deactivated;
    default:
      return STATUS_STYLES.pending;
  }
}

export function UserAccountStatus() {
  const { data: session, isLoading, isError } = useSessionQuery();

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading status…</p>;
  }

  if (isError || !session) {
    return <p className="text-sm text-red-600">Couldn't load account status.</p>;
  }

  const label = normalizeStatusLabel(session.statusText, session.status);
  const style = getStatusStyle(session.statusText, session.status);

  return (
    <div>
      <p className="text-sm text-gray-500">Current Status</p>
      <span className={`inline-block mt-1 px-3 py-1 text-xs rounded-full ${style}`}>
        {label}
      </span>
    </div>
  );
}
