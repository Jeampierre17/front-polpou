import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { HomeIcon, ViewColumnsIcon, ShoppingBagIcon, SwatchIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigationItems = [
  { path: '/', label: 'Inicio', icon: HomeIcon },
  { path: '/kanban', label: 'Kanban', icon: ViewColumnsIcon },
  { path: '/products', label: 'Productos', icon: ShoppingBagIcon },
];

import { usePageTitle } from '../hooks/usePageTitle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pageTitle } = usePageTitle();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
           
                  {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>

            {/* Logo + Title */}
            <div className="flex items-center gap-1 md:gap-2">
              <img src="/vertical.svg" alt="Logo" className="h-10 ml-1 mt-3" />
              {pageTitle && (
                <>
                  <span className="hidden md:inline-block text-2xl font-bold text-pink-600 select-none border-l border-gray-200 dark:border-gray-700 pl-2 ml-1 font-quicksand font-semibold">{pageTitle}</span>
                  <span className="md:hidden text-lg font-bold text-pink-600 select-none border-l border-gray-200 dark:border-gray-700 pl-3 ml-1 font-quicksand">{pageTitle.split(' ')[0]}</span>
                </>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-purple-100 dark:bg-pink-700 text-pink-700 dark:text-pink-200'
                        : 'text-light-700 dark:text-light-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

     

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-purple-100 dark:bg-pink-700 text-pink-700 dark:text-pink-200'
                        : 'text-light-700 dark:text-light-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl px-6 sm:px-2 lg:px-8  lg:mx-auto py-4 flex-1 relative overflow-x-clip">
        <AnimatePresence mode="wait" initial={false}>
          <AnimatedPage key={location.pathname} className="h-full w-full">
            {children}
          </AnimatedPage>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Desarrollado con ❤️ por Jeampierre Gonzalez
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;