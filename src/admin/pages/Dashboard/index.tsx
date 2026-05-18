import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

interface RecentOrder {
  orderId: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRecentOrders([]);
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get("/api/products", {
            params: { pageNumber: 0, pageSize: 1, status: true },
          }),
          axiosInstance.get("/api/categories", {
            params: { pageNumber: 0, pageSize: 1, status: true },
          }),
        ]);

        setStats((prev) => ({
          ...prev,
          totalProducts: productsRes.data.totalElements ?? 0,
          totalCategories: categoriesRes.data.totalElements ?? 0,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards: StatCard[] = [
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts,
      icon: "📦",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Danh mục",
      value: stats.totalCategories,
      icon: "🏷️",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Đơn hàng",
      value: stats.totalOrders,
      icon: "🛒",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Doanh thu",
      value: stats.totalRevenue.toLocaleString("vi-VN") + " ₫",
      icon: "💰",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " ₫";

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-600";
      case "PENDING":
        return "bg-yellow-100 text-yellow-600";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Hoàn thành";
      case "PENDING":
        return "Chờ xử lý";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
          <p className="text-gray-400 text-sm mt-1">Chào mừng trở lại, Admin</p>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div className="text-center py-10 text-gray-400">⏳ Đang tải...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${card.color}`}
                >
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-400 mt-1">{card.title}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Quản lý sản phẩm", icon: "📦", path: "/admin/products" },
            {
              label: "Quản lý danh mục",
              icon: "🏷️",
              path: "/admin/categories",
            },
            { label: "Quản lý đơn hàng", icon: "🛒", path: "/admin/orders" },
            { label: "Quản lý người dùng", icon: "👤", path: "/admin/users" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-[#007350] hover:shadow-md transition-all flex items-center gap-3 cursor-pointer"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
            </a>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Đơn hàng gần đây</h2>
            <a
              href="/admin/orders"
              className="text-sm text-[#007350] hover:underline"
            >
              Xem tất cả
            </a>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">🛒</p>
              <p className="text-sm">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Mã đơn</th>
                  <th className="px-6 py-3 text-left">Khách hàng</th>
                  <th className="px-6 py-3 text-left">Tổng tiền</th>
                  <th className="px-6 py-3 text-left">Trạng thái</th>
                  <th className="px-6 py-3 text-left">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      #{order.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#007350]">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyle(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {order.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
