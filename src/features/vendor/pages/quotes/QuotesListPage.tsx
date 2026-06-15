import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { QuoteListItem } from '../../components/quotes/QuoteListItem';
import { useVendorQuotesQuery } from '@/features/vendor/dashboardQueries';
import { mapVendorQuoteToQuoteItem } from '@/features/vendor/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

const STATUS_FILTERS = [
  { label: 'All', value: undefined },
  { label: 'Pending', value: 1 },
  { label: 'Sent', value: 2 },
  { label: 'Accepted', value: 3 },
  { label: 'Rejected', value: 4 },
  { label: 'Flagged', value: 5 },
] as const;

export const QuotesListPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [filterOpen, setFilterOpen] = useState(false);

  const quotesQuery = useVendorQuotesQuery({
    Page: 1,
    PageSize: 20,
    Status: statusFilter,
  });

  const quotes = useMemo(
    () => (quotesQuery.data?.items ?? []).map(mapVendorQuoteToQuoteItem),
    [quotesQuery.data?.items],
  );

  const activeFilterLabel =
    STATUS_FILTERS.find((filter) => filter.value === statusFilter)?.label ?? 'All';

  const loadError =
    quotesQuery.isError &&
    getApiErrorMessage(quotesQuery.error, 'Could not load quotes.');

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and respond to buyer requests</p>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((open) => !open)}
              className="flex items-center justify-between gap-8 px-4 py-2 bg-gray-100/80 hover:bg-gray-200/80 rounded-lg text-sm font-medium text-slate-700 transition-colors w-32 cursor-pointer"
            >
              {activeFilterLabel} <ChevronDown size={16} className="text-gray-500" />
            </button>
            {filterOpen ? (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-100 bg-white shadow-lg z-10 py-1">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={() => {
                      setStatusFilter(filter.value);
                      setFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      statusFilter === filter.value ? 'text-yellow-700 font-medium' : 'text-slate-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {loadError ? (
          <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : quotesQuery.isLoading ? (
          <div className="space-y-3" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : quotes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">No quotes found.</p>
        ) : (
          <div className="flex flex-col">
            {quotes.map((quote) => (
              <QuoteListItem key={quote.id} quote={quote} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
