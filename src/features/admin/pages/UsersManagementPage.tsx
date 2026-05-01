import { usersList, userStats } from '../data/userData';
import { StatusBadge } from '../components/StatusBadge';
import { ActionButtons } from '../components/ActionButton';
import { FilterDropdown } from '../components/FilterDropDown';

const UsersManagementPage = () => {
  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans">
      
      {/* Top Header Mockup */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded text-white flex items-center justify-center font-bold text-xs">AM</div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-gray-400 relative">
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#B89047] text-white flex items-center justify-center text-xs font-bold">A</div>
            <span className="text-sm font-bold text-gray-700">Admin</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Users Management</h1>
          <p className="text-sm text-gray-500 font-medium">Manage vendor and buyer accounts, KYC verification, and account status</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-[#F4F5F7] border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E293B]"
            />
          </div>
          <div className="flex gap-4">
            <FilterDropdown placeholder="All Roles" />
            <FilterDropdown placeholder="All KYC Status" />
            <FilterDropdown placeholder="All Account Status" />
          </div>
        </div>

        {/* Data Table */}
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
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-2 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="py-4 px-2 text-sm text-gray-500">{user.email}</td>
                  <td className="py-4 px-2">
                    <StatusBadge type="role" value={user.role} />
                  </td>
                  <td className="py-4 px-2">
                    <StatusBadge type="kyc" value={user.kycStatus} />
                  </td>
                  <td className="py-4 px-2">
                    <StatusBadge 
                      type="account" 
                      value={user.accountStatus} 
                      forceRed={user.isRedAccountStatus} 
                    />
                  </td>
                  <td className="py-4 px-2">
                    <ActionButtons accountStatus={user.accountStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-8">
          {userStats.map((stat, idx) => (
            <div key={idx}>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default UsersManagementPage;