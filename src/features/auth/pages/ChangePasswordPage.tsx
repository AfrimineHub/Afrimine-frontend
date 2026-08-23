import { ChangePasswordForm } from '../components/ChangePasswordForm';

const ChangePasswordPage = () => {
  return (
    <div className="w-full py-6 sm:py-10">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Change password
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter your current password and choose a new password.
          </p>
        </div>

        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
