import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

export function withReactQueryProvider(Component: React.ComponentType<any>) {
  return function Wrapper(props: any) {
    return (
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    );
  };
}
