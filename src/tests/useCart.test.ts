import { renderHook, act } from '@testing-library/react';
import { useCart } from '../hooks/useCart';

describe('useCart', () => {
  it('adds and removes items from cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addToCart({ id: 1, title: 'Test', price: 10, thumbnail: '' });
    });
    expect(result.current.cart.length).toBe(1);
    act(() => {
      result.current.removeFromCart(1);
    });
    expect(result.current.cart.length).toBe(0);
  });
});
