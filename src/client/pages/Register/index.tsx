import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_URL}auth/register`, {
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Đăng ký</h2>
          <p className="text-sm text-gray-400 mt-0.5">Tạo tài khoản mới</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3.5">
          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              Đăng ký thành công! Đang chuyển hướng...
            </p>
          )}

          <input
            className="auth-input"
            type="text"
            autoFocus
            placeholder="Họ và tên"
            value={form.fullName}
            onChange={set("fullName")}
          />

          <input
            className="auth-input"
            type="text"
            autoComplete="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={set("username")}
          />

          <input
            className="auth-input"
            type="password"
            autoComplete="new-password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={set("password")}
          />

          <div>
            <input
              className={`auth-input ${
                form.confirmPassword
                  ? form.password === form.confirmPassword
                    ? "border-green-400 focus:border-green-500"
                    : "border-red-300 focus:border-red-400"
                  : ""
              }`}
              type="password"
              autoComplete="new-password"
              placeholder="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
            />
            {form.confirmPassword && (
              <p
                className={`text-xs mt-1 ${form.password === form.confirmPassword ? "text-green-500" : "text-red-400"}`}
              >
                {form.password === form.confirmPassword
                  ? "✓ Mật khẩu khớp"
                  : "✗ Mật khẩu chưa khớp"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !form.fullName.trim() ||
              !form.username.trim() ||
              !form.password ||
              !form.confirmPassword
            }
            className="w-full py-2.5 bg-[#007350] hover:bg-[#005a3e] text-white text-sm font-medium rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Tạo tài khoản
          </button>

          <p className="text-center text-sm text-gray-400">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-[#007350] font-medium hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
