import { Link, useLocation } from 'react-router-dom';

const STEPS = [
  { label: 'Profile', path: '/vendor-profile', root: '/vendor' },
  { label: 'KYC Verification', path: '/dashboard/my-kyc' },
  { label: 'Company Details', path: '/vendor/company-details' },
];

export const KycStepper = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-gray-100 rounded-full h-8 flex items-center text-xs overflow-hidden">
      {STEPS.map((step) => {
        // A step is active if the path matches exactly, 
        // OR if we are at the root and this is the designated "root" step.
        const isActive = pathname === step.path || (pathname === step.root);

        return (
          <Link
            key={step.path}
            to={step.path}
            className={`flex-1 flex items-center justify-center h-full transition-all duration-200 ${
              isActive 
                ? "bg-yellow-500 text-white font-medium" 
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            {step.label}
          </Link>
        );
      })}
    </div>
  );
};