import { renderHook, act } from '@testing-library/react';
import { useStore } from '../hooks/useStore';

describe('useStore', () => {
  it('sets and gets products', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.setProducts([{ id: 1, title: 'Test', price: 10 }]);
    });
    expect(result.current.products[0].title).toBe('Test');
  });
  it('sets and gets filters', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.setFilters({ category: 'cat', sortBy: 'name', search: 'abc' });
    });
    expect(result.current.filters.category).toBe('cat');
  });
});
