import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 text-sm text-gray-400 bg-slate-950">
      <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <img src="/images/afrimine-logo1.svg" alt="Afrimine" className="h-8 mb-4 opacity-80" />
            <p className="mb-4 text-gray-500">The most trusted marketplace for mining assets and equipment worldwide.</p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-yellow-500">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-yellow-500">Careers</Link></li>
              <li><Link to="/press" className="hover:text-yellow-500">Press</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/support" className="hover:text-yellow-500">Support</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-500">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-yellow-500">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-yellow-500">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Contact</h4>
            <ul className="space-y-2">
              <li>support@afrimine.com</li>
              <li>+234 (0) 800 000 0000</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 mt-12 text-center border-t border-slate-800">
          <p>© {new Date().getFullYear()} Afrimine Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;