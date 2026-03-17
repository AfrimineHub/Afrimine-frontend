import { ShieldCheck } from 'lucide-react';

export const AdsSummary = () => (
  <div className="bg-[#F0F7FF] border border-[#CCE3FF] rounded-xl p-4 flex items-center justify-between mb-6">
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg text-white">
        <ShieldCheck size={34} className='fill-blue-600' />
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#0747A6]">Your Listings Summary</h4>
        <p className="text-xs text-[#172B4D]">
          Your listings are open and visible to buyers. Verify your business to build trust and unlock premium features.
        </p>
      </div>
    </div>
    <button className="bg-[#22272B] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-all cursor-pointer">
      Get Verified
    </button>
  </div>
);