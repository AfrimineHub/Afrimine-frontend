const CheckIcon = ({ colorClass }) => (
  <svg 
    className={`w-4 h-4 mr-3 flex-shrink-0 ${colorClass}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path 
      fillRule="evenodd" 
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
      clipRule="evenodd" 
    />
  </svg>
);

export const SubscriptionPricingCard = ({ plan }) => {
  const isPopular = plan.isPopular;
  
  // Dynamic styling based on the Diamond/Popular tier vs Standard
  const cardBg = isPopular ? 'bg-[#FFFBF5] border-[#E5C99F]' : 'bg-white border-gray-200';
  const buttonClass = isPopular 
    ? 'bg-[#EAB308] hover:bg-[#CA8A04] text-white' 
    : 'bg-[#1E293B] hover:bg-slate-800 text-white';
  const iconColor = isPopular ? 'text-[#EAB308]' : 'text-blue-500';

  return (
    <div className={`relative flex flex-col p-6 rounded-2xl border ${cardBg} shadow-sm transition-all duration-300 hover:shadow-md`}>
      
      {/* Most Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-[#EAB308] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow-sm">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-2">
          {plan.name}
        </h3>
        <p className="text-sm text-gray-500 min-h-[40px]">
          {plan.description}
        </p>
      </div>

      <div className="mb-6 border-b border-gray-100 pb-6">
        <span className="text-3xl font-extrabold text-gray-900">
          ₦{plan.price}
        </span>
        <span className="text-sm text-gray-500 font-medium">/month</span>
      </div>

      <ul className="flex-1 space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li 
            key={index} 
            className={`flex items-start text-sm ${feature.included ? 'text-gray-700 font-medium' : 'text-gray-400'}`}
          >
            {feature.included ? (
              <CheckIcon colorClass={iconColor} />
            ) : (
              <span className="w-4 h-4 mr-3 flex-shrink-0 block" /> // Spacer for alignment
            )}
            {feature.text}
          </li>
        ))}
      </ul>

      <button className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${buttonClass}`}>
        Get Started
      </button>
    </div>
  );
};