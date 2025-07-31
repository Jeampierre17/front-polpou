// Interfaces principales del proyecto

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
}

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

export interface FilterOptions {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  rating?: number;
  tags?: string[];
  search?: string;
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'rating' | '';
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
  color: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Tipos para filtros del catálogo
export interface ProductFilters {
  category: string;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'name';
  search: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

// Tipos para el carrito (callback del ProductCard)
export interface CartItem {
  productId: number;
  quantity: number;
} 
