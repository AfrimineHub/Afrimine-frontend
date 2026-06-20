import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle, FileBadge, Globe, Mail, Phone } from 'lucide-react';
import { AdminPagination } from '../components/AdminPagination';
import { useAdminKycQueueQuery } from '@/features/admin/queries';
import { formatAdminDateTime, getInitials } from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const KYCVerificationQueue = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      q: searchQuery.trim() || undefined,
      status: 'pending',
      page,
      pageSize: 20,
    }),
    [page, searchQuery],
  );

  const queueQuery = useAdminKycQueueQuery(queryParams);
  const pendingUsers = queueQuery.data?.items ?? [];
  const pendingCount = queueQuery.data?.totalCount ?? pendingUsers.length;

  const loadError =
    queueQuery.isError && getApiErrorMessage(queueQuery.error, 'Could not load KYC queue.');

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans">
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">KYC Verification Queue</h1>
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" />
              {queueQuery.isLoading ? 'Loading…' : `${pendingCount} pending verification${pendingCount === 1 ? '' : 's'}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setPage(1);
                }}
                className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Contact Information
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Document Type
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Country</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {queueQuery.isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="px-6 py-5">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No pending KYC submissions.
                  </td>
                </tr>
              ) : (
                pendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {getInitials(user.fullName)}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{user.fullName ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail size={12} className="text-slate-300" /> {user.email ?? '—'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone size={12} className="text-slate-300" /> {user.phone ?? '—'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <FileBadge size={16} className="text-amber-500" />
                        <span className="text-sm font-medium text-slate-600">{user.documentType ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Globe size={16} className="text-slate-300" /> {user.country ?? '—'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        {formatAdminDateTime(user.submittedAt)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-500/10 transition-all active:scale-95 cursor-pointer"
                        onClick={() => navigate(`/admin/kyc/review/${user.id}`)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {queueQuery.data ? (
            <AdminPagination
              page={queueQuery.data.page}
              pageSize={queueQuery.data.pageSize}
              totalCount={queueQuery.data.totalCount}
              totalPages={queueQuery.data.totalPages}
              onPageChange={setPage}
              isLoading={queueQuery.isFetching}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default KYCVerificationQueue;
