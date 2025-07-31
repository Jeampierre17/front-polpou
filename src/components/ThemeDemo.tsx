import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { 
  SunIcon, 
  MoonIcon,
  SwatchIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const ThemeDemo: React.FC = () => {
  const { theme, isDark } = useTheme();

  const demoCards = [
    {
      title: 'Colores Principales',
      items: [
        { name: 'Primary', color: theme.colors.primary, textColor: 'white' },
        { name: 'Secondary', color: theme.colors.secondary, textColor: 'white' },
        { name: 'Background', color: theme.colors.background, textColor: theme.colors.text },
        { name: 'Surface', color: theme.colors.surface, textColor: theme.colors.text },
      ]
    },
    {
      title: 'Colores de Texto',
      items: [
        { name: 'Text Primary', color: theme.colors.text, textColor: theme.colors.background },
        { name: 'Text Secondary', color: theme.colors.textSecondary, textColor: theme.colors.background },
        { name: 'Border', color: theme.colors.border, textColor: theme.colors.text },
      ]
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <SwatchIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manual de Estilo
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Tema actual: <span className="font-semibold capitalize">{theme.name}</span>
          {isDark ? <MoonIcon className="w-5 h-5 inline ml-2" /> : <SunIcon className="w-5 h-5 inline ml-2" />}
        </p>
      </div>

    <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Fuentes</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          La fuente principal de la aplicación es <span className="font-semibold">Poppins</span>.
        </p>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-4">
          <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '1.25rem' }}>
            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Ejemplo de la fuente Poppins (400)</p>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.25rem' }} className="mt-4">
            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0123456789
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Ejemplo de la fuente Poppins (700)</p>
        </div>
     
      </div>
 
      {/* Color Palette */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {demoCards.map((section) => (
          <div 
            key={section.title}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div 
                  key={item.name}
                  className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div 
                    className="w-12 h-12 rounded-lg shadow-md border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {item.color}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Elements Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Elementos Interactivos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Button Primary */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Botón Primary
          </button>

          {/* Button Secondary */}
          <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors">
            Botón Secondary
          </button>

          {/* Success Button */}
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            Éxito
          </button>

          {/* Warning Button */}
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4" />
            Alerta
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {/* Input Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Campo de entrada
            </label>
            <input
              type="text"
              placeholder="Escribe algo aquí..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Alerts */}
          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-200">
                ¡Operación completada exitosamente!
              </span>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-yellow-800 dark:text-yellow-200">
                Atención: Revisa la información antes de continuar.
              </span>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
              <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-800 dark:text-red-200">
                Error: No se pudo completar la operación.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Features */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Características del Sistema de Temas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">Persistencia en localStorage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">Detección automática del sistema</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">Transiciones suaves</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">Accesibilidad completa</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">Animaciones fluidas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">TypeScript completo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
