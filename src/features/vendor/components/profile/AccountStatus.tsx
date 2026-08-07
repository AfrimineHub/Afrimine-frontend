import { useVendorAccountStatusQuery } from './profileQueries';

const STATUS_STYLES: Record<string, string> = {
  verified: 'bg-green-100 text-green-700',
  pending_verification: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-600',
};

const STATUS_LABELS: Record<string, string> = {
  verified: 'Verified',
  pending_verification: 'Pending Review',
  rejected: 'Rejected',
  draft: 'Incomplete',
};

export const AccountStatus = () => {
  const { data, isLoading, isError } = useVendorAccountStatusQuery();

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading status…</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-red-600">Couldn't load account status.</p>;
  }

  const label = data.blocked ? 'Blocked' : STATUS_LABELS[data.verification];
  const style = data.blocked ? 'bg-red-100 text-red-700' : STATUS_STYLES[data.verification];

  return (
    <div>
      <p className="text-sm text-gray-500">Current Status</p>
      <span className={`inline-block mt-1 px-3 py-1 text-xs rounded-full ${style}`}>
        {label}
      </span>
    </div>
  );
};