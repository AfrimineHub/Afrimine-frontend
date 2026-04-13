import React from 'react';

interface PricingItem {
  id: string;
  name: string;
  targetPrice: string;
  quantity: string;
  defaultUnitPrice?: string;
  defaultTotal?: string;
}

interface QuotePricingTableProps {
  items: PricingItem[];
  subtotal: string;
  vat: string;
  total: string;
}

export const QuotePricingTable: React.FC<QuotePricingTableProps> = ({ items, subtotal, vat, total }) => {
  return (
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
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Target: {item.targetPrice}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center font-medium text-slate-700">{item.quantity}</td>
                <td className="py-4 px-4">
                  <input 
                    type="text" 
                    defaultValue={item.defaultUnitPrice}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-right focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-shadow"
                  />
                </td>
                <td className="py-4 pl-4">
                  <input 
                    type="text" 
                    defaultValue={item.defaultTotal}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-right text-gray-500 outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Summary */}
      <div className="flex justify-end border-t border-gray-100 pt-6">
        <div className="w-full sm:w-72 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-slate-900">{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>VAT (7.5%)</span>
            <span className="font-medium text-slate-900">{vat}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-gray-100">
            <span>Total Amount</span>
            <span>{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};