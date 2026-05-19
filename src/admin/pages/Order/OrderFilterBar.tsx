import { STATUS_LIST } from "@/admin/constants/order.constants";
import type { OrderStatus } from "@/types/product.types";

interface OrderFilterBarProps {
  statusFilter: OrderStatus | "";
  onStatusChange: (status: OrderStatus | "") => void;
}

export default function OrderFilterBar({
  statusFilter,
  onStatusChange,
}: OrderFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {STATUS_LIST.map((s) => (
        <button
          key={s.value}
          onClick={() => onStatusChange(s.value)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
            statusFilter === s.value
              ? "bg-[#007350] text-white border-[#007350]"
              : "border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
