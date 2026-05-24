import { useState, useMemo } from 'react';
import {
  ShieldCheck, AlertCircle,
  Clock, Info, File
} from 'lucide-react';
import NotificationTabs from '../components/NotificationTabs';
import NotificationList from '../components/NotificationList';
import { NoNotification } from '../components/EmptyNotificationState';

const TABS = ['All', 'Disputes', 'KYC Pending', 'Escrow', 'System Alerts'];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'Disputes',
    title: 'New Dispute Opened',
    desc: 'Customer John Doe has opened a dispute for transaction #TX-4521. Reason: Product not as described.',
    time: '2 minutes ago',
    unread: true,
    priority: 'High Priority',
    icon: <Clock size={18} />,
    color: 'text-pink-500 bg-pink-50'
  },
  {
    id: 2,
    type: 'KYC Pending',
    title: 'KYC Verification Pending',
    desc: 'New vendor registration requires KYC verification. Business name: Tech Solutions Inc.',
    time: '15 minutes ago',
    unread: true,
    priority: null,
    icon: <File size={18} />,
    color: 'text-blue-500 bg-blue-50'
  },
  {
    id: 3,
    type: 'Escrow',
    title: 'High-Value Escrow Transaction',
    desc: 'Escrow payment of $25,000 has been initiated for order #ORD-8834. Awaiting confirmation.',
    time: '1 hour ago',
    unread: true,
    priority: 'High Priority',
    icon: <ShieldCheck size={18} />,
    color: 'text-emerald-500 bg-emerald-50'
  },
  {
    id: 4,
    type: 'System Alerts',
    title: 'System Maintenance Scheduled',
    desc: 'Platform maintenance scheduled for April 20, 2026 at 2:00 AM EST. Expected downtime: 2 hours.',
    time: '3 hours ago',
    unread: false,
    priority: null,
    icon: <Info size={18} />,
    color: 'text-slate-500 bg-slate-50'
  },
  {
    id: 5,
    type: 'Disputes',
    title: 'Dispute Resolution Required',
    desc: 'Transaction #TX-4480 dispute needs your response within 48 hours.',
    time: '5 hours ago',
    unread: false,
    priority: 'High Priority',
    icon: <AlertCircle size={18} />,
    color: 'text-pink-500 bg-pink-50'
  },
  {
    id: 6,
    type: 'KYC Pending',
    title: 'KYC Document Uploaded',
    desc: 'Vendor "Global Traders LLC" has uploaded additional KYC documents for review.',
    time: '1 day ago',
    unread: false,
    priority: null,
    icon: <File size={18} />,
    color: 'text-blue-500 bg-blue-50'
  },
  {
    id: 7,
    type: 'Escrow',
    title: 'Escrow Funds Released',
    desc: 'Escrow funds of $12,500 released to vendor account for order #ORD-8821.',
    time: '1 day ago',
    unread: true,
    priority: null,
    icon: <ShieldCheck size={18} />,
    color: 'text-emerald-500 bg-emerald-50'
  },
  {
    id: 8,
    type: 'System Alerts',
    title: 'Security Update Available',
    desc: 'A new security patch is available. Please update your vendor dashboard.',
    time: '2 hours ago',
    unread: true,
    priority: 'High Priority',
    icon: <Info size={18} />,
    color: 'text-slate-500 bg-slate-50'
  },
];

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredNotifications = useMemo(() => {
    return activeTab === 'All'
      ? MOCK_NOTIFICATIONS
      : MOCK_NOTIFICATIONS.filter(n => n.type === activeTab);
  }, [activeTab]);

  // Dynamically calculate unread count instead of hardcoding
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.unread).length;

  if (MOCK_NOTIFICATIONS && MOCK_NOTIFICATIONS.length === 0) {
    return <NoNotification />
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <main className="max-w-5xl mx-auto py-10 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Notifications</h1>
          <p className="text-slate-500 font-medium">
            {unreadCount} Unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>

        <NotificationTabs 
          tabs={TABS} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <NotificationList notifications={filteredNotifications} />
      </main>
    </div>
  );
};

export default NotificationsPage;