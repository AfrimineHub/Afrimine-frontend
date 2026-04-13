import React from 'react';
import { MapPin, MessageSquare, Edit2, Trash2 } from 'lucide-react';

export interface Order {
  id: string;
  title: string;
  location: string;
  price: string;
  status: 'Inquiry' | 'Negotiation' | 'Agreement' | 'Closed';
  statusLabel: string;
  seller: { name: string; country: string; rate: string };
  lastUpdated: string;
}

export const OrderListItem: React.FC<{ order: Order }> = ({ order }) => {
  const statusStyles = {
    Inquiry: 'bg-emerald-50 text-emerald-600',
    Negotiation: 'bg-blue-50 text-blue-600',
    Agreement: 'bg-yellow-50 text-yellow-700',
    Closed: 'bg-gray-50 text-gray-500',
  };

  return (
    <div className="group bg-white border-b border-gray-100 p-5 flex flex-col md:flex-row items-center gap-6 hover:bg-gray-50/50 transition-all">
      <div className="flex items-center gap-4 w-full md:w-[35%]">
        <div className="w-20 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0" />
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">{order.title}</h4>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
            <MapPin size={12} className="text-yellow-600" /> {order.location}
          </div>
          <p className="text-[11px] font-bold text-slate-900 mt-1">{order.price}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full md:w-[20%] text-center border-x border-gray-100/60 px-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[order.status]}`}>
          {order.status}
        </span>
        <span className="text-[10px] text-gray-400 mt-2 font-medium">{order.statusLabel}</span>
      </div>

      <div className="flex items-center gap-3 w-full md:w-[25%]">
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-gray-200 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate">{order.seller.name}</p>
          <p className="text-[10px] text-gray-500">{order.seller.country}</p>
          <p className="text-[10px] font-bold text-yellow-600 mt-0.5">{order.seller.rate}</p>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between w-full md:flex-1 h-full">
        <span className="text-[10px] text-gray-400 mb-4">{order.lastUpdated}</span>
        <div className="flex items-center gap-3">
          <MessageSquare size={16} className="text-yellow-600 cursor-pointer" />
          <Edit2 size={16} className="text-yellow-600 cursor-pointer" />
          <Trash2 size={16} className="text-red-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};