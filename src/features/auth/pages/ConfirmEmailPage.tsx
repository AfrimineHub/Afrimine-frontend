import { ConfirmEmailForm } from '../components/ConfirmEmailForm';

const ConfirmEmailPage = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Confirm your email</h2>
      <p className="text-gray-500 text-sm mb-8">
        Enter the verification code sent to your email to activate your account.
      </p>
      <ConfirmEmailForm />
    </>
  );
};

export default ConfirmEmailPage;

