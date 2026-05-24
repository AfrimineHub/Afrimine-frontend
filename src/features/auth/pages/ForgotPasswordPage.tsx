import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot password</h2>
      <p className="text-gray-500 text-sm mb-8">
        Enter your email to receive a verification code, then choose a new password.
      </p>
      <ForgotPasswordForm />
    </>
  );
};

export default ForgotPasswordPage;
