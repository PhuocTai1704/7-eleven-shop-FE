import type { Order } from "@/types/product.types";

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-medium ${color ?? "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}

interface OrderStatCardsProps {
  orders: Order[];
  totalElements: number;
}

export default function OrderStatCards({
  orders,
  totalElements,
}: OrderStatCardsProps) {
  const pendingCount = orders.filter((o) => o.orderStatus === "PENDING").length;
  const shippedCount = orders.filter((o) => o.orderStatus === "SHIPPED").length;
  const completedCount = orders.filter(
    (o) => o.orderStatus === "COMPLETED",
  ).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <StatCard label="Tổng đơn hàng" value={totalElements} />
      <StatCard label="Chờ xử lý" value={pendingCount} color="text-amber-600" />
      <StatCard
        label="Đang giao"
        value={shippedCount}
        color="text-purple-600"
      />
      <StatCard
        label="Hoàn thành"
        value={completedCount}
        color="text-[#007350]"
      />
    </div>
  );
}
