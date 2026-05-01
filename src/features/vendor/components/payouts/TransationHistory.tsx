import { useState } from 'react';
import { TransactionsHistoryFilter } from './TransactionHistoryFilter';
import { TransactionsTable } from './TransactionTable';

const MOCK_TRANSACTIONS = [
  {
    id: 'TXN-001',
    date: '3/28/2025',
    method: 'Bank Transfer',
    amount: '₦500,000',
    status: 'completed',
  },
  {
    id: 'TXN-002',
    date: '3/28/2025',
    method: 'Mobile Money',
    amount: '₦500,000',
    status: 'completed',
  },
  {
    id: 'TXN-004',
    date: '3/28/2025',
    method: 'Paystack',
    amount: '₦500,000',
    status: 'pending',
  },
];

export const TransactionsPage = () => {
  const [filter, setFilter] = useState('all');

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    if (filter === 'all') return true;
    return tx.status === filter;
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Transaction History
        </h2>
        <p className="text-sm text-gray-500">
          View your past payout transactions
        </p>
      </div>

      {/* Filter */}
      <TransactionsHistoryFilter
        value={filter}
        onChange={setFilter}
      />

      {/* Table */}
      <TransactionsTable transactions={filteredTransactions} />
    </div>
  );
};