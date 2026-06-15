import type { ReactNode } from 'react';

export interface TrendRow {
  label: string;
  price: string;
  changeLabel: string | null;
  isPositive?: boolean;
}

export interface InsightRow {
  label: string;
  timeAgo: string;
}

interface DataListSectionProps {
  title: string;
  showTrends?: boolean;
  isInsight?: boolean;
  icon?: ReactNode;
  trendItems?: TrendRow[];
  insightItems?: InsightRow[];
  isLoading?: boolean;
  errorMessage?: string;
}

const DataListSection = ({
  title,
  showTrends,
  icon,
  trendItems = [],
  insightItems = [],
  isLoading,
  errorMessage,
}: DataListSectionProps) => {
  const items = showTrends ? trendItems : insightItems;
  const hasItems = items.length > 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <button
          type="button"
          className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider"
        >
          See All &gt;
        </button>
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {isLoading ? (
        <div className="space-y-4" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !hasItems ? (
        <p className="text-sm text-gray-500 py-4">No data available yet.</p>
      ) : (
        <div className="space-y-4">
          {showTrends
            ? (items as TrendRow[]).map((item, i) => (
                <div
                  key={`${item.label}-${i}`}
                  className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold block">{item.price}</span>
                    {item.changeLabel ? (
                      <span
                        className={`text-[10px] font-bold ${
                          item.isPositive ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {item.changeLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))
            : (items as InsightRow[]).map((item, i) => (
                <div
                  key={`${item.label}-${i}`}
                  className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {icon ? (
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-500 shrink-0">
                        {icon}
                      </div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                    )}
                    <span className="text-sm text-gray-700 font-medium truncate">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-3">{item.timeAgo}</span>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default DataListSection;
