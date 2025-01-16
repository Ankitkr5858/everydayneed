import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Shop, Product } from '../types';

interface ShopState {
  shops: Shop[];
  products: Product[];
  loading: boolean;
  loadShops: (lat?: number, lng?: number) => Promise<void>;
  loadProducts: (shopId: string) => Promise<void>;
  createProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  searchNearbyShops: (lat: number, lng: number, radius?: number) => Promise<void>;
}

export const useShopStore = create<ShopState>((set, get) => ({
  shops: [],
  products: [],
  loading: false,

  loadShops: async (lat?: number, lng?: number) => {
    set({ loading: true });
    try {
      if (lat && lng) {
        await get().searchNearbyShops(lat, lng);
      } else {
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .order('name');

        if (error) throw error;
        set({ shops: data || [] });
      }
    } catch (error) {
      console.error('Error loading shops:', error);
    } finally {
      set({ loading: false });
    }
  },

  searchNearbyShops: async (lat: number, lng: number, radius: number = 10) => {
    try {
      const { data, error } = await supabase
        .rpc('get_nearby_societies', {
          user_lat: lat,
          user_lng: lng,
          radius_km: radius
        });

      if (error) throw error;

      const societyIds = data.map((s: any) => s.id);
      
      const { data: shops, error: shopsError } = await supabase
        .from('shops')
        .select('*')
        .in('society_id', societyIds)
        .order('rating', { ascending: false });

      if (shopsError) throw shopsError;

      // Add distance to shops based on society distance
      const shopsWithDistance = shops.map((shop: Shop) => {
        const society = data.find((s: any) => s.id === shop.society);
        return {
          ...shop,
          distance: society?.distance || null
        };
      });

      set({ shops: shopsWithDistance });
    } catch (error) {
      console.error('Error searching nearby shops:', error);
    }
  },

  loadProducts: async (shopId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopId)
        .order('name');

      if (error) throw error;
      set({ products: data || [] });
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (product) => {
    try {
      const { error } = await supabase.from('products').insert([product]);
      if (error) throw error;
      await get().loadProducts(product.shopId);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  },

  updateProduct: async (id, product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id);
      if (error) throw error;
      await get().loadProducts(product.shopId!);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      set({ products: get().products.filter((p) => p.id !== id) });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  },
}));