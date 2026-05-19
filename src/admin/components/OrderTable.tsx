import {
  fmt,
  fmtDate,
  NEXT_STATUS,
  STATUS_LABEL,
} from "@/admin/constants/order.constants";
import type { Order, OrderStatus } from "@/types/product.types";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  updating: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSelectOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export default function OrderTable({
  orders,
  loading,
  updating,
  page,
  totalPages,
  totalElements,
  onPageChange,
  onSelectOrder,
  onUpdateStatus,
}: OrderTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
            <th className="text-left px-4 py-3 font-medium">Mã đơn</th>
            <th className="text-left px-4 py-3 font-medium">Khách hàng</th>
            <th className="text-left px-4 py-3 font-medium">Sản phẩm</th>
            <th className="text-left px-4 py-3 font-medium">Tổng tiền</th>
            <th className="text-left px-4 py-3 font-medium">Thanh toán</th>
            <th className="text-left px-4 py-3 font-medium">Ngày đặt</th>
            <th className="text-left px-4 py-3 font-medium">Trạng thái</th>
            <th className="text-left px-4 py-3 font-medium">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-gray-400">
                Đang tải...
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-gray-400">
                Không có đơn hàng nào
              </td>
            </tr>
          ) : (
            orders.map((o) => {
              const nextStatus = NEXT_STATUS[o.orderStatus];
              return (
                <tr
                  key={o.orderId}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg">
                      #{o.orderId.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-800 font-medium text-sm">
                      {o.deliveryName}
                    </p>
                    <p className="text-xs text-gray-400">{o.deliveryPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700 text-sm">
                      {o.orderItems[0]?.product.productName}
                      {o.orderItems.length > 1 && (
                        <span className="text-xs text-gray-400 ml-1">
                          +{o.orderItems.length - 1}
                        </span>
                      )}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {fmt(o.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                      {o.payment.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {fmtDate(o.orderDateTime)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.orderStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => onSelectOrder(o)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition text-xs whitespace-nowrap"
                      >
                        Chi tiết
                      </button>
                      {nextStatus && (
                        <button
                          onClick={() => onUpdateStatus(o.orderId, nextStatus)}
                          disabled={updating}
                          className="px-3 py-1.5 rounded-lg border border-[#007350] text-[#007350] hover:bg-[#e1f5ee] transition text-xs whitespace-nowrap disabled:opacity-50"
                        >
                          {STATUS_LABEL[nextStatus]}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
        <span>
          Trang {page + 1} / {totalPages} — {totalElements} đơn hàng
        </span>
        <div className="flex gap-1">
          <button
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            className="px-2 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`px-2.5 py-1 rounded-lg border text-xs transition ${
                page === i
                  ? "bg-[#007350] text-white border-[#007350]"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            className="px-2 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
