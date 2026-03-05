import { Outlet, useMatches, Link } from 'react-router-dom';

const AuthLayout = () => {
  const matches = useMatches();
  const currentStep = matches.find((m) => (m.handle as any)?.step)?.handle?.step;

  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen w-full overflow-x-hidden bg-black">

      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm" />

      {/* Logo */}
      <Link
        to="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 lg:top-12 lg:left-16 z-50 flex items-center gap-2"
      >
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-black shadow-lg">
          A
        </div>
        <span className="text-lg md:text-xl font-bold tracking-tight text-white">
          Afrimine
        </span>
      </Link>

      {/* Marketing Content */}
      <div className="w-full lg:w-1/2 text-white px-6 pt-28 pb-12 md:px-12 lg:p-16 flex flex-col justify-center relative z-20">
        <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Buy and sell <span className="text-yellow-500">minerals</span>,
            list <span className="text-yellow-500">mining</span> sites,
            find equipment, and connect with investors.
          </h1>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
            Connect with verified buyers, streamline deals, and grow your mining business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 text-sm text-gray-400 font-medium tracking-wider">
            <span className="flex items-center gap-2">🛡️ Secure Marketplace</span>
            <span className="flex items-center gap-2">📊 Simple Data</span>
          </div>
        </div>
      </div>

      {/* Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end px-6 pt-8 pb-8 md:px-12 lg:pr-10 relative z-20">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-3xl shadow-2xl relative flex flex-col justify-center">

          {currentStep && (
            <div className="absolute top-6 right-6 bg-gray-100 text-gray-500 text-[10px] px-3 py-1 rounded-full font-black border border-gray-200 uppercase tracking-widest">
              {currentStep}
            </div>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;