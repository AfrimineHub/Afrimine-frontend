import { MapPin, MessageSquare, Edit2, Trash2 } from 'lucide-react';

interface OrderItemProps {
  title: string;
  location: string;
  price: string;
  category: string;
  status: 'Inquiry' | 'Negotiation' | 'Agreement' | 'Closed';
  statusLabel: string; // e.g., "5K Initially"
  seller: { name: string; country: string; avatar?: string };
  lastUpdated: string;
  actionType: 'Ongoing' | 'Completed';
}

export const OrderListItem = ({ title, location, price, category, status, statusLabel, seller, lastUpdated, actionType }: OrderItemProps) => {
  const statusColors = {
    Inquiry: 'bg-emerald-500',
    Negotiation: 'bg-blue-500',
    Agreement: 'bg-yellow-500',
    Closed: 'bg-gray-400'
  };

  return (
    <div className="bg-white border-b border-gray-100 p-4 flex items-center hover:bg-gray-50/50 transition-colors">
      {/* Product Info */}
      <div className="flex items-center gap-4 w-[30%]">
        <img src="/images/categories/lithium-mine.svg" className="w-20 h-14 rounded-lg object-cover" alt={title} />
        <div>
          <h4 className="text-sm font-bold text-gray-900 leading-tight">{title}</h4>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 my-1">
            <MapPin size={10} /> {location}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-800">{price}</span>
            <span className="bg-blue-50 text-blue-600 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">{category}</span>
          </div>
        </div>
      </div>

      {/* Status Column */}
      <div className="w-[15%] px-4">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
          <span className="text-xs font-bold text-gray-700">{status}</span>
        </div>
        <span className="text-[10px] text-gray-400">{statusLabel}</span>
      </div>

      {/* Seller Column */}
      <div className="w-[25%] flex items-center gap-3 px-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
          <img src={seller.avatar || "/images/categories/cat-jv.svg"} alt={seller.name} />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900">{seller.name}</p>
          <p className="text-[10px] text-gray-400">{seller.country}</p>
          <p className="text-[10px] text-gray-600 font-medium">$55,000/Kg</p>
        </div>
      </div>

      {/* Metadata & Actions */}
      <div className="flex-1 flex flex-col items-end gap-3">
        <span className="text-[10px] text-gray-400">{lastUpdated}</span>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-gray-400">
            <MessageSquare size={16} className="text-yellow-500 cursor-pointer" />
            <Edit2 size={16} className="text-yellow-500 cursor-pointer" />
            <Trash2 size={16} className="text-red-400 cursor-pointer" />
          </div>
          <button className={`px-4 py-1.5 rounded-md text-[10px] font-bold text-white transition-colors ${
            actionType === 'Ongoing' ? 'bg-[#3EB489]' : 'bg-[#2D3339]'
          }`}>
            {actionType}
          </button>
        </div>
      </div>
    </div>
  );
};