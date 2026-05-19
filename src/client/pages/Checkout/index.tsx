// src/client/pages/Checkout/index.tsx

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/api/axiosInstance";
import type {
  CreateOrderRequest,
  OrderResponse,
  PaymentMethod,
} from "@/types/order.types";
import type { Product } from "@/types/product.types";

const SHIPPING_FEE = 30000;

const getFinalPrice = (price: number, discount: number) =>
  discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " ₫";

type ProductMap = Record<string, Product>;

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    value: "COD",
    label: "Tiền mặt khi nhận hàng",
    icon: "💵",
    desc: "Thanh toán khi shipper giao hàng",
  },
];

interface FormState {
  deliveryName: string;
  deliveryPhone: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethod;
}

interface FormErrors {
  deliveryName?: string;
  deliveryPhone?: string;
  address?: string;
}

const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!form.deliveryName.trim())
    errors.deliveryName = "Vui lòng nhập họ tên người nhận";
  if (!form.address.trim()) errors.address = "Vui lòng nhập địa chỉ giao hàng";
  if (!form.deliveryPhone.trim())
    errors.deliveryPhone = "Vui lòng nhập số điện thoại";
  else if (!/^0\d{9}$/.test(form.deliveryPhone.trim())) {
    errors.deliveryPhone = "Số điện thoại không hợp lệ";
  }
  return errors;
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalItems } = useCart();
  const { user } = useAuth();

  const [productMap, setProductMap] = useState<ProductMap>({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [form, setForm] = useState<FormState>({
    deliveryName: user?.username ?? "",
    deliveryPhone: "",
    address: "",
    note: "",
    paymentMethod: "COD",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch product info
  useEffect(() => {
    if (cartItems.length === 0) {
      setLoadingProducts(false);
      return;
    }
    setLoadingProducts(true);
    Promise.all(
      cartItems.map((i) =>
        axiosInstance
          .get<Product>(`products/${i.productId}`)
          .then((res) => ({ id: i.productId, product: res.data })),
      ),
    )
      .then((results) => {
        const map: ProductMap = {};
        results.forEach(({ id, product }) => {
          map[id] = product;
        });
        setProductMap(map);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const p = productMap[item.productId];
        if (!p) return sum;
        return sum + getFinalPrice(p.price, p.discount) * item.quantity;
      }, 0),
    [cartItems, productMap],
  );

  const totalAmount = subtotal + SHIPPING_FEE;

  if (cartItems.length === 0) {
    navigate("/cart", { replace: true });
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    setApiError(null);

    const payload: CreateOrderRequest = {
      deliveryName: form.deliveryName.trim(),
      deliveryPhone: form.deliveryPhone.trim(),
      address: form.address.trim(),
      note: form.note.trim() || undefined,
      paymentMethod: form.paymentMethod,
      orderItems: cartItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    try {
      const response = await axiosInstance.post<OrderResponse>(
        "orders",
        payload,
      );
      navigate("/order-confirm", {
        state: { order: response.data },
        replace: true,
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Đặt hàng thất bại. Vui lòng thử lại.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-36">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 transition text-xl leading-none"
          aria-label="Quay lại"
        >
          ←
        </button>
        <h1 className="text-lg font-bold text-gray-800">Đặt hàng</h1>
      </div>

      {/* Thông tin tài khoản */}
      {user && (
        <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#007350] text-white flex items-center justify-center text-sm font-bold shrink-0">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{user.username}</p>
            <p className="text-xs text-gray-400">{totalItems} sản phẩm</p>
          </div>
        </div>
      )}

      {/* Danh sách sản phẩm */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          🛍️ Sản phẩm đặt hàng
        </h2>

        <div className="space-y-3">
          {cartItems.map((item) => {
            const product = productMap[item.productId];

            if (loadingProducts || !product) {
              return (
                <div key={item.productId} className="flex gap-3 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              );
            }

            const finalPrice = getFinalPrice(product.price, product.discount);

            return (
              <div key={item.productId} className="flex gap-3 items-center">
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}${product.image}`}
                  alt={product.productName}
                  className="w-14 h-14 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium line-clamp-1">
                    {product.productName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-[#007350] font-semibold">
                      {formatPrice(finalPrice)}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">x{item.quantity}</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatPrice(finalPrice * item.quantity)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider + tổng */}
        {!loadingProducts && (
          <div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Phí giao hàng</span>
              <span>{formatPrice(SHIPPING_FEE)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-800 pt-1 border-t border-gray-100">
              <span>Tổng thanh toán</span>
              <span className="text-[#007350]">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Form giao hàng */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">
          🚚 Thông tin giao hàng
        </h2>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Họ tên người nhận <span className="text-red-400">*</span>
          </label>
          <input
            name="deliveryName"
            value={form.deliveryName}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            className={`w-full text-sm border rounded-xl px-3 py-2.5 outline-none transition
              ${
                errors.deliveryName
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-200 focus:border-[#007350]"
              }`}
          />
          {errors.deliveryName && (
            <p className="text-xs text-red-400 mt-1">{errors.deliveryName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Số điện thoại <span className="text-red-400">*</span>
          </label>
          <input
            name="deliveryPhone"
            value={form.deliveryPhone}
            onChange={handleChange}
            placeholder="0xxxxxxxxx"
            inputMode="tel"
            maxLength={10}
            className={`w-full text-sm border rounded-xl px-3 py-2.5 outline-none transition
              ${
                errors.deliveryPhone
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-200 focus:border-[#007350]"
              }`}
          />
          {errors.deliveryPhone && (
            <p className="text-xs text-red-400 mt-1">{errors.deliveryPhone}</p>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Địa chỉ giao hàng <span className="text-red-400">*</span>
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            className={`w-full text-sm border rounded-xl px-3 py-2.5 outline-none transition
              ${
                errors.address
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-200 focus:border-[#007350]"
              }`}
          />
          {errors.address && (
            <p className="text-xs text-red-400 mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Ghi chú</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Ghi chú cho shipper, yêu cầu đặc biệt..."
            rows={2}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#007350] transition resize-none"
          />
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          💳 Phương thức thanh toán
        </h2>
        <div className="space-y-2">
          {PAYMENT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition
                ${
                  form.paymentMethod === opt.value
                    ? "border-[#007350] bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={opt.value}
                checked={form.paymentMethod === opt.value}
                onChange={handleChange}
                className="accent-[#007350]"
              />
              <span className="text-xl">{opt.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* API error */}
      {apiError && (
        <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
          {apiError}
        </div>
      )}

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg px-4 py-4 z-50">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-400">Tổng thanh toán</p>
            <p className="text-base font-bold text-[#007350]">
              {formatPrice(totalAmount)}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting || loadingProducts}
            className="flex-1 bg-[#007350] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#005c3e] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận đặt hàng"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
