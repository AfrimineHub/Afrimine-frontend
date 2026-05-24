import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const AdminOrderTrackingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const ordersData = [
    {
      id: 'ORD-2024-001',
      buyer: { name: 'Sarah Johnson', email: 'sarah.j@example.com', initials: 'SJ', bg: 'bg-blue-50 text-blue-600' },
      vendor: { name: 'TechStore Inc.', email: 'contact@techstore.com', initials: 'TS', bg: 'bg-indigo-50 text-indigo-600' },
      amount: '₦8,450',
      status: 'In Progress',
      date: 'Apr 5, 2024',
      description: 'Custom software development - E-C...',
    },
    {
      id: 'ORD-2024-002',
      buyer: { name: 'Michael Chen', email: 'michael.chen@example.com', initials: 'MC', bg: 'bg-emerald-50 text-emerald-600' },
      vendor: { name: 'Creative Designs Studio', email: 'hello@creativedesigns.com', initials: 'CD', bg: 'bg-teal-50 text-teal-600' },
      amount: '₦8,450',
      status: 'Completed',
      date: 'Mar 28, 2024',
      description: 'Brand identity design package',
    },
    {
      id: 'ORD-2024-003',
      buyer: { name: 'Emily Rodriguez', email: 'emily.r@example.com', initials: 'ER', bg: 'bg-purple-50 text-purple-600' },
      vendor: { name: 'WebDev Solutions', email: 'support@webdev.com', initials: 'WD', bg: 'bg-violet-50 text-violet-600' },
      amount: '₦8,450',
      status: 'Failed',
      date: 'Apr 1, 2024',
      description: 'Enterprise web application developme...',
    },
    {
      id: 'ORD-2024-004',
      buyer: { name: 'David Thompson', email: 'david.t@example.com', initials: 'DT', bg: 'bg-orange-50 text-orange-600' },
      vendor: { name: 'Marketing Pros', email: 'info@marketingpros.com', initials: 'MP', bg: 'bg-amber-50 text-amber-600' },
      amount: '₦8,450',
      status: 'Pending',
      date: 'Apr 8, 2024',
      description: 'Social media marketing campaign',
    },
    {
      id: 'ORD-2024-005',
      buyer: { name: 'Lisa Anderson', email: 'lisa.a@example.com', initials: 'LA', bg: 'bg-pink-50 text-pink-600' },
      vendor: { name: 'DataSoft Consulting', email: 'contact@datasoft.com', initials: 'DC', bg: 'bg-rose-50 text-rose-600' },
      amount: '₦8,450',
      status: 'Canceled',
      date: 'Mar 20, 2024',
      description: 'Data analytics dashboard development',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'text-blue-500';
      case 'Completed': return 'text-emerald-500';
      case 'Failed': return 'text-purple-500';
      case 'Pending': return 'text-orange-500';
      case 'Canceled': return 'text-pink-500';
      default: return 'text-slate-500';
    }
  };

  const filteredOrders = ordersData.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate summary statistics
  const stats = useMemo(() => {
    return {
      total: filteredOrders.length,
      completed: filteredOrders.filter(o => o.status === 'Completed').length,
      inProgress: filteredOrders.filter(o => o.status === 'In Progress').length,
      pending: filteredOrders.filter(o => o.status === 'Pending').length,
      canceled: filteredOrders.filter(o => o.status === 'Canceled' || o.status === 'Failed').length,
    };
  }, [filteredOrders]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-8">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- Header Section --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Order Tracking Page</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and monitor all escrow transactions</p>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative mb-8 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50/50"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* --- Data Table --- */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Buyer</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vendor</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Created</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="py-4 px-6 text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                      {order.id}
                    </td>
                    
                    {/* Buyer Avatar & Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${order.buyer.bg}`}>
                          {order.buyer.initials}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{order.buyer.name}</div>
                          <div className="text-xs text-slate-400">{order.buyer.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Vendor Avatar & Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${order.vendor.bg}`}>
                          {order.vendor.initials}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{order.vendor.name}</div>
                          <div className="text-xs text-slate-400">{order.vendor.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6 text-sm font-semibold text-slate-700">{order.amount}</td>
                    
                    <td className="py-4 px-6 text-sm font-medium">
                      <span className={getStatusColor(order.status)}>{order.status}</span>
                    </td>
                    
                    <td className="py-4 px-6 text-sm text-slate-500">{order.date}</td>
                    
                    <td className="py-4 px-6 text-sm text-slate-500 max-w-[200px] truncate" title={order.description}>
                      {order.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="py-12 text-center text-slate-500">
                No orders found matching "{searchQuery}".
              </div>
            )}
          </div>

          {/* --- Summary Footer --- */}
          <div className="bg-slate-50/80 border-t border-slate-100 p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Orders</span>
              <span className="text-xl font-bold text-slate-800">{stats.total}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-500/70 uppercase tracking-wider mb-1">Completed</span>
              <span className="text-xl font-bold text-emerald-600">{stats.completed}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-blue-500/70 uppercase tracking-wider mb-1">In Progress</span>
              <span className="text-xl font-bold text-blue-600">{stats.inProgress}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-orange-500/70 uppercase tracking-wider mb-1">Pending</span>
              <span className="text-xl font-bold text-orange-600">{stats.pending}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-pink-500/70 uppercase tracking-wider mb-1">Failed/Canceled</span>
              <span className="text-xl font-bold text-pink-600">{stats.canceled}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOrderTrackingPage;