import { ResendOtpForm } from '../components/ResendOtpForm';

const ResendOtpPage = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Resend verification code</h2>
      <p className="text-gray-500 text-sm mb-8">
        If you already created an account but haven&apos;t verified your email yet, request a new code to continue.
      </p>
      <ResendOtpForm />
    </>
  );
};

export default ResendOtpPage;

