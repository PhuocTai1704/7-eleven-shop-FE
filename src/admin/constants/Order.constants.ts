import type { OrderStatus } from "@/types/product.types";

export const PAGE_SIZE = 10;

export const STATUS_LIST: { value: OrderStatus | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SHIPPED", label: "Đang giao hàng" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã huỷ" },
  { value: "FAILED", label: "Thất bại" },
];

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "SHIPPED",
  SHIPPED: "COMPLETED",
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-purple-50 text-purple-700",
  COMPLETED: "bg-[#e1f5ee] text-[#005a3e]",
  CANCELLED: "bg-gray-100 text-gray-500",
  FAILED: "bg-red-50 text-red-600",
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  SHIPPED: "Đang giao hàng",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã huỷ",
  FAILED: "Thất bại",
};

export const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
