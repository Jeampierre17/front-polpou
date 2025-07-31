import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../animations';

interface AnimatedPageProps {
  children: React.ReactNode;
  variant?: 'fade' | 'slide' | 'custom';
  customAnimation?: any;
  className?: string;
  pageKey?: string | number;
}

// Wrapper para animar páginas con presets globales
// Para evitar doble render visual, integra AnimatePresence en el layout/router así:
//
// import { AnimatePresence } from 'framer-motion';
// import { useLocation } from 'react-router-dom';
//
// function AppLayout() {
//   const location = useLocation();
//   return (
//     <AnimatePresence mode="wait" initial={false}>
//       <Routes location={location} key={location.pathname}>
//         {/* tus rutas aquí, cada una usando <AnimatedPage pageKey={location.pathname}> */}
//       </Routes>
//     </AnimatePresence>
//   );
// }
//
const AnimatedPage: React.FC<AnimatedPageProps> = ({
  children,
  variant = 'slide',
  customAnimation,
  className = '',
  pageKey,
}) => {
  // Mejorar presets para evitar doble aparición
  const preset =
    variant === 'fade' ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.35, ease: 'easeInOut' },
    } :
    variant === 'slide' ? {
      initial: { opacity: 0, y: 32 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -32 },
      transition: { duration: 0.38, ease: 'easeInOut' },
    } :
    customAnimation || fadeIn;

  return (
    <motion.div
      key={pageKey}
      className={className}
      initial={preset.initial}
      animate={preset.animate}
      exit={preset.exit}
      transition={preset.transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
