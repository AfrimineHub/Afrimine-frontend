interface StatCardProps {
    title: string;
    value: string | number;
    trend: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  }

export const StatCard = ({ title, value, trend, isPositive, isNeutral }: StatCardProps) => {
  const trendColor = isPositive ? 'text-green-600' : isNeutral ? 'text-red-500' : 'text-red-600';
  
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
          <div className="w-4 h-4 bg-gray-300 rounded-sm" /> {/* Placeholder Icon */}
        </div>
        <span className={`text-xs font-bold ${trendColor}`}>{trend}</span>
      </div>
      <div>
        <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-extrabold text-gray-900">{value}</h3>
      </div>
    </div>
  );
};