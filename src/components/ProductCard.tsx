import React, { useState,  memo, useEffect } from 'react';
import { PlusCircleIcon} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import type { Product } from '../types';
import { motion } from 'framer-motion';

import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}


const ProductCard: React.FC<ProductCardProps> = function ProductCard({ product, onAddToCart }) {
  const { cart, addToCart, removeFromCart, incrementCartItem, decrementCartItem } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const inCart = !!cartItem;
  // Estado local para la imagen, solo depende de la imagen
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Reset solo si cambia la imagen
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
    setShowSkeleton(true);
  }, [product.thumbnail]);

  const formatPrice = React.useCallback((price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }, []);

  const renderStars = React.useCallback((rating: number) => {
    let stars = [];
    // Si el rating es 5 o más, mostrar 5 estrellas doradas
    if (rating >= 5) {
      stars = Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="text-yellow-400">★</span>
      ));
      return (
        <div className="flex items-center gap-1">
          {stars}
          <span className="text-sm text-text-secondary ml-1">(5.0)</span>
        </div>
      );
    }
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={"half"} className="text-yellow-300">★</span>);
      } else {
        stars.push(<span key={i + 10} className="text-gray-300 dark:text-gray-600">★</span>);
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
    <motion.article
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 dark:border-gray-800 group
        hover:bg-gray-50 dark:hover:bg-gray-800/80 dark:hover:border-pink-600
        p-4 min-h-[420px] min-w-0 h-full w-full box-border flex flex-col"
      style={{ width: '100%', borderRadius: '1rem' }}
      whileHover={{
        scale: 1.035,
        boxShadow: '0 8px 32px 0 rgba(80, 40, 180, 0.10), 0 2px 8px 0 rgba(0,0,0,0.08)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {/* Imagen ocupa 60% */}
      <div className="relative flex-[0_0_45%] md:flex-[0_0_50%] min-h-[0] flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        {/* ...imagen y overlays igual... */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-20 h-20" />
          </div>
        )}
        {!imageError && (
          <img
            src={product.thumbnail}
            alt={product.title}
            className={`w-full h-full max-h-full max-w-full object-contain transition-all duration-500 ${imageLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} group-hover:scale-105`}
            loading="lazy"
            onLoad={() => {
              setImageLoading(false);
              setTimeout(() => setShowSkeleton(false), 180);
            }}
            onError={() => {
              setImageLoading(false);
              setShowSkeleton(false);
              setImageError(true);
            }}
            draggable={false}
          />
        )}
        {showSkeleton && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300" style={{ opacity: imageLoading ? 1 : 0 }}>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-20 h-20" />
          </div>
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
            <span>Imagen no disponible</span>
          </div>
        )}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 right-3 font-quicksand bg-pink-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
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
                  <span className="text-lg md:text-lg text-pink-600 dark:text-pink-300 font-bold font-quicksand">
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
          <div className="mt-1 md:mt-0 flex justify-start md:justify-end min-w-[90px] font-quicksand">
            {renderStars(product.rating)}
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] md:text-xs text-gray-500 dark:text-gray-400">
          {product.brand && <span>Marca: <span className="font-medium text-gray-700 dark:text-gray-200">{product.brand}</span></span>}
          {product.stock !== undefined && <span>Stock: <span className="font-medium text-gray-700 dark:text-gray-200">{product.stock}</span></span>}
        </div>

        {inCart ? (
          <div className="flex items-center justify-center gap-2 mt-2">
            <motion.button
              onClick={() => {
                if (cartItem && cartItem.quantity === 1) {
                  removeFromCart(product.id);
                } else {
                  decrementCartItem(product.id);
                }
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              whileTap={{ scale: 0.92 }}
              aria-label="Quitar uno"
              disabled={!cartItem || cartItem.quantity === 0}
            >
              -
            </motion.button>
            <span className="px-2 font-semibold text-gray-900 dark:text-white select-none">{cartItem?.quantity ?? 1}</span>
            <motion.button
              onClick={() => incrementCartItem(product.id)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-700 text-white font-bold text-lg shadow hover:bg-purple-800 transition"
              whileTap={{ scale: 0.92 }}
              aria-label="Agregar uno más"
              disabled={product.stock !== undefined && cartItem && cartItem.quantity >= product.stock}
            >
              +
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={() => {
              if (typeof onAddToCart === 'function') {
                onAddToCart(product.id);
              } else {
                addToCart({
                  id: product.id,
                  title: product.title,
                  price: product.price * (1 - (product.discountPercentage || 0) / 100),
                  thumbnail: product.thumbnail ?? ''
                });
              }
              toast.success(`Agregado al carrito: ${product.title}`);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-purple-700 hover:bg-purple-800 active:bg-purple-800 text-white font-semibold py-2 md:py-2 mt-2 shadow-md transition disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
            disabled={product.stock === 0}
            whileHover={{ scale: 1.04, boxShadow: '0 4px 16px 0  rgba(80, 40, 180, 0.10), 0 2px 8px 0 rgba(0,0,0,0.08' }}
            whileTap={{ scale: 0.96, backgroundColor: '#a21caf' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <PlusCircleIcon className="w-5 h-5" />
            {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </motion.button>
        )}
      </div>
    </motion.article>
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
