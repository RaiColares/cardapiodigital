export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  promoPrice?: number;
  image: string;
  available: boolean;
  featured: boolean;
  isNew: boolean;
  tags: string[];
  ingredients: string;
  prepTime: string;
  order: number;
  complementGroups: ComplementGroup[];
}

export interface ComplementGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  minItems: number;
  maxItems: number;
  items: ComplementItem[];
}

export interface ComplementItem {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  observations: string;
  selectedComplements: { [groupId: string]: string[] };
  totalPrice: number;
}

export interface Order {
  id: string;
  number: number;
  customer: CustomerData;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  changeFor?: number;
  orderType: 'delivery' | 'pickup' | 'dine-in';
  tableNumber?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface CustomerData {
  name: string;
  phone: string;
  address?: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    reference: string;
  };
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

export interface StoreSettings {
  name: string;
  logo: string;
  banner: string;
  description: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  facebook: string;
  openingHours: OpeningHours[];
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  dineInEnabled: boolean;
  deliveryFee: number;
  minOrder: number;
  neighborhoods: NeighborhoodFee[];
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface NeighborhoodFee {
  name: string;
  fee: number;
}

export interface AdminUser {
  username: string;
  password: string;
  role: 'admin' | 'manager' | 'attendant';
}
