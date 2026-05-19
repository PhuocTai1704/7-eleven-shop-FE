export interface Category {
  categoryId: number;
  categoryName: string;
  slug: string;
  image: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  productId: string;
  productName: string;
  slug: string;
  image: string | null;
  price: number;
  quantity: number;
  discount: number; // 0 - 100
  status: boolean;
  description: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

export interface OrderProduct {
  productId: string;
  productName: string;
  slug: string;
  image: string | null;
  price: number;
  quantity: number;
  discount: number;
  status: boolean;
  description: string;
  category: {
    categoryId: number;
    categoryName: string;
  };
}

export interface OrderItem {
  product: OrderProduct;
  quantity: number;
  discount: number;
  price: number;
}

export interface Order {
  orderId: string;
  userId: string;
  deliveryName: string;
  deliveryPhone: string;
  orderItems: OrderItem[];
  address: string;
  orderDateTime: string;
  payment: {
    paymentMethod: string;
    paymentCode: string | null;
  };
  subTotal: number;
  priceShip: number;
  totalAmount: number;
  orderStatus: OrderStatus;
}

export interface PaginationResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}
