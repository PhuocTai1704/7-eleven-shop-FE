import { useState, useEffect } from "react";
import type { Category, Product } from "@/types/product.types";
import Header from "@/client/components/layout/Header";
import { useRef } from "react";
import ProductCard from "@/client/components/ProductCard";
import axios from "axios";
import axiosInstance from "@/api/axiosInstance";

interface CategoryFilter {
  categoryId: number | "all";
  categoryName: string;
  icon: string;
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { categoryId: "all", categoryName: "Tất cả", icon: "🏪" },
  { categoryId: 1, categoryName: "Đồ Uống", icon: "🧋" },
  { categoryId: 2, categoryName: "Bánh & Snack", icon: "🍞" },
  { categoryId: 3, categoryName: "Ăn Nhanh", icon: "🍱" },
  { categoryId: 4, categoryName: "Đồ Đông Lạnh", icon: "🧊" },
  { categoryId: 5, categoryName: "Sản Phẩm Từ Sữa", icon: "🥛" },
  { categoryId: 6, categoryName: "Chăm Sóc Cá Nhân", icon: "🧴" },
  { categoryId: 7, categoryName: "Rau Củ & Trái Cây", icon: "🥦" },
  { categoryId: 8, categoryName: "Thịt & Hải Sản", icon: "🥩" },
  { categoryId: 9, categoryName: "Đồ Hộp", icon: "🥫" },
  { categoryId: 10, categoryName: "Gia Vị Dầu Ăn", icon: "🧂" },
  { categoryId: 11, categoryName: "Đồ Khô Ngũ Cốc", icon: "🌾" },
  { categoryId: 12, categoryName: "Đồ Uống Có Cồn", icon: "🍺" },
  { categoryId: 13, categoryName: "Chăm Sóc Sức Khỏe", icon: "💊" },
  { categoryId: 14, categoryName: "Chăm Sóc Nhà Cửa", icon: "🧹" },
  { categoryId: 15, categoryName: "Phụ Kiện Điện Tử", icon: "🔌" },
  { categoryId: 16, categoryName: "Văn Phòng Phẩm", icon: "✏️" },
  { categoryId: 17, categoryName: "Sản Phẩm Cho Bé", icon: "👶" },
  { categoryId: 18, categoryName: "Chăm Sóc Thú Cưng", icon: "🐾" },
  { categoryId: 19, categoryName: "Đồ Chơi", icon: "🧸" },
];

