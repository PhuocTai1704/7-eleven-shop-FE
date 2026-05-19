// src/client/pages/CartPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/api/axiosInstance";
import type { Product } from "@/types/product.types";

const getFinalPrice = (price: number, discount: number) =>
  discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " ₫";

// Map productId -> Product để tránh re-fetch
type ProductMap = Record<string, Product>;

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalItems } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [productMap, setProductMap] = useState<ProductMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product info cho các productId chưa có trong map
  useEffect(() => {
    if (cartItems.length === 0) {
      setLoading(false);
      return;
    }

    const missingIds = cartItems
      .map((i) => i.productId)
      .filter((id) => !productMap[id]);

    if (missingIds.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all(
      missingIds.map((id) =>
        axiosInstance
          .get<Product>(`products/${id}`)
          .then((res) => ({ id, product: res.data })),
      ),
    )
      .then((results) => {
        setProductMap((prev) => {
          const next = { ...prev };
          results.forEach(({ id, product }) => {
            next[id] = product;
          });
          return next;
        });
      })
      .catch(() => setError("Không thể tải thông tin sản phẩm."))
      .finally(() => setLoading(false));
  }, [cartItems]);

  const totalPrice = cartItems.reduce((sum, item) => {
    const product = productMap[item.productId];
    if (!product) return sum;
    return sum + getFinalPrice(product.price, product.discount) * item.quantity;
  }, 0);

  const originalTotal = cartItems.reduce((sum, item) => {
    const product = productMap[item.productId];
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  const totalDiscount = originalTotal - totalPrice;

  // --- Empty state ---
  if (!loading && cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-6xl">🛒</div>
        <h2 className="text-lg font-semibold text-gray-700">Giỏ hàng trống</h2>
        <p className="text-sm text-gray-400">
          Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 bg-[#007350] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#005c3e] transition"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-40">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-gray-800">
          Giỏ hàng
          {totalItems > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({totalItems} sản phẩm)
            </span>
          )}
        </h1>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-400 hover:text-red-600 transition"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {/* Cart items */}
      <div className="flex flex-col gap-3">
        {cartItems.map((item) => {
          const product = productMap[item.productId];
          const isLoading = loading && !product;

          if (isLoading) {
            return (
              <div
                key={item.productId}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 animate-pulse"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            );
          }

          if (!product) return null;

          const finalPrice = getFinalPrice(product.price, product.discount);

          return (
            <div
              key={item.productId}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3"
            >
              {/* Ảnh */}
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}${product.image}`}
                alt={product.productName}
                className="w-20 h-20 object-cover rounded-xl shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1">
                  {product.productName}
                </p>

                {/* Giá */}
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-[#007350] font-bold text-sm">
                    {formatPrice(finalPrice)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-gray-400 text-xs line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Quantity + Xóa */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-base leading-none"
                      aria-label="Giảm"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-gray-800 min-w-[1.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={item.quantity >= product.quantity}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-base leading-none disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Tăng"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-xs text-gray-400 hover:text-red-400 transition"
                    aria-label="Xóa sản phẩm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky bottom: Tóm tắt + Checkout */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg px-4 py-4 z-50">
          <div className="max-w-2xl mx-auto space-y-1.5">
            {/* Tổng tiền hàng */}
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tạm tính</span>
              <span>{formatPrice(originalTotal)}</span>
            </div>

            {/* Giảm giá */}
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Giảm giá</span>
                <span>-{formatPrice(totalDiscount)}</span>
              </div>
            )}

            {/* Tổng thanh toán */}
            <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
              <span className="font-semibold text-gray-800">
                Tổng thanh toán
              </span>
              <span className="font-bold text-[#007350] text-lg">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/checkout");
                } else {
                  navigate("/login", { state: { from: "/cart" } });
                }
              }}
              className="w-full bg-[#007350] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#005c3e] active:scale-[0.98] transition-all mt-1"
            >
              {isAuthenticated
                ? `Đặt hàng (${totalItems})`
                : "Đăng nhập để đặt hàng"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
