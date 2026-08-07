import { useVendorProfileQuery } from './profileQueries';

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '—';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const ProfilePhoto = () => {
  const { data: profile } = useVendorProfileQuery();
  const initials = profile ? getInitials(profile.fullName) : '—';

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
        {initials}
      </div>

      <div className="opacity-60">
        <p className="text-sm font-medium">Photo uploads coming soon</p>
        <p className="text-xs text-gray-500">There's no upload endpoint for this yet.</p>
      </div>
    </div>
  );
};