import React from 'react';

const steps = [
  { num: '01', title: 'Browse Listings', desc: 'Find verified assets matching your criteria.' },
  { num: '02', title: 'Request Deal', desc: 'Submit a formal inquiry to the seller.' },
  { num: '03', title: 'Sign NDA', desc: 'Gain access to sensitive documents securely.' },
  { num: '04', title: 'Complete via Escrow', desc: 'Finalize transaction with full protection.' },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8 text-center">
        <h2 className="mb-16 text-3xl font-bold text-slate-900">How It Works</h2>
        
        <div className="flex flex-col md:flex-row justify-between items-start relative">
          {/* Connector Line (Hidden on mobile) */}
          <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-gray-200 z-0" />
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center flex-1 mb-8 md:mb-0">
              <div className="flex items-center justify-center w-12 h-12 mb-4 font-bold text-yellow-500 bg-white border-2 border-yellow-500 rounded-full shadow-sm">
                {step.num}
              </div>
              <h3 className="mb-2 font-bold text-slate-900">{step.title}</h3>
              <p className="px-4 text-sm text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;