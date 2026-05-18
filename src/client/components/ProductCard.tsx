import type { Product } from "@/types/product.types";

interface ProductCardProps {
  product: Product;
}

const getFinalPrice = (price: number, discount: number) =>
  discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " ₫";

const ProductCard = ({ product }: ProductCardProps) => {
  const finalPrice = getFinalPrice(product.price, product.discount);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border border-gray-100">
      <div className="relative">
        <img
          src={`${import.meta.env.VITE_IMAGE_URL}${product.image}`}
          alt={product.productName}
          className="w-full aspect-square object-cover"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{product.discount}%
          </span>
        )}
        {product.quantity < 10 && (
          <span className="absolute top-2 right-2 bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Sắp hết
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm text-gray-700 font-medium leading-tight line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.productName}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#007350] font-bold text-sm">
              {formatPrice(finalPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-gray-400 text-xs line-through ml-1">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <button className="bg-[#007350] text-white w-7 h-7 rounded-full flex items-center justify-center text-lg leading-none hover:bg-[#005c3e] transition">
            +
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">🚚 Giao 24 phút</p>
      </div>
    </div>
  );
};

export default ProductCard;
