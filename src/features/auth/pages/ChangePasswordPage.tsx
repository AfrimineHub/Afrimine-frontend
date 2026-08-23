import { ChangePasswordForm } from '../components/ChangePasswordForm';

const ChangePasswordPage = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Change password</h2>
      <p className="text-gray-500 text-sm mb-8">
        Enter your current password and choose a new password.
      </p>
      <ChangePasswordForm />
    </>
  );
};

export default ChangePasswordPage;
