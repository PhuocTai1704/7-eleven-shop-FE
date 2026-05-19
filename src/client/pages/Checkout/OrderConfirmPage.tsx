// src/client/pages/OrderConfirm/index.tsx

import { useLocation, useNavigate } from "react-router-dom";
import type { OrderResponse } from "@/types/order.types";
import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " ₫";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const order = location.state?.order as OrderResponse | undefined;

  // Nếu vào thẳng URL mà không có state thì về trang chủ
  if (!order) {
    navigate("/", { replace: true });
    return null;
  }
  useEffect(() => {
    if (order) clearCart();
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Icon thành công */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-[#007350]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Đặt hàng thành công!
          </h1>
          <p className="text-sm text-gray-400 mt-1 text-center">
            Cảm ơn bạn đã mua hàng. Chúng tôi sẽ giao hàng sớm nhất có thể.
          </p>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">
            Chi tiết đơn hàng
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Mã đơn hàng</span>
              <span className="font-medium text-gray-800">
                #{order.orderId}
              </span>
            </div>

            {order.createdAt && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Thời gian đặt</span>
                <span className="font-medium text-gray-800">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            )}

            {order.status && (
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-400">Trạng thái</span>
                <span className="bg-green-50 text-[#007350] text-xs font-semibold px-2.5 py-1 rounded-full">
                  {order.status}
                </span>
              </div>
            )}

            {order.totalAmount > 0 && (
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                <span className="font-semibold text-gray-700">
                  Tổng thanh toán
                </span>
                <span className="font-bold text-[#007350]">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-[#007350] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#005c3e] active:scale-[0.98] transition-all"
          >
            Về trang chủ
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-white text-gray-600 py-3 rounded-xl font-medium text-sm border border-gray-200 hover:border-gray-300 active:scale-[0.98] transition-all"
          >
            Xem lịch sử đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
function clearCart() {
  throw new Error("Function not implemented.");
}
