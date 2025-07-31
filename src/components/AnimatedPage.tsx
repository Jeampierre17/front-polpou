import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, slideInUp } from '../animations';

interface AnimatedPageProps {
  children: React.ReactNode;
  variant?: 'fade' | 'slide' | 'custom';
  customAnimation?: any;
  className?: string;
}

// Wrapper para animar páginas con presets globales
const AnimatedPage: React.FC<AnimatedPageProps> = ({
  children,
  variant = 'slide',
  customAnimation,
  className = '',
}) => {
  const preset =
    variant === 'fade' ? fadeIn :
    variant === 'slide' ? slideInUp :
    customAnimation || fadeIn;

  return (
    <motion.div
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
