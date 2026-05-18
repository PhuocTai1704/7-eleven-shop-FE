import type { Category } from "@/types/product.types";
import { useState } from "react";

export type ProductForm = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  discount: number;
  status: boolean;
  description: string;
  categoryId: number;
  image: File | null;
};

interface Props {
  mode: "add" | "edit";
  form: ProductForm;
  categories: Category[];

  onChange: (
    field: keyof ProductForm,
    value: string | number | boolean | File | null,
  ) => void;

  onSave: () => void;
  onClose: () => void;

  saving: boolean;
}

export default function ProductModal({
  mode,
  form,
  categories,
  onChange,
  onSave,
  onClose,
  saving,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    onChange("image", file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-start justify-center pt-10 z-50 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden mb-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-medium text-gray-800">
            {mode === "edit" ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* Tên */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Tên sản phẩm *
            </label>

            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#007350]"
              value={form.productName}
              onChange={(e) => onChange("productName", e.target.value)}
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Danh mục</label>

            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#007350] bg-white"
              value={form.categoryId}
              onChange={(e) => onChange("categoryId", Number(e.target.value))}
            >
              <option value={0} disabled>
                -- Chọn danh mục --
              </option>

              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Giá + Tồn kho */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Giá bán
              </label>

              <input
                type="number"
                min={0}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#007350]"
                value={form.price || ""}
                onChange={(e) => onChange("price", +e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Tồn kho
              </label>

              <input
                type="number"
                min={0}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#007350]"
                value={form.quantity || ""}
                onChange={(e) => onChange("quantity", +e.target.value)}
              />
            </div>
          </div>

          {/* Discount + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Giảm giá (%)
              </label>

              <input
                type="number"
                min={0}
                max={100}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#007350]"
                value={form.discount || ""}
                onChange={(e) => onChange("discount", +e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Trạng thái
              </label>

              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#007350] bg-white"
                value={form.status ? "true" : "false"}
                onChange={(e) => onChange("status", e.target.value === "true")}
              >
                <option value="true">Đang bán</option>
                <option value="false">Ngừng bán</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mô tả</label>

            <textarea
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#007350] resize-none"
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hình ảnh</label>

            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#007350] transition bg-gray-50">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="h-full w-full object-contain rounded-xl p-1"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <span className="text-2xl">📷</span>

                  <span className="text-xs">Nhấn để chọn ảnh</span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {form.image && (
              <p className="text-xs text-gray-400 mt-1 truncate">
                {form.image.name}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            Huỷ
          </button>

          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#007350] text-white text-sm hover:bg-[#005a3e] transition disabled:opacity-60"
          >
            {mode === "edit" ? "Lưu thay đổi" : "Thêm sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
}
