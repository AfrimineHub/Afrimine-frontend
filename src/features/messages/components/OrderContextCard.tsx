export const OrderContextCard = () => (
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="relative aspect-video">
        <img src="/images/categories/lithium-mine.svg" className="w-full h-full object-cover" alt="Product" />
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[8px] px-2 py-1 rounded font-bold uppercase">Investment Opportunities</span>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-sm text-gray-900 mb-1">Lithium Mining Project</h4>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-4">
          <span className="text-yellow-500">📍</span> Tarauni, Kano, Nigeria
        </div>
        <div className="flex justify-between items-center pt-3 border-t">
          <span className="font-black text-gray-900 text-sm">$5M-$20M</span>
          <button className="bg-yellow-400 text-black text-[10px] px-4 py-1.5 rounded-lg font-bold cursor-pointer">View Order</button>
        </div>
      </div>
    </div>
  );