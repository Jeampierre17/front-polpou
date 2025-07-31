import { renderHook, act } from '@testing-library/react';
import { useProductStore } from '../hooks/useProductStore';

describe('useProductStore', () => {
  it('sets and gets products', () => {
    const { result } = renderHook(() => useProductStore());
    act(() => {
      result.current.setProducts([{ id: 1, title: 'Test', price: 10 }]);
    });
    expect(result.current.products[0].title).toBe('Test');
  });
  it('sets and gets filters', () => {
    const { result } = renderHook(() => useProductStore());
    act(() => {
      result.current.setFilters({ category: 'cat', sortBy: 'name', search: 'abc' });
    });
    expect(result.current.filters.category).toBe('cat');
  });
});
