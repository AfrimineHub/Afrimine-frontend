import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Bell, User, X, Menu, LogOut } from 'lucide-react';
import Logo from '@/shared/components/Logo';
import { useAuth } from '@/features/auth/hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/home', hasDropdown: true, public: true },
    { name: 'Marketplace', path: '/marketplace', hasDropdown: true, public: true },
    { name: 'My Ad', path: '/my-ad', hasDropdown: false, public: false },
    { name: 'My Order', path: '/my-order', hasDropdown: true, public: false },
    { name: 'Messages', path: '/messages', hasDropdown: false, public: false },
  ];

  const visibleLinks = navLinks.filter((link) => link.public || isAuthenticated);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login', { replace: true });
  };

  return (
    <nav className="bg-[#22272B] text-white w-full h-16 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Logo className="" />
      </div>

      <div className="hidden md:flex items-center gap-8">
        {visibleLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`text-sm transition-colors hover:text-yellow-500 flex items-center gap-1 ${
              location.pathname === link.path ? 'text-yellow-500 font-medium' : 'text-gray-300'
            }`}
          >
            {link.name}
            {link.hasDropdown && <ChevronDown size={14} />}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {isLoading ? (
          <span className="text-xs text-gray-400">…</span>
        ) : isAuthenticated ? (
          <>
            <button
              type="button"
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-[#1A1A1A]" />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden border border-gray-500">
                  <User size={18} />
                </div>
                <span className="text-sm text-gray-300 max-w-[120px] truncate">
                  {user?.fullName ?? user?.email}
                </span>
                <ChevronDown size={14} className="text-gray-400 group-hover:text-white" />
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white cursor-pointer"
                aria-label="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/auth/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-5 py-2 rounded-md text-sm font-bold transition-all"
            >
              Get Started
            </Link>
          </div>
        )}

        <button
          type="button"
          className="md:hidden p-2 text-gray-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`absolute top-16 left-0 w-full bg-[#22272B] border-t border-gray-700 transition-all md:hidden ${isOpen ? 'h-auto pb-6' : 'h-0 overflow-hidden'}`}
      >
        <div className="flex flex-col px-6 py-4 space-y-4">
          {visibleLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-gray-300 py-2"
            >
              {link.name}
            </Link>
          ))}
          {!isAuthenticated && !isLoading && (
            <div className="flex flex-col gap-4 pt-4 border-t border-gray-700">
              <Link to="/auth/login" onClick={() => setIsOpen(false)} className="text-gray-300">
                Login
              </Link>
              <Link
                to="/auth/register"
                onClick={() => setIsOpen(false)}
                className="bg-yellow-500 text-slate-900 text-center py-2 rounded font-bold"
              >
                Get Started
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                void handleLogout();
              }}
              className="text-left text-gray-300 py-2 flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={16} /> Log out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
