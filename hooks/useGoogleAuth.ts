import { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectUri = makeRedirectUri({
    scheme: 'com.mooday.app',
    path: 'auth/callback',
  });

  console.log('Environment variables for Google OAuth:', {
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'Not set',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'Not set',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'Not set',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'Not set',
  });

  if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
    throw new Error('Google OAuth client ID is not set. Please ensure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is defined in your environment variables.');
  }

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    redirectUri,
    scopes: ['profile', 'email'],
    selectAccount: true,
  });

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Starting Google sign-in process...');
    console.log('Redirect URI:', redirectUri);

    try {
      if (!request) {
        throw new Error('Failed to create Google auth request');
      }

      console.log('Prompting Google auth...');
      const authResponse = await promptAsync();
      console.log('Google auth response:', authResponse);

      if (authResponse?.type === 'success') {
        const { authentication } = authResponse;
        if (!authentication?.accessToken) {
          throw new Error('No access token received from Google');
        }

        console.log('Signing in with Google token to Supabase...');
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: authentication.accessToken,
        });

        if (error) {
          console.error('Supabase sign-in error:', error);
          throw error;
        }

        if (!data.user) {
          throw new Error('No user data returned from Supabase');
        }

        console.log('Fetching or creating user profile...');
        // Fetch or create user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        console.log('User profile check:', { userData, userError });

        if (userError || !userData) {
          console.log('Creating new user profile...');
          const { error: insertError } = await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            username: data.user.email?.split('@')[0] || 'user',
            auth_method: 'google',
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            user_status: 'active',
            email_verified: true,
          });

          if (insertError) {
            console.error('User creation error:', insertError);
            throw insertError;
          }
          console.log('New user profile created');
        }

        const finalUser = {
          id: data.user.id,
          email: data.user.email,
          username: userData?.username || data.user.email?.split('@')[0] || 'user',
          authMethod: 'google' as const,
        };
        console.log('Setting user state:', finalUser);

        // Update auth store
        const { setAuthenticated, setUser } = (await import('@/stores/authStore')).useAuthStore.getState();
        setAuthenticated(true);
        setUser(finalUser);

        console.log('Navigation to tabs...');
        router.replace('/(tabs)');
      } else {
        console.log('Google auth cancelled or failed:', authResponse);
        throw new Error('Google authentication cancelled or failed');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { signInWithGoogle, isLoading, error };
}; 