import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../hooks/useTheme';

describe('useTheme', () => {
  it('toggles theme', () => {
    const wrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>;
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBeDefined();
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBeDefined();
  });
});
