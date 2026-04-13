import { useState } from 'react';
import { Eye, Edit2, Trash2, ExternalLink, EyeOff, } from 'lucide-react';

interface AdItemProps {
  image: string;
  title: string;
  category: string;
  status: 'Active' | 'Pending' | 'Rejected';
  price: string;
  stats: { views: number; inquiries: number };
  date: string;
}

export const AdListItem = ({ image, title, category, status, price, stats, date }: AdItemProps) => {
  const [showActions, setShowActions] = useState(false);

  const toggleActions = () => setShowActions(!showActions);

  const statusStyles = {
    Active: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
      {/* Listing Column */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <img src={image} alt={title} className="w-12 h-10 rounded-lg object-cover bg-gray-100" />
          <span className="text-sm font-semibold text-slate-800 max-w-[150px] leading-tight">
            {title}
          </span>
        </div>
      </td>

      {/* Status Column */}
      <td className="py-4 px-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${statusStyles[status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
          {status}
        </span>
      </td>

      {/* Category Column */}
      <td className="py-4 px-4 text-sm text-gray-500">{category}</td>

      {/* Price Column */}
      <td className="py-4 px-4 text-sm font-bold text-slate-900">{price}</td>

      {/* Performance Column */}
      <td className="py-4 px-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
             <span className="font-medium">{stats.views} views</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
             <span>{stats.inquiries} inquiries</span>
          </div>
        </div>
      </td>

      {/* Date Created Column */}
      <td className="py-4 px-4 text-sm text-gray-500">{date}</td>

      {/* Actions Column */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 text-gray-400">
          <button 
            onClick={toggleActions} 
            className="p-1 hover:text-blue-600 transition-colors"
            title={showActions ? "Hide actions" : "Show actions"}
          >
            {/* Optional: Switch icon based on state */}
            {showActions ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          
          {showActions && (
            <>
              <button className="p-1 hover:text-yellow-600"><Edit2 size={16} /></button>
              <button className="p-1 hover:text-red-600"><Trash2 size={16} /></button>
              <button className="p-1 hover:text-gray-900"><ExternalLink size={16} /></button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};