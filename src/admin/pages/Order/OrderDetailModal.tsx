import {
  fmt,
  fmtDate,
  NEXT_STATUS,
  STATUS_LABEL,
} from "@/admin/constants/Order.constants";
import type { Order, OrderStatus } from "@/types/product.types";
import OrderStatusBadge from "@/admin/components/OrderStatusBadge";

interface OrderDetailModalProps {
  order: Order;
  updating: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export default function OrderDetailModal({
  order,
  updating,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
  const nextStatus = NEXT_STATUS[order.orderStatus];
  const canCancel =
    order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED";

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-start justify-center pt-10 z-50 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden mb-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-medium text-gray-800">
              Chi tiết đơn hàng
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              #{order.orderId.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Thông tin giao hàng */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Thông tin nhận hàng
            </p>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-gray-400">Tên</span>
              <span className="text-gray-800 font-medium">
                {order.deliveryName}
              </span>
              <span className="text-gray-400">Điện thoại</span>
              <span className="text-gray-800">{order.deliveryPhone}</span>
              <span className="text-gray-400">Địa chỉ</span>
              <span className="text-gray-800">{order.address}</span>
              <span className="text-gray-400">Ngày đặt</span>
              <span className="text-gray-800">
                {fmtDate(order.orderDateTime)}
              </span>
              <span className="text-gray-400">Thanh toán</span>
              <span className="text-gray-800">
                {order.payment.paymentMethod}
                {order.payment.paymentCode && (
                  <span className="text-xs text-gray-400 ml-1">
                    ({order.payment.paymentCode})
                  </span>
                )}
              </span>
              <span className="text-gray-400">Trạng thái</span>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
          </div>

          {/* Sản phẩm */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Sản phẩm ({order.orderItems.length})
            </p>
            <div className="flex flex-col gap-3">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.productName}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                      📦
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.product.productName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {fmt(item.price)} × {item.quantity}
                      {item.discount > 0 && (
                        <span className="ml-1 text-orange-500">
                          -{item.discount}%
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-800 flex-shrink-0">
                    {fmt(
                      Math.round(
                        item.price * item.quantity * (1 - item.discount / 100),
                      ),
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-1.5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tạm tính</span>
              <span>{fmt(order.subTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Phí vận chuyển</span>
              <span>{fmt(order.priceShip)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-800 mt-1">
              <span>Tổng cộng</span>
              <span className="text-[#007350]">{fmt(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-2 px-5 py-3 border-t border-gray-100">
          {canCancel && (
            <button
              onClick={() => onUpdateStatus(order.orderId, "CANCELLED")}
              disabled={updating}
              className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm hover:bg-red-50 transition disabled:opacity-50"
            >
              Huỷ đơn
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition"
            >
              Đóng
            </button>
            {nextStatus && (
              <button
                onClick={() => onUpdateStatus(order.orderId, nextStatus)}
                disabled={updating}
                className="px-4 py-2 rounded-xl bg-[#007350] text-white text-sm hover:bg-[#005a3e] transition disabled:opacity-60 flex items-center gap-2"
              >
                {updating && (
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {STATUS_LABEL[nextStatus]} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
