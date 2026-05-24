export const KycProgressCard = () => {
    const progress = 25;
  
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">
              KYC Verification Status
            </h3>
            <p className="text-sm text-gray-500">
              Complete your verification to unlock full platform access
            </p>
          </div>
  
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer">
            Continue
          </button>
        </div>
  
        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Verification Progress</span>
            <span>{progress}% complete</span>
          </div>
  
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };