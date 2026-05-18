export interface Category {
  categoryId: number;
  categoryName: string;
  slug: string;
  image: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  productId: string;
  productName: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  discount: number; // 0 - 100
  status: boolean;
  description: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}
