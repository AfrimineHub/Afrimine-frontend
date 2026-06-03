import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import Logo from '@/shared/components/Logo';
import { UserMenu } from '@/shared/components/UserMenu';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  getAccountMenuLinks,
  getNavLinksForUser,
  isNavLinkActive,
} from '@/shared/navigation/roleNavLinks';

const Navbar = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const visibleLinks = getNavLinksForUser(user, isAuthenticated);
  const accountMenuLinks = getAccountMenuLinks(user);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login', { replace: true });
  };

  return (
    <nav className="bg-[#22272B] text-white w-full h-16 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Logo className="" />
      </div>

      <div className="hidden md:flex items-center gap-6 lg:gap-8">
        {visibleLinks.map((link) => (
          <Link
            key={`${link.label}-${link.path}`}
            to={link.path}
            className={`text-sm transition-colors hover:text-yellow-500 whitespace-nowrap ${
              isNavLinkActive(location.pathname, link.path, user)
                ? 'text-yellow-500 font-medium'
                : 'text-gray-300'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {isLoading ? (
          <span className="text-xs text-gray-400">…</span>
        ) : isAuthenticated ? (
          <>
            <Link
              to="/notification"
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-[#1A1A1A]" />
            </Link>
            <UserMenu user={user} onLogout={() => void handleLogout()} />
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white cursor-pointer"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
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
        <div className="flex flex-col px-6 py-4 space-y-1">
          {visibleLinks.map((link) => (
            <Link
              key={`mobile-${link.label}-${link.path}`}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`py-2.5 text-sm ${
                isNavLinkActive(location.pathname, link.path, user)
                  ? 'text-yellow-500 font-medium'
                  : 'text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <div className="my-2 border-t border-gray-700" />
              {accountMenuLinks.map((link) => (
                <Link
                  key={`account-${link.path}`}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-sm text-gray-400"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  void handleLogout();
                }}
                className="text-left py-2.5 text-sm text-gray-300 flex items-center gap-2 cursor-pointer"
              >
                <LogOut size={16} aria-hidden /> Log out
              </button>
            </>
          ) : (
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