const MOCK_PRODUCTS: Product[] = [
  {
    productId: "1",
    productName: "Trà Sữa Oolong Mẫu Đơn Size L",
    slug: "tra-sua-oolong-mau-don",
    image: "https://placehold.co/300x300/007350/white?text=Trà+Sữa",
    price: 29000,
    quantity: 100,
    discount: 0,
    status: true,
    description: "Trà sữa oolong thơm ngon đặc trưng của 7-Eleven",
    category: {
      categoryId: 1,
      categoryName: "Đồ Uống",
      slug: "do-uong",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "2",
    productName: "Matcha Latte Size M",
    slug: "matcha-latte-size-m",
    image: "https://placehold.co/300x300/007350/white?text=Matcha",
    price: 39000,
    quantity: 50,
    discount: 0,
    status: true,
    description: "Matcha latte thơm béo với sữa thanh trùng",
    category: {
      categoryId: 1,
      categoryName: "Đồ Uống",
      slug: "do-uong",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "3",
    productName: "Combo 2 Trà Sữa + 2 Topping",
    slug: "combo-2-tra-sua-2-topping",
    image: "https://placehold.co/300x300/e63946/white?text=Combo",
    price: 68000,
    quantity: 30,
    discount: 8,
    status: true,
    description: "Combo tiết kiệm 2 trà sữa tùy chọn và 2 topping bất kỳ",
    category: {
      categoryId: 1,
      categoryName: "Đồ Uống",
      slug: "do-uong",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "4",
    productName: "Burger Bò Phô Mai Size Lớn",
    slug: "burger-bo-pho-mai-size-lon",
    image: "https://placehold.co/300x300/f4a261/white?text=Burger",
    price: 49000,
    quantity: 20,
    discount: 0,
    status: true,
    description: "Burger bò phô mai thơm ngon size lớn đặc biệt",
    category: {
      categoryId: 3,
      categoryName: "Ăn Nhanh",
      slug: "an-nhanh",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "5",
    productName: "Combo 3 Toastie (Tùy chọn)",
    slug: "combo-3-toastie",
    image: "https://placehold.co/300x300/e63946/white?text=Toastie",
    price: 81000,
    quantity: 25,
    discount: 7,
    status: true,
    description: "Combo 3 bánh mì sandwich nướng tùy chọn nhân",
    category: {
      categoryId: 2,
      categoryName: "Bánh & Snack",
      slug: "banh-snack",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "6",
    productName: "Lemonade Size L",
    slug: "lemonade-size-l",
    image: "https://placehold.co/300x300/2a9d8f/white?text=Lemonade",
    price: 22000,
    quantity: 80,
    discount: 0,
    status: true,
    description: "Nước chanh tươi mát lạnh size lớn",
    category: {
      categoryId: 1,
      categoryName: "Đồ Uống",
      slug: "do-uong",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "7",
    productName: "Bánh Mì Que + Trà Sữa Nhà Bảy",
    slug: "banh-mi-que-tra-sua",
    image: "https://placehold.co/300x300/264653/white?text=Bánh+Mì",
    price: 55000,
    quantity: 15,
    discount: 0,
    status: true,
    description: "Combo bánh mì que giòn và trà sữa nhà bảy",
    category: {
      categoryId: 2,
      categoryName: "Bánh & Snack",
      slug: "banh-snack",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "8",
    productName: "Oatmilk Matcha Latte Size M",
    slug: "oatmilk-matcha-latte",
    image: "https://placehold.co/300x300/007350/white?text=Oatmilk",
    price: 39000,
    quantity: 40,
    discount: 0,
    status: true,
    description: "Matcha latte với sữa yến mạch healthy",
    category: {
      categoryId: 1,
      categoryName: "Đồ Uống",
      slug: "do-uong",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "9",
    productName: "Trà Tắc Nhà Bảy Size L",
    slug: "tra-tac-nha-bay",
    image: "https://placehold.co/300x300/f4a261/white?text=Trà+Tắc",
    price: 17000,
    quantity: 60,
    discount: 0,
    status: true,
    description: "Trà tắc nhà bảy chua ngọt thanh mát",
    category: {
      categoryId: 1,
      categoryName: "Đồ Uống",
      slug: "do-uong",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "10",
    productName: "Hồng Trà Sữa Size L",
    slug: "hong-tra-sua-size-l",
    image: "https://placehold.co/300x300/e63946/white?text=Hồng+Trà",
    price: 25000,
    quantity: 55,
    discount: 0,
    status: true,
    description: "Hồng trà sữa thơm ngon đặc trưng",
    category: {
      categoryId: 1,
      categoryName: "Đồ Uống",
      slug: "do-uong",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "11",
    productName: "Burger Gà Xốt Kem Gochujang",
    slug: "burger-ga-xot-kem-gochujang",
    image: "https://placehold.co/300x300/264653/white?text=Burger+Gà",
    price: 49000,
    quantity: 8,
    discount: 0,
    status: true,
    description: "Burger gà với xốt kem gochujang cay nồng",
    category: {
      categoryId: 3,
      categoryName: "Ăn Nhanh",
      slug: "an-nhanh",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "12",
    productName: "Combo Bánh Bao + Thức Uống",
    slug: "combo-banh-bao-thuc-uong",
    image: "https://placehold.co/300x300/2a9d8f/white?text=Bánh+Bao",
    price: 42000,
    quantity: 30,
    discount: 0,
    status: true,
    description: "Combo 1 bánh bao và 1 thức uống nhà bảy",
    category: {
      categoryId: 2,
      categoryName: "Bánh & Snack",
      slug: "banh-snack",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "13",
    productName: "Oolong Mai Mơ Size L",
    slug: "oolong-mai-mo-size-l",
    image: "https://placehold.co/300x300/007350/white?text=Oolong",
    price: 29000,
    quantity: 45,
    discount: 0,
    status: true,
    description: "Trà oolong hương mai mơ thanh tao",
    category: {
      categoryId: 1,
      categoryName: "Đồ Uống",
      slug: "do-uong",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "14",
    productName: "Combo 2 Đồ Hấp + Thức Uống",
    slug: "combo-do-hap-thuc-uong",
    image: "https://placehold.co/300x300/f4a261/white?text=Đồ+Hấp",
    price: 49000,
    quantity: 20,
    discount: 0,
    status: true,
    description: "Combo 2 món hấp tùy chọn và 1 thức uống nhà bảy",
    category: {
      categoryId: 3,
      categoryName: "Ăn Nhanh",
      slug: "an-nhanh",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "15",
    productName: "Cơm Nắm + Thức Uống Nhà Bảy",
    slug: "com-nam-thuc-uong",
    image: "https://placehold.co/300x300/264653/white?text=Cơm+Nắm",
    price: 32000,
    quantity: 25,
    discount: 0,
    status: true,
    description: "Cơm nắm tùy chọn nhân và 1 thức uống nhà bảy",
    category: {
      categoryId: 3,
      categoryName: "Ăn Nhanh",
      slug: "an-nhanh",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
  {
    productId: "16",
    productName: "Combo 2 Hồng Trà Sữa Size M",
    slug: "combo-2-hong-tra-sua",
    image: "https://placehold.co/300x300/e63946/white?text=Combo+Trà",
    price: 50000,
    quantity: 35,
    discount: 10,
    status: true,
    description: "Combo 2 hồng trà sữa size M tiết kiệm",
    category: {
      categoryId: 1,
      categoryName: "Đồ Uống",
      slug: "do-uong",
      image: "",
      status: true,
      createdAt: "",
      updatedAt: "",
    },
    createdAt: "",
    updatedAt: "",
  },
];

const Home = () => {
  const ITEMS_PER_PAGE = 8;

  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("categories", {
          params: {
            pageNumber: 0,
            pageSize: 100,
            sortBy: "id",
            sortOrder: "asc",
            status: true,
          },
        });
        setCategories(res.data.content);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, unknown> = {
          pageNumber: currentPage - 1,
          pageSize: ITEMS_PER_PAGE,
          sortBy: "id",
          sortOrder: "asc",
          status: true,
        };

        if (selectedCategoryId !== "all") {
          params.categoryId = selectedCategoryId;
        }

        if (search.trim()) {
          params.keyword = search;
        }

        const res = await axiosInstance.get("products", { params });
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedCategoryId, search]);

  const categoryFilters = [
    { categoryId: "all" as const, categoryName: "Tất cả", icon: "🏪" },
    ...categories.map((cat) => ({
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      icon: "🏷️",
    })),
  ];
  const categoryRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (categoryRef.current)
      categoryRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (categoryRef.current)
      categoryRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };
  return (
    <div className="small-h-screen bg-gray-50">
      {/* Header */}
      <Header
        search={search}
        onSearch={setSearch}
        isLoggedIn={false}
        onLogin={() => console.log("login")}
        onLogout={() => console.log("logout")}
      />
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#007350] to-[#00a36c] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-green-200 text-sm font-medium mb-1 text-center">
            Giao hàng siêu tốc ⚡
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
            Danh mục
          </h2>
          <div className="relative flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#007350] hover:text-[#007350] transition"
            >
              ‹
            </button>

            <div
              ref={categoryRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide"
            >
              {categoryFilters.map((cat) => (
                <button
                  key={String(cat.categoryId)}
                  onClick={() => setSelectedCategoryId(cat.categoryId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap flex-shrink-0
            ${
              selectedCategoryId === cat.categoryId
                ? "bg-[#007350] text-white border-[#007350] shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#007350] hover:text-[#007350]"
            }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.categoryName}</span>
                </button>
              ))}
            </div>

            <button
              onClick={scrollRight}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#007350] hover:text-[#007350] transition"
            >
              ›
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          {products.length > 0
            ? `Hiển thị ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, products.length)} / ${products.length} sản phẩm`
            : "Không tìm thấy sản phẩm"}
        </p>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
            <p className="text-sm">Thử tìm kiếm từ khóa khác</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full border text-sm font-medium disabled:opacity-40 hover:border-[#007350] hover:text-[#007350] transition"
            >
              ← Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition
                  ${
                    currentPage === page
                      ? "bg-[#007350] text-white"
                      : "border hover:border-[#007350] hover:text-[#007350]"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full border text-sm font-medium disabled:opacity-40 hover:border-[#007350] hover:text-[#007350] transition"
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
