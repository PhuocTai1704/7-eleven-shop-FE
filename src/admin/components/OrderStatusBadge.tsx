import { STATUS_LABEL, STATUS_STYLE } from "@/admin/constants/Order.constants";
import type { OrderStatus } from "@/types/product.types";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
