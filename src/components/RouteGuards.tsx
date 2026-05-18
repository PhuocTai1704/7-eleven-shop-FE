import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// ── Loading spinner dùng chung ─────────────────────────────────────────────
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm">Đang tải...</p>
    </div>
  );
}

// ── AdminRoute: yêu cầu quyền admin ───────────────────────────────────────
// Nếu chưa login        → redirect /admin/login
// Nếu đã login nhưng không phải admin → redirect /403
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loading />;

  if (!isAuthenticated) {
    return (
      <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
