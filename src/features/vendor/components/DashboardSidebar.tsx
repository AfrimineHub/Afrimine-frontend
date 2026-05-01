import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, List, FileText, ShoppingCart, 
  CreditCard, MessageSquare, ShieldCheck, Settings, X, 
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/vendor-dashboard' },
    { name: 'Listings', icon: List, path: '/my-ad' },
    { name: 'Quotes', icon: FileText, path: '/dashboard/my-quotes' },
    { name: 'Orders', icon: ShoppingCart, path: '/my-order' },
    { name: 'Payouts', icon: CreditCard, path: '/dashboard/my-payouts' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'KYC / Verification', icon: ShieldCheck, path: '/dashboard/my-kyc' },
    { name: 'Subscription', icon: Settings, path: '/dashboard/my-subscription' },
  ];

  return (
    <aside className="flex flex-col w-full h-full min-h-0 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] bg-white border-r border-gray-100 overflow-y-auto overscroll-y-contain">
      <div className="flex items-center justify-between gap-3 mb-6 shrink-0 lg:hidden">
        <span className="font-bold">Menu</span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg text-gray-600 hover:bg-gray-50 active:bg-gray-100"
          aria-label="Close menu"
        >
          <X size={20} aria-hidden />
        </button>
      </div>
      <div className="flex flex-col space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={`flex items-center min-h-11 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-yellow-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-yellow-600'
              }`}
            >
              <Icon size={18} className="mr-3" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};