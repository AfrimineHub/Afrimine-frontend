import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_TYPES } from '@/features/auth/types';
import { useBuyerOrderQuery } from '@/features/buyer/dashboardQueries';
import { mapBuyerOrderToOrder } from '@/features/buyer/dashboardUtils';
import { useVendorOrderQuery } from '@/features/escrow/queries';
import { mapVendorOrderToOrder } from '@/features/vendor/dashboardUtils';
import {
  useBuyerOrderEscrowQuery,
  useConfirmOrderDeliveryMutation,
  useMarkVendorOrderDeliveredMutation,
  useOpenOrderDisputeMutation,
  useOrderCheckoutMutation,
  useVendorOrderEscrowQuery,
  useVerifyOrderCheckoutMutation,
} from '@/features/escrow/queries';
import { buildOrderCheckoutReturnUrls, formatEscrowStatus } from '@/features/escrow/utils';
import { StatusBadge } from '@/features/marketplace/myOrders/components/OrderStatusBadge';
import { formatBuyerAmount } from '@/features/buyer/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isBuyer = user?.type === USER_TYPES.buyer;

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const verifyAttemptedRef = useRef(false);

  const buyerOrderQuery = useBuyerOrderQuery(isBuyer ? orderId : undefined);
  const vendorOrderQuery = useVendorOrderQuery(!isBuyer ? orderId : undefined);
  const buyerEscrowQuery = useBuyerOrderEscrowQuery(isBuyer ? orderId : undefined);
  const vendorEscrowQuery = useVendorOrderEscrowQuery(!isBuyer ? orderId : undefined);

  const checkoutMutation = useOrderCheckoutMutation();
  const verifyCheckoutMutation = useVerifyOrderCheckoutMutation();
  const confirmDeliveryMutation = useConfirmOrderDeliveryMutation();
  const openDisputeMutation = useOpenOrderDisputeMutation();
  const markDeliveredMutation = useMarkVendorOrderDeliveredMutation();

  const orderQuery = isBuyer ? buyerOrderQuery : vendorOrderQuery;
  const escrowQuery = isBuyer ? buyerEscrowQuery : vendorEscrowQuery;
  const escrow = escrowQuery.data;

  const order = isBuyer
    ? buyerOrderQuery.data
      ? mapBuyerOrderToOrder(buyerOrderQuery.data)
      : null
    : vendorOrderQuery.data
      ? mapVendorOrderToOrder(vendorOrderQuery.data)
      : null;

  const checkoutStatus = searchParams.get('checkout');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!orderId || checkoutStatus !== 'success' || !sessionId || verifyAttemptedRef.current) return;

    verifyAttemptedRef.current = true;
    verifyCheckoutMutation.mutate(
      { orderId, sessionId },
      {
        onSuccess: () => {
          setActionSuccess('Payment confirmed. Funds are now held in escrow.');
          setSearchParams({}, { replace: true });
        },
        onError: (error) => {
          setActionError(getApiErrorMessage(error, 'Could not verify payment.'));
          setSearchParams({}, { replace: true });
        },
      },
    );
  }, [checkoutStatus, orderId, sessionId, setSearchParams, verifyCheckoutMutation.mutate]);

  useEffect(() => {
    if (checkoutStatus === 'canceled') {
      setActionError('Checkout was canceled. You can try again when ready.');
      setSearchParams({}, { replace: true });
    }
  }, [checkoutStatus, setSearchParams]);

  const loadError =
    orderQuery.isError && getApiErrorMessage(orderQuery.error, 'Could not load order details.');

  const isActionPending =
    checkoutMutation.isPending ||
    confirmDeliveryMutation.isPending ||
    openDisputeMutation.isPending ||
    markDeliveredMutation.isPending ||
    verifyCheckoutMutation.isPending;

  const canFundEscrow =
    isBuyer && (escrow?.canFund || order?.status === 'pending');
  const canConfirmDelivery =
    isBuyer && (escrow?.canConfirmDelivery || order?.status === 'delivered');
  const canDispute =
    isBuyer &&
    (escrow?.canDispute || order?.status === 'paid' || order?.status === 'delivered');
  const canMarkDelivered =
    !isBuyer && (escrow?.canMarkDelivered || order?.status === 'paid');

  const handleFundEscrow = async () => {
    if (!orderId) return;
    setActionError(null);
    setActionSuccess(null);

    try {
      const { successUrl, cancelUrl } = buildOrderCheckoutReturnUrls(orderId);
      await checkoutMutation.mutateAsync({ orderId, successUrl, cancelUrl });
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not start escrow payment.'));
    }
  };

  const handleConfirmDelivery = async () => {
    if (!orderId) return;
    const confirmed = window.confirm(
      'Confirm you received the goods? This will release escrow funds to the vendor.',
    );
    if (!confirmed) return;

    setActionError(null);
    setActionSuccess(null);

    try {
      await confirmDeliveryMutation.mutateAsync(orderId);
      setActionSuccess('Delivery confirmed. Escrow funds will be released to the vendor.');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not confirm delivery.'));
    }
  };

  const handleOpenDispute = async () => {
    if (!orderId) return;
    const reason = window.prompt('Briefly describe the issue with this order:');
    if (!reason?.trim()) return;

    const details = window.prompt('Additional details (optional):') ?? undefined;

    setActionError(null);
    setActionSuccess(null);

    try {
      await openDisputeMutation.mutateAsync({ orderId, reason: reason.trim(), details: details?.trim() });
      setActionSuccess('Dispute opened. Our team will review and contact both parties.');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not open a dispute.'));
    }
  };

  const handleMarkDelivered = async () => {
    if (!orderId) return;
    const confirmed = window.confirm('Mark this order as delivered? The buyer will be asked to confirm receipt.');
    if (!confirmed) return;

    setActionError(null);
    setActionSuccess(null);

    try {
      await markDeliveredMutation.mutateAsync(orderId);
      setActionSuccess('Order marked as delivered. Waiting for buyer confirmation.');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not mark order as delivered.'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate('/my-order')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to orders
        </button>

        {orderQuery.isLoading ? (
          <div className="h-48 bg-white rounded-xl border border-gray-100 animate-pulse" aria-busy="true" />
        ) : loadError ? (
          <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : order ? (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Order</p>
                  <h1 className="text-2xl font-bold text-gray-900 mt-1">{order.listing}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {isBuyer ? 'Vendor' : 'Buyer'}: {order.counterparty}
                  </p>
                  <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatBuyerAmount(order.amount, order.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">{order.date}</p>
                </div>
              </div>
            </div>

            {escrow ? (
              <div className="bg-white rounded-xl border border-yellow-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="text-yellow-600" size={20} />
                  <h2 className="text-lg font-bold text-gray-900">Escrow</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium text-gray-900">{formatEscrowStatus(escrow.status)}</p>
                  </div>
                  {escrow.escrowId ? (
                    <div>
                      <p className="text-gray-500">Escrow ID</p>
                      <p className="font-medium text-gray-900">{escrow.escrowId}</p>
                    </div>
                  ) : null}
                  {escrow.fundedAt ? (
                    <div>
                      <p className="text-gray-500">Funded</p>
                      <p className="font-medium text-gray-900">
                        {new Date(escrow.fundedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : null}
                  {escrow.releasedAt ? (
                    <div>
                      <p className="text-gray-500">Released</p>
                      <p className="font-medium text-gray-900">
                        {new Date(escrow.releasedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {actionSuccess ? (
              <p className="text-sm text-green-700 rounded-lg border border-green-100 bg-green-50 px-4 py-3" role="status">
                {actionSuccess}
              </p>
            ) : null}

            {actionError ? (
              <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
                {actionError}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {canFundEscrow ? (
                <button
                  type="button"
                  onClick={handleFundEscrow}
                  disabled={isActionPending}
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-bold rounded-lg disabled:opacity-60"
                >
                  {checkoutMutation.isPending ? 'Redirecting…' : 'Fund Escrow'}
                </button>
              ) : null}

              {canConfirmDelivery ? (
                <button
                  type="button"
                  onClick={handleConfirmDelivery}
                  disabled={isActionPending}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg disabled:opacity-60"
                >
                  {confirmDeliveryMutation.isPending ? 'Confirming…' : 'Confirm Delivery & Release'}
                </button>
              ) : null}

              {canMarkDelivered ? (
                <button
                  type="button"
                  onClick={handleMarkDelivered}
                  disabled={isActionPending}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg disabled:opacity-60"
                >
                  {markDeliveredMutation.isPending ? 'Updating…' : 'Mark as Delivered'}
                </button>
              ) : null}

              {canDispute ? (
                <button
                  type="button"
                  onClick={handleOpenDispute}
                  disabled={isActionPending}
                  className="px-5 py-2.5 bg-white border border-red-200 text-red-700 text-sm font-bold rounded-lg hover:bg-red-50 disabled:opacity-60"
                >
                  {openDisputeMutation.isPending ? 'Opening…' : 'Open Dispute'}
                </button>
              ) : null}

              <Link
                to={`/messages?orderId=${order.id}`}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg"
              >
                Message
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
