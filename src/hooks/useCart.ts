import { useStore } from './useStore';

// Hook reutilizable para carrito
export function useCart() {
  const { cart, addToCart, removeFromCart, clearCart } = useStore();
  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  };
}
