import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardOverviewCards } from '../components/DashboardOverviewCards';
import { DashboardStatsGrid } from '../components/DashboardStatsGrid';
import { ListingPerformanceTable } from '../components/ListingPerformanceTable';
import { RecentActivityFeed } from '../components/RecentActivityFeed';

export const VendorDashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex w-full bg-gray-50">
      {/* Sidebar - Hidden on mobile, Drawer on click */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 max-w-[min(16rem,100vw)] bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:max-w-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden overscroll-none touch-none" 
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden
        />
      )}
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden shrink-0 flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 bg-white border-b border-gray-100">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center justify-center min-h-11 min-w-11 -ml-1 rounded-lg text-gray-600 hover:bg-gray-50 active:bg-gray-100"
            aria-label="Open navigation menu"
          >
            <Menu size={24} aria-hidden />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full pb-[max(1.5rem,calc(1.5rem+env(safe-area-inset-bottom)))]">
          <DashboardHeader />
          <DashboardOverviewCards />
          <DashboardStatsGrid />
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ListingPerformanceTable />
            <RecentActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
};