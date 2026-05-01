import React from 'react';
import { useNavigate } from 'react-router-dom';

const mockListings = [
  { id: 1, title: 'Gold Mining Claim', location: 'Osun, Nigeria', price: '$2,500,000', tag: 'Verified', image: '/images/gold-mine.png' },
  { id: 2, title: 'Caterpillar 320 Excavator', location: 'Johannesburg, SA', price: '$120,000', tag: 'Inspection Ready', image: '/images/categories/excavator-caterpillar.svg' },
  { id: 3, title: 'Lithium Reserve', location: 'Nasarawa, Nigeria', price: '$5,000,000', tag: 'Verified', image: '/images/categories/lithium-mine.png' },
  { id: 4, title: 'Copper Processing Plant', location: 'Zambia', price: '$1,200,000', tag: 'Turnkey', image: '/images/copper.png' },
];

const FeaturedListings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Featured Listings</h2>
          <p className="mt-4 text-gray-600">Explore premium, verified mining assets currently on the market.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {mockListings.map((listing) => (
            <div key={listing.id} className="overflow-hidden transition-shadow bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md">
              <div className="relative h-48 bg-gray-200">
                <img src={listing.image} alt={listing.title} className="object-cover w-full h-full" />
                <span className="absolute top-4 left-4 px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded">
                  {listing.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-lg font-bold text-slate-900">{listing.title}</h3>
                <p className="mb-4 text-sm text-gray-500">{listing.location}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{listing.price}</span>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-white transition-colors rounded bg-slate-900 hover:bg-slate-800 cursor-pointer"
                    onClick={() => navigate('/marketplace')}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <button 
            className="px-6 py-3 font-semibold text-slate-900 transition-colors bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
            onClick={() => navigate('/marketplace')}
          >
            View All Listings
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;