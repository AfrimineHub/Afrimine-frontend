import { AdsFilterBar } from '../components/AdsFilterBar';
import { AdListItem } from '../components/AdListItem';

const mockAds = [
  {
    image: '/images/listings/gold-ore.png',
    title: 'Premium Gold Ore - High Grade',
    category: 'Mineral',
    status: 'Active' as const,
    price: '₦900,000',
    stats: { views: 1247, inquiries: 34 },
    date: 'March 15, 2026',
  },
  {
    image: '/images/listings/heavy-duty-excavator.png',
    title: 'Heavy Duty Mining Excavator',
    category: 'Equipment',
    status: 'Active' as const,
    price: '₦500,000',
    stats: { views: 832, inquiries: 18 },
    date: 'March 10, 2026',
  },
  {
    image: '/images/listings/copper-min-conc.png',
    title: 'Copper Mineral Concentrate',
    category: 'Mineral',
    status: 'Pending' as const,
    price: '₦800,000',
    stats: { views: 458, inquiries: 12 },
    date: 'March 20, 2026',
  },
  {
    image: '/images/listings/diamond-mine-site.png',
    title: 'Diamond Mining Site - Lease',
    category: 'Site',
    status: 'Active' as const,
    price: '₦1000,000',
    stats: { views: 2543, inquiries: 90 },
    date: 'March 5, 2026',
  },
  {
    image: '/images/listings/industrial-rock-crusher.png',
    title: 'Industrial Rock Crusher Equipment',
    category: 'Equipment',
    status: 'Rejected' as const,
    price: '₦270,000',
    stats: { views: 123, inquiries: 2 },
    date: 'March 18, 2026',
  },
  // Add more items matching the image...
];

const MyAdsPage = () => {
  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <AdsFilterBar />

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="pb-4 px-4">Listings</th>
              <th className="pb-4 px-4">Status</th>
              <th className="pb-4 px-4">Category</th>
              <th className="pb-4 px-4">Price</th>
              <th className="pb-4 px-4">Performance</th>
              <th className="pb-4 px-4">Date Created</th>
              <th className="pb-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockAds.map((ad, index) => (
              <AdListItem key={index} {...ad} />
            ))}
          </tbody>
        </table>
        
        {/* Simple Pagination Footer */}
        <div className="flex justify-end mt-6 gap-2">
           <button className="px-3 py-1 rounded bg-yellow-500 text-white text-xs font-bold cursor-pointer">1</button>
           <button className="px-3 py-1 rounded border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 cursor-pointer">2</button>
        </div>
      </div>
    </div>
  );
};

export default MyAdsPage;
