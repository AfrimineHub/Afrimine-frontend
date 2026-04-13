import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const QuoteFormPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
             <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Send Quote</h1>
            <p className="text-sm text-gray-500 mt-1">Review the request and provide your pricing.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          
          {/* Notes Section */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Note <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea 
              rows={4}
              placeholder="Add a note to the buyer..."
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none resize-none"
            ></textarea>
          </div>

          {/* Pricing Table Section */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-gray-100 pb-3">Items Pricing</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[600px]">
                <thead className="text-gray-500 font-medium">
                  <tr>
                    <th className="pb-3 pr-4">Item</th>
                    <th className="pb-3 px-4 text-center">Quantity</th>
                    <th className="pb-3 px-4 w-48">Unit Price (₦)</th>
                    <th className="pb-3 pl-4 w-48">Total Price (₦)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                        <div>
                          <p className="font-medium text-slate-900">Lithium Ore - Raw</p>
                          <p className="text-xs text-gray-500 mt-0.5">Target: ₦150k/Ton</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-slate-700">500 Tons</td>
                    <td className="py-4 px-4">
                      <input 
                        type="text" 
                        defaultValue="160,000"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-right focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none"
                      />
                    </td>
                    <td className="py-4 pl-4">
                      <input 
                        type="text" 
                        defaultValue="80,000,000"
                        readOnly
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-right text-gray-500 outline-none"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end border-t border-gray-100 pt-6">
            <div className="w-full sm:w-72 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">₦ 80,000,000</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>VAT (7.5%)</span>
                <span className="font-medium text-slate-900">₦ 6,000,000</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-gray-100">
                <span>Total Amount</span>
                <span>₦ 86,000,000</span>
              </div>
            </div>
          </div>

        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <button className="px-6 py-3 text-sm font-bold text-slate-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-8 py-3 text-sm font-bold text-black bg-yellow-500 rounded-xl hover:bg-yellow-600 shadow-sm transition-colors">
            Send Quote
          </button>
        </div>

      </div>
    </div>
  );
};