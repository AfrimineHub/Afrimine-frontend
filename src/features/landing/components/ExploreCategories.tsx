import React from 'react';

const categories = [
  { title: 'Minerals', icon: '/images/categories/cat-minerals.svg', count: '150+ Listings' },
  { title: 'Heavy Equipment', icon: '/images/categories/cat-equip.svg', count: '220+ Listings' },
  { title: 'Mining Sites', icon: '/images/categories/cat-sites.png', count: '85+ Listings' },
  { title: 'Manpower', icon: '/images/categories/cat-jv.svg', count: '45+ Listings' },
];

const ExploreCategories: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Explore By Category</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center p-8 transition-transform bg-gray-50 border border-gray-100 rounded-xl hover:-translate-y-1 hover:shadow-lg cursor-pointer">
              <img src={cat.icon} alt={cat.title} className="w-16 h-16 mb-4" />
              <h3 className="mb-1 text-lg font-bold text-slate-900">{cat.title}</h3>
              <p className="text-sm text-gray-500">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;