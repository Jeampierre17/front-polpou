import { renderHook } from '@testing-library/react';
import { useKanbanFilters } from '../hooks/useKanbanFilters';

describe('useKanbanFilters', () => {
  it('returns filters object', () => {
    const { result } = renderHook(() => useKanbanFilters());
    expect(typeof result.current).toBe('object');
  });
});
