import { Search, Bell, Bookmark, MessageSquare, Package, ChevronsRight, ChevronRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import DataListSection from '../components/DataListSection';
import ProjectCard from '../components/ProjectCard';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back, John</h1>
        <p className="text-gray-500 text-sm">Find mining opportunities that match your interest.</p>
        
        <div className="mt-6 flex gap-4 max-w-4xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for minerals, sites, or equipment" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
            />
          </div>
          <button className="bg-[#0d0d0d] text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* STATS / ACTION BAR */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <StatCard 
          icon={<Bookmark size={18} className='fill-yellow-500' />} 
          label="Saved Listings" count={30} 
          />
        <StatCard 
          icon={<MessageSquare size={18} 
          className='fill-yellow-500' />} 
          label="Messages" 
          count={5} badge="new" 
          />
        <StatCard 
          icon={<MessageSquare size={18} className='fill-yellow-500' />} 
          label="Messages" count={10} />
        <StatCard 
          icon={<Package size={18} className='fill-yellow-500'/>} 
          label="Ongoing Order" count={10} />
        <button 
          className="bg-yellow-500 text-white rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-orange-600"
          >
          List Item
        </button>
      </div>

      {/* RECOMMENDED FOR YOU */}
      <div className="mb-12">
        <h2 className="text-lg font-bold mb-6 text-gray-800">Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProjectCard 
            title="Gold Mining Site" 
            location="Brownfield Project in Ghana" 
            image="/images/gold-mine.svg" 
          />
          <ProjectCard 
            title="Copper Ore Supply" 
            location="High-grade Copper in Zambia" 
            image="/images/copper.svg" 
          />
          <ProjectCard 
            title="Mobile Crushing Plant" 
            location="For sale/Lease/2021 Model" 
            image="/images/plant.svg" 
          />
        </div>
      </div>

      {/* BOTTOM DATA GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <DataListSection 
          title="Latest Notification"
          icon={<Bell size={16} className='text-yellow-500' />}
        />
        <DataListSection 
          title="My Saved Listings"
          icon={<Bookmark size={16} className='fill-yellow-500' />}
          />
        <DataListSection title="Market Trends" showTrends />
        <DataListSection 
          title="Investment Insight" isInsight
          icon={<ChevronRight size={16} className='fill-gray-900 text-yellow-500' />}
        />
      </div>
    </div>
  );
};

export default HomePage;