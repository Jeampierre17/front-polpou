import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';
import { Dialog, Transition } from '@headlessui/react';
import CartModal from '../components/CartModal';
import { useSearchParams } from 'react-router-dom';
import ProductFilters from '../components/ProductFilters';
import { XMarkIcon } from '@heroicons/react/24/outline';
import SkeletonCard from '../components/SkeletonCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
const VirtualizedProductGrid = React.lazy(() => import('../components/VirtualizedProductGrid'));
const VirtualizedProductList = React.lazy(() => import('../components/VirtualizedProductList'));

const Products: React.FC = () => {
  const { setPageTitle } = usePageTitle();
  useEffect(() => { setPageTitle('Catálogo de Productos'); }, [setPageTitle]);
  // Productos, filtros y loading centralizados en el hook
  const { products, isLoading, isError, filters, setFilters } = useProducts();
  const { cart, addToCart, clearCart, incrementCartItem, decrementCartItem } = useCart();
  const [showCart, setShowCart] = useState(false);
  // Paginación
  const PRODUCTS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const [, setSearchParams] = useSearchParams();
  // Sincroniza filtros con URL (opcional)
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.category) params.category = filters.category;
    if (filters.sortBy && filters.sortBy !== 'name') params.sortBy = filters.sortBy;
    if (filters.search) params.search = filters.search;
    if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== 0) params.minPrice = String(filters.minPrice);
    if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== 1000) params.maxPrice = String(filters.maxPrice);
    if (filters.minRating !== undefined && filters.minRating !== null && filters.minRating !== 0) params.minRating = String(filters.minRating);
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line
  }, [filters]);


  // Memoizar productos paginados para mantener referencias estables
  const paginatedProducts = useMemo(() => {
    // Creamos un Map para mantener la referencia original de cada producto por id
    const productMap = new Map<number, Product>();
    (products as Product[]).forEach(p => productMap.set(p.id, p));
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = currentPage * PRODUCTS_PER_PAGE;
    return (products as Product[]).slice(start, end).map(p => productMap.get(p.id)!);
  }, [products, currentPage]);

  // Categorías únicas (ya viene de useProducts si lo exporta, si no, mantener esto)
  const categories = useMemo(() => Array.from(new Set((products as Product[]).map(p => p.category))).filter((c): c is string => typeof c === 'string'), [products]);

  // Handler para agregar al carrito (memorizado para evitar rerender innecesario de ProductCard)
  const handleAddToCart = useCallback((productId: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) {
      toast.error('No se encontró el producto.');
      return;
    }
    addToCart({
      id: prod.id,
      title: prod.title,
      price: prod.price * (1 - (prod.discountPercentage || 0) / 100),
      thumbnail: prod.thumbnail ?? ''
    });
    toast.success(`Agregado al carrito: ${prod.title}`);
  }, [products, addToCart]);

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <motion.div
        className="h-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
      {/* Header */}
      {/* Header eliminado, el título ahora va en el navbar */}

      {/* Filtros en mobile (siempre visibles debajo del header) */}
      <div className="block md:hidden w-full mb-1 ">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col gap-4 px-4 py-3 border border-gray-100 dark:border-gray-700">
      <ProductFilters
        filters={filters}
        categories={categories}
        onFiltersChange={setFilters}
      />
          {/* Botón limpiar filtros */}
          {(filters.category || filters.search || filters.sortBy !== 'name') && (
            <button
              onClick={() => setFilters({ category: '', sortBy: 'name', search: '' })}
              className="flex items-center gap-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm self-end"
            >
              <XMarkIcon className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Filtros horizontales en desktop */}
      <div className="hidden md:block w-full mb-2 mt-2" >
      <ProductFilters
        filters={filters}
        categories={categories}
        onFiltersChange={setFilters}
      />
      </div>

      {/* Products Grid */}
      <main className="flex-1 px-0 md:px-2 xl:px-0 max-w-full md:max-w-3xl xl:max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center min-h-[340px]">
            <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2 flex items-center gap-2">Cargando catálogo...</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Por favor espera, estamos trayendo los mejores productos</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8 w-full max-w-7xl">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 text-center min-h-[340px]">
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-5 text-red-400 dark:text-red-500 animate-bounce">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
            </svg>
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">¡Ups! Hubo un error</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">No pudimos cargar los productos.<br />Intenta recargar la página o revisa tu conexión.</p>
            <button onClick={() => window.location.reload()} className="mt-2 px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow transition">Reintentar</button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center min-h-[340px]">
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-5 text-gray-300 dark:text-gray-600">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 9.5h.01M14.5 9.5h.01M9 15c1.5-1 4.5-1 6 0" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">Sin resultados</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filters.search
                ? <>No hay productos que coincidan con <span className="font-semibold text-pink-600 dark:text-pink-400">"{filters.search}"</span></>
                : 'No hay productos que coincidan con los filtros seleccionados'}
            </p>
            <button onClick={() => setFilters({ category: '', sortBy: 'name', search: '' })} className="mt-2 px-5 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 font-semibold shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition">Limpiar filtros</button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-0">
              <p className="text-gray-600 dark:text-gray-400">
                {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            {/* Mobile: Virtualized List */}
            <div className="block md:hidden">
              <Suspense fallback={
                           <LoadingSpinner className="mb-6 w-16 h-16 text-pink-500" />

              }>
                <VirtualizedProductList
                  products={paginatedProducts}
                  onAddToCart={handleAddToCart}
                  height={Math.min(3, paginatedProducts.length) * 340 + 16}
                  itemHeight={340}
                />
              </Suspense>
            </div>
            {/* Desktop: Virtualized Grid */}
            <div className="hidden md:block">
              <Suspense fallback={
                <LoadingSpinner className="mb-6 w-16 h-16 text-pink-500" />
              }>
                <VirtualizedProductGrid
                  products={paginatedProducts}
                  onAddToCart={handleAddToCart}
                />
              </Suspense>
            </div>
            {/* Paginador al final de la lista, centrado, no flotante */}
            {totalPages > 1 && (
              <div className="flex justify-center w-full mt-6 mb-0">
                <nav className="flex items-center gap-1 select-none bg-white/95 dark:bg-gray-900/95 rounded-full shadow px-3 py-2 border border-gray-100 dark:border-gray-800" aria-label="Paginación">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Anterior"
                  >
                    <span aria-hidden="true">‹</span>
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    if (
                      i === 0 ||
                      i === totalPages - 1 ||
                      Math.abs(i + 1 - currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={i}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition
                            ${currentPage === i + 1
                              ? 'bg-pink-600 text-white shadow'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                          onClick={() => setCurrentPage(i + 1)}
                          aria-current={currentPage === i + 1 ? 'page' : undefined}
                        >
                          {i + 1}
                        </button>
                      );
                    }
                    if (
                      (i === 1 && currentPage > 3) ||
                      (i === totalPages - 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={i} className="w-8 h-8 flex items-center justify-center text-gray-400">…</span>
                      );
                    }
                    return null;
                  })}
                  <button
                    className="w-8 h-4 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-40"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Siguiente"
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
      {/* Botón flotante para ver carrito */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 z-50 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg flex items-center gap-2 px-5 py-3 font-semibold text-base md:text-lg transition-all"
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)' }}
      >
         <ShoppingCartIcon className="w-6 h-6" />
        <span className="ml-1">Carrito</span>
        {cart.length > 0 && <span className="ml-2 bg-white text-pink-600 rounded-full px-2 py-0.5 text-xs font-bold">{cart.length}</span>}
      </button>

      <CartModal show={showCart} onClose={() => setShowCart(false)} />
      </motion.div>
    </>
  );
};

export default Products;