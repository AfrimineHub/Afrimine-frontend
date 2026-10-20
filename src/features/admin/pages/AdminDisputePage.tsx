import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAdminDisputesQuery } from '@/features/escrow/queries';
import { formatBuyerAmount } from '@/features/buyer/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

const PAGE_SIZE = 50;

// Values come from the spec: Open, UnderReview, ResolvedBuyer, ResolvedVendor, Closed
const STATUS_FILTERS = [
  { label: 'All statuses', value: '' },
  { label: 'Open', value: 'Open' },
  { label: 'Under review', value: 'UnderReview' },
  { label: 'Resolved (buyer)', value: 'ResolvedBuyer' },
  { label: 'Resolved (vendor)', value: 'ResolvedVendor' },
  { label: 'Closed', value: 'Closed' },
] as const;

const STATUS_LABELS: Record<string, string> = {
  Open: 'Open',
  UnderReview: 'Under review',
  ResolvedBuyer: 'Resolved · Buyer',
  ResolvedVendor: 'Resolved · Vendor',
  Closed: 'Closed',
};

const statusBadgeClass = (status: string | null) => {
  switch (status) {
    case 'Open':
      return 'text-rose-500 bg-rose-50';
    case 'UnderReview':
      return 'text-amber-600 bg-amber-50';
    case 'ResolvedBuyer':
    case 'ResolvedVendor':
      return 'text-emerald-600 bg-emerald-50';
    default:
      return 'text-slate-500 bg-slate-100';
  }
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

const AdminDisputePage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  const disputesQuery = useAdminDisputesQuery({
    page: 1,
    pageSize: PAGE_SIZE,
    status: statusFilter || undefined,
  });

  const allDisputes = disputesQuery.data?.items ?? [];
  const totalCount = disputesQuery.data?.totalCount ?? allDisputes.length;

  // The API has no `q` param for disputes, so search is client-side over the loaded page.
  const disputes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allDisputes;
    return allDisputes.filter(
      (d) =>
        (d.listingTitle ?? '').toLowerCase().includes(term) ||
        (d.raisedByName ?? '').toLowerCase().includes(term),
    );
  }, [allDisputes, search]);

  const selected = disputes.find((d) => d.id === selectedId) ?? disputes[0];

  const loadError =
    disputesQuery.isError &&
    getApiErrorMessage(disputesQuery.error, 'Could not load disputes.');

  const emptyMessage = search.trim()
    ? 'No disputes match your search.'
    : statusFilter
      ? `No disputes with status "${STATUS_LABELS[statusFilter] ?? statusFilter}".`
      : 'No disputes found.';

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setSelectedId(null);
  };

  const titleFor = (d: (typeof allDisputes)[number]) =>
    d.listingTitle ?? `${d.source ?? 'Dispute'} #${d.id.slice(0, 8)}`;

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-slate-900 font-sans overflow-hidden min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-100 space-y-3">
            <h2 className="text-2xl font-black text-slate-800">Disputes</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by listing or name..."
                className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              aria-label="Filter by status"
              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {disputesQuery.isLoading ? (
              <div className="p-6 space-y-3" aria-busy="true">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            ) : disputesQuery.isError ? (
              <p className="p-6 text-sm text-slate-500">Disputes unavailable.</p>
            ) : disputes.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">{emptyMessage}</p>
            ) : (
              <>
                {disputes.map((dispute) => (
                  <button
                    key={dispute.id}
                    type="button"
                    onClick={() => setSelectedId(dispute.id)}
                    className={`w-full text-left p-6 border-b border-slate-50 transition-all hover:bg-slate-50 ${
                      selected?.id === dispute.id ? 'bg-slate-50 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <h4 className="font-bold text-slate-800 mb-1">{titleFor(dispute)}</h4>
                    <p className="text-xs text-slate-400 font-medium mb-3">
                      {dispute.raisedByName ? `Raised by ${dispute.raisedByName}` : 'Raised by unknown'}
                      {' · '}
                      {formatDate(dispute.createdAt)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${statusBadgeClass(
                          dispute.status,
                        )}`}
                      >
                        {STATUS_LABELS[dispute.status ?? ''] ?? dispute.status ?? 'Dispute'}
                      </span>
                      {dispute.source ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100">
                          {dispute.source}
                        </span>
                      ) : null}
                    </div>
                  </button>
                ))}
                {totalCount > allDisputes.length ? (
                  <p className="p-4 text-xs text-slate-400 text-center">
                    Showing {allDisputes.length} of {totalCount}. Use the status filter to narrow results.
                  </p>
                ) : null}
              </>
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
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-black text-slate-800">{titleFor(selected)}</h2>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                {formatBuyerAmount(selected.amount, selected.currency)} · Opened{' '}
                {formatDate(selected.createdAt)}
                {selected.raisedByName ? ` · Raised by ${selected.raisedByName}` : ''}
              </p>

              {selected.reason ? (
                <p className="text-sm text-slate-700 mb-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
                  {selected.reason}
                </p>
              ) : null}

              {selected.resolvedAt || selected.adminNote ? (
                <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                    Resolution{selected.resolvedAt ? ` · ${formatDate(selected.resolvedAt)}` : ''}
                  </p>
                  {selected.adminNote ? (
                    <p className="text-sm text-slate-700">{selected.adminNote}</p>
                  ) : null}
                </div>
              ) : null}

              <Link
                to={`/admin/dispute/${selected.id}`}
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800"
              >
                Open resolution panel
              </Link>
            </div>
          ) : disputesQuery.isLoading ? null : (
            <p className="text-sm text-slate-500">Select a dispute to review.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDisputePage;