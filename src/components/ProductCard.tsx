import React, { useState, useRef, memo, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}


const ProductCard: React.FC<ProductCardProps> = function ProductCard({ product, onAddToCart }) {
  // Usar useRef para que el estado de la imagen no se reinicie en rerenders
  const imageLoading = useRef(true);
  const imageError = useRef(false);
  const showSkeleton = useRef(true);
  const [, forceUpdate] = useState(0); // Para forzar rerender local

  // Reset refs si cambia el producto.id
  useEffect(() => {
    imageLoading.current = true;
    imageError.current = false;
    showSkeleton.current = true;
    forceUpdate(n => n + 1);
  }, [product.id]);

  const formatPrice = React.useCallback((price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }, []);

  const renderStars = React.useCallback((rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key="half" className="text-yellow-300">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300 dark:text-gray-600">★</span>);
      }
    }
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-sm text-text-secondary ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  }, []);

  return (
    <article
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 dark:border-gray-800 group
        hover:bg-gray-50 dark:hover:bg-gray-800/80 dark:hover:border-pink-600
        p-3 md:p-4 xl:p-5 min-h-[420px] min-w-0 h-full w-full box-border flex flex-col"
    >
      {/* Imagen ocupa 60% */}
      <div className="relative flex-[0_0_45%] md:flex-[0_0_50%] min-h-[0] flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        {/* ...imagen y overlays igual... */}
        {imageLoading.current && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-20 h-20" />
          </div>
        )}
        {!imageError.current && (
          <img
            src={product.thumbnail}
            alt={product.title}
            className={`w-full h-full max-h-full max-w-full object-contain transition-all duration-500 ${imageLoading.current ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} group-hover:scale-105`}
            loading="lazy"
            onLoad={() => {
              imageLoading.current = false;
              setTimeout(() => {
                showSkeleton.current = false;
                forceUpdate(n => n + 1);
              }, 180);
              forceUpdate(n => n + 1);
            }}
            onError={() => {
              imageLoading.current = false;
              showSkeleton.current = false;
              imageError.current = true;
              forceUpdate(n => n + 1);
            }}
            draggable={false}
          />
        )}
        {showSkeleton.current && !imageError.current && (
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300" style={{ opacity: imageLoading.current ? 1 : 0 }}>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-20 h-20" />
          </div>
        )}
        {imageError.current && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
            <span>Imagen no disponible</span>
          </div>
        )}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-pink-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
            -{product.discountPercentage.toFixed(0)}%
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2 py-1 rounded shadow-sm">
            {product.category}
          </span>
        </div>
        {product.stock !== undefined && product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wide">Sin stock</span>
          </div>
        )}
      </div>

      {/* Detalles y botón ocupan el resto */}
      <div className="flex flex-col flex-1 justify-between gap-2 pt-2">
        <div>
          <h3 className="font-semibold font-quicksand text-gray-900 dark:text-white text-base md:text-[1.05rem] xl:text-lg mb-1 line-clamp-1 truncate transition-colors">
            {product.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="grid grid-cols-2 items-center gap-2 md:flex md:flex-row md:items-center md:justify-between md:gap-0">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            {product.discountPercentage > 0 ? (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base md:text-lg text-pink-600 dark:text-pink-300 font-semibold font-quicksand">
                    {formatPrice(product.price * (1 - product.discountPercentage / 100))}
                  </span>
                </div>
                <span className="text-xs text-red-400 line-through font-normal">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
            )}
          </div>
          <div className="mt-1 md:mt-0 flex justify-start md:justify-end min-w-[90px]">
            {renderStars(product.rating)}
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] md:text-xs text-gray-500 dark:text-gray-400">
          {product.brand && <span>Marca: <span className="font-medium text-gray-700 dark:text-gray-200">{product.brand}</span></span>}
          {product.stock !== undefined && <span>Stock: <span className="font-medium text-gray-700 dark:text-gray-200">{product.stock}</span></span>}
        </div>
        <button
          onClick={() => onAddToCart(product.id)}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-purple-700 hover:bg-purple-800 active:bg-purple-800 text-white font-semibold py-2 md:py-2 mt-2 shadow-md transition disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
          disabled={product.stock === 0}
        >
          <ShoppingCartIcon className="w-5 h-5" />
          {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
};

// Solo rerender si cambia el producto o el id de la función onAddToCart
function areEqual(prev: ProductCardProps, next: ProductCardProps) {
  return (
    prev.product.id === next.product.id &&
    prev.product.stock === next.product.stock &&
    prev.product.price === next.product.price &&
    prev.product.discountPercentage === next.product.discountPercentage &&
    prev.product.rating === next.product.rating &&
    prev.onAddToCart === next.onAddToCart
  );
}

export default memo(ProductCard, areEqual);
