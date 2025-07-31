import React, { useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { Link } from 'react-router-dom';

const Home: React.FC<{ onNavigate: (page: 'home' | 'kanban' | 'products' | 'theme') => void }> = ({ onNavigate }) => {
  const { setPageTitle } = usePageTitle();
  useEffect(() => { setPageTitle('Bienvenido'); }, [setPageTitle]);

  return (
    <div className="space-y-12 max-w-5xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-pink-100/80 via-white to-indigo-100/80 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 rounded-3xl shadow-xl p-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-pink-600 dark:text-pink-400 mb-4 tracking-tight drop-shadow font-quicksand"> Kanban & Productos</h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-6 max-w-xl mx-auto md:mx-0">Organiza tareas y productos de forma visual, rápida y moderna. ¡Explora el tablero Kanban y el catálogo de productos con la mejor experiencia!</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link to="/kanban" className="px-6 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow transition mr-2">Ir al Kanban</Link>
            <Link to="/products" className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow transition">Ver Productos</Link>
        </div>
        <div className="flex-1 flex justify-center">
          {/* Octopus SVG mascot */}
          <svg
            width="160" height="260" viewBox="0 0 500 500"
            className="mb-0"
            style={{ filter: 'drop-shadow(0 4px 24px #db2777aa)' }}
          >
            <defs>
              <linearGradient id="octoBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#db2777" />
                <stop offset="100%" stopColor="#a21caf" />
              </linearGradient>
              <radialGradient id="octoLight" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#db2777" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g className="animate-bounce-slow">
              <path className="cls-1 tentacle-move" d="M462.68,399.27c-40.14,4.55-73.21-26.21-85.29-50.17,48.4-29.24,80.71-77.69,75.98-145.88C445.44,88.94,355.63-1.94,241.1.78,126.6,3.5,42.55,98.56,38.68,213.05c-2.01,59.37,26.81,103.35,70.05,131.64-11.31,24.08-36.63,57.28-85.41,61.04-28.98,2.24-30.25,45.7-.86,61.45,27.35,13.5,52.75-2.3,73.36-23.83,19.43-20.3,45.37-62.74,54.34-77.81,9.57,3.62,19.47,6.68,29.63,9.15-12.51,54.95-28.48,71.37-54.84,82.84-28.79,12.52-12.4,53.41,21.56,57.88h0c26.16.36,48.52-21.96,61.73-48.01,12.45-24.54,15.75-52.8,18.23-85.52,11.49.81,23.05.96,34.56.41,4.25,25.79,12.49,68.07,23.54,88.36,14.27,26.19,34.72,50.62,64.87,44.76h0c32.72-5.37,39.99-49.58,9.92-60.95-23.92-9.05-40.38-46.65-51.76-78.25,9.56-2.09,18.93-4.69,28.02-7.8,10.4,12.97,43.06,55.27,65.54,72.98,23.41,18.44,47.17,34.2,72.37,17.01h0c26.91-19.69,18.02-62.4-10.86-59.13Z" fill="url(#octoBody)" />
              <path className="cls-1" d="M462.68,399.27c-40.14,4.55-73.21-26.21-85.29-50.17,48.4-29.24,80.71-77.69,75.98-145.88C445.44,88.94,355.63-1.94,241.1.78,126.6,3.5,42.55,98.56,38.68,213.05c-2.01,59.37,26.81,103.35,70.05,131.64-11.31,24.08-36.63,57.28-85.41,61.04-28.98,2.24-30.25,45.7-.86,61.45,27.35,13.5,52.75-2.3,73.36-23.83,19.43-20.3,45.37-62.74,54.34-77.81,9.57,3.62,19.47,6.68,29.63,9.15-12.51,54.95-28.48,71.37-54.84,82.84-28.79,12.52-12.4,53.41,21.56,57.88h0c26.16.36,48.52-21.96,61.73-48.01,12.45-24.54,15.75-52.8,18.23-85.52,11.49.81,23.05.96,34.56.41,4.25,25.79,12.49,68.07,23.54,88.36,14.27,26.19,34.72,50.62,64.87,44.76h0c32.72-5.37,39.99-49.58,9.92-60.95-23.92-9.05-40.38-46.65-51.76-78.25,9.56-2.09,18.93-4.69,28.02-7.8,10.4,12.97,43.06,55.27,65.54,72.98,23.41,18.44,47.17,34.2,72.37,17.01h0c26.91-19.69,18.02-62.4-10.86-59.13Z" fill="url(#octoLight)" />
              <path id="OJOS" className="cls-2 eye-blink" d="M350.63,90.99c-46.07,1.09-84.94,29.97-101,70.24-15.54-45-58.74-76.84-108.9-75.65-62.01,1.48-111.13,52.96-109.66,115.01,1.48,62.06,53.01,111.17,115.01,109.7,46.53-1.1,85.77-30.33,101.88-71.06,15.51,44.51,58.32,75.97,107.97,74.8,61.57-1.45,110.31-52.56,108.85-114.16-1.48-61.61-52.57-110.34-114.15-108.88Z" fill="#fff" />
              <g id="Pupilas">
                <path className="cls-1" d="M183.34,182.31c-6.41.24-11.76,7.13-13.56,16.44l12.05,4.94-12.68,2.92c.35,12.66,6.93,22.61,14.88,22.3,8.01-.3,14.38-10.98,14.18-23.85-.19-12.87-6.85-23.06-14.87-22.75Z" fill="#db2777" />
                <path className="cls-1" d="M303.01,181.99c-6.42.24-11.76,7.13-13.56,16.44l12.04,4.94-12.67,2.92c.35,12.66,6.93,22.61,14.88,22.3,8.01-.3,14.38-10.98,14.18-23.86-.19-12.87-6.85-23.06-14.87-22.75Z" fill="#db2777" />
              </g>
              <path id="Marco" className="cls-1" d="M352.82,102.89l-2.35.03c-25.93.62-50.07,11.29-67.97,30.06-16.35,17.15-25.68,39.16-26.71,62.6h-15.68c-1.89-52.81-46.02-95.6-98.93-95.6l-2.4.03c-54.61,1.29-98,46.78-96.72,101.39,1.26,53.32,45.69,96.73,98.98,96.73l2.4-.03c26.48-.63,51.1-11.51,69.37-30.67,15.62-16.4,24.98-37.17,26.96-59.42h16.25c4.14,49.63,46.35,89.1,96.69,89.1l2.36-.03c53.51-1.27,96.03-45.85,94.79-99.39-1.29-53.16-43.91-94.8-97.04-94.8ZM228.9,201.68c-.62,21.72-9.13,42.15-24.22,57.99-16.21,16.97-38.03,26.63-61.49,27.17l-2.14.03c-47.25,0-86.61-38.47-87.74-85.75-1.12-48.42,37.33-88.73,85.72-89.87l2.15-.03c47.11,0,86.37,38.26,87.71,85.36v5.09ZM354.82,286.05l-2.11.03c-46.31,0-84.87-37.69-85.96-84.04-.56-22.99,7.88-44.81,23.73-61.45,15.86-16.64,37.27-26.1,60.24-26.64l2.1-.02c47.09,0,84.87,36.91,86,84.03,1.11,47.45-36.58,86.97-84.01,88.09Z" fill="#db2777" />
            </g>
            <style>{`
              .animate-bounce-slow {
                animation: bounce-slow 2.5s infinite cubic-bezier(.28,.84,.42,1);
              }
              @keyframes bounce-slow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-18px); }
              }
              .tentacle-move {
                transform-origin: 250px 400px;
                animation: tentacle-wave 2.5s infinite ease-in-out;
              }
              @keyframes tentacle-wave {
                0%, 100% { transform: rotate(0deg); }
                20% { transform: rotate(-2deg); }
                50% { transform: rotate(2deg); }
                80% { transform: rotate(-2deg); }
              }
              .eye-blink {
                transform-origin: 250px 150px;
                animation: blink 3s infinite;
              }
              @keyframes blink {
                0%, 92%, 100% { transform: scaleY(1); }
                95% { transform: scaleY(0.1); }
                97% { transform: scaleY(1); }
              }
              .pupil-move {
                animation: pupil-bounce 2.5s infinite cubic-bezier(.28,.84,.42,1);
              }
              @keyframes pupil-bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(4px); }
              }
            `}</style>
          </svg>
        </div>
      </div>

     

   

   
    </div>   {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-[1.03] transition-transform">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">Tablero Kanban</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">Gestiona tus tareas de forma visual con un tablero Kanban interactivo. Arrastra y suelta tareas, edita detalles y mantén todo organizado.</p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 text-left w-full max-w-xs mx-auto">
            <li>• Drag & Drop entre columnas</li>
            <li>• Edición inline de tareas</li>
            <li>• Prioridades y fechas de vencimiento</li>
            <li>• Estadísticas en tiempo real</li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-[1.03] transition-transform">
          <div className="text-5xl mb-4">🛍️</div>
          <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Catálogo de Productos</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">Explora una colección de productos con filtros avanzados, búsqueda en tiempo real y una interfaz elegante y responsive.</p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 text-left w-full max-w-xs mx-auto">
            <li>• Filtros por categoría, precio y rating</li>
            <li>• Búsqueda en tiempo real</li>
            <li>• Grid responsive</li>
            <li>• Estados de loading y error</li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-[1.03] transition-transform">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="text-xl font-bold text-fuchsia-600 dark:text-fuchsia-400 mb-2">Tema & UX</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">Cambia entre modo claro y oscuro, disfruta de una interfaz moderna, animaciones y experiencia de usuario pulida.</p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 text-left w-full max-w-xs mx-auto">
            <li>• Modo oscuro/tema dinámico</li>
            <li>• Animaciones y microinteracciones</li>
            <li>• Accesibilidad y responsive</li>
            <li>• Manejo de errores elegante</li>
          </ul>
        </div>
      </div>
   {/* Tech Stack Modernizado */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-10 mt-12 shadow-xl">
        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center tracking-tight">Stack Tecnológico 2025</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Core */}
          <div className="text-center p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 shadow">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">Vite 5</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Build Tool</span>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-100 dark:bg-blue-900 shadow">
            <div className="text-3xl mb-2">⚛️</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">React 19</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">UI Framework</span>
          </div>
          <div className="text-center p-4 rounded-lg bg-indigo-100 dark:bg-indigo-900 shadow">
            <div className="text-3xl mb-2">📘</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">TypeScript </h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Tipado Estático</span>
          </div>
          <div className="text-center p-4 rounded-lg bg-cyan-100 dark:bg-cyan-900 shadow">
            <div className="text-3xl mb-2">🎨</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">Tailwind CSS</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Estilos & Responsive</span>
          </div>
          {/* UI/UX */}
          <div className="text-center p-4 rounded-lg bg-purple-100 dark:bg-purple-900 shadow">
            <div className="text-3xl mb-2">🧩</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">Headless UI</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Componentes Accesibles</span>
          </div>
          <div className="text-center p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900 shadow">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">Heroicons</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Iconografía</span>
          </div>
          {/* Estado y Datos */}
          <div className="text-center p-4 rounded-lg bg-pink-100 dark:bg-pink-900 shadow">
            <div className="text-3xl mb-2">🗃️</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">Zustand</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Estado Global</span>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-100 dark:bg-green-900 shadow">
            <div className="text-3xl mb-2">🔄</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">React Query</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Fetching & Caching</span>
          </div>
          <div className="text-center p-4 rounded-lg bg-orange-100 dark:bg-orange-900 shadow">
            <div className="text-3xl mb-2">🧮</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">React Window</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Virtualización</span>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-100 dark:bg-gray-700 shadow">
            <div className="text-3xl mb-2">🗺️</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">React Router</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Ruteo SPA</span>
          </div>
          {/* Utilidades y Experiencia */}
          <div className="text-center p-4 rounded-lg bg-gray-200 dark:bg-gray-800 shadow">
            <div className="text-3xl mb-2">🌙</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">Dark Mode</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Soporte Nativo</span>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-gray-900 shadow">
            <div className="text-3xl mb-2">💾</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">LocalStorage</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Persistencia Carrito</span>
          </div>
        
          <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 shadow">
            <div className="text-3xl mb-2">📱</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">Responsive Design</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Mobile First</span>
          </div>
           {/* Stack avanzado: técnicas y patrones modernos */}
          <div className="text-center p-4 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900 shadow">
            <div className="text-3xl mb-2">🪝</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">Custom Hooks</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">useProducts, useCart, useTheme, etc.</span>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-100 dark:bg-blue-900 shadow">
            <div className="text-3xl mb-2">🧠</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">Memoización inteligente</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">React.memo, useMemo, useCallback</span>
          </div>
          <div className="text-center p-4 rounded-lg bg-indigo-100 dark:bg-indigo-900 shadow">
            <div className="text-3xl mb-2">📦</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">Code Splitting</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">React.lazy & Suspense</span>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-100 dark:bg-green-900 shadow">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-base">Optimistic Updates</h4>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">UI instantánea y rollback seguro</span>
          </div>
         <div className="text-center p-3 px-0 rounded-lg bg-red-100 dark:bg-red-900 shadow">
            <div className="text-3xl mb-2">🛡️</div>
            <h5 className="font-semibold text-gray-900 dark:text-white text-base">Error boundaries - Loading states</h5>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">UX robusta y elegante</span>
          </div>
     
        </div>
      </div>

    
    </div>
  );
};

export default Home;
