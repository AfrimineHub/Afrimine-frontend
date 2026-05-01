export const ActivityItem = ({ type, title, desc, time }) => {
    const getIconStyles = () => {
      switch (type) {
        case 'info': return 'bg-blue-100 text-blue-600';
        case 'success': return 'bg-green-100 text-green-600';
        case 'warning': return 'bg-yellow-100 text-yellow-600';
        case 'danger': return 'bg-red-100 text-red-600';
        case 'primary': return 'bg-indigo-100 text-indigo-600';
        default: return 'bg-gray-100 text-gray-600';
      }
    };
  
    return (
      <div className="flex items-start justify-between py-3 group">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getIconStyles()}`}>
            <div className="w-3 h-3 bg-current rounded-sm opacity-70" /> {/* Placeholder Icon */}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{title}</h4>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
        </div>
        <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">{time}</span>
      </div>
    );
  };