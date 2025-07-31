import React from 'react'
import { motion } from 'framer-motion';


const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ display: 'inline-block' }}
      >
        <span className="block rounded-full h-8 w-8 border-b-2 border-color-primary border-solid" />
      </motion.div>
      <span className="sr-only">Cargando...</span>
    </div>
  );
}

export default LoadingSpinner 