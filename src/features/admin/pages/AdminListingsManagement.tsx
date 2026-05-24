import { useState } from 'react';
import { 
  Bell, MessageSquare, User, AlertCircle, 
  Eye, Check, Trash2, Flag
} from 'lucide-react';

const AdminListingsManagement = () => {
  const [activeTab, setActiveTab] = useState('All Listings');

  const tabs = [
    { name: 'All Listings', count: 10 },
    { name: 'Pending', count: 3 },
    { name: 'Approved', count: null },
    { name: 'Rejected', count: null },
    { name: 'Flagged', count: 3 },
  ];

  const listingsData = [
    {
      id: 1,
      title: 'Gold Ore - High Grade',
      category: 'Precious Metals',
      location: 'Ghana',
      seller: 'Accra Mining Corp',
      price: '₦54,000',
      status: 'Pending',
      date: '2026-04-07',
    },
    {
      id: 2,
      title: 'Lithium Spodumene Ore',
      category: 'Battery Metals',
      location: 'Zimbabwe',
      seller: 'African Battery Minerals',
      price: '₦54,000',
      status: 'Pending',
      date: '2026-04-08',
    },
    {
      id: 3,
      title: 'Rare Earth Elements',
      category: 'Rare Earth',
      location: 'Tanzania',
      seller: 'East African Rare Earths',
      price: '₦54,000',
      status: 'Pending',
      date: '2026-04-08',
    },
    {
      id: 4,
      title: 'Copper Concentrate',
      category: 'Base Metals',
      location: 'Zambia',
      seller: 'Copperbelt Ventures',
      price: '₦54,000',
      status: 'Approved',
      date: '2026-04-08',
    },
    {
      id: 5,
      title: 'Lithium Spodumene Ore',
      category: 'Battery Metals',
      location: 'Zimbabwe',
      seller: 'African Battery Minerals',
      price: '₦54,000',
      status: 'Flagged',
      date: '2026-04-09',
    },
    {
      id: 6,
      title: 'Lithium Spodumene Ore',
      category: 'Battery Metals',
      location: 'Zimbabwe',
      seller: 'African Battery Minerals',
      price: '₦54,000',
      status: 'Rejected',
      date: '2026-04-06',
    },
  ];

  // Helper function for status badge styling
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Pending':
        return 'bg-slate-50 text-slate-500 border border-slate-200';
      case 'Flagged':
        return 'bg-pink-50 text-pink-600 border border-pink-100 flex items-center gap-1';
      case 'Rejected':
        return 'bg-red-50 text-red-500 border border-red-100';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredData = activeTab === 'All Listings' 
    ? listingsData 
    : listingsData.filter(item => item.status === activeTab.replace(/ \(\d+\)/, '')); // Strip count for comparison

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans">

      {/* --- Main Content --- */}
      <main className="max-w-[1400px] mx-auto py-8 px-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Listings Management</h1>
            <p className="text-slate-500 text-sm">Review and manage mineral listings from sellers</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <AlertCircle size={16} />
            View Flagged
          </button>
        </div>

        {/* --- Tabs --- */}
        <div className="flex bg-slate-100/50 p-1 rounded-lg mb-6 w-max border border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.name 
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.name} {tab.count && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* --- Data Table --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Seller</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6 text-sm font-medium text-slate-700">{item.title}</td>
                  <td className="py-4 px-6 text-sm text-slate-500">{item.category}</td>
                  <td className="py-4 px-6 text-sm text-slate-500">{item.location}</td>
                  <td className="py-4 px-6 text-sm text-slate-500">{item.seller}</td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-700">{item.price}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${getStatusStyles(item.status)}`}>
                      {item.status === 'Flagged' && <Flag size={10} className="mr-1" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500">{item.date}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-slate-400 hover:text-slate-700"><Eye size={16} /></button>
                      {item.status === 'Pending' ? (
                        <button className="text-slate-400 hover:text-emerald-600"><Check size={16} /></button>
                      ) : (
                        <button className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State Handler */}
          {filteredData.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              No listings found for this category.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminListingsManagement;