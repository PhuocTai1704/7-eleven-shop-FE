interface Props {
  stock: number;
}

export default function StockBadge({ stock }: Props) {
  if (stock === 0) {
    return (
      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
        Hết hàng
      </span>
    );
  }

  if (stock < 10) {
    return (
      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
        Sắp hết ({stock})
      </span>
    );
  }

  return <span className="text-sm text-gray-600">{stock}</span>;
}
