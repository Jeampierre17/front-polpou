

// zustand: store global para carrito, filtros y kanban
import { create } from 'zustand';

// tipos para productos y carrito
interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface ProductFilters {
  category: string;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'rating';
  search: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

// tipos para kanban
export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
}

interface KanbanFilters {
  status: string;
  priority: string;
}

// estado global (storestate): aquí se definen todos los estados y acciones globales de la app
// Definir tipo Product (puedes moverlo a types/index.ts si ya existe)
export interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
  thumbnail?: string;
  rating?: number;
  [key: string]: any;
}

interface StoreState {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  setCart: (cart: CartItem[]) => void;
  incrementCartItem: (id: number) => void;
  decrementCartItem: (id: number) => void;

  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;

  // Kanban
  kanbanTasks: KanbanTask[];
  setKanbanTasks: (tasks: KanbanTask[]) => void;
  addKanbanTask: (task: Omit<KanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateKanbanTask: (id: string, updates: Partial<KanbanTask>) => void;
  deleteKanbanTask: (id: string) => void;
  moveKanbanTask: (taskId: string, newStatus: KanbanTask['status']) => void;
  kanbanFilters: KanbanFilters;
  setKanbanFilters: (filters: KanbanFilters) => void;

  // Productos globales y acciones
  products: Product[];
  setProducts: (products: Product[]) => void;
}

// implementación del store global: todo el estado y lógica global vive aquí
export const useStore = create<StoreState>((set, get) => ({
  // estado y acciones para kanban
  // lista de tareas kanban (persistente en localstorage)
  kanbanTasks: (() => {
    const stored = localStorage.getItem('kanban-tasks');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((t: any) => ({
          ...t,
          createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
          updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
        }));
      } catch {
        return [];
      }
    }
    return [];
  })(),
  // reemplaza todas las tareas kanban
  setKanbanTasks: (tasks) => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
    set({ kanbanTasks: tasks });
  },
  // agrega una nueva tarea kanban
  addKanbanTask: (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [...get().kanbanTasks, newTask];
    localStorage.setItem('kanban-tasks', JSON.stringify(updated));
    set({ kanbanTasks: updated });
  },
  // actualiza una tarea kanban por id
  updateKanbanTask: (id, updates) => {
    const updated = get().kanbanTasks.map(task =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    );
    localStorage.setItem('kanban-tasks', JSON.stringify(updated));
    set({ kanbanTasks: updated });
  },
  // elimina una tarea kanban por id
  deleteKanbanTask: (id) => {
    const updated = get().kanbanTasks.filter(task => task.id !== id);
    localStorage.setItem('kanban-tasks', JSON.stringify(updated));
    set({ kanbanTasks: updated });
  },
  // cambia el status de una tarea kanban (drag & drop)
  moveKanbanTask: (taskId, newStatus) => {
    const tasks = get().kanbanTasks;
    const taskToMove = tasks.find(t => t.id === taskId);
    if (!taskToMove) return;
    const filtered = tasks.filter(t => t.id !== taskId);
    const updatedTask = { ...taskToMove, status: newStatus, updatedAt: new Date() };
    const newTasks = [updatedTask, ...filtered];
    localStorage.setItem('kanban-tasks', JSON.stringify(newTasks));
    set({ kanbanTasks: newTasks });
  },

  // Optimistic update para mover tarea Kanban con rollback si localStorage falla
  moveKanbanTaskOptimistic: (
    taskId: string,
    newStatus: KanbanTask['status'],
    onError?: (e: unknown) => void
  ) => {
    const prevTasks = get().kanbanTasks;
    const taskToMove = prevTasks.find(t => t.id === taskId);
    if (!taskToMove) return;
    const filtered = prevTasks.filter(t => t.id !== taskId);
    const updatedTask = { ...taskToMove, status: newStatus, updatedAt: new Date() };
    const newTasks = [updatedTask, ...filtered];
    set({ kanbanTasks: newTasks }); // Optimistic UI
    try {
      localStorage.setItem('kanban-tasks', JSON.stringify(newTasks));
    } catch (e) {
      set({ kanbanTasks: prevTasks }); // Rollback
      if (onError) onError(e);
    }
  },
  // filtros globales para kanban
  kanbanFilters: { status: 'all', priority: 'all' },
  setKanbanFilters: (filters) => set({ kanbanFilters: filters }),
  // estado y acciones para carrito y filtros de productos
  cart: [],
  addToCart: (item) => set((state) => {
    // Si ya existe, aumenta la cantidad
    const existing = state.cart.find(i => i.id === item.id);
    let newCart;
    if (existing) {
      newCart = state.cart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newCart = [...state.cart, { ...item, quantity: 1 }];
    }
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  incrementCartItem: (id) => set((state) => {
    const newCart = state.cart.map(i =>
      i.id === id ? { ...i, quantity: i.quantity + 1 } : i
    );
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  decrementCartItem: (id) => set((state) => {
    let newCart = state.cart.map(i =>
      i.id === id ? { ...i, quantity: i.quantity - 1 } : i
    ).filter(i => i.quantity > 0);
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  removeFromCart: (id) => set((state) => {
    // elimina un producto del carrito
    const newCart = state.cart.filter((i) => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(newCart));
    return { cart: newCart };
  }),
  clearCart: () => set(() => {
    // vacía el carrito
    localStorage.setItem('cart', '[]');
    return { cart: [] };
  }),
  setCart: (cart) => set(() => {
    // reemplaza el carrito completo
    localStorage.setItem('cart', JSON.stringify(cart));
    return { cart };
  }),

  // productos globales y acciones
  products: [],
  setProducts: (products) => set(() => ({ products })),
  // filtros globales para productos
  filters: {
    category: '',
    sortBy: 'name',
    search: '',
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
  },
  setFilters: (filters) => set(() => ({ filters })),
}));
