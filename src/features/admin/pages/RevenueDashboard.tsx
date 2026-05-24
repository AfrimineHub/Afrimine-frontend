import { Bell, MessageSquare, User, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';

const RevenueDashboard = () => {
  const transactions = [
    { id: 'TXN-00234', vendor: 'Gold Coast Minerals', product: 'Gold Ore - 100kg', amount: '₦8,450', status: 'Completed', date: 'April 5, 2024' },
    { id: 'TXN-00235', vendor: 'Diamond Valley Mining', product: 'Uncut Diamond - 20 Carat', amount: '₦8,450', status: 'Completed', date: 'April 5, 2024' },
    { id: 'TXN-00236', vendor: 'Copper Ridge Ltd', product: 'Copper Concentrate - 500kg', amount: '₦8,450', status: 'Completed', date: 'April 6, 2024' },
    { id: 'TXN-00237', vendor: 'Platinum Mines Co.', product: 'Platinum Ore - 50kg', amount: '₦8,450', status: 'Completed', date: 'April 7, 2024' },
    { id: 'TXN-00238', vendor: 'Ironclad Metal Works', product: 'Iron Ore - 1000kg', amount: '₦8,450', status: 'Pending', date: 'April 8, 2024' },
    { id: 'TXN-00239', vendor: 'Silver Stream Corp.', product: 'Silver Bar - 500kg', amount: '₦8,450', status: 'Failed', date: 'April 9, 2024' },
    { id: 'TXN-00240', vendor: 'Basalt Extraction', product: 'Basalt Rock - 2000kg', amount: '₦8,450', status: 'Completed', date: 'April 10, 2024' },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-600';
      case 'Pending': return 'bg-amber-100 text-amber-600';
      case 'Failed': return 'bg-rose-100 text-rose-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      {/* --- Top Navigation Bar --- */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
            <div className="w-4 h-4 border-t-2 border-r-2 border-white rotate-45" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 uppercase">Addmire</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:text-slate-600"><Bell size={20} /></button>
          <button className="text-slate-400 hover:text-slate-600"><MessageSquare size={20} /></button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <span className="text-sm font-bold text-slate-700">Admin</span>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-[1400px] mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Revenue Dashboard</h1>
          <p className="text-slate-500 text-sm font-medium">Monitor platform earnings, vendor payouts, and transaction status</p>
        </div>

        {/* --- Financial Metrics Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total Platform Revenue</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">₦480,500</h2>
              <span className="text-emerald-500 flex items-center text-sm font-bold">
                <ArrowUpRight size={14} /> 12.5%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Total from all asset sales</p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Vendor Payouts</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">₦450,000</h2>
              <span className="text-blue-500 flex items-center text-sm font-bold">
                <ArrowUpRight size={14} /> 8.2%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Successfully processed payouts</p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pending Payments</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">₦80,450</h2>
              <span className="text-rose-400 flex items-center text-sm font-bold">
                <ArrowDownRight size={14} /> 2.1%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Escrowed funds awaiting release</p>
          </div>
        </div>

        {/* --- Transactions Table Section --- */}
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
          <button className="text-sm font-bold text-blue-600 hover:underline">View Payout Logs</button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vendor</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 text-sm font-bold text-slate-700">{txn.id}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-500">{txn.vendor}</td>
                    <td className="py-4 px-6 text-sm text-slate-500">{txn.product}</td>
                    <td className="py-4 px-6 text-sm font-black text-slate-800">{txn.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-400 font-medium">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevenueDashboard;