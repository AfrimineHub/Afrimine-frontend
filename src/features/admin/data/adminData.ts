import { Clock } from "lucide-react";

export const sidebarNavigation = [
    {
      section: 'CORE MONITORING',
      links: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', active: true, path: '/admin' },
        { id: 'users', label: 'Users', icon: 'users', path: '/admin/user-management' },
        { id: 'listings', label: 'Listings', icon: 'listings', path: '/admin/listings' },
      ]
    },
    {
      section: 'TRANSACTIONS',
      links: [
        { id: 'quotes', label: 'Quotes', icon: 'quotes', path: '/admin/all-quotes' },
        { id: 'orders', label: 'Orders', icon: 'orders', path: '/admin/order-tracker', },
        { id: 'payments', label: 'Revenue', icon: 'payments', path: '/admin/revenue' },
        { id: 'withdrawals', label: 'Vendor Withdrawals', icon: 'withdrawals', path: '/admin/vendor-withdrawals' },
      ]
    },
    {
      section: 'RISK / CONTROL',
      links: [
        { id: 'disputes', label: 'Disputes', icon: 'disputes', path: '/admin/dispute', },
        { id: 'flagged', label: 'Flagged Content', icon: 'flagged' },
        { id: 'subscriptions', label: 'Subscriptions', icon: 'subscriptions' },
        { id: 'kyc', label: 'KYC Verification', icon: 'kyc', path: '/admin/kyc/verification-queue', },
        { id: 'settings', label: 'Settings', icon: 'settings' },
      ]
    }
  ];
  
  export const statCardsData = [
    { id: 'users', title: 'Total Users', value: '2,847', trend: '+12%', isPositive: true },
    { id: 'listings', title: 'Active Listings', value: '1,234', trend: '+8%', isPositive: true },
    { id: 'escrows', title: 'Ongoing Escrows', value: '156', trend: '5%', isPositive: false, isNeutral: true },
    { id: 'income', title: 'Total Platform Income', value: '₦1.2M', trend: '+15%', isPositive: true },
    { id: 'disputes', title: 'Active Disputes', value: '23', trend: '3%', isPositive: false },
    { id: 'successful', title: 'Successful Orders', value: '50', trend: '3%', isPositive: true },
  ];
  
  export const priorityAlerts = [
    {
      id: 'alert-1',
      type: 'danger',
      title: 'High-Value Dispute',
      description: 'Dispute #12458 - $15,000 escrow needs immediate attention',
      time: '10 min ago',
      actionText: 'Review Now'
    },
    {
      id: 'alert-2',
      type: Clock,
      title: 'Pending KYC Verification',
      description: '15 new high-volume vendor applications pending review',
      time: '1 hour ago',
      actionText: 'Review Queue'
    },
    {
      id: 'alert-3',
      type: 'warning',
      title: 'Suspicious Activity',
      description: 'User #8742 - Multiple failed payment attempts detected',
      time: '2 hours ago',
      actionText: 'Investigate'
    },
    {
      id: 'alert-4',
      type: 'warning',
      title: 'Flagged Listings',
      description: '5 new listings flagged by community for review',
      time: '3 hours ago',
      actionText: 'View All'
    }
  ];
  
  export const liveActivityFeed = [
    { id: 'act-1', type: 'info', title: 'New User Registration', desc: 'Jane Cooper registered from South Africa', time: '2 minutes ago' },
    { id: 'act-2', type: 'success', title: 'Escrow Funded', desc: 'Order #8742 - $8,500 deposited by Mining Corp Ltd', time: '15 minutes ago' },
    { id: 'act-3', type: 'primary', title: 'Quote Request Sent', desc: 'Vendor #2341 sent quote for 500kg Gold Ore', time: '32 minutes ago' },
    { id: 'act-4', type: 'danger', title: 'Dispute Opened', desc: 'Order #8421 - Quality concerns raised by buyer', time: '1 hours ago' },
    { id: 'act-5', type: 'success', title: 'Escrow Released', desc: 'Order #8396 - $12,000 released to vendor', time: '2 hours ago' },
    { id: 'act-6', type: 'primary', title: 'New Listing Published', desc: 'Diamond Supplier #1892 listed 2ct diamonds', time: '3 hours ago' },
    { id: 'act-7', type: 'info', title: 'New Vendor Registration', desc: 'Zambia Mining Co. completed vendor profile', time: '4 hours ago' },
    { id: 'act-8', type: 'warning', title: 'KYC Document Submitted', desc: 'User #9231 submitted verification documents', time: '5 hours ago' },
  ];
  
  export const ongoingTransactions = [
    { id: '#8742', buyer: 'Mining Corp Ltd', vendor: 'Gold Suppliers SA', amount: '₦8,450', status: 'Pending Release' },
    { id: '#8741', buyer: 'Diamond Inc', vendor: 'Zambia Diamonds', amount: '₦8,450', status: 'Pending Release' },
    { id: '#8743', buyer: 'Global Minerals', vendor: 'Platinum Limited', amount: '₦8,450', status: 'In Dispute' },
  ];