import { useState } from "react";
import { PayoutsStatsGrid } from "../../components/payouts/PayoutsGrid";
import { RequestPayout } from "../../components/payouts/RequestPayout";
import { TransactionsTable, type Transaction } from "../../components/payouts/TransactionTable";
import { TransactionsHistoryFilter } from "../../components/payouts/TransactionHistoryFilter";

const MOCK_TRANSACTIONS: Transaction[] = [
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

const PayoutPage = () => {
  const [filter, setFilter] = useState('all');

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    if (filter === 'all') return true;
    return tx.status === filter;
  });

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Your Payouts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track, manage, and review all your payout transactions
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <PayoutsStatsGrid />
        </div>

        {/* Request Payout */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <RequestPayout />
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          
          {/* Section Header */}
          <div className="mb-4 space-y-3">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                Transaction History
                </h2>
                <p className="text-sm text-gray-500">
                View your past payout transactions
                </p>
            </div>

            <TransactionsHistoryFilter
                value={filter}
                onChange={setFilter}
            />
        </div>

          {/* Table */}
          <TransactionsTable transactions={filteredTransactions} />
        </div>

      </div>
    </section>
  );
};

export default PayoutPage;