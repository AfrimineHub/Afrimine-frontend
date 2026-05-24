import { Link, useLocation } from 'react-router-dom';
import { sidebarNavigation } from '../data/adminData';

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#F8F9FA] border-r border-gray-200 flex flex-col h-full overflow-y-auto hidden md:flex">
      <div className="flex-1 px-4 pb-6 space-y-6 p-6">
        {sidebarNavigation.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 pl-3">
              {group.section}
            </h3>
            <ul className="space-y-1">
              {group.links.map((link) => {
                // Check if the current URL matches the link's path
                const isActive = location.pathname === link.path;

                return (
                  <li key={link.id}>
                    {/* Swap <button> for <Link> */}
                    <Link 
                      to={link.path}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-yellow-600 text-white shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-sm ${isActive ? 'bg-white/30' : 'bg-gray-300'}`} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;