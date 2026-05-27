import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/buttons/Button';
import { useSearchParams } from 'react-router-dom';

const AccountCreatedPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="text-green-600 w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Account Created</h2>
      <p className="text-gray-500 text-sm mb-8 px-4">
        Your account has been successfully created. We've sent a verification link to your email address.
      </p>
      <div className="flex flex-col gap-3 w-full">
        <Button onClick={() => window.open('https://gmail.com')}>Go to Gmail</Button>
        <Button
          variant="outline"
          onClick={() =>
            (window.location.href = `/auth/confirm-email${email ? `?email=${encodeURIComponent(email)}` : ''}`)
          }
        >
          Enter verification code
        </Button>
      </div>
    </div>
  );
};
export default AccountCreatedPage;