import { useState, useEffect, createContext, useContext } from 'react';
import type { Theme } from '../types';

const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#dd3bf6ff',
    secondary: '#06b6d4',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
  },
};

const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#60a5fa',
    secondary: '#22d3ee',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) {
        return saved === 'dark';
      }
      // Si no hay preferencia guardada, usar la del sistema
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  useEffect(() => {
    // Guardar preferencia
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Aplicar clase al documento para Tailwind con transición suave
    const root = document.documentElement;
    
    // Añadir transición suave
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Limpiar transición después de aplicar el cambio
    const timer = setTimeout(() => {
      root.style.transition = '';
    }, 300);

    return () => clearTimeout(timer);
  }, [isDark]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Solo cambiar si no hay preferencia guardada
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    theme,
    toggleTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
