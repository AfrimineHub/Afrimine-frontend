import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/shared/inputs/Input';
import { Button } from '@/shared/buttons/Button';
import { useResendOtpMutation } from '@/features/auth/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

export const ResendOtpForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') ?? '';

  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const resendOtpMutation = useResendOtpMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    try {
      await resendOtpMutation.mutateAsync({ email });
      navigate(`/auth/confirm-email?email=${encodeURIComponent(email)}`, {
        replace: true,
        state: { message: 'A new verification code has been sent to your email.' },
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not resend code'));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {info && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
          {info}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Input
        label="Email"
        placeholder="Enter your account email"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button type="submit" className="w-full" disabled={resendOtpMutation.isPending || !email}>
        {resendOtpMutation.isPending ? 'Sending…' : 'Send new code'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        <Link to="/auth/login" className="font-semibold text-yellow-600 hover:text-yellow-700">
          Back to login
        </Link>
      </p>
    </form>
  );
};

