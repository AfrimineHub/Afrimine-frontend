import React from 'react';

interface QuoteDetailsCardProps {
  status: string;
  buyer: { name: string; email: string; phone: string };
  delivery: { location: string; expectedDate: string };
  quote: { rfqNo: string; deadline: string };
}

export const QuoteDetailsCard: React.FC<QuoteDetailsCardProps> = ({ status, buyer, delivery, quote }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative">
      <div className="absolute top-6 right-6">
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>
      </div>
      
      <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-gray-100 pb-4">Request for Quotation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Buyer Details</h3>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-slate-900">{buyer.name}</p>
            <p className="text-gray-600">{buyer.email}</p>
            <p className="text-gray-600">{buyer.phone}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Delivery Details</h3>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-slate-900">{delivery.location}</p>
            <p className="text-gray-600">Expected: {delivery.expectedDate}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quote Details</h3>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-slate-900">RFQ No: <span className="font-normal text-gray-600">{quote.rfqNo}</span></p>
            <p className="text-gray-600">Submission Deadline: {quote.deadline}</p>
          </div>
        </div>
      </div>
    </div>
  );
};