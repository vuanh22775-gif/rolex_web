import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/axios';
import type { Category, Customer, Order, Product, Theme, ToastMessage } from '../types';

interface AdminState {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  statistics: { products: number; users: number; orders: number; revenue: number; lowStock: number; chart: { label: string; revenue: number; orders: number }[]; statuses: Record<string, number> };
  loading: boolean;
  loadError: string;
  adminUser: { username: string; fullName: string } | null;
  theme: Theme;
  sidebarCollapsed: boolean;
  toasts: ToastMessage[];
  loadAdminData: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (product: Product) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<Order>;
  loadStatistics: (days: number) => Promise<void>;
  setAdminUser: (user: { username: string; fullName: string } | null) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  notify: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export const useAdminStore = create<AdminState>()(persist((set, get) => ({
  products: [],
  categories: [],
  orders: [],
  customers: [],
  statistics: { products: 0, users: 0, orders: 0, revenue: 0, lowStock: 0, chart: [], statuses: {} },
  loading: false,
  loadError: '',
  adminUser: null,
  theme: 'light',
  sidebarCollapsed: false,
  toasts: [],
  loadAdminData: async () => {
    set({ loading: true, loadError: '' });
    try {
      const [products, categories, orders, customers, statistics] = await Promise.all([
        api.get('/admin/products'), api.get('/admin/categories'), api.get('/orders'), api.get('/admin/customers'), api.get('/admin/statistics'),
      ]);
      set({ products: products.data.data, categories: categories.data.data, orders: orders.data.data, customers: customers.data.data, statistics: statistics.data.data });
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 'Không thể tải dữ liệu từ máy chủ.';
      set({ loadError: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  loadStatistics: async (days) => {
    const response = await api.get(`/admin/statistics?days=${days}`);
    set({ statistics: response.data.data });
  },
  setAdminUser: (adminUser) => set({ adminUser }),
  addProduct: async (product) => {
    const response = await api.post('/products', { ...product, model: product.model || product.name });
    const saved = response.data.data as Product;
    set((state) => ({ products: [saved, ...state.products] }));
    return saved;
  },
  updateProduct: async (product) => {
    const response = await api.put(`/products/${encodeURIComponent(product.id)}`, { ...product, model: product.model || product.name });
    const saved = response.data.data as Product;
    set((state) => ({ products: state.products.map((item) => item.id === product.id ? saved : item) }));
    return saved;
  },
  deleteProduct: async (id) => {
    await api.delete(`/products/${encodeURIComponent(id)}`);
    set((state) => ({ products: state.products.filter((item) => item.id !== id) }));
  },
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${encodeURIComponent(id)}/status`, { status });
    const saved = response.data.data as Order;
    set((state) => ({ orders: state.orders.map((order) => order.id === id ? saved : order) }));
    return saved;
  },
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  notify: (toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    window.setTimeout(() => get().dismissToast(id), 3600);
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}), {
  name: 'atelier-admin-state',
  partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }),
  merge: (persistedState, currentState) => {
    const persisted = persistedState as Partial<AdminState>;
    return { ...currentState, theme: persisted.theme || currentState.theme, sidebarCollapsed: persisted.sidebarCollapsed ?? currentState.sidebarCollapsed };
  },
}));