import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/shared/inputs/Input';
import { Button } from '@/shared/buttons/Button';
import { useLoginMutation } from '@/features/auth/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const locationState = location.state as { from?: string; message?: string } | null;
  const returnTo = locationState?.from ?? '/vendor-dashboard';
  const successMessage = locationState?.message ?? null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await loginMutation.mutateAsync({ email, password });
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {successMessage && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700" role="status">
          {successMessage}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Input
        label="Email"
        placeholder="Input your email"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="relative">
        <Input
          label="Password"
          placeholder="Input your password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="accent-yellow-500" /> Remember me
        </label>
        <Link to="/auth/forgot-password" className="hover:text-yellow-600">
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        className="cursor-pointer w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Logging in…' : 'Login'}
      </Button>

      <div className="text-center py-2 text-gray-400 text-xs">Or Continue with</div>
      <Button variant="outline" type="button" className="cursor-pointer w-full">
        Signup with Google
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to="/auth/register" className="font-semibold text-yellow-600 hover:text-yellow-700">
          Register
        </Link>
      </p>
    </form>
  );
};
