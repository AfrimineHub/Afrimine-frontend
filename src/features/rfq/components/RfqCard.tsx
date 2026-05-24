export const RfqCard = ({ rfq }) => {
    return (
      <div className="flex flex-col p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow duration-200 h-full">
        <div className="mb-6">
          <h3 className="text-[17px] font-bold text-gray-900 mb-4">
            {rfq.resource} – {rfq.quantity}
          </h3>
          <div className="space-y-2.5">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="text-gray-400">Location:</span> 
              <span className="font-medium text-gray-800">{rfq.location}</span>
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="text-gray-400">Budget:</span> 
              <span className="font-medium text-gray-800">{rfq.budget}</span>
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="text-gray-400">Posted:</span> 
              <span className="font-medium text-gray-800">{rfq.posted}</span>
            </p>
          </div>
        </div>
  
        {/* Action Buttons pushed to the bottom */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <button className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
            View Request
          </button>
          <button className="bg-yellow-600 hover:bg-[#C29E4A] text-white text-sm font-bold py-2.5 px-6 rounded transition-colors shadow-sm cursor-pointer">
            Submit Quote
          </button>
        </div>
      </div>
    );
  };