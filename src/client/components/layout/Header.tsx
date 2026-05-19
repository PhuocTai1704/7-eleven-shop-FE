import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onSearch: (value: string) => void;
  search: string;
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Header = ({
  onSearch,
  search,
  isLoggedIn = false,
  onLogin,
  onLogout,
}: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="bg-[#007350] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <div
          onClick={() => navigate("/")}
          className="bg-white text-[#007350] font-black text-lg px-2 py-1 rounded flex-shrink-0 cursor-pointer"
        >
          7-ELEVEN
        </div>

        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full bg-white/20 text-white placeholder-white/70 text-sm outline-none focus:ring-2 focus:ring-white/50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
              🔍
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 text-sm">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-1 hover:text-green-200 transition"
          >
            🛒 Giỏ hàng
          </button>

          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-full border border-white/50 hover:bg-white/20 transition"
            >
              Đăng xuất
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="px-3 py-1.5 rounded-full bg-white text-[#007350] font-semibold hover:bg-green-100 transition"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
