import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/buttons/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getHomePathForUser } from '@/features/auth/routes';

const AccountSetupSuccessPage = () => {
  const { user } = useAuth();
  const homePath = getHomePathForUser(user);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="text-green-600 w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Successful</h2>
      <p className="text-gray-500 text-sm mb-8 px-4">
        Congratulations! Your account has been created successfully, and your KYC is currently under review.
        The verification process should be completed within 24 hours. Thank you for your patience.
        We'll notify you soon as your KYC is approved.
      </p>
      <Link to={homePath} className="w-full">
        <Button>Go to dashboard</Button>
      </Link>
    </div>
  );
};
export default AccountSetupSuccessPage;