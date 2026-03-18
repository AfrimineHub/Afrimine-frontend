import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Bell, User, X, Menu } from 'lucide-react';
import Logo from '@/shared/components/Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/home', 'hasDropdown': true },
    { name: 'Marketplace', path: '/marketplace', 'hasDropdown': true },
    { name: 'My Ad', path: '/my-ad', 'hasDropdown': false },
    { name: 'My Order', path: '/my-order', 'hasDropdown': true },
    { name: 'Messages', path: '/messages', 'hasDropdown': false },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav 
        className="bg-[#22272B] text-white w-full h-16 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50">
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <Logo className='' />
      </div>

      {/* NAV LINKS */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
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

      {/* RIGHT SECTION: Profile/Icons */}
      <div className="flex items-center md:gap-4">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
          <Bell size={20} className="text-gray-300 cursor-pointer" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-[#1A1A1A]"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden border border-gray-500">
            <User size={18} />
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-white" />
        </div>

        <button 
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`
        absolute top-16 left-0 w-full bg-[#22272B] border-t border-gray-700 transition-all duration-300 ease-in-out md:hidden
        ${isOpen ? 'opacity-100 visible h-auto pb-6' : 'opacity-0 invisible h-0'}
      `}>
        <div className="flex flex-col px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)} // Close menu on click
              className={`text-base py-2 flex items-center justify-between ${
                location.pathname === link.path ? 'text-yellow-500 font-bold' : 'text-gray-300'
              }`}
            >
              {link.name}
              {link.hasDropdown && <ChevronDown size={18} />}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;