import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Profile } from '../types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  otpSent: boolean;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signInVendor: (email: string, password: string) => Promise<void>;
  signUpVendor: (data: VendorFormData) => Promise<void>;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
}

interface VendorFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  state: string;
  pincode: string;
  societyName: string;
  shopName: string;
  gstNumber: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  otpSent: false,

  signInWithPhone: async (phone: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true,
        }
      });
      
      if (error) throw error;
      set({ otpSent: true });
    } catch (error) {
      console.error('SignInWithPhone error:', error);
      throw error;
    }
  },

  verifyOTP: async (phone: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      
      if (error) throw error;

      // After successful verification, create/update profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            phone,
            role: 'user',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('Profile update error:', profileError);
          throw profileError;
        }
      }

      set({ otpSent: false });
      await get().loadProfile();
    } catch (error) {
      console.error('VerifyOTP error:', error);
      throw error;
    }
  },

  signInVendor: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    await get().loadProfile();
  },

  signUpVendor: async (data: VendorFormData) => {
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.fullName,
          role: 'vendor',
          phone: data.phone
        },
      },
    });
    if (signUpError) throw signUpError;

    // Get the newly created user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Failed to create user');

    // Create profile first
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: data.fullName,
        role: 'vendor',
        phone: data.phone,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) throw profileError;

    // Create shop entry
    const { error: shopError } = await supabase
      .from('shops')
      .insert([{
        name: data.shopName,
        owner_id: user.id,
        society: data.societyName,
        address: `${data.societyName}, ${data.city}, ${data.state} - ${data.pincode}`,
        subscription_plan: 'basic',
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      }]);
    
    if (shopError) throw shopError;

    await get().loadProfile();
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, profile: null });
  },

  loadProfile: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      set({ user });

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Load profile error:', profileError);
          throw profileError;
        }

        set({ profile });
      }

      set({ loading: false });
    } catch (error) {
      console.error('LoadProfile error:', error);
      set({ loading: false });
      throw error;
    }
  },
}));