import type { Category } from "@/types/product.types";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  categoryId: number | "";
  setCategoryId: (value: number | "") => void;

  status: boolean | "";
  setStatus: (value: boolean | "") => void;

  categories: Category[];

  onAdd: () => void;
  setPage: (page: number) => void;
}

export default function ProductToolbar({
  search,
  setSearch,
  categoryId,
  setCategoryId,
  status,
  setStatus,
  categories,
  onAdd,
  setPage,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>

          <input
            className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#007350]"
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>

        {/* Category */}
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#007350]"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value === "" ? "" : Number(e.target.value));
            setPage(0);
          }}
        >
          <option value="">Tất cả danh mục</option>

          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#007350]"
          value={status === "" ? "" : String(status)}
          onChange={(e) => {
            setStatus(e.target.value === "" ? "" : e.target.value === "true");
            setPage(0);
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang bán</option>
          <option value="false">Ngừng bán</option>
        </select>
      </div>

      {/* Add button */}
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 px-4 py-2 bg-[#007350] text-white rounded-xl text-sm hover:bg-[#005a3e] transition whitespace-nowrap"
      >
        + Thêm sản phẩm
      </button>
    </div>
  );
}
