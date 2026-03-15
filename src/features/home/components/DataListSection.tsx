const DataListSection = ({ title, showTrends, isInsight, icon }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <button 
          className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider"
          >
            See All &gt;
          </button>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} 
            className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              {!showTrends && icon && (
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-500">
                  {icon}
                </div>
              )}
              
              {!showTrends && !icon && <div className="w-2 h-2 rounded-full bg-yellow-400" />}

              <span className="text-sm text-gray-700 font-medium">
              {showTrends ? "Gold Price" : isInsight ? "Top 5 African Mining Hotspot" : "New Lithium Projects in Namibia"}
            </span>
            </div>
            {showTrends ? (
              <div className="text-right">
                <span className="text-sm font-bold block">$9,350/ton</span>
                <span className="text-[10px] text-red-500 font-bold">▼ 0.8% Today</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">2hr ago</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
  export default DataListSection;