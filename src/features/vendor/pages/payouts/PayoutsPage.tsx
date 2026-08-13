import { useMemo, useState } from 'react';
import { PayoutsStatsGrid } from '../../components/payouts/PayoutsGrid';
import { RequestPayout } from '../../components/payouts/RequestPayout';
import { TransactionsTable } from '../../components/payouts/TransactionTable';
import { TransactionsHistoryFilter } from '../../components/payouts/TransactionHistoryFilter';
import { useWalletBalanceQuery, useWalletTransactionsQuery } from '@/features/supplier/wallet/walletQueries';
import { mapWalletTransactionToRow } from '@/features/supplier/wallet/walletUtils';
import { useSupplierProfileQuery } from '@/features/supplier/onboarding/onboardingQueries';
import { getApiErrorMessage } from '@/lib/api/errors';
import { SUPPLIER_PROFILE_PATH } from '@/features/supplier/constants';
import { Link } from 'react-router-dom';

function hasBankAccountNumber(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return false;
  const r = raw as Record<string, unknown>;
  return typeof r.bankAccountNumber === 'string' && r.bankAccountNumber.length > 0;
}

const PayoutPage = () => {
  const [filter, setFilter] = useState('all');
  const balanceQuery = useWalletBalanceQuery();
  const transactionsQuery = useWalletTransactionsQuery();
  const profileQuery = useSupplierProfileQuery();

  const hasBankDetails = hasBankAccountNumber(profileQuery.data);

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
            hasBankDetails={hasBankDetails}
          />
          {!profileQuery.isLoading && !hasBankDetails ? (
            <>
              <p className="mt-3 text-xs text-amber-700">
                You haven't added a payout bank account yet.
              </p><Link to={`${SUPPLIER_PROFILE_PATH}#bank-details`} className="font-semibold underline hover:text-amber-900">
                  Add bank details in your profile
                </Link>
            </>
          ) : null}
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