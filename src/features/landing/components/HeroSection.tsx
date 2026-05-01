import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section 
      className="relative flex items-center justify-center min-h-[calc(100svh-4rem)] bg-cover bg-center py-12 sm:py-16 lg:py-20"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-slate-900/70" />
      
      <div className="relative z-10 max-w-5xl px-4 mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 mb-6 text-sm text-yellow-500 bg-yellow-500/10 rounded-full">
          <span className="w-2 h-2 mr-2 bg-yellow-500 rounded-full animate-pulse" />
          Trusted by 10,000+ Global Miners
        </div>
        
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Buy & Sell Verified <span className="text-yellow-500">Mining Assets</span><br />
          And Equipment
        </h1>
        
        <p className="max-w-2xl mx-auto mb-8 text-base text-gray-300 sm:text-lg">
          The premier marketplace connecting buyers and sellers of premium mining claims, 
          heavy machinery, and raw minerals with secure escrow protection.
        </p>
        
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button 
            className="px-8 py-3 font-semibold text-slate-900 transition-colors bg-yellow-500 rounded-md hover:bg-yellow-400 cursor-pointer"
            onClick={() => navigate('/marketplace')}
          >
            Browse Listings
          </button>
          <button 
            className="px-8 py-3 font-semibold text-white transition-colors border border-white rounded-md hover:bg-white/10 cursor-pointer"
            onClick={() => navigate('#')}
          >
            Post a Request
          </button>
          <button 
            className="px-8 py-3 font-semibold text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-400 cursor-pointer"
            onClick={() => navigate('/rfq')}
          >
            View All Requests
          </button>
        </div>

        <div className="flex justify-center gap-12 mt-12 text-white">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">500+</span>
            <span className="text-sm text-gray-400">Active Listings</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">98%</span>
            <span className="text-sm text-gray-400">Success Rate</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;