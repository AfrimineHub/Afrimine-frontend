
const NotificationTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === tab
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-transparent text-slate-500 hover:bg-slate-100'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default NotificationTabs;