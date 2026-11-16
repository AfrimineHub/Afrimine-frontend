import { Link } from 'react-router-dom'
import type { WalletTransactionRow } from '@/features/supplier/wallet/walletUtils';
import { WALLET_TRANSACTION_TYPE_STYLES } from '@/features/supplier/wallet/walletUtils';
import { SUPPLIER_BOOKINGS_PATH } from '@/features/supplier/constants';

const UUID_RE = /\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i;

interface TransactionsTableProps {
  transactions: WalletTransactionRow[];
}

const GRID =
  'grid grid-cols-[minmax(7rem,1fr)_minmax(9.5rem,1.2fr)_minmax(12rem,2.5fr)_minmax(6.5rem,1fr)_5rem] gap-x-4';

function DescriptionCell({ text }: { text: string }) {
  const match = UUID_RE.exec(text);
  if (!match) return <>{text}</>;

  const id = match[1];
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + id.length);

  return (
    <>
      {before}
      <Link
        to={`${SUPPLIER_BOOKINGS_PATH}/${id}`}
        title={id}
        className="font-semibold text-[#CA8A04] hover:underline"
      >
        #{id.slice(0, 8)}
      </Link>
      {after}
    </>
  );
}

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
    <div className="mt-6 overflow-x-auto">
      {/* min-w keeps the layout intact on narrow screens; the wrapper scrolls instead of crushing columns */}
      <div className="min-w-[44rem]">
        <div className={`${GRID} border-b border-gray-100 pb-3 text-sm font-medium text-gray-500`}>
          <p>Reference</p>
          <p>Date &amp; time</p>
          <p>Description</p>
          <p className="text-right">Amount</p>
          <p>Type</p>
        </div>

        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <div key={tx.id} className={`${GRID} items-center py-4 text-sm`}>
              <p className="break-all text-gray-800">{tx.reference}</p>
              <p className="text-gray-600">{tx.date}</p>
              <p className="break-words text-gray-600">
                <DescriptionCell text={tx.description} />
              </p>
              <p
                className={`whitespace-nowrap text-right font-medium tabular-nums ${
                  tx.type === 'debit' ? 'text-red-700' : 'text-gray-800'
                }`}
              >
                {tx.amount}
              </p>
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${WALLET_TRANSACTION_TYPE_STYLES[tx.type]}`}
                >
                  {tx.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};