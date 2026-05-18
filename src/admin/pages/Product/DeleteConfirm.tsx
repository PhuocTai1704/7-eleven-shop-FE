import type { Product } from "@/types/product.types";

interface Props {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirm({ product, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-72 shadow-xl">
        <p className="text-sm text-gray-700 mb-4">
          Bạn có chắc muốn xoá sản phẩm{" "}
          <span className="font-medium">{product.productName}</span>?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition"
          >
            Huỷ
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
