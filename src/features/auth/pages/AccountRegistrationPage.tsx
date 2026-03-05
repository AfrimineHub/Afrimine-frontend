import { AccountRegistrationForm } from '../components/AccountRegistrationForm';

const AccountRegistrationPage = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Account Registration</h2>
      <p className="text-gray-500 text-sm mb-8">Log in to start selling and buying mining equipment</p>
      
      <AccountRegistrationForm />
      
      <div className="mt-8 text-center">
        <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Back
        </button>
      </div>
    </>
  );
};

export default AccountRegistrationPage;