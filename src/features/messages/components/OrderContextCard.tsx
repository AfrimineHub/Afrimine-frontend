import type { ConversationContext } from '@/features/buyer/dashboardTypes';

interface OrderContextCardProps {
  context?: ConversationContext | null;
  isLoading?: boolean;
}

export const OrderContextCard = ({ context, isLoading }: OrderContextCardProps) => {
  if (isLoading) {
    return (
      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm h-64 bg-gray-100 animate-pulse" />
    );
  }

  if (!context?.title) {
    return (
      <div className="border border-gray-100 rounded-xl p-6 shadow-sm text-center">
        <p className="text-sm text-gray-500">No listing or order linked to this conversation.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="relative aspect-video">
        <img
          src={context.imageUrl || '/images/categories/lithium-mine.svg'}
          className="w-full h-full object-cover"
          alt={context.title}
        />
        {context.category ? (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[8px] px-2 py-1 rounded font-bold uppercase">
            {context.category}
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <h4 className="font-bold text-sm text-gray-900 mb-1">{context.title}</h4>
        {context.location ? (
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-4">
            <span className="text-yellow-500">📍</span> {context.location}
          </div>
        ) : null}
        <div className="flex justify-between items-center pt-3 border-t">
          <span className="font-black text-gray-900 text-sm">{context.priceRange || '—'}</span>
          <button
            type="button"
            className="bg-yellow-400 text-black text-[10px] px-4 py-1.5 rounded-lg font-bold cursor-pointer"
          >
            View Order
          </button>
        </div>
      </div>
    </div>
  );
};
