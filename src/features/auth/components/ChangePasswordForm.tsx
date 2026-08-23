import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/inputs/Input';
import { Button } from '@/shared/buttons/Button';
import { useChangePasswordMutation } from '@/features/auth/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

export const ChangePasswordForm = () => {
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const changePasswordMutation = useChangePasswordMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from your current password');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      navigate('/auth/login', {
        replace: true,
        state: { message: 'Password updated. You can sign in with your new password.' },
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not change password'));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Input
        label="Current password"
        type="password"
        name="currentPassword"
        autoComplete="current-password"
        required
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <Input
        label="New password"
        type="password"
        name="newPassword"
        autoComplete="new-password"
        required
        minLength={8}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Input
        label="Confirm new password"
        type="password"
        name="confirmNewPassword"
        autoComplete="new-password"
        required
        minLength={8}
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />

      <Button type="submit" disabled={changePasswordMutation.isPending}>
        {changePasswordMutation.isPending
          ? 'Updating password…'
          : 'Change password'}
      </Button>
    </form>
  );
};
