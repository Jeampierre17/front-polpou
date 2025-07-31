import { useEffect, useMemo, useCallback } from 'react';
// Asegúrate que el nombre coincida con el export real de useProductStore
import { useProductStore } from './useProductStore';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../services/productService';

// Hook reutilizable para productos (fetch + estado global + filtrado + ordenamiento)
export function useProducts() {
  const { products, setProducts, filters, setFilters } = useProductStore();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data) {
      setProducts(data.products);
    }
  }, [data, setProducts]);

  // Filtrado y ordenamiento centralizados
  const filteredProducts = useMemo(() => {
    let result = [...(data?.products || products)];
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(product =>
        (product.title ?? '').toLowerCase().includes(searchLower) ||
        (product.description ?? '').toLowerCase().includes(searchLower) ||
        (product.brand ?? '').toLowerCase().includes(searchLower)
      );
    }
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }
    if (typeof filters.minPrice === 'number') {
      result = result.filter(product => product.price >= filters.minPrice!);
    }
    if (typeof filters.maxPrice === 'number') {
      result = result.filter(product => product.price <= filters.maxPrice!);
    }
    if (typeof filters.minRating === 'number' && filters.minRating > 0) {
      result = result.filter(product => typeof product.rating === 'number' && product.rating >= filters.minRating!);
    }
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return result;
  }, [data, products, filters]);

  // Memoizar categorías únicas
  const categories = useMemo(() => {
    // Ensure we always have an array of products
    const allProductsArray =
      Array.isArray(data)
        ? data
        : data && Array.isArray(data.products)
        ? data.products
        : Array.isArray(products)
        ? products
        : [];
    return Array.from(
      new Set(
        allProductsArray
          .map((p: { category?: string }) => p.category)
          .filter((category): category is string => typeof category === 'string')
      )
    );
  }, [data, products]);

  // Memoizar handler para setFilters
  const setFiltersMemo = useCallback((f: Parameters<typeof setFilters>[0]) => setFilters(f), [setFilters]);

  return {
    products: filteredProducts,
    isLoading,
    isError,
    refetch,
    filters,
    setFilters: setFiltersMemo,
    categories,
    allProducts: data || products, // por si necesitas todos sin filtrar
  };
}