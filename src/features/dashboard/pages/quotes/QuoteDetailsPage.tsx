import React from 'react';
import { ArrowLeft, Download, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuoteDetailsCard } from '../../components/quotes/QuoteDetailsCard';

export const QuoteDetailsPage: React.FC = () => {
  const quoteData = {
    status: 'Completed',
    buyer: { 
      name: 'Afrimines Inc', 
      email: 'contact@afrimines.com', 
      phone: '+234 (0) 801 234 5678' 
    },
    delivery: { 
      location: 'Lagos Port Complex, Apapa', 
      expectedDate: 'Oct 30, 2024' 
    },
    quote: { 
      rfqNo: 'QT-2024-001', 
      deadline: 'Oct 28, 2024' 
    }
  };

  const lineItems = [
    {
      id: 1,
      name: 'Lithium Ore - Raw',
      quantity: '500 Tons',
      targetPrice: '₦ 150,000 / Ton',
      expectedDelivery: 'Oct 30, 2024',
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header & Breadcrumbs */}
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link to="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
            <span className="text-gray-300">/</span>
            <Link to="/quotes" className="hover:text-gray-900 transition-colors">Quotes</Link>
            <span className="text-gray-300">/</span>
            <span className="text-slate-900 font-medium">Quote Details</span>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard/my-quotes" 
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-700" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Details</h1>
          </div>
        </div>

        {/* Top Summary Card (Orchestrated Component) */}
        <QuoteDetailsCard {...quoteData} />

        {/* Items Display Table Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-slate-900">Item Details</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6">Item</th>
                  <th className="py-3 px-6 text-center">Quantity</th>
                  <th className="py-3 px-6 text-right">Target Price</th>
                  <th className="py-3 px-6 text-right">Expected Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lineItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {/* Placeholder for item image */}
                        <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-md shrink-0"></div>
                        <span className="font-medium text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600 font-medium">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-600">
                      {item.targetPrice}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-600">
                      {item.expectedDelivery}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Total Summary Footer */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 mt-auto flex justify-end">
             <div className="text-right">
               <p className="text-sm text-gray-500 mb-1">Total Target Amount</p>
               <p className="text-2xl font-bold text-slate-900">₦ 75,000,000</p>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button className="px-6 py-2.5 text-sm font-bold text-slate-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
            <Download size={16} /> Download Quote
          </button>
          <button className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2 shadow-sm transition-colors">
            <MessageSquare size={16} /> Message Buyer
          </button>
        </div>

      </div>
    </div>
  );
};