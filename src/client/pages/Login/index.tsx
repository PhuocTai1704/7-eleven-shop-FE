import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ username, password });
      navigate(-1);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Tên đăng nhập hoặc mật khẩu không đúng",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Đăng nhập</h2>
          <p className="text-sm text-gray-400 mt-0.5">Chào mừng bạn trở lại</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3.5">
          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <input
            className="auth-input"
            type="text"
            autoFocus
            autoComplete="username"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            autoComplete="current-password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className="w-full py-2.5 bg-[#007350] hover:bg-[#005a3e] text-white text-sm font-medium rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Đăng nhập
          </button>

          <p className="text-center text-sm text-gray-400">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-[#007350] font-medium hover:underline"
            >
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
