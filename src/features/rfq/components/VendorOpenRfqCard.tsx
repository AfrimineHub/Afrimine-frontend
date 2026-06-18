import { MessageSquare } from 'lucide-react';
import type { BuyerRfqCardData } from '@/features/buyer/dashboardUtils';

interface VendorOpenRfqCardProps {
  rfq: BuyerRfqCardData;
  onMessageBuyer: (rfqId: string) => void;
  isMessaging?: boolean;
}

export const VendorOpenRfqCard = ({ rfq, onMessageBuyer, isMessaging }: VendorOpenRfqCardProps) => (
  <div className="flex flex-col p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow duration-200 h-full">
    <div className="mb-6">
      <h3 className="text-[17px] font-bold text-gray-900 mb-4">
        {rfq.title} – {rfq.quantity}
      </h3>
      <div className="space-y-2.5">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span className="text-gray-400">Location:</span>
          <span className="font-medium text-gray-800">{rfq.location}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span className="text-gray-400">Target Price:</span>
          <span className="font-medium text-gray-800">{rfq.targetPrice}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span className="text-gray-400">Buyer Name:</span>
          <span className="font-medium text-gray-800">{rfq.buyerName}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span className="text-gray-400">Posted:</span>
          <span className="font-medium text-gray-800">{rfq.posted}</span>
        </p>
        {rfq.notes ? (
          <p className="text-sm text-gray-500 line-clamp-3">{rfq.notes}</p>
        ) : null}
      </div>
    </div>

    <div className="mt-auto pt-2">
      <button
        type="button"
        onClick={() => onMessageBuyer(rfq.id)}
        disabled={isMessaging}
        className="w-full inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black text-sm font-bold py-2.5 px-6 rounded transition-colors shadow-sm cursor-pointer"
      >
        <MessageSquare size={16} />
        {isMessaging ? 'Opening chat…' : 'I have this — message buyer'}
      </button>
    </div>
  </div>
);
