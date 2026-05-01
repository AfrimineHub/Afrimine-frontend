
const NotificationItem = ({ notification }) => {
  const { title, desc, time, unread, priority, icon, color } = notification;

  return (
    <div
      className={`group flex items-start justify-between p-5 rounded-xl transition-all cursor-pointer border-b border-gray-50 hover:bg-slate-50 ${
        unread ? 'bg-white' : 'opacity-70'
      }`}
    >
      <div className="flex gap-5">
        <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 text-lg leading-tight">
            {title}
          </h3>
          <p className="text-slate-500 text-[15px] leading-relaxed max-w-2xl">
            {desc}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {time}
            </span>
            {unread && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
          </div>
        </div>
      </div>

      {priority && (
        <div className="hidden sm:block">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-pink-100 text-pink-600">
            {priority}
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;