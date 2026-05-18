interface Props {
  label: string;
  value: number;
  color?: string;
}

export default function StatCard({ label, value, color }: Props) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>

      <p className={`text-2xl font-medium ${color ?? "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}
