import { type Order } from "../types";

export const OrdersSummary = ({ orders }: { orders: Order[] }) => {
  const total = orders.length;
  const pending = orders.filter(o => o.status === "pending").length;
  const completed = orders.filter(o => o.status === "completed").length;
  const disputed = orders.filter(o => o.status === "disputed").length;

  return (
    <div className="grid grid-cols-4 gap-4 mt-6">
      <SummaryCard title="Total Orders" value={total} />
      <SummaryCard title="Pending" value={pending} />
      <SummaryCard title="Completed" value={completed} />
      <SummaryCard title="Disputes" value={disputed} />
    </div>
  );
};

const SummaryCard = ({ title, value }: any) => (
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-xl font-semibold">{value}</h3>
  </div>
);