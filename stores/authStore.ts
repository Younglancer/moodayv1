import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id?: string;
    email?: string;
    username?: string;
    authMethod?: 'email' | 'google';
  } | null;
  isLoading: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: { username?: string; email?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  setError: (error: string | null) => void;
  setUser: (user: AuthState['user']) => void;
  setAuthenticated: (value: boolean) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      setUser: (user) => set({ user }),
      setAuthenticated: (value) => {
        console.log('Setting authentication state:', value);
        if (value) {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              set({ isAuthenticated: true });
            } else {
              console.error('Attempted to set authenticated to true without a session');
              set({ isAuthenticated: false });
            }
          });
        } else {
          set({ isAuthenticated: false });
        }
      },
      setError: (error) => set({ error }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      initializeAuth: async () => {
        try {
          set({ isLoading: true, error: null });
          console.log('Initializing auth...');
          
          // Check if there's an existing session
          const { data: { session }, error } = await supabase.auth.getSession();
          console.log('Initial session check:', { session, error });
          
          if (error) {
            console.error('Session error:', error);
            set({ isAuthenticated: false, user: null, error: error.message });
            return;
          }

          if (!session?.user) {
            console.log('No session found');
            set({ isAuthenticated: false, user: null });
            return;
          }

          console.log('Session found, fetching user profile...');
          // Fetch user profile
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          console.log('User profile fetch result:', { userData, userError });

          if (userError) {
            console.error('User profile error:', userError);
            set({ isAuthenticated: false, user: null, error: userError.message });
            return;
          }

          if (!userData) {
            console.log('No user profile found, creating new profile...');
            // Create user profile if it doesn't exist
            const { error: insertError } = await supabase.from('users').insert({
              id: session.user.id,
              email: session.user.email,
              username: session.user.email?.split('@')[0] || 'user',
              auth_method: 'email',
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
              user_status: 'active',
              email_verified: session.user.email_confirmed_at ? true : false,
            });

            if (insertError) {
              console.error('User creation error:', insertError);
              set({ isAuthenticated: false, user: null, error: insertError.message });
              return;
            }
            console.log('New user profile created');
          }

          const finalUser = {
            id: session.user.id,
            email: session.user.email,
            username: userData?.username || session.user.email?.split('@')[0] || 'user',
            authMethod: userData?.auth_method || 'email',
          };
          console.log('Setting user state:', finalUser);

          set({
            isAuthenticated: true,
            user: finalUser,
          });
          console.log('Auth initialization complete');
        } catch (error: any) {
          console.error('Auth initialization error:', error);
          set({ isAuthenticated: false, user: null, error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      signInWithEmail: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          console.log('Starting email sign-in process...', { email });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          console.log('Email sign-in response:', { data, error });

          if (error || !data.user) {
            console.error('Email sign-in failed:', error?.message);
            set({ error: error?.message || 'Invalid login', isAuthenticated: false });
            return;
          }

          console.log('Fetching user profile after email sign-in...');
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          console.log('User profile fetch result:', { userData, userError });

          if (userError || !userData) {
            console.error('User profile fetch failed:', userError?.message);
            set({ error: userError?.message || 'User not found', isAuthenticated: false });
            return;
          }

          const finalUser = {
            id: data.user.id,
            email: data.user.email,
            username: userData.username,
            authMethod: userData.auth_method,
          };
          console.log('Setting user state after email sign-in:', finalUser);

          set({
            isAuthenticated: true,
            user: finalUser,
          });

          // Update last login
          console.log('Updating last login...');
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', data.user.id);

          console.log('Navigating to tabs after successful email sign-in...');
          router.replace('/(tabs)');
        } catch (error: any) {
          console.error('Email sign-in error:', error);
          set({ error: error.message, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      signUpWithEmail: async (email: string, password: string, username: string) => {
        try {
          set({ isLoading: true, error: null });

          // Check if username is taken
          const { data: existingUser } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();

          if (existingUser) {
            throw new Error('Username is already taken');
          }

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Create user profile
            const { error: profileError } = await supabase.from('users').insert({
              id: data.user.id,
              email: data.user.email,
              username,
              auth_method: 'email',
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
              user_status: 'active',
              email_verified: false,
            });

            if (profileError) throw profileError;

            set({
              isAuthenticated: true,
              user: {
                id: data.user.id,
                email: data.user.email,
                username,
                authMethod: 'email',
              },
            });

            router.replace('/onboarding/intro');
          }
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          console.log('Starting Google sign-in process...');

          const redirectUri = makeRedirectUri({
            scheme: 'com.mooday.app',
            path: 'auth/callback',
          });
          console.log('Redirect URI:', redirectUri);

          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: redirectUri,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          });

          if (error) {
            console.error('OAuth error:', error);
            throw error;
          }

          console.log('OAuth response:', data);
          console.log('Please complete the authentication in the browser. The app will handle the callback.');
          
        } catch (error: any) {
          console.error('Google sign-in error:', error);
          set({ error: error.message, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) throw error;
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const user = get().user;
          if (!user?.id) throw new Error('No user found');

          if (data.username) {
            // Check if username is taken
            const { data: existingUser } = await supabase
              .from('users')
              .select('username')
              .eq('username', data.username)
              .neq('id', user.id)
              .single();

            if (existingUser) {
              throw new Error('Username is already taken');
            }
          }

          const { error } = await supabase
            .from('users')
            .update(data)
            .eq('id', user.id);

          if (error) throw error;

          set({
            user: {
              ...user,
              ...data,
            },
          });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ isAuthenticated: false, user: null });
          router.replace('/welcome');
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Listen to auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', { event, session });
  const { initializeAuth } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session) {
    console.log('User signed in, initializing auth...');
    await initializeAuth();
    console.log('Navigating to tabs after sign in...');
    router.replace('/(tabs)');
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
    useAuthStore.setState({ isAuthenticated: false, user: null });
    router.replace('/welcome');
  }
});