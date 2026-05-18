import { useState, useEffect } from "react";
import type { Category, Product } from "@/types/product.types";
import Header from "@/client/components/layout/Header";
import { useRef } from "react";
import ProductCard from "@/client/components/ProductCard";
import { axioss } from "@/api/axiosInstance";

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
        const res = await axioss.get("categories", {
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

        const res = await axioss.get("products", { params });
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
