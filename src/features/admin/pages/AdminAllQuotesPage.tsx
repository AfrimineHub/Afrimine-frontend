import { useMemo, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { AdminPagination } from '../components/AdminPagination';
import { useAdminQuotesQuery } from '@/features/admin/queries';
import { formatAdminDate, titleCaseStatus } from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Negotiating':
      return 'bg-blue-100 text-blue-600';
    case 'Approved':
      return 'bg-emerald-100 text-emerald-600';
    case 'Pending':
      return 'bg-slate-100 text-slate-500';
    case 'Rejected':
      return 'bg-pink-100 text-pink-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const AdminAllQuotesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      q: searchQuery.trim() || undefined,
      page,
      pageSize: 20,
    }),
    [page, searchQuery],
  );

  const quotesQuery = useAdminQuotesQuery(queryParams);
  const quotes = quotesQuery.data?.items ?? [];

  const loadError =
    quotesQuery.isError && getApiErrorMessage(quotesQuery.error, 'Could not load quotes.');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">All Quotes</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and review all client quotes</p>
        </div>

        <div className="relative mb-8 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-slate-50/50"
            placeholder="Search by quote number, client, company, or product..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPage(1);
            }}
          />
        </div>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Quote #</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Client</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Product</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Quantity</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-600 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotesQuery.isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={7} className="py-4 px-6">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : quotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No quotes found{searchQuery ? ` matching "${searchQuery}"` : ''}.
                    </td>
                  </tr>
                ) : (
                  quotes.map((quote) => {
                    const statusLabel = titleCaseStatus(quote.status);
                    return (
                      <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3 px-6 text-sm font-medium text-slate-600">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-sm ${quote.isUnread ? 'bg-red-500' : 'bg-transparent'}`}
                            />
                            {quote.id}
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="text-sm font-semibold text-slate-800">
                            {quote.clientName?.trim() || '—'}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{quote.companyName ?? '—'}</div>
                        </td>
                        <td className="py-3 px-6 text-sm text-slate-600 font-medium">
                          {quote.productName ?? '—'}
                        </td>
                        <td className="py-3 px-6 text-sm text-slate-600">{quote.quantity ?? '—'}</td>
                        <td className="py-3 px-6">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getStatusStyles(statusLabel)}`}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-sm text-slate-500">{formatAdminDate(quote.createdAt)}</td>
                        <td className="py-3 px-6">
                          <button
                            type="button"
                            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-800 transition-colors text-sm font-medium"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {quotesQuery.data ? (
            <AdminPagination
              page={quotesQuery.data.page}
              pageSize={quotesQuery.data.pageSize}
              totalCount={quotesQuery.data.totalCount}
              totalPages={quotesQuery.data.totalPages}
              onPageChange={setPage}
              isLoading={quotesQuery.isFetching}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminAllQuotesPage;
