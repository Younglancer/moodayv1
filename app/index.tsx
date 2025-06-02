import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Easing, ActivityIndicator } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { Asset } from 'expo-asset';

function SplashContent() {
  const { isAuthenticated } = useAuthStore();
  const { hasCompletedOnboarding } = useUserStore();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Animation values
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const bounceValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  // Preload the image
  useEffect(() => {
    async function preloadImage() {
      try {
        // Preload the splash image
        await Asset.loadAsync(require('@/assets/images/blueSplash.png'));
        setIsImageLoaded(true);
        
        // Fade in the image
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Failed to preload image:', error);
        // Continue even if preloading fails
        setIsImageLoaded(true);
      }
    }
    
    preloadImage();
  }, [fadeValue]);

  // Start animations after image is loaded
  useEffect(() => {
    if (!isImageLoaded) return;
    
    // Use a small timeout to ensure animations start after rendering
    const timer = setTimeout(() => {
      // First animation: small bounce effect
      Animated.sequence([
        // Initial bounce animation
        Animated.timing(bounceValue, {
          toValue: 1.1,
          duration: 300,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        
        // Short pause
        Animated.delay(800),
        
        // Final exit animation: Scale down animation
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 600,
          easing: Easing.back(2),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Navigate after animations complete
        if (isAuthenticated) {
          if (hasCompletedOnboarding) {
            router.replace('/(tabs)');
          } else {
            // Go to intro if authenticated but onboarding not completed
            router.replace('/onboarding/intro');
          }
        } else {
          router.replace('/welcome');
        }
      });
    }, 0);

    // Clean up animations
    return () => {
      clearTimeout(timer);
      scaleValue.stopAnimation();
      bounceValue.stopAnimation();
      fadeValue.stopAnimation();
    };
  }, [isImageLoaded, isAuthenticated, hasCompletedOnboarding, scaleValue, bounceValue, fadeValue]);

  return (
    <View style={styles.container}>
      {!isImageLoaded && (
        <ActivityIndicator size="large" color="#FFFFFF" />
      )}
      <Animated.View 
        style={[
          styles.logoContainer,
          { 
            transform: [
              { scale: bounceValue }, // Apply initial bounce
              { scale: scaleValue }   // Apply final scale down
            ],
            opacity: fadeValue
          }
        ]}
      >
        <ExpoImage
          source={require('@/assets/images/blueSplash.png')}
          style={styles.splashImage}
          contentFit="cover"
        />
      </Animated.View>
    </View>
  );
}

export default function SplashScreen() {
  return (
    <ThemeProvider forceDark>
      <SplashContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0072ff', 
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    width: 250, 
    height: 250,
  },
});