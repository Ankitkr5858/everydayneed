import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Order } from '../types';

interface OrderState {
  orders: Order[];
  loading: boolean;
  loadOrders: (userId?: string, shopId?: string) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,

  loadOrders: async (userId?: string, shopId?: string) => {
    set({ loading: true });
    let query = supabase.from('orders').select('*');

    if (userId) query = query.eq('user_id', userId);
    if (shopId) query = query.eq('shop_id', shopId);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    set({ orders: data, loading: false });
  },

  createOrder: async (order) => {
    const { error } = await supabase.from('orders').insert([order]);
    if (error) throw error;
    await get().loadOrders(order.userId);
  },

  updateOrderStatus: async (id, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
    set({
      orders: get().orders.map((o) =>
        o.id === id ? { ...o, status } : o
      ),
    });
  },
}));