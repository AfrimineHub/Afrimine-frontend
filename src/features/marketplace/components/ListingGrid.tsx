import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ListingCard, type ListingCardData } from './ListingCard';

// This would ideally come from a prop or a custom hook in production
const mockData: ListingCardData[] = [
  { id: '1', title: 'Lithium Mining Project', category: 'Investment Opportunities', badgeColor: 'bg-blue-600', location: 'Tarauni, Kano, Nigeria', spec: '1.2M Mt', subSpec: 'Lithium Ore', price: '$5M - $20M', imageUrl: '/images/categories/lithium-mine.svg' },
  { id: '2', title: 'Gold Dore Bars For Sale', category: 'Mineral', badgeColor: 'bg-teal-600', location: 'Tarauni, Kano, Nigeria', spec: '95.8%-98.2% AU', subSpec: 'Gold', price: '$55,000/Kg', imageUrl: '/images/categories/gold-dore-bars.svg' },
  { id: '3', title: 'Excavator Caterpillar 2019', category: 'Equipment', badgeColor: 'bg-emerald-500', location: 'Tarauni, Kano, Nigeria', spec: '2019', subSpec: 'CAT', price: '$239,000', imageUrl: '/images/categories/excavator-caterpillar.svg' },
  { id: '4', title: 'JV Opportunity: Tin Mine', category: 'Investment Opportunities', badgeColor: 'bg-blue-600', location: 'Tarauni, Kano, Nigeria', spec: 'License ready', subSpec: '', price: '$2M - $10M', imageUrl: '/images/categories/lithium-mine.svg' },
];

export const ListingsGrid = () => {
  const [activeTab, setActiveTab] = useState('Latest');

  return (
    <section className="mt-8">
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Recent Listings</h2>
        <button className="bg-yellow-400 hover:bg-[#CA8A04] text-black font-bold px-5 py-2 rounded-lg text-sm transition-colors shadow-sm cursor-pointer w-full sm:w-auto">
          Post New Listings
        </button>
      </div>

      {/* Tabs / Sub-Filters */}
      <div className="flex items-center gap-8 mb-8 border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {['Latest', 'Recommended', 'Price', 'Verified Only'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeTab === tab 
                ? 'text-gray-900 p-2 rounded-lg  bg-yellow-500 border-yellow-500' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {tab === 'Price' && <ChevronDown size={14} />}
          </button>
        ))}
      </div>

      {/* The Actual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* double the mock data to fill the grid as per the design */}
        {[...mockData, ...mockData].map((listing, index) => (
          <ListingCard key={`${listing.id}-${index}`} data={listing} />
        ))}
      </div>
    </section>
  );
};