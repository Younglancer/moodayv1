import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Supabase Environment Variables:', {
  url: supabaseUrl || 'Not set',
  anonKey: supabaseAnonKey ? 'Set (hidden for security)' : 'Not set',
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types for our database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          auth_method: 'email' | 'google'
          created_at: string
          last_login: string
          user_status: 'active' | 'inactive' | 'suspended'
          profile_picture?: string
          email_verified: boolean
        }
        Insert: {
          id: string
          email: string
          username: string
          auth_method: 'email' | 'google'
          created_at?: string
          last_login?: string
          user_status?: 'active' | 'inactive' | 'suspended'
          profile_picture?: string
          email_verified?: boolean
        }
        Update: {
          email?: string
          username?: string
          auth_method?: 'email' | 'google'
          last_login?: string
          user_status?: 'active' | 'inactive' | 'suspended'
          profile_picture?: string
          email_verified?: boolean
        }
      }
    }
  }
}