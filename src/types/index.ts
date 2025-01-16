export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  society?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  shopId: string;
  expiryDate?: string;
  image?: string;
}

export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  society: string;
  address: string;
  rating: number;
  subscriptionPlan: 'basic' | 'standard' | 'premium';
  subscriptionEndDate: string;
  distance?: number;
}

export interface Order {
  id: string;
  userId: string;
  shopId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  createdAt: string;
  address: string;
  paymentMethod: 'cash' | 'card' | 'upi';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Society {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}