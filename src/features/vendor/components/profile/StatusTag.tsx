export const StatusTag = ({ status }: { status: string }) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
  
    return (
      <span
        className={`px-2 py-1 text-xs rounded-full capitalize ${styles[status as keyof typeof styles]}`}
      >
        {status}
      </span>
    );
  };