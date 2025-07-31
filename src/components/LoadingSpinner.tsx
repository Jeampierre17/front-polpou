import React from 'react'
import { motion } from 'framer-motion';



interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ display: 'inline-block' }}
      >
        <span className="block rounded-full h-16 w-16 border-b-4 border-pink-500 border-solid" />
      </motion.div>
      <span className="sr-only">Cargando...</span>
    </div>
  );
}

export default LoadingSpinner 