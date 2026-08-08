import { useMemo, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { ActionButtons } from '../components/ActionButton';
import { FilterDropdown } from '../components/FilterDropDown';
import { AdminPagination } from '../components/AdminPagination';
import {
  useAdminUsersQuery,
  useAdminUsersStatsQuery,
} from '@/features/admin/queries';
import {
  mapAccountStatusLabel,
  mapKycStatusLabel,
  mapUserRoleLabel,
} from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const ROLE_OPTIONS = [
  { label: 'All Roles', value: '' },
  { label: 'Vendor', value: 'vendor' },
  { label: 'Buyer', value: 'buyer' },
  { label: 'Investor', value: 'investor' },
];

const KYC_OPTIONS = [
  { label: 'All KYC Status', value: '' },
  { label: 'Verified', value: 'verified' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Not Started', value: 'not_started' },
];

const ACCOUNT_OPTIONS = [
  { label: 'All Account Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Banned', value: 'banned' },
];

const UsersManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState('');
  const [kycStatus, setKycStatus] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      q: searchQuery.trim() || undefined,
      role: role || undefined,
      kycStatus: kycStatus || undefined,
      accountStatus: accountStatus || undefined,
      page,
      pageSize: 20,
    }),
    [accountStatus, kycStatus, page, role, searchQuery],
  );

  const usersQuery = useAdminUsersQuery(queryParams);
  const statsQuery = useAdminUsersStatsQuery();

  const users = usersQuery.data?.items ?? [];
  const userStats = statsQuery.data
    ? [
        { label: 'Total Users', value: String(statsQuery.data.totalUsers) },
        { label: 'Active Users', value: String(statsQuery.data.activeUsers) },
        { label: 'KYC Verified', value: String(statsQuery.data.kycVerified) },
        { label: 'Vendors', value: String(statsQuery.data.vendors) },
      ]
    : [];

  const loadError =
    usersQuery.isError && getApiErrorMessage(usersQuery.error, 'Could not load users.');

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans">
      <main className="w-full mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Users Management</h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage vendor and buyer accounts, KYC verification, and account status
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-[#F4F5F7] border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E293B]"
            />
          </div>
          <div className="flex gap-4">
            <FilterDropdown
              placeholder="All Roles"
              value={role}
              options={ROLE_OPTIONS}
              onChange={(value) => {
                setRole(value);
                setPage(1);
              }}
            />
            <FilterDropdown
              placeholder="All KYC Status"
              value={kycStatus}
              options={KYC_OPTIONS}
              onChange={(value) => {
                setKycStatus(value);
                setPage(1);
              }}
            />
            <FilterDropdown
              placeholder="All Account Status"
              value={accountStatus}
              options={ACCOUNT_OPTIONS}
              onChange={(value) => {
                setAccountStatus(value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 px-2 text-sm font-bold text-gray-700">Name</th>
                <th className="py-4 px-2 text-sm font-bold text-gray-700">Email</th>
                <th className="py-4 px-2 text-sm font-bold text-gray-700">Role</th>
                <th className="py-4 px-2 text-sm font-bold text-gray-700">KYC Status</th>
                <th className="py-4 px-2 text-sm font-bold text-gray-700">Account Status</th>
                <th className="py-4 px-2 text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersQuery.isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const roleLabel = mapUserRoleLabel(user.role);
                  const kycLabel = mapKycStatusLabel(user.kycStatus);
                  const accountLabel = mapAccountStatusLabel(user.accountStatus);

                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-2 text-sm font-medium text-gray-900">
                        {user.fullName?.trim() || '—'}
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-500">{user.email ?? '—'}</td>
                      <td className="py-4 px-2">
                        <StatusBadge type="role" value={roleLabel} />
                      </td>
                      <td className="py-4 px-2">
                        <StatusBadge type="kyc" value={kycLabel} />
                      </td>
                      <td className="py-4 px-2">
                        <StatusBadge
                          type="account"
                          value={accountLabel}
                          forceRed={accountLabel === 'Suspended' || accountLabel === 'Banned'}
                        />
                      </td>
                      <td className="py-4 px-2">
                        <ActionButtons user={user} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {usersQuery.data ? (
          <AdminPagination
            page={usersQuery.data.page}
            pageSize={usersQuery.data.pageSize}
            totalCount={usersQuery.data.totalCount}
            totalPages={usersQuery.data.totalPages}
            onPageChange={setPage}
            isLoading={usersQuery.isFetching}
          />
        ) : null}

        <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsQuery.isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))
            : userStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
        </div>
      </main>
    </div>
  );
};

export default UsersManagementPage;
