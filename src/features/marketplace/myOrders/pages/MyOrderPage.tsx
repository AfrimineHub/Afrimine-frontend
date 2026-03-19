import { OrderStatusStepper } from '../components/OrderStatusStepper';
import { OrderListItem } from '../components/OrderListItem';
import { Search, ChevronDown, Plus, Home } from 'lucide-react';

const MyOrdersPage = () => {
  return (
    <main className="min-h-screen bg-white py-8 px-4 md:px-16">
      {/* 1. Header & Primary Tabs */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <nav className="flex items-center gap-2 text-[12px] text-gray-400 mb-2">
            <span><Home size={16} /></span> 
            <span>▶</span> 
            <span className="text-gray-600">Marketplace</span>
            <span>▶</span> 
            <span className="text-gray-600">My Order</span>
          </nav>
          <h1 className="text-xl font-bold text-gray-900">My Order</h1>
        </div>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold cursor-pointer w-full sm:w-auto">
          <Plus size={16} /> Add New Listing
        </button>
      </div>

      <div className="flex gap-6 sm:gap-8 border-b border-gray-100 mb-6 overflow-x-auto whitespace-nowrap">
        {['All Orders (5)', 'Inquiries (9)', 'Negotiation (1)', 'Agreement (2)', 'Closed (10)'].map((tab, i) => (
          <button key={tab} className={`pb-3 text-xs font-bold transition-all ${
            i === 0 ? 'text-gray-900 border-b-2 border-yellow-500' : 'text-gray-400'
          }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* 2. Secondary Filter Bar */}
      <div className="bg-gray-50/50 p-3 rounded-lg flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
        {['Order Status', 'All Regions', 'Sort by'].map((filter) => (
          <div key={filter} className="flex-1 bg-white border border-gray-200 px-3 py-2 rounded-md flex justify-between items-center text-xs text-gray-500 cursor-pointer w-full">
            {filter} <ChevronDown size={14} />
          </div>
        ))}
      </div>

      {/* 3. Progress Stepper */}
      <OrderStatusStepper />

      {/* 4. Orders Table */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800">Orders</h3>
          <div className="relative w-full sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search your orders" className="pl-9 pr-4 py-2 border border-gray-100 rounded-lg text-xs outline-none w-full sm:w-64" />
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="bg-gray-50/80 px-4 py-2 flex text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              <div className="w-[30%]">Orders</div>
              <div className="w-[15%] px-4">Status</div>
              <div className="w-[25%] px-4">Seller</div>
              <div className="flex-1 text-right">Last Updated</div>
            </div>
            <div className="flex flex-col">
            <OrderListItem 
              title="Gold Dores Bars for Sale"
              location="Tarauni, Kano, Nigeria"
              price="$300,000"
              category="Mining Site"
              status="Negotiation"
              statusLabel="5K Initially"
              seller={{ name: 'Zinc Mining Corp', country: 'Nigeria' }}
              lastUpdated="Two days Ago"
              actionType="Ongoing"
            />
            <OrderListItem 
              title="Gold Dores Bars for Sale"
              location="Tarauni, Kano, Nigeria"
              price="$300,000"
              category="Mining Site"
              status="Closed"
              statusLabel="5K Initially"
              seller={{ name: 'Zinc Mining Corp', country: 'Nigeria' }}
              lastUpdated="Two days Ago"
              actionType="Ongoing"
            />
            <OrderListItem 
              title="Gold Dores Bars for Sale"
              location="Tarauni, Kano, Nigeria"
              price="$300,000"
              category="Mining Site"
              status="Inquiry"
              statusLabel="5K Initially"
              seller={{ name: 'Zinc Mining Corp', country: 'Nigeria' }}
              lastUpdated="Two days Ago"
              actionType="Ongoing"
            />
            <OrderListItem 
              title="Gold Dores Bars for Sale"
              location="Tarauni, Kano, Nigeria"
              price="$300,000"
              category="Mining Site"
              status="Agreement"
              statusLabel="5K Initially"
              seller={{ name: 'Zinc Mining Corp', country: 'Nigeria' }}
              lastUpdated="Two days Ago"
              actionType="Ongoing"
            />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyOrdersPage;