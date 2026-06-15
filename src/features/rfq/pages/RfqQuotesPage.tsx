import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useBuyerRfqQuery, useBuyerRfqQuotesQuery } from '@/features/buyer/dashboardQueries';
import { formatBuyerAmount } from '@/features/buyer/dashboardUtils';
import { useAcceptRfqQuoteMutation } from '@/features/escrow/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

const RfqQuotesPage = () => {
  const { rfqId } = useParams<{ rfqId: string }>();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState<string | null>(null);
  const [acceptingQuoteId, setAcceptingQuoteId] = useState<string | null>(null);

  const rfqQuery = useBuyerRfqQuery(rfqId);
  const quotesQuery = useBuyerRfqQuotesQuery(rfqId);
  const acceptQuoteMutation = useAcceptRfqQuoteMutation();

  const loadError =
    (rfqQuery.isError && getApiErrorMessage(rfqQuery.error, 'Could not load request.')) ||
    (quotesQuery.isError && getApiErrorMessage(quotesQuery.error, 'Could not load quotes.'));

  const handleAcceptQuote = async (quoteId: string) => {
    if (!rfqId) return;

    const confirmed = window.confirm(
      'Accept this quote? An order will be created and you can fund escrow next.',
    );
    if (!confirmed) return;

    setActionError(null);
    setAcceptingQuoteId(quoteId);

    try {
      const result = await acceptQuoteMutation.mutateAsync({ rfqId, quoteId });
      if (result.orderId) {
        navigate(`/my-order/${result.orderId}`);
      } else {
        navigate('/my-order');
      }
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not accept this quote.'));
    } finally {
      setAcceptingQuoteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-6 lg:px-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          to="/rfq"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to my requests
        </Link>

        {rfqQuery.isLoading ? (
          <div className="h-24 bg-white rounded-xl border border-gray-100 animate-pulse" />
        ) : rfqQuery.data ? (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900">{rfqQuery.data.resource}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {rfqQuery.data.quantity ?? '—'} · {rfqQuery.data.location ?? '—'}
            </p>
          </div>
        ) : null}

        {loadError ? (
          <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        {actionError ? (
          <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {actionError}
          </p>
        ) : null}

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Vendor quotes</h2>

          {quotesQuery.isLoading ? (
            <div className="space-y-3" aria-busy="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 bg-white border border-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (quotesQuery.data ?? []).length === 0 ? (
            <p className="text-sm text-gray-500 py-12 text-center bg-white rounded-xl border border-gray-100">
              No quotes yet. Vendors will respond via messages.
            </p>
          ) : (
            <div className="space-y-4">
              {(quotesQuery.data ?? []).map((quote) => {
                const isAccepted = quote.status?.toLowerCase().includes('accept');
                const isPending = !isAccepted && !quote.status?.toLowerCase().includes('reject');

                return (
                  <div
                    key={quote.id}
                    className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{quote.vendorName ?? 'Vendor'}</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">
                        {formatBuyerAmount(quote.amount, quote.currency)}
                      </p>
                      {quote.note ? <p className="text-sm text-gray-500 mt-2">{quote.note}</p> : null}
                      {quote.expiresAt ? (
                        <p className="text-xs text-gray-400 mt-1">
                          Expires {new Date(quote.expiresAt).toLocaleDateString()}
                        </p>
                      ) : null}
                    </div>

                    {isPending ? (
                      <button
                        type="button"
                        onClick={() => handleAcceptQuote(quote.id)}
                        disabled={acceptQuoteMutation.isPending}
                        className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-bold rounded-lg disabled:opacity-60 shrink-0"
                      >
                        {acceptingQuoteId === quote.id ? 'Accepting…' : 'Accept & Create Order'}
                      </button>
                    ) : (
                      <span className="text-xs font-bold uppercase text-gray-500">{quote.status}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RfqQuotesPage;
