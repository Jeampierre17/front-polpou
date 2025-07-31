import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ProductCard from '../components/ProductCard';

const product = {
  id: 1,
  title: 'Test Product',
  description: 'A test product',
  price: 100,
  discountPercentage: 10,
  thumbnail: '',
  rating: 4.5,
  category: 'Test',
  stock: 10,
  brand: 'Test Brand',
  images: [''],
};

describe('ProductCard', () => {
  it('renders product title and price', () => {
    render(<ProductCard product={product} onAddToCart={() => {}} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/90/)).toBeInTheDocument(); // discounted price
  });

  it('calls addToCart when button is clicked', () => {
    const addToCart = vi.fn();
    render(<ProductCard product={product} onAddToCart={addToCart} />);
    fireEvent.click(screen.getByRole('button', { name: /Agregar al carrito/i }));
    expect(addToCart).toHaveBeenCalledWith(product.id);
  });
});
