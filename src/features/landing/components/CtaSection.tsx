import React from 'react';

const CtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-4xl px-4 mx-auto text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">Ready to Start Trading Securely?</h2>
        <p className="mb-8 text-gray-400">
          Join thousands of traders who trust Afrimine Market for their mining asset transactions.
        </p>
        <div className="flex flex-col justify-center max-w-md mx-auto sm:flex-row gap-2">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-1 px-4 py-3 rounded-md bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-yellow-500"
          />
          <button className="px-6 py-3 font-semibold text-slate-900 bg-yellow-500 rounded-md hover:bg-yellow-400">
            Get Started →
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;