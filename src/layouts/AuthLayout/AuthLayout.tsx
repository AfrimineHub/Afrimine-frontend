import { Outlet, useMatches, Link } from 'react-router-dom';

interface MatchWithStep {
  handle?: {
    step?: string | number;
  };
}

const AuthLayout = () => {
  const matches = useMatches() as MatchWithStep[];
  const currentStep = matches.find((m) => m.handle?.step)?.handle?.step;

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen w-full overflow-x-hidden bg-black">
      {/* ... rest of your JSX */}
      {currentStep && (
        <div className="absolute top-6 right-6 bg-gray-100 text-gray-500 text-[10px] px-3 py-1 rounded-full font-black border border-gray-200 uppercase tracking-widest">
          {currentStep}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default AuthLayout;