// src/services/cartService.ts

export interface CartItem {
  productId: string;
  quantity: number;
}

const CART_KEY = "cart";

export const cartService = {
  getCart: (): CartItem[] => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw || raw === "undefined") return [];
      return JSON.parse(raw) as CartItem[];
    } catch {
      return [];
    }
  },

  saveCart: (items: CartItem[]): void => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  },

  clearCart: (): void => {
    localStorage.removeItem(CART_KEY);
  },

  addItem: (items: CartItem[], productId: string, quantity = 1): CartItem[] => {
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      return items.map((i) =>
        i.productId === productId
          ? { ...i, quantity: i.quantity + quantity }
          : i,
      );
    }
    return [...items, { productId, quantity }];
  },

  removeItem: (items: CartItem[], productId: string): CartItem[] => {
    return items.filter((i) => i.productId !== productId);
  },

  updateQuantity: (
    items: CartItem[],
    productId: string,
    quantity: number,
  ): CartItem[] => {
    if (quantity <= 0) return cartService.removeItem(items, productId);
    return items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i,
    );
  },

  getTotalItems: (items: CartItem[]): number => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  },
};
