import { type OrderStatus } from "../types";

const filters: ("all" | OrderStatus)[] = [
  "all",
  "pending",
  "paid",
  "delivered",
  "completed",
  "disputed",
];

export const OrderFilters = ({
  active,
  onChange,
}: {
  active: string;
  onChange: (val: any) => void;
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-4 py-1 rounded-md text-sm capitalize ${
            active === f
              ? "bg-yellow-500 text-black"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};