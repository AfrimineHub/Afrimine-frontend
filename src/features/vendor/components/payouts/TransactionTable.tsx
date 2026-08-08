import type { WalletTransactionRow } from '@/features/supplier/wallet/walletUtils';
import { WALLET_TRANSACTION_TYPE_STYLES } from '@/features/supplier/wallet/walletUtils';

interface TransactionsTableProps {
  transactions: WalletTransactionRow[];
}

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-5 text-sm text-gray-500 font-medium pb-3">
        <p>Reference</p>
        <p>Date</p>
        <p>Description</p>
        <p>Amount</p>
        <p>Type</p>
      </div>

      <div>
        {transactions.map((tx) => (
          <div key={tx.id} className="grid grid-cols-5 py-4 text-sm items-center">
            <p className="text-gray-800">{tx.reference}</p>
            <p className="text-gray-600">{tx.date}</p>
            <p className="text-gray-600">{tx.description}</p>
            <p className="text-gray-800 font-medium">{tx.amount}</p>
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${WALLET_TRANSACTION_TYPE_STYLES[tx.type]}`}
              >
                {tx.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};