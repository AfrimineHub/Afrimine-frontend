import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { sidebarNavigation } from '../data/adminData';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({ isOpen = false, onClose }: AdminSidebarProps) => {
  const location = useLocation();

  const navContent = (
    <div className="flex-1 px-4 pb-6 space-y-6 p-6 overflow-y-auto">
      {sidebarNavigation.map((group, idx) => (
        <div key={idx}>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 pl-3">
            {group.section}
          </h3>
          <ul className="space-y-1">
            {group.links.map((link) => {
              const isActive = link.path ? location.pathname === link.path : false;
              if (!link.path) {
                return (
                  <li key={link.id}>
                    <span className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400">
                      <div className="w-4 h-4 rounded-sm bg-gray-200 shrink-0" />
                      {link.label}
                    </span>
                  </li>
                );
              }
              return (
                <li key={link.id}>
                  <Link
                    to={link.path}
                    onClick={onClose}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-yellow-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-sm shrink-0 ${isActive ? 'bg-white/30' : 'bg-gray-300'}`} />
                    <span className="truncate">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop: static, always visible */}
      <aside className="hidden md:flex w-64 shrink-0 bg-[#F8F9FA] border-r border-gray-200 flex-col h-full overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile: slide-in drawer + backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#F8F9FA] border-r border-gray-200 flex flex-col h-full transform transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <span className="text-sm font-bold text-gray-900">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        {navContent}
      </aside>
    </>
  );
};

export default AdminSidebar;