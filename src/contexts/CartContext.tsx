// src/contexts/CartContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { cartService, type CartItem } from "../services/cartService";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load giỏ hàng từ localStorage khi mount
  useEffect(() => {
    const saved = cartService.getCart();
    setCartItems(saved);
  }, []);

  // Đồng bộ state xuống localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    cartService.saveCart(cartItems);
  }, [cartItems]);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCartItems((prev) => cartService.addItem(prev, productId, quantity));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => cartService.removeItem(prev, productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((prev) =>
      cartService.updateQuantity(prev, productId, quantity),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    cartService.clearCart();
  }, []);

  const getItemQuantity = useCallback(
    (productId: string): number => {
      return cartItems.find((i) => i.productId === productId)?.quantity ?? 0;
    },
    [cartItems],
  );

  const totalItems = useMemo(
    () => cartService.getTotalItems(cartItems),
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được dùng bên trong CartProvider");
  }
  return context;
}
