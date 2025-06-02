import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { darkColors } from '@/constants/colors';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useSegments } from 'expo-router';

export const unstable_settings = {
  initialRouteName: "welcome",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded && hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [loaded, hasHydrated]);

  if (!loaded || !hasHydrated) {
    return <View style={styles.container} />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const router = useRouter();
  const segments = useSegments();

  // Initialize auth on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  // Protected and public routes
  const publicRoutes = ['welcome', 'auth'];
  const protectedRoutes = ['(tabs)', 'onboarding'];
  const currentRoute = segments[0];

  useEffect(() => {
    if (isLoading) {
      console.log('Auth is loading, skipping navigation...');
      return; // Don't redirect while loading
    }

    console.log('Current auth state:', { isAuthenticated, currentRoute });

    if (!isAuthenticated) {
      // If user is not authenticated and trying to access protected routes
      if (protectedRoutes.includes(currentRoute)) {
        console.log('User not authenticated, redirecting to welcome...');
        router.replace('/welcome');
      }
    } else {
      // If user is authenticated and on public routes
      if (publicRoutes.includes(currentRoute)) {
        console.log('User authenticated, redirecting to tabs...');
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, currentRoute, isLoading]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: darkColors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="auth" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            animation: 'fade',
          }} 
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.background,
  },
});