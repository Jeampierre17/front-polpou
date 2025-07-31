import ProductCard from '../../components/ProductCard';

export default {
  title: 'Components/ProductCard',
  component: ProductCard,
};

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
  images: ['https://via.placeholder.com/150'],
};

export const Default = () => (
  <ProductCard
    product={product}
    onAddToCart={(productId) => alert(`Added product ${productId} to cart`)}
  />
);

export const Hover = () => (
  <div style={{ background: '#f3f4f6', padding: 24 }}>
    <ProductCard
      product={product}
      onAddToCart={(productId) => alert(`Added product ${productId} to cart`)}
    />
  </div>
);

export const Loading = () => (
  <ProductCard
    product={{ ...product, thumbnail: '', title: 'Cargando...', price: 0 }}
    onAddToCart={(productId) => alert(`Added product ${productId} to cart`)}
  />
);
