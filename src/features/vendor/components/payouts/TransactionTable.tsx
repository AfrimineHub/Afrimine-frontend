export interface Transaction {
    id: string;
    date: string;
    method: string;
    amount: string;
    status: 'completed' | 'pending';
};

interface TransactionsTableProps {
  transactions: Transaction[];
};

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
    return (
      <div className="mt-6">
        {/* Table Header */}
        <div className="grid grid-cols-5 text-sm text-gray-500 font-medium pb-3">
          <p>Transaction ID</p>
          <p>Date</p>
          <p>Method</p>
          <p>Amount</p>
          <p>Status</p>
        </div>
  
        {/* Table Body */}
        <div className="">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="grid grid-cols-5 py-4 text-sm items-center"
            >
              <p className="text-gray-800">{tx.id}</p>
              <p className="text-gray-600">{tx.date}</p>
              <p className="text-gray-600">{tx.method}</p>
              <p className="text-gray-800 font-medium">{tx.amount}</p>
  
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'completed'
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tx.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };