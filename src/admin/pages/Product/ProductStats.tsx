import StatCard from "@/admin/components/StatCard";

interface Props {
  total: number;
  active: number;
  outStock: number;
}

export default function ProductStats({ total, active, outStock }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
      <StatCard label="Tổng sản phẩm" value={total} />

      <StatCard label="Đang bán" value={active} color="text-[#007350]" />

      <StatCard label="Hết hàng" value={outStock} color="text-red-600" />
    </div>
  );
}
