import { MapPin } from 'lucide-react';

export type ListingCardData = {
  id: string;
  title: string;
  category: string;
  badgeColor: string;
  location: string;
  spec: string;
  subSpec: string;
  price: string;
  imageUrl: string;
};

export const ListingCard = ({ data }: { data: ListingCardData }) => {
  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-50 relative">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] text-white px-2 py-1 rounded-full font-bold ${data.badgeColor}`}>
                {data.category}
              </span>
            </div>
            <h3 className="font-bold text-sm text-gray-900 truncate">{data.title}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[11px] text-gray-400 font-semibold">Price</div>
            <div className="text-sm font-extrabold text-gray-900">{data.price}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin size={14} className="text-gray-300" />
          <span className="truncate">{data.location}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <span className="font-bold text-gray-900">{data.spec}</span>
            {data.subSpec ? <span className="text-gray-400"> · {data.subSpec}</span> : null}
          </div>
          <button className="text-xs font-bold text-black bg-yellow-400 rounded-lg px-4 py-2 hover:text-yellow-800 cursor-pointer">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

