import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, User } from 'lucide-react';
import type { AuthUser } from '@/features/auth/types';
import { getAccountMenuLinks } from '@/shared/navigation/roleNavLinks';

interface UserMenuProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinks = getAccountMenuLinks(user);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative hidden md:block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/10 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden border border-gray-500">
          <User size={18} aria-hidden />
        </div>
        <span className="text-sm text-gray-300 max-w-[120px] truncate">
          {user?.fullName ?? user?.email}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-700 bg-[#1e2226] py-2 shadow-xl z-50"
        >
          {menuLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="my-1 border-t border-gray-700" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="mx-2 flex w-[calc(100%-1rem)] items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 cursor-pointer"
          >
            <LogOut size={16} aria-hidden />
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
