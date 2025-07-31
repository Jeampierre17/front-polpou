// Hook global para productos y filtros
export function useProductStore() {
  const products = useStore(state => state.products);
  const setProducts = useStore(state => state.setProducts);
  const filters = useStore(state => state.filters);
  const setFilters = useStore(state => state.setFilters);
  return { products, setProducts, filters, setFilters };
}
import { useStore } from './useStore';
// Make sure your StoreState type and store implementation include setProducts

export function useCart() {
  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  const clearCart = useStore(state => state.clearCart);
  return { cart, addToCart, clearCart };
}

export function useProductFilters() {
  const filters = useStore(state => state.filters);
  const setFilters = useStore(state => state.setFilters);
  return { filters, setFilters };
}
