// src/layouts/ClientLayout.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/client/components/layout/Header";
import { useState } from "react";

export default function ClientLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        search={search}
        onSearch={setSearch}
        isLoggedIn={isAuthenticated}
        onLogin={() => navigate("/login")}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-2">
        <Outlet context={{ search }} />
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
          © 2026 7-Eleven Vietnam
        </div>
      </footer>
    </div>
  );
}
