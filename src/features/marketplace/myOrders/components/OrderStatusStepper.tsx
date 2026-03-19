
export const OrderStatusStepper = () => {
  const steps = ["Inquiry", "Negotiations", "Agreements", "Closed"];
  const currentStep = 1; // 0-indexed (e.g., 1 = Negotiations)

  return (
    <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl p-4 sm:p-6 mb-8">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900">Most Recent Order</h3>
        <p className="text-xs text-gray-500 mt-1">
          Gold Dores and Bars / <span className="font-bold text-gray-700">$230,000</span> / Tarauni, Kano State Nigeria
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="relative flex justify-between items-center px-2 sm:px-4 py-8 min-w-[520px]">
          {/* Background Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />
          
          {/* Active Progress Line */}
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-[#5C7CFA] -translate-y-1/2 transition-all duration-500" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, index) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              {/* Step Circle */}
              <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                index <= currentStep 
                  ? 'bg-[#5C7CFA] border-[#5C7CFA]' 
                  : 'bg-white border-gray-300'
              }`} />
              
              {/* Step Label */}
              <span className={`absolute top-6 text-[10px] font-bold whitespace-nowrap ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};