import { AccountRegistrationForm } from '../components/AccountRegistrationForm';
import { useNavigate } from 'react-router-dom';

const AccountRegistrationPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
      <p className="text-gray-500 text-sm mb-8">
        Register as a Vendor / Supplier to list mining equipment, or as a Buyer to rent and purchase.
      </p>

      <AccountRegistrationForm />

      <div className="mt-8 text-center">
        <button
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          onClick={() => navigate('/auth/login')}
        >
          Back
        </button>
      </div>
    </>
  );
};

export default AccountRegistrationPage;
