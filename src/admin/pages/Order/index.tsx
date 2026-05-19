
import axiosInstance from "@/api/axiosInstance";
import OrderDetailModal from "@/admin/pages/Order/OrderDetailModal";
import OrderFilterBar from "@/admin/pages/Order/OrderFilterBar";
import OrderStatCards from "@/admin/components/OrderStatCards";
import OrderTable from "@/admin/components/OrderTable";
import { PAGE_SIZE } from "@/admin/constants/order.constants";
import type {
  Order,
  OrderStatus,
  PaginationResponse,
} from "@/types/product.types";
import { useCallback, useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ── Fetch ──

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        pageNumber: page,
        pageSize: PAGE_SIZE,
        sortBy: "id",
        sortOrder: "desc",
      };
      if (statusFilter !== "") params.status = statusFilter;

      const res = await axiosInstance.get<PaginationResponse<Order>>("orders", {
        params,
      });
      setOrders(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── Update status ──

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    setUpdating(true);
    try {
      await axiosInstance.patch("orders/status", {
        orderId,
        orderStatus: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, orderStatus: newStatus } : o,
        ),
      );
      setSelectedOrder((prev) =>
        prev?.orderId === orderId ? { ...prev, orderStatus: newStatus } : prev,
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusFilterChange = (status: OrderStatus | "") => {
    setStatusFilter(status);
    setPage(0);
  };

  // ── Render ──

  return (
    <>
      {/* <OrderStatCards orders={orders} totalElements={totalElements} /> */}

      <OrderFilterBar
        statusFilter={statusFilter}
        onStatusChange={handleStatusFilterChange}
      />

      <OrderTable
        orders={orders}
        loading={loading}
        updating={updating}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        onSelectOrder={setSelectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          updating={updating}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </>
  );
}
