export type PaymentMethod = "COD";

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  deliveryName: string;
  deliveryPhone: string;
  note?: string;
  orderItems: OrderItem[];
  address: string;
  paymentMethod: PaymentMethod;
}

export interface OrderResponse {
  orderId: string | number;
  status: string;
  totalAmount: number;
  createdAt: string;
}
