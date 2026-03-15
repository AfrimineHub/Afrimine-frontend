const StatCard = ({ icon, label, count, badge }: any) => (
    <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-yellow-500">{icon}</div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-bold text-gray-900 text-yellow-500">{count}</span>
        {badge && <span className="text-[10px] bg-yellow-400 text-black-600 px-1.5 py-0.5 rounded font-bold uppercase">{badge}</span>}
      </div>
    </div>
  );

  export default StatCard;