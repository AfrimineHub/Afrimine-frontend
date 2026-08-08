import { useMemo, useState } from 'react';
import { PayoutsStatsGrid } from '../../components/payouts/PayoutsGrid';
import { RequestPayout } from '../../components/payouts/RequestPayout';
import { TransactionsTable } from '../../components/payouts/TransactionTable';
import { TransactionsHistoryFilter } from '../../components/payouts/TransactionHistoryFilter';
import { useWalletBalanceQuery, useWalletTransactionsQuery } from '@/features/supplier/wallet/walletQueries';
import { mapWalletTransactionToRow } from '@/features/supplier/wallet/walletUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

const PayoutPage = () => {
  const [filter, setFilter] = useState('all');
  const balanceQuery = useWalletBalanceQuery();
  const transactionsQuery = useWalletTransactionsQuery();

  const transactions = useMemo(
    () => (transactionsQuery.data ?? []).map(mapWalletTransactionToRow),
    [transactionsQuery.data],
  );

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const loadError =
    (balanceQuery.isError && getApiErrorMessage(balanceQuery.error, 'Could not load wallet balance.')) ||
    (transactionsQuery.isError && getApiErrorMessage(transactionsQuery.error, 'Could not load transaction history.'));

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track, manage, and review all your wallet transactions
          </p>
        </div>

        {loadError ? (
          <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="bg-white rounded-xl shadow-sm p-5">
          <PayoutsStatsGrid
            balance={balanceQuery.data}
            transactionsCount={transactionsQuery.data?.length}
            isLoading={balanceQuery.isLoading}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <RequestPayout
            availableAmount={balanceQuery.data?.availableBalance}
            currency={balanceQuery.data?.currency}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="mb-4 space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-500">View your wallet's credit and debit history</p>
            </div>

            <TransactionsHistoryFilter value={filter} onChange={setFilter} />
          </div>

          {transactionsQuery.isLoading ? (
            <div className="space-y-3" aria-busy="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No wallet transactions yet.</p>
          ) : (
            <TransactionsTable transactions={filteredTransactions} />
          )}
        </div>
      </div>
    </section>
  );
};

export default PayoutPage;