import React, { useState } from 'react';
import { Home, Plus } from 'lucide-react';
import { OrderStatusStepper } from '../components/OrderStatusStepper';
import { OrdersFilterBar } from '../components/OrdersFilterBar';
import { OrderListItem, type Order } from '../components/OrderListItem';

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    title: 'Gold Dores Bars for Sale',
    location: 'Tarauni, Kano, Nigeria',
    price: '$300,000',
    status: 'Negotiation',
    statusLabel: 'Reviewing Terms',
    seller: { name: 'Zinc Mining Corp', country: 'Nigeria', rate: '$55,000/Kg' },
    lastUpdated: 'Two days ago',
  },
  {
    id: 'ORD-002',
    title: 'Lithium Concentrate 6%',
    location: 'Kogi State, Nigeria',
    price: '$120,000',
    status: 'Agreement',
    statusLabel: 'Funds in Escrow',
    seller: { name: 'Alpha Resources', country: 'Nigeria', rate: '$1,200/Ton' },
    lastUpdated: 'Three hours ago',
  },
];

const MyOrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All Orders');

  return (
    <main className="min-h-screen bg-[#FDFDFD] py-8 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
          <div>
            <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              <Home size={14} /> <span className="mx-1">/</span> Marketplace <span className="mx-1">/</span> <span className="text-slate-900">My Order</span>
            </nav>
            <h1 className="text-2xl font-black text-slate-900">My Order</h1>
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-sm transition-all">
            <Plus size={18} /> Add New Listing
          </button>
        </header>

        <OrderStatusStepper currentStatus="Negotiation" />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <OrdersFilterBar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="flex flex-col">
            {mockOrders.map((order) => <OrderListItem key={order.id} order={order} />)}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyOrdersPage;