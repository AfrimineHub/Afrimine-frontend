import { AdsSummary } from '../components/AdsSummary';
import { AdsFilterBar } from '../components/AdsFilterBar';
import { AdListItem } from '../components/AdListItem';
import { Home } from 'lucide-react';

const mockAds = [
  {
    title: 'Gold Mining Site',
    location: 'Tarauni, Kano, Nigeria',
    type: 'Mining Site',
    status: 'Active' as const,
    stats: { views: 320, inquiries: 30, saves: 80 },
    date: 'Published 2 days ago',
  },
  {
    title: 'Gold Mining Site',
    location: 'Tarauni, Kano, Nigeria',
    type: 'Mining Site',
    status: 'Active' as const,
    stats: { views: 320, inquiries: 30, saves: 80 },
    date: 'Published 2 days ago',
  },
  {
    title: 'Gold Mining Site',
    location: 'Tarauni, Kano, Nigeria',
    type: 'Mining Site',
    status: 'Active' as const,
    stats: { views: 320, inquiries: 30, saves: 80 },
    date: 'Published 2 days ago',
  },
  {
    title: 'Gold Mining Site',
    location: 'Tarauni, Kano, Nigeria',
    type: 'Mining Site',
    status: 'Active' as const,
    stats: { views: 320, inquiries: 30, saves: 80 },
    date: 'Published 2 days ago',
  },
];

const MyAdsPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 lg:px-16">
      <header className="mb-6">
        <nav className="text-xs flex gap-2 text-gray-400 mb-3 font-medium tracking-wider">
            <Home size={16} />
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <span className="hover:text-gray-600 cursor-pointer">Home</span> 
              <span className="text-gray-300">▶</span>
              <span className="text-gray-600 font-medium">Marketplace</span>
              <span className="text-gray-300">▶</span>
              <span className="text-gray-600 font-medium">My Ads</span>
            </div>
        </nav>
      </header>

      <section className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 p-4 md:p-6">
        <AdsFilterBar />
        <AdsSummary />

        <div className="mt-2 rounded-xl border border-gray-100 overflow-hidden bg-white">
          {mockAds.map((ad) => (
            <AdListItem
              key={ad.title}
              title={ad.title}
              location={ad.location}
              type={ad.type}
              status={ad.status}
              stats={ad.stats}
              date={ad.date}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyAdsPage;

