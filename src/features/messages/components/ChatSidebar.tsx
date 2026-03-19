import { Search } from 'lucide-react';

export const ChatSidebar = () => (
  <aside className="w-full md:w-80 bg-white flex flex-col md:h-auto max-h-[40vh] md:max-h-none min-h-0">
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4">My Order</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input 
          type="text" 
          placeholder="Search your orders" 
          className="w-full pl-9 pr-4 py-2 bg-gray-50  border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-yellow-500"
        />
      </div>
    </div>
    
    <div className="flex-1 overflow-y-auto">
      {[1, 2, 3, 4].map((_, i) => (
        <div key={i} className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${i === 0 ? 'bg-gray-50' : ''}`}>
          <div className="relative">
            <img src="/images/categories/buyer.png" className="w-10 h-10 rounded-full object-cover" alt="User" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white font-bold">2</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-xs font-bold text-gray-900 truncate">Zinc Mining Corp</h4>
              <span className="text-[10px] text-gray-400">2 min</span>
            </div>
            <p className="text-[10px] text-gray-500 truncate italic">Can you sell it at $4000</p>
          </div>
        </div>
      ))}
    </div>
  </aside>
);