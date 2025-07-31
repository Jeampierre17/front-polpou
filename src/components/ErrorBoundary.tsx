import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }


  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">¡Algo salió mal!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Ocurrió un error inesperado. Por favor, recarga la página o intenta más tarde.</p>
          <pre className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 rounded p-2 max-w-full overflow-x-auto">{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
