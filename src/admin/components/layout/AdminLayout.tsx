import { useAuth } from "@/contexts/AuthContext";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/admin/login");
  };
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-[#007350] mb-6">Admin Panel</h1>

        <nav className="flex flex-col gap-2">
          <Link
            to="/admin"
            className="px-4 py-3 rounded-xl hover:bg-[#007350] hover:text-white transition"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="px-4 py-3 rounded-xl hover:bg-[#007350] hover:text-white transition"
          >
            Sản phẩm
          </Link>

          <Link
            to="/admin/categories"
            className="px-4 py-3 rounded-xl hover:bg-[#007350] hover:text-white transition"
          >
            Danh mục
          </Link>

          <Link
            to="/admin/orders"
            className="px-4 py-3 rounded-xl hover:bg-[#007350] hover:text-white transition"
          >
            Đơn hàng
          </Link>

          <Link
            to="/admin/users"
            className="px-4 py-3 rounded-xl hover:bg-[#007350] hover:text-white transition"
          >
            Người dùng
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#007350] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-[#007350] font-black text-lg px-2 py-1 rounded">
              7-ELEVEN
            </div>
            <span className="text-green-200 text-sm">Admin Dashboard</span>
          </div>
          <button
            onClick={() => handleLogout()}
            className="text-sm hover:text-green-200 transition"
          >
            Đăng xuất
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
