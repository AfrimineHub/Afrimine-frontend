import { SearchHero, FilterBar, CategoryGrid, ListingsGrid } from '../components';

export const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 lg:px-16">
      <SearchHero />
      <FilterBar />

      {/* 2. Top Categories */}
      <CategoryGrid />
      <ListingsGrid />
    </div>
  );
};

export default MarketplacePage;