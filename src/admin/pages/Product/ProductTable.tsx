import type { Product } from "@/types/product.types";
import StockBadge from "@/admin/components/StockBadge";
import StatusBadge from "@/admin/components/StatusBadge";

interface Props {
  products: Product[];
  loading: boolean;

  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}
const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";
export default function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
  onView,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
            <th className="text-left px-4 py-3 font-medium">Sản phẩm</th>
            <th className="text-left px-4 py-3 font-medium">Danh mục</th>
            <th className="text-left px-4 py-3 font-medium">Giá</th>
            <th className="text-left px-4 py-3 font-medium">Giảm giá</th>
            <th className="text-left px-4 py-3 font-medium">Tồn kho</th>
            <th className="text-left px-4 py-3 font-medium">Trạng thái</th>
            <th className="text-left px-4 py-3 font-medium">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-12 text-gray-400">
                Đang tải...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-12 text-gray-400">
                Không tìm thấy sản phẩm nào
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr
                key={p.productId}
                className="border-b border-gray-50 hover:bg-gray-50 transition"
              >
                {/* Product */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image ? (
                      <img
                        src={`${import.meta.env.VITE_IMAGE_URL}${p.image}`}
                        alt={p.productName}
                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                        📦
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-gray-800">
                        {p.productName}
                      </p>

                      <p className="text-xs text-gray-400 mt-0.5">{p.slug}</p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3 text-gray-600">
                  {p.category.categoryName}
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-gray-700 font-medium">
                  {fmt(p.price)}
                </td>

                {/* Discount */}
                <td className="px-4 py-3">
                  {p.discount > 0 ? (
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">
                      -{p.discount}%
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>

                {/* Stock */}
                <td className="px-4 py-3">
                  <StockBadge stock={p.quantity} />
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onView(p)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-blue-500 hover:bg-blue-50 transition text-xs"
                    >
                      Chi tiết
                    </button>

                    <button
                      onClick={() => onEdit(p)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition text-xs"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => onDelete(p)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-red-400 hover:bg-red-50 hover:border-red-200 transition text-xs"
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
