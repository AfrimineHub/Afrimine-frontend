import { useListingCategoriesQuery } from '@/features/buyer/dashboardQueries';
import { getApiErrorMessage } from '@/lib/api/errors';

const FALLBACK_CATEGORIES = [
  { id: '1', title: 'Minerals', description: 'Buy or sale product and industrial mineral commodities', imageUrl: '/images/categories/cat-minerals.svg' },
  { id: '2', title: 'Mining Site', description: 'Browse Greenfield and brownfield mining properties', imageUrl: '/images/categories/cat-sites.png' },
  { id: '3', title: 'Equipment', description: 'Buy, sell or lease mining Machineries and equipments', imageUrl: '/images/categories/cat-equip.svg' },
  { id: '4', title: 'JV & Partnerships', description: 'Find joint ventures and investment opportunities', imageUrl: '/images/categories/cat-jv.svg' },
];

const LIVE_CATEGORY_TITLE = 'Equipment';

function isLiveCategory(title: string): boolean {
  return title.trim().toLowerCase() === LIVE_CATEGORY_TITLE.toLowerCase();
}

export const CategoryGrid = () => {
  const categoriesQuery = useListingCategoriesQuery();

  const categories =
    categoriesQuery.data && categoriesQuery.data.length > 0
      ? categoriesQuery.data.map((category) => ({
          id: category.id,
          title: category.name,
          description: `${category.listingCount} listing${category.listingCount === 1 ? '' : 's'}`,
          imageUrl: category.imageUrl || '/images/categories/cat-minerals.svg',
        }))
      : FALLBACK_CATEGORIES;

  const loadError =
    categoriesQuery.isError &&
    getApiErrorMessage(categoriesQuery.error, 'Could not load categories.');

  return (
    <div>
      {loadError ? (
        <p className="mb-4 text-sm text-amber-700 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3" role="status">
          {loadError} Showing default categories.
        </p>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
        {categoriesQuery.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[180px] bg-gray-200 rounded-xl animate-pulse" />
          ))
        ) : (
          categories.map((cat) => {
            const isLive = isLiveCategory(cat.title);
            return (
              <div
                key={cat.id}
                className={`relative h-[180px] rounded-xl overflow-hidden group shadow-md ${
                  isLive ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
                    isLive ? 'group-hover:scale-110' : 'grayscale-[40%] opacity-70'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {!isLive ? (
                  <div className="absolute right-3 top-3 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-bold text-gray-900 shadow-sm">
                    Coming soon
                  </div>
                ) : null}

                <div className="absolute inset-0 flex flex-col justify-end">
                  <div className="bg-gray-100/10 backdrop-blur-sm w-full p-3">
                    <h3 className="text-white font-bold text-lg mb-1">{cat.title}</h3>
                    <p className="text-white text-[10px] leading-relaxed max-w-[90%] font-medium">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};