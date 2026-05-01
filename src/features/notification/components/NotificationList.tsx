import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="py-10 text-center text-slate-500">
        No notifications found in this category.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {notifications.map((notif) => (
        <NotificationItem key={notif.id} notification={notif} />
      ))}
    </div>
  );
};

export default NotificationList;