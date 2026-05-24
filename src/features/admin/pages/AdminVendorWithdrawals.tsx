import { Bell, MessageSquare, User, Search, Download } from 'lucide-react';

const AdminVendorWithdrawals = () => {
  const withdrawalRequests = [
    { id: 1, vendor: 'Acme Electronics', initials: 'AE', email: 'payouts@acme.com', amount: '₦8,450', bank: 'First National Bank', date: 'Apr 15, 2026', status: 'Pending', color: 'bg-blue-50 text-blue-600' },
    { id: 2, vendor: 'Global Logistics Co.', initials: 'GL', email: 'finance@globallogistics.com', amount: '₦8,450', bank: 'United Bank of Nigeria', date: 'Apr 14, 2026', status: 'Pending', color: 'bg-indigo-50 text-indigo-600' },
    { id: 3, vendor: 'TechSupply Pro', initials: 'TP', email: 'accounts@techsupply.pro', amount: '₦8,450', bank: 'Access Bank', date: 'Apr 14, 2026', status: 'On Hold', color: 'bg-slate-100 text-slate-600' },
    { id: 4, vendor: 'Prime Materials Inc.', initials: 'PM', email: 'billing@primematerials.com', amount: '₦8,450', bank: 'Union Bank', date: 'Apr 13, 2026', status: 'Approved', color: 'bg-emerald-50 text-emerald-600' },
    { id: 5, vendor: 'Swift Services Ltd', initials: 'SS', email: 'finance@swiftservices.net', amount: '₦8,450', bank: 'Eco Bank', date: 'Apr 12, 2026', status: 'Approved', color: 'bg-teal-50 text-teal-600' },
    { id: 6, vendor: 'Omega Distribution', initials: 'OD', email: 'ops@omegadist.com', amount: '₦8,450', bank: 'Polaris Bank', date: 'Apr 10, 2026', status: 'Rejected', color: 'bg-rose-50 text-rose-600' },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending': return 'text-amber-500';
      case 'Approved': return 'text-emerald-500';
      case 'On Hold': return 'text-blue-500';
      case 'Rejected': return 'text-rose-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* --- Dashboard Header --- */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
            <div className="w-4 h-4 border-t-2 border-r-2 border-white rotate-45" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 uppercase">Addmire</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Bell size={20} className="text-slate-400" />
            <div className="absolute -top-1 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
          </div>
          <MessageSquare size={20} className="text-slate-400" />
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#D4A017] flex items-center justify-center text-white font-bold">
              <User size={16} />
            </div>
            <span className="text-sm font-bold text-slate-700">Admin</span>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-[1400px] mx-auto">
        {/* --- Page Title --- */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Vendor Withdrawals</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and process vendor payout requests</p>
        </div>

        {/* --- Toolbar --- */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search vendor or bank..." 
              className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* --- Withdrawals Table --- */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Vendor</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Bank</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Request Date</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {withdrawalRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${req.color}`}>
                          {req.initials}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{req.vendor}</div>
                          <div className="text-xs text-slate-400 mt-0.5 group-hover:text-slate-500 transition-colors">{req.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-black text-slate-800">{req.amount}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-slate-500">{req.bank}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-400 font-medium">{req.date}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`text-xs font-black uppercase tracking-widest ${getStatusStyles(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* --- Pagination Footer --- */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 1-6 of 24 requests</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-slate-200 rounded text-xs font-bold text-slate-400 hover:bg-white transition-colors cursor-not-allowed">Prev</button>
              <button className="px-3 py-1 border border-slate-200 bg-white rounded text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminVendorWithdrawals;