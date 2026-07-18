import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Menu,
  X,
  ClipboardList,
} from 'lucide-react';
import {
  SUPPLIER_DASHBOARD_PATH,
  SUPPLIER_MACHINES_PATH,
} from '@/features/supplier/constants';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: SUPPLIER_DASHBOARD_PATH },
  { name: 'My Machines', icon: Truck, path: SUPPLIER_MACHINES_PATH },
  { name: 'Bookings', icon: ClipboardList, path: '/supplier/bookings' },
  { name: 'Payouts', icon: CreditCard, path: '/dashboard/my-payouts' },
  { name: 'Messages', icon: MessageSquare, path: '/messages' },
  { name: 'Verification', icon: ShieldCheck, path: '/dashboard/my-kyc' },
];

interface SupplierLayoutProps {
  children: ReactNode;
}

export function SupplierLayout({ children }: SupplierLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isSidebarOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)] bg-slate-50">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[min(16rem,100vw)] bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <aside className="flex h-full flex-col border-r border-slate-100 p-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <span className="font-bold text-slate-900">Menu</span>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Supplier
          </p>
          <nav className="flex flex-col space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active =
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex min-h-11 items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#EAB308] text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#CA8A04]'
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden
        />
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50"
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-slate-900">Supplier</span>
        </div>
        <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
