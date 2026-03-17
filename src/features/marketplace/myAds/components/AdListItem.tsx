import { Eye, Mail, Bookmark, Edit2, Trash2, MapPin } from 'lucide-react';

interface AdItemProps {
  title: string;
  location: string;
  type: string;
  status: 'Active' | 'Pending' | 'Draft';
  stats: { views: number; inquiries: number; saves: number };
  date: string;
}

export const AdListItem = ({ title, location, type, status, stats, date }: AdItemProps) => (
  <div className="bg-white border-b border-gray-100 p-4 flex flex-col gap-4 md:flex-row md:items-center group hover:bg-gray-50/50 transition-all">
    {/* Image & Info */}
    <div className="flex items-center gap-4 w-full md:w-[35%]">
      <img src="/images/categories/lithium-mine.png" className="w-24 h-16 rounded-lg object-cover bg-gray-100" alt={title} />
      <div className="flex-1">
        <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
          <MapPin size={10} className="text-yellow-500" /> {location}
        </div>
        <div className="flex gap-2">
          <span className="bg-[#F0F4FF] text-white text-[9px] px-2 py-0.5 rounded font-bold bg-blue-800">{type}</span>
          <span className="text-[#36B37E] text-[9px] font-bold">{status}</span>
        </div>
      </div>
    </div>

    {/* Stats Columns */}
    <div className="grid grid-cols-3 gap-y-3 text-center mt-2 md:mt-0 md:flex-1">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
          <Eye size={14} /> <span className="font-bold text-gray-900">{stats.views}</span>
        </div>
        <span className="text-[10px] text-gray-400">Total Views</span>
      </div>
      <div className="flex flex-col items-center justify-center border-x border-gray-100">
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
          <Mail size={14} /> <span className="font-bold text-gray-900">{stats.inquiries}</span>
        </div>
        <span className="text-[10px] text-gray-400">Inquiries</span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
          <Bookmark size={14} className='fill-gray-500' /> <span className="font-bold text-gray-900">{stats.saves}</span>
        </div>
        <span className="text-[10px] text-gray-400">Saves</span>
      </div>
    </div>

    {/* Metadata & Actions */}
    <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100 md:border-none md:pt-0 md:w-[20%] md:justify-end">
      <span className="text-[11px] text-gray-400 line-clamp-1">{date}</span>
      <div className="flex gap-2 shrink-0">
        <button className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer">
          <Edit2 size={16} />
        </button>
        <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer ">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);