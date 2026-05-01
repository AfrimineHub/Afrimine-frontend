interface StatusProps {
    type: string;
    value: string;
    forceRed?: boolean;
};

export const StatusBadge = ({ type, value, forceRed }: StatusProps) => {
    let styleClass = "text-sm text-gray-500 font-medium";
  
    if (
      (type === 'role' && value === 'Vendor') ||
      (type === 'kyc' && value === 'Verified') ||
      (type === 'account' && value === 'Active')
    ) {
      styleClass = "bg-[#1E293B] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide";
    } else if (
      (type === 'kyc' && value === 'Rejected') ||
      (type === 'account' && value === 'Banned') ||
      forceRed
    ) {
      styleClass = "bg-[#EF4444] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide";
    } else if (type === 'kyc' && (value === 'Pending' || value === 'Not Started')) {
      styleClass = "text-sm text-blue-600 font-medium";
    }
  
    return <span className={styleClass}>{value}</span>;
  };