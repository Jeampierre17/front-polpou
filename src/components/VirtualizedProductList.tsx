import React from 'react';
import { FixedSizeList } from 'react-window';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface VirtualizedProductListProps {
  products: Product[];
  onAddToCart: (id: number) => void;
  height?: number;
}

const VirtualizedProductList: React.FC<VirtualizedProductListProps> = ({ products, onAddToCart, height = 1020 }) => {
  // height: visible area height, itemHeight: height of each product row
  const Row = React.useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const product = products[index];
    const isLast = index === products.length - 1;
    // El wrapper tiene height 500px y padding-bottom 16px (excepto la última)
    return (
      <div
        style={{
          ...style,
          height: 500,
          paddingBottom: isLast ? 0 : 16,
          boxSizing: 'border-box',
        }}
      >
        <ProductCard
          product={product}
          onAddToCart={() => onAddToCart(product.id)}
        />
      </div>
    );
  }, [products, onAddToCart]);

  // Altura total visible: máximo entre height prop y cantidad de productos * (itemHeight + gap)
  const gap = 16;
  const realItemHeight = 500 + gap;
  const totalHeight = Math.min(height, products.length * realItemHeight);
  return (
    <div
      style={{ width: '100%', boxSizing: 'border-box' }}
      className="sm:px-4 sm:pb-4 md:px-8 md:pb-8 w-full"
    >
      <FixedSizeList
        height={totalHeight}
        itemCount={products.length}
        itemSize={realItemHeight}
        width={"100%"}
      >
        {Row}
      </FixedSizeList>
    </div>
  );
};

export default VirtualizedProductList;
