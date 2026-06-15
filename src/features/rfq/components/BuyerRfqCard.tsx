import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import type { BuyerRfqCardData } from '@/features/buyer/dashboardUtils';

interface BuyerRfqCardProps {
  rfq: BuyerRfqCardData;
}

export const BuyerRfqCard = ({ rfq }: BuyerRfqCardProps) => {
  const statusColor =
    rfq.statusLabel === 'Closed'
      ? 'bg-gray-100 text-gray-600'
      : rfq.statusLabel === 'Responded'
        ? 'bg-green-50 text-green-700'
        : 'bg-yellow-50 text-yellow-800';

  return (
    <div className="flex flex-col p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow duration-200 h-full">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-[17px] font-bold text-gray-900">
          {rfq.resource} – {rfq.quantity}
        </h3>
        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full shrink-0 ${statusColor}`}>
          {rfq.statusLabel}
        </span>
      </div>

      <div className="mb-6 space-y-2.5">
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
        {rfq.notes ? (
          <p className="text-sm text-gray-500 line-clamp-2">{rfq.notes}</p>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between pt-2 gap-3 flex-wrap">
        <span className="text-xs text-gray-500">
          {rfq.responseCount > 0
            ? `${rfq.responseCount} vendor${rfq.responseCount === 1 ? '' : 's'} responded`
            : 'Waiting for vendor responses'}
        </span>
        <div className="flex items-center gap-2">
          {rfq.responseCount > 0 ? (
            <Link
              to={`/rfq/${rfq.id}/quotes`}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2.5 px-4 rounded transition-colors"
            >
              View quotes
            </Link>
          ) : null}
          <Link
            to={`/messages?rfqId=${rfq.id}`}
            className="inline-flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-bold py-2.5 px-5 rounded transition-colors shadow-sm"
          >
            <MessageSquare size={14} />
            Messages
          </Link>
        </div>
      </div>
    </div>
  );
};
