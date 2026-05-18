interface Props {
  status: boolean;
}

export default function StatusBadge({ status }: Props) {
  return status ? (
    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-[#e1f5ee] text-[#005a3e] font-medium">
      Đang bán
    </span>
  ) : (
    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
      Ngừng bán
    </span>
  );
}