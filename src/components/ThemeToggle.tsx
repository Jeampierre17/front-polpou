import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-16 h-8 
        bg-gray-200 dark:bg-gray-700 
        rounded-full 
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        hover:bg-gray-300 dark:hover:bg-gray-600
        group
      "
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {/* Slider */}
      <div 
        className={`
          absolute top-1 left-1 w-6 h-6
          bg-white dark:bg-gray-200
          rounded-full shadow-md
          transform transition-transform duration-300 ease-in-out
          flex items-center justify-center
          ${isDark ? 'translate-x-8' : 'translate-x-0'}
        `}
      >
        {/* Icons */}
        <SunIcon 
          className={`
            w-4 h-4 text-yellow-500 absolute
            transition-all duration-300 ease-in-out
            ${isDark ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100 rotate-0'}
          `} 
        />
        <MoonIcon 
          className={`
            w-4 h-4 text-blue-600 absolute
            transition-all duration-300 ease-in-out
            ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-180'}
          `} 
        />
      </div>

      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <SunIcon 
          className={`
            w-4 h-4 transition-opacity duration-300
            ${isDark ? 'text-gray-400 opacity-50' : 'text-yellow-400 opacity-80'}
          `} 
        />
        <MoonIcon 
          className={`
            w-4 h-4 transition-opacity duration-300
            ${isDark ? 'text-blue-400 opacity-80' : 'text-gray-400 opacity-50'}
          `} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
