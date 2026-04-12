import React from 'react';

const features = [
  { title: 'Secure Escrow', desc: 'Funds are held in secure escrow until terms are fully met.', icon: '🛡️' },
  { title: 'Verified Vendors', desc: 'All sellers undergo strict KYC and asset verification.', icon: '✅' },
  { title: 'NDA Protection', desc: 'Your sensitive business data is protected by industry standard NDAs.', icon: '🔒' },
  { title: 'Expert Support', desc: 'Dedicated support from our team of mining industry professionals.', icon: '💬' },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white">Why Choose Us</h2>
          <p className="mt-4 text-gray-400">The most secure marketplace for high-value mining transactions.</p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-2xl bg-slate-800 rounded-lg shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-16 mt-16 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div><p className="text-3xl font-bold text-yellow-500">$2.5B+</p><p className="text-sm text-gray-400">Total Transactions</p></div>
            <div><p className="text-3xl font-bold text-yellow-500">10K+</p><p className="text-sm text-gray-400">Active Users</p></div>
            <div><p className="text-3xl font-bold text-yellow-500">500+</p><p className="text-sm text-gray-400">Active Listings</p></div>
            <div><p className="text-3xl font-bold text-yellow-500">98%</p><p className="text-sm text-gray-400">Success Rate</p></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;