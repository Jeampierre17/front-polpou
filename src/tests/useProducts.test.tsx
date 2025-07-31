import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '../hooks/useProducts';

describe('useProducts', () => {
  it('returns products array', () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useProducts(), { wrapper });
    expect(Array.isArray(result.current.products)).toBe(true);
  });
});
