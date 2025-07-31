import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-color-primary"></div>
      <span className="sr-only">Cargando...</span>
    </div>
  )
}

export default LoadingSpinner 