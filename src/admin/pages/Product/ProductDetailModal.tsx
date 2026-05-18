import type { Product } from "@/types/product.types";

interface Props {
  product: Product;
  onClose: () => void;
}

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

export default function ProductDetailModal({ product, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden py-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Chi tiết sản phẩm
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">{product.productId}</p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-gray-100 transition flex items-center justify-center text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div>
            {product.image ? (
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}${product.image}`}
                alt={product.productName}
                className="w-full h-80 object-cover rounded-2xl border border-gray-100"
              />
            ) : (
              <div className="w-full h-80 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center text-6xl">
                📦
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Tên sản phẩm</p>
              <h3 className="text-xl font-semibold text-gray-800">
                {product.productName}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Giá bán</p>
                <p className="font-semibold text-[#007350] text-lg">
                  {fmt(product.price)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Giảm giá</p>
                <p className="font-semibold text-orange-500 text-lg">
                  {product.discount}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Tồn kho</p>
                <p className="font-medium text-gray-700">{product.quantity}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Trạng thái</p>

                {product.status ? (
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-[#e1f5ee] text-[#005a3e] font-medium">
                    Đang bán
                  </span>
                ) : (
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                    Ngừng bán
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Danh mục</p>

              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                {product.category.categoryName}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Slug</p>
              <p className="text-sm text-gray-700 break-all">{product.slug}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Mô tả</p>

              <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed min-h-[100px]">
                {product.description || "Không có mô tả"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
              <div>
                <p className="mb-1">Ngày tạo</p>
                <p className="text-gray-600">
                  {new Date(product.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>

              <div>
                <p className="mb-1">Cập nhật</p>
                <p className="text-gray-600">
                  {new Date(product.updatedAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#007350] text-white text-sm hover:bg-[#005a3e] transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
