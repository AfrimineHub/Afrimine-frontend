import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface QuoteItem {
  id: string;
  company: string;
  listing: string;
  requestSummary: string;
  timeAgo: string;
  status: 'Pending' | 'Sent' | 'Accepted' | 'Rejected' | 'Flagged';
  isNew?: boolean;
}

export const QuoteListItem: React.FC<{ quote: QuoteItem }> = ({ quote }) => {
  const getStatusDisplay = (status: QuoteItem['status']) => {
    switch (status) {
      case 'Pending':
        return { style: 'bg-orange-50 text-orange-600', icon: <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" /> };
      case 'Sent':
        return { style: 'bg-blue-50 text-blue-600', icon: <Send size={12} className="mr-1.5" /> };
      case 'Accepted':
        return { style: 'bg-emerald-50 text-emerald-600', icon: <CheckCircle size={12} className="mr-1.5" /> };
      case 'Rejected':
        return { style: 'bg-red-50 text-red-600', icon: <XCircle size={12} className="mr-1.5" /> };
      case 'Flagged':
        return { style: 'bg-red-50 text-red-600', icon: <AlertCircle size={12} className="mr-1.5" /> };
      default:
        return { style: 'bg-gray-50 text-gray-600', icon: null };
    }
  };

  const statusDisplay = getStatusDisplay(quote.status);

  return (
    <Link 
      to={`/dashboard/my-quotes/${quote.id}`}
      className={`block p-4 mb-2 transition-all rounded-lg border-l-4 ${
        quote.isNew ? 'border-yellow-500 bg-yellow-50/30' : 'border-transparent hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900">{quote.company}</h4>
          <p className="text-xs text-gray-500">{quote.listing}</p>
          <p className="text-xs text-gray-600 font-medium">{quote.requestSummary}</p>
          <p className="text-[10px] text-gray-400 mt-2">{quote.timeAgo}</p>
        </div>
        <div className={`flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${statusDisplay.style}`}>
          {statusDisplay.icon}
          {quote.status}
        </div>
      </div>
    </Link>
  );
};