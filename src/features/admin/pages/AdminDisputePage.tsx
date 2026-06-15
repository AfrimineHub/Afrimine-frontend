import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAdminDisputesQuery } from '@/features/escrow/queries';
import { formatBuyerAmount } from '@/features/buyer/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

const AdminDisputePage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const disputesQuery = useAdminDisputesQuery({ page: 1, pageSize: 50 });

  const disputes = disputesQuery.data?.items ?? [];
  const selected = disputes.find((d) => d.id === selectedId) ?? disputes[0];

  const loadError =
    disputesQuery.isError &&
    getApiErrorMessage(disputesQuery.error, 'Could not load disputes.');

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-slate-900 font-sans overflow-hidden min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-4">Disputes</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                placeholder="Search disputes..."
                className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {disputesQuery.isLoading ? (
              <div className="p-6 space-y-3" aria-busy="true">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            ) : disputes.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">No open disputes.</p>
            ) : (
              disputes.map((dispute) => (
                <button
                  key={dispute.id}
                  type="button"
                  onClick={() => setSelectedId(dispute.id)}
                  className={`w-full text-left p-6 border-b border-slate-50 transition-all hover:bg-slate-50 ${
                    selected?.id === dispute.id ? 'bg-slate-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <h4 className="font-bold text-slate-800 mb-1">
                    {dispute.listingTitle ?? `Order ${dispute.orderId}`}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium mb-3">
                    {dispute.buyerName} vs {dispute.vendorName}
                  </p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-50">
                    {dispute.status ?? 'DISPUTE'}
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-white p-8">
          {loadError ? (
            <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
              {loadError}
            </p>
          ) : selected ? (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black text-slate-800 mb-2">
                {selected.listingTitle ?? 'Dispute'}
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                {formatBuyerAmount(selected.amount, selected.currency)} · Opened{' '}
                {new Date(selected.openedAt).toLocaleDateString()}
              </p>
              {selected.reason ? (
                <p className="text-sm text-slate-700 mb-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
                  {selected.reason}
                </p>
              ) : null}
              <Link
                to={`/admin/dispute/${selected.id}`}
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800"
              >
                Open resolution panel
              </Link>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Select a dispute to review.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDisputePage;
