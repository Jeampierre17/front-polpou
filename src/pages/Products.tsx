import React, { useState, useEffect, Suspense } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';
import { Dialog, Transition } from '@headlessui/react';
import { useSearchParams } from 'react-router-dom';
import ProductFilters from '../components/ProductFilters';
import { XMarkIcon } from '@heroicons/react/24/outline';
const VirtualizedProductGrid = React.lazy(() => import('../components/VirtualizedProductGrid'));
const VirtualizedProductList = React.lazy(() => import('../components/VirtualizedProductList'));

const Products: React.FC = () => {
  const { setPageTitle } = usePageTitle();
  useEffect(() => { setPageTitle('Catálogo de Productos'); }, [setPageTitle]);
  // Productos, filtros y loading centralizados en el hook
  const { products, isLoading, isError, filters, setFilters } = useProducts();
  const { cart, addToCart, clearCart } = useCart();
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

  // Categorías únicas (ya viene de useProducts si lo exporta, si no, mantener esto)
  const categories = Array.from(new Set((products as Product[]).map(p => p.category))).filter((c): c is string => typeof c === 'string');

  // Handler para agregar al carrito
  const handleAddToCart = (productId: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    addToCart({
      id: prod.id,
      title: prod.title,
      price: prod.price * (1 - (prod.discountPercentage || 0) / 100),
      thumbnail: prod.thumbnail ?? ''
    });
  };

  return (
    <div className="h-full">
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
          <div className="flex flex-col items-center justify-center py-24 text-center min-h-[340px]">
            <svg className="animate-spin h-14 w-14 text-pink-500 mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" strokeWidth="4" className="opacity-75" /></svg>
            <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-2 flex items-center gap-2">Cargando catálogo...</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Por favor espera, estamos trayendo los mejores productos </p>
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
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg className="animate-spin h-10 w-10 text-pink-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" strokeWidth="4" className="opacity-75" /></svg>
                  <span className="text-pink-500 font-semibold text-lg flex items-center gap-2"> Cargando lista de productos...</span>
                </div>
              }>
                <VirtualizedProductList
                  products={(products as Product[]).slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)}
                  onAddToCart={handleAddToCart}
                  height={Math.min(3, products.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE).length) * 340 + 16}
                  itemHeight={340}
                />
              </Suspense>
            </div>
            {/* Desktop: Virtualized Grid */}
            <div className="hidden md:block">
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg className="animate-spin h-10 w-10 text-pink-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" strokeWidth="4" className="opacity-75" /></svg>
                  <span className="text-pink-500 font-semibold text-lg flex items-center gap-2">✅ Cargando grilla de productos...</span>
                </div>
              }>
                <VirtualizedProductGrid
                  products={(products as Product[]).slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)}
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
        🛒
        <span className="ml-1">Carrito</span>
        {cart.length > 0 && <span className="ml-2 bg-white text-pink-600 rounded-full px-2 py-0.5 text-xs font-bold">{cart.length}</span>}
      </button>

      {/* Modal moderno y amplio del carrito */}
      <Suspense fallback={
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 text-white text-xl">
          <svg className="animate-spin h-12 w-12 text-pink-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" strokeWidth="4" className="opacity-75" /></svg>
          <span className="text-pink-200 font-semibold text-2xl flex items-center gap-2">✅ Cargando carrito...</span>
        </div>
      }>
        <Transition show={showCart} as={React.Fragment}>
          <Dialog as="div" className="fixed inset-0 z-[100] overflow-y-auto" onClose={setShowCart}>
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Fondo oscuro */}
              <Transition
                show={showCart}
                as={React.Fragment}
                enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
              </Transition>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              {/* Contenido del modal */}
              <Transition
                show={showCart}
                as={React.Fragment}
                enter="ease-out duration-300" enterFrom="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95"
              >
                <div className="inline-block align-bottom bg-white dark:bg-gray-700 rounded-3xl px-6 pt-8 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-lg md:max-w-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl md:text-4xl text-pink-600">🛒</span>
                      <Dialog.Title as="h3" className="text-2xl md:text-3xl font-bold leading-7 text-gray-900 dark:text-white">Carrito</Dialog.Title>
                    </div>
                    <button onClick={() => setShowCart(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                      <span className="text-2xl">×</span>
                    </button>
                  </div>
                  {cart.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">El carrito está vacío.</div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-5 max-h-[340px] md:max-h-[420px] overflow-y-auto pr-1">
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-3 last:border-b-0">
                            <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 dark:text-white text-base md:text-lg leading-tight line-clamp-2">{item.title}</div>
                              <div className="text-pink-600 dark:text-pink-400 font-bold text-lg md:text-xl mt-1">{item.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Total y acciones */}
                      <div className="mt-8 flex flex-col gap-4">
                        <div className="flex justify-between items-center text-lg md:text-xl font-bold border-t border-gray-200 dark:border-gray-800 pt-4">
                          <span>Total</span>
                          <span className="text-pink-600 dark:text-pink-400">{cart.reduce((acc, item) => acc + item.price, 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={clearCart}
                            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 rounded-xl px-4 py-3 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition text-base md:text-lg"
                            disabled={cart.length === 0}
                          >
                            Vaciar carrito
                          </button>
                          <button
                            onClick={() => setShowCart(false)}
                            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-4 py-3 font-bold text-base md:text-lg transition"
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Transition>
            </div>
          </Dialog>
        </Transition>
      </Suspense>
    </div>
  );
};

export default Products;