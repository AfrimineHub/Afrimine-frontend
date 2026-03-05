import { KycForm } from '../components/KycForm';

const KycPage = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">KYC / Verification</h2>
      <p className="text-gray-500 text-sm mb-8">Log in to start selling and buying mining equipment</p>
      
      <KycForm />
    </>
  );
};

export default KycPage;