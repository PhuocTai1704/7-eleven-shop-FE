import { Routes, Route } from "react-router-dom";
import Dashboard from "@/admin/pages/Dashboard";
import Login from "@/admin/pages/Login";
import NotFound from "@/admin/pages/NotFound";
import { AdminRoute } from "@/components/RouteGuards";
import AdminLayout from "@/admin/components/layout/AdminLayout";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRouter;
