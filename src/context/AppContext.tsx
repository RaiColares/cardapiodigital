import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, Product, CartItem, Order, StoreSettings, OrderStatus } from '../types';
import { initialCategories, initialProducts, initialSettings, initialOrders } from '../data/initialData';

interface AppState {
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  settings: StoreSettings;
  isLoggedIn: boolean;
  currentView: string;
  selectedCategory: string | null;
  selectedProduct: Product | null;
  currentOrder: Order | null;
  isAdmin: boolean;
}

interface AppContextType extends AppState {
  setCategories: (c: Category[]) => void;
  setProducts: (p: Product[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateCartItem: (index: number, item: CartItem) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  setSettings: (s: StoreSettings) => void;
  setView: (view: string) => void;
  setSelectedCategory: (id: string | null) => void;
  setSelectedProduct: (p: Product | null) => void;
  setCurrentOrder: (o: Order | null) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(() => loadFromStorage('categories', initialCategories));
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('products', initialProducts));
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('cart', []));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('orders', initialOrders));
  const [settings, setSettings] = useState<StoreSettings>(() => loadFromStorage('settings', initialSettings));
  const [isLoggedIn, setIsLoggedIn] = useState(() => loadFromStorage('isLoggedIn', false));
  const [currentView, setCurrentView] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn)); }, [isLoggedIn]);

  const addToCart = (item: CartItem) => setCart(prev => [...prev, item]);
  const removeFromCart = (index: number) => setCart(prev => prev.filter((_, i) => i !== index));
  const updateCartItem = (index: number, item: CartItem) => setCart(prev => prev.map((c, i) => i === index ? item : c));
  const clearCart = () => setCart([]);
  
  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);
  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => { setIsLoggedIn(false); setCurrentView('menu'); };

  const getCartTotal = () => cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const setView = (view: string) => {
    setCurrentView(view);
    if (view === 'menu') { setSelectedProduct(null); }
  };

  return (
    <AppContext.Provider value={{
      categories, products, cart, orders, settings, isLoggedIn, currentView,
      selectedCategory, selectedProduct, currentOrder, isAdmin: isLoggedIn,
      setCategories, setProducts, addToCart, removeFromCart, updateCartItem, clearCart,
      addOrder, updateOrderStatus, setSettings, setView, setSelectedCategory,
      setSelectedProduct, setCurrentOrder, login, logout, getCartTotal, getCartCount
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
