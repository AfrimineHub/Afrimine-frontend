import { useState } from "react";
import { OrderTable } from "@/features/marketplace/myOrders";
import { OrderFilters } from "@/features/marketplace/myOrders";
import { OrdersSummary } from "@/features/marketplace/myOrders";
import { type Order } from "@/features/marketplace/myOrders/types";
import { OrderCard } from "@/features/marketplace/myOrders";

export const orders: Order[] = [
  {
    id: "#ORD-1023",
    buyer: "Goldfield Mining Co.",
    listing: "Gold Nuggets - 500g",
    amount: 45000,
    status: "paid",
    date: "Mar 25, 2026",
  },
  {
    id: "#ORD-1024",
    buyer: "Diamond Traders Ltd",
    listing: "Raw Diamonds - 2ct",
    amount: 64000,
    status: "delivered",
    date: "Mar 26, 2026",
  },
  {
    id: "#ORD-1025",
    buyer: "Copper Solutions Inc",
    listing: "Copper Ore - 10 tons",
    amount: 54000,
    status: "pending",
    date: "Mar 27, 2026",
  },
  {
    id: "#ORD-1026",
    buyer: "Platinum Group SA",
    listing: "Platinum Samples",
    amount: 54000,
    status: "completed",
    date: "Mar 20, 2026",
  },
  {
    id: "#ORD-1027",
    buyer: "Emerald Exports",
    listing: "Emerald Rough - 50ct",
    amount: 54000,
    status: "paid",
    date: "Mar 20, 2026",
  },
  {
    id: "#ORD-1028",
    buyer: "Silver Mine Holdings",
    listing: "Silver Bars - 100oz",
    amount: 54000,
    status: "paid",
    date: "Mar 20, 2026",
  },
  {
    id: "#ORD-1029",
    buyer: "Rare Earth Minerals",
    listing: "Cobalt Concentrate",
    amount: 54000,
    status: "frozen",
    date: "Mar 22, 2026",
  },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left side */}
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">My Orders</h1>
          <p className="text-gray-500 text-sm">
            Track and manage all transactions
          </p>
        </div>

        {/* Right side (Filters) */}
        <div className="overflow-x-auto">
          <OrderFilters active={filter} onChange={setFilter} />
        </div>
      </div>

      {/* Desktop Table */}
      <OrderTable orders={filteredOrders} />

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* Summary */}
      <OrdersSummary orders={orders} />
    </div>
  );
}