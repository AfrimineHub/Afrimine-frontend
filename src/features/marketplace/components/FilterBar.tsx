import { MapPin, Globe, Layers, Eye, ChevronDown } from 'lucide-react';

const FilterItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div 
    className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 cursor-pointer transition-colors border-r border-gray-100 last:border-0">
    <Icon size={18} className="text-gray-400" />
    <span className="text-sm font-medium">{label}</span>
    <ChevronDown size={14} className="ml-1 opacity-50" />
  </div>
);

export const FilterBar = () => (
  <div className="flex flex-wrap items-center gap-4 py-6 border-b border-gray-100">
    <FilterItem icon={MapPin} label="Location" />
    <FilterItem icon={Globe} label="Minerals" />
    <FilterItem icon={Layers} label="Listing Type" />
    <FilterItem icon={Layers} label="Listing Type" />
    
    <div className="flex items-center bg-gray-200 rounded-lg gap-2 px-4 py-2 text-gray-400 text-sm ml-auto cursor-pointer">
      <Eye size={18} className="text-gray-400" />
      <span className="text-sm font-medium">Only Verified Listings</span>
      <ChevronDown size={14} className="ml-1 opacity-50 text-gray-400" />
    </div>
  </div>
);