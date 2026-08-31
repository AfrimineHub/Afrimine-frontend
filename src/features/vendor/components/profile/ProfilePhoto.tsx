import { useRef, useState } from 'react';
import { useSessionQuery, useUploadProfilePhotoMutation } from '@/features/auth/queries';
import { useVendorProfileQuery } from './profileQueries';

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '—';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per API docs
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ProfilePhoto = () => {
  const { data: profile } = useVendorProfileQuery();
  const { data: session } = useSessionQuery();
  const uploadPhoto = useUploadProfilePhotoMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const initials = profile ? getInitials(profile.fullName) : '—';
  const avatarUrl = session?.avatarUrl;

  function handlePickFile() {
    setError(null);
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow re-selecting the same file next time
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('Image must be smaller than 10MB.');
      return;
    }

    setError(null);
    uploadPhoto.mutate(file, {
      onError: () => setError('Upload failed. Please try again.'),
    });
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={handlePickFile}
        disabled={uploadPhoto.isPending}
        className="relative w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 overflow-hidden disabled:opacity-60"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile photo" className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
        {uploadPhoto.isPending && (
          <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs">
            …
          </span>
        )}
      </button>

      <div>
        <button
          type="button"
          onClick={handlePickFile}
          disabled={uploadPhoto.isPending}
          className="text-sm font-medium text-primary hover:underline disabled:opacity-60 cursor-pointer"
        >
          {uploadPhoto.isPending ? 'Uploading…' : avatarUrl ? 'Change photo' : 'Upload photo'}
        </button>
        <p className="text-xs text-gray-500">JPG, PNG or WEBP. Max 10MB.</p>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};