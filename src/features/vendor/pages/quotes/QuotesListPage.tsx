import React from 'react';
import { ChevronDown } from 'lucide-react';
import { QuoteListItem, type QuoteItem } from '../../components/quotes/QuoteListItem';

const mockQuotes: QuoteItem[] = [
  { id: '1', company: 'Global Mining Corp', listing: 'Premium Gold Ore', requestSummary: 'Request for 50kg gold ore with immediate delivery', timeAgo: 'Yesterday', status: 'Pending', isNew: true },
  { id: '2', company: 'Diamond Traders Ltd', listing: 'Rough Diamonds', requestSummary: 'Inquiry for 200 carats rough diamonds', timeAgo: '2d ago', status: 'Sent' },
  { id: '3', company: 'Platinum Industries', listing: 'Platinum Concentrate', requestSummary: 'Request for 100 tons platinum concentrate', timeAgo: '3d ago', status: 'Accepted' },
  { id: '4', company: 'Copper Ventures SA', listing: 'Copper Cathodes', requestSummary: 'Quote request for 500 MT copper cathodes', timeAgo: '4d ago', status: 'Rejected' },
  { id: '5', company: 'Rare Earth Solutions', listing: 'Lithium Ore', requestSummary: 'RFQ for 20 tons lithium Spodumene Ore', timeAgo: '5d ago', status: 'Flagged' },
];

export const QuotesListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header matching Image 1 */}
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and respond to buyer request</p>
          </div>
          <div className="relative">
            <button className="flex items-center justify-between gap-8 px-4 py-2 bg-gray-100/80 hover:bg-gray-200/80 rounded-lg text-sm font-medium text-slate-700 transition-colors w-32 cursor-pointer">
              All <ChevronDown size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Quotes List */}
        <div className="flex flex-col">
          {mockQuotes.map((quote) => (
            <QuoteListItem key={quote.id} quote={quote} />
          ))}
        </div>

      </div>
    </div>
  );
};