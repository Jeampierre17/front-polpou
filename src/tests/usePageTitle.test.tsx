import { renderHook, act } from '@testing-library/react';
import { PageTitleProvider, usePageTitle } from '../hooks/usePageTitle';

describe('usePageTitle', () => {
  it('sets the page title in context', () => {
    const wrapper = ({ children }: any) => <PageTitleProvider>{children}</PageTitleProvider>;
    const { result } = renderHook(() => usePageTitle(), { wrapper });
    act(() => {
      result.current.setPageTitle('Test Title');
    });
    expect(result.current.pageTitle).toBe('Test Title');
  });
});
