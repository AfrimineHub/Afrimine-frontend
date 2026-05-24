import { useState } from 'react';
import { Search, Eye } from 'lucide-react';

const AdminAllQuotesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const quotesData = [
    {
      id: 'QT-2026-001',
      clientName: 'John Mukasa',
      company: 'Mukasa Mining Ltd',
      product: 'Gold Ore',
      quantity: '500 kg',
      status: 'Negotiating',
      date: 'Apr 1, 2026',
      isNew: false,
    },
    {
      id: 'QT-2026-002',
      clientName: 'Sarah Ochieng',
      company: 'East Africa Minerals',
      product: 'Copper Concentrate',
      quantity: '2,000 kg',
      status: 'Approved',
      date: 'Mar 28, 2026',
      isNew: false,
    },
    {
      id: 'QT-2026-003',
      clientName: 'David Kimani',
      company: 'Kimani Exports',
      product: 'Diamond Rough',
      quantity: '50 carats',
      status: 'Pending',
      date: 'Apr 5, 2026',
      isNew: true,
    },
    {
      id: 'QT-2026-004',
      clientName: 'Grace Akinyi',
      company: 'Akinyi Trading Co.',
      product: 'Cobalt Ore',
      quantity: '1,500 kg',
      status: 'Negotiating',
      date: 'Apr 3, 2026',
      isNew: false,
    },
    {
      id: 'QT-2026-005',
      clientName: 'Peter Ngugi',
      company: 'Ngugi Minerals',
      product: 'Tantalum Concentrate',
      quantity: '300 kg',
      status: 'Rejected',
      date: 'Mar 25, 2026',
      isNew: false,
    },
    {
      id: 'QT-2026-006',
      clientName: 'Unknown Client',
      company: 'Zero Minerals LLC',
      product: 'Gold Bars',
      quantity: '100 kg',
      status: 'Pending',
      date: 'Apr 2, 2026',
      isNew: true,
    },
    {
      id: 'QT-2026-007',
      clientName: 'Mary Wambu',
      company: 'Wambu Enterprises',
      product: 'Lithium Carbonate',
      quantity: '800 kg',
      status: 'Approved',
      date: 'Mar 30, 2026',
      isNew: false,
    },
    {
      id: 'QT-2026-008',
      clientName: 'James Omondi',
      company: 'Omondi Logistics',
      product: 'Nickel Ore',
      quantity: '3,000 kg',
      status: 'Negotiating',
      date: 'Apr 6, 2026',
      isNew: true,
    },
  ];

  const getStatusStyles = (status) => {
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

  const filteredQuotes = quotesData.filter((quote) => 
    quote.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- Header Section --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">All Quotes</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and review all client quotes</p>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative mb-8 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-slate-50/50"
            placeholder="Search by quote number, client, company, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* --- Data Table --- */}
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
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Quote ID with optional red dot */}
                    <td className="py-3 px-6 text-sm font-medium text-slate-600">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-sm ${quote.isNew ? 'bg-red-500' : 'bg-transparent'}`} />
                        {quote.id}
                      </div>
                    </td>
                    
                    {/* Two-line Client Info */}
                    <td className="py-3 px-6">
                      <div className="text-sm font-semibold text-slate-800">{quote.clientName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{quote.company}</div>
                    </td>
                    
                    <td className="py-3 px-6 text-sm text-slate-600 font-medium">{quote.product}</td>
                    
                    <td className="py-3 px-6 text-sm text-slate-600">{quote.quantity}</td>
                    
                    {/* Status Badge */}
                    <td className="py-3 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getStatusStyles(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    
                    <td className="py-3 px-6 text-sm text-slate-500">{quote.date}</td>
                    
                    {/* Action Button */}
                    <td className="py-3 px-6">
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-800 transition-colors text-sm font-medium">
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredQuotes.length === 0 && (
              <div className="py-12 text-center text-slate-500">
                No quotes found matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAllQuotesPage;