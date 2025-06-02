import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Dimensions, TouchableOpacity, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
const BLUE_COLOR = '#0072ff';

function WelcomeContent() {
  // Animation values
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;
  const fadeAnim5 = useRef(new Animated.Value(0)).current;
  const fadeAnim6 = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const handleGetStarted = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      router.push('/auth/email');
    });
  };

  // Start floating animation for button
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    ).start();
  }, [floatAnim]);

  // Initial animations
  useEffect(() => {
    // Overall scale animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1.5))
    }).start();
    
    // Staggered text animations
    const staggeredAnimations = [
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 500,
        delay: 250,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 500,
        delay: 400,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim4, {
        toValue: 1,
        duration: 500,
        delay: 550,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim5, {
        toValue: 1,
        duration: 500,
        delay: 700,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim6, {
        toValue: 1,
        duration: 500,
        delay: 850,
        useNativeDriver: true
      })
    ];

    Animated.parallel(staggeredAnimations).start();
  }, [fadeAnim1, fadeAnim2, fadeAnim3, fadeAnim4, fadeAnim5, fadeAnim6, scaleAnim]);

  // Derive button animation values
  const buttonScale = buttonAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.95, 1]
  });

  // Derive floating animation
  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8]
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* Main Message with alternating styles */}
          <View style={styles.messageContainer}>
            <Animated.Text style={[styles.lightText, { opacity: fadeAnim1 }]}>
              Get ready to
            </Animated.Text>
            <Animated.Text style={[styles.boldText, { opacity: fadeAnim2 }]}>
              supercharge
            </Animated.Text>
            <Animated.Text style={[styles.boldText, { opacity: fadeAnim3 }]}>
              your mood-
            </Animated.Text>
            <Animated.Text style={[styles.lightText, { opacity: fadeAnim4 }]}>
              setting and,
            </Animated.Text>
            <Animated.Text style={[styles.lightText, { opacity: fadeAnim5 }]}>
              planning with
            </Animated.Text>
            <Animated.Text style={[styles.boldText, { opacity: fadeAnim6 }]}>
              mooday.
            </Animated.Text>
          </View>

          {/* Get Started Button */}
          <View style={styles.buttonContainer}>
            <Animated.View style={{ transform: [{ translateY }, { scale: buttonScale }] }}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleGetStarted}
                activeOpacity={0.9}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Home Indicator */}
        <View style={styles.homeIndicator} />
      </SafeAreaView>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  return (
    <ThemeProvider>
      <WelcomeContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  messageContainer: {
    marginTop: height * 0.15,
  },
  lightText: {
    color: 'rgba(0, 114, 255, 0.65)',
    fontSize: 42,
    fontWeight: '700',
    lineHeight: 52,
  },
  boldText: {
    color: BLUE_COLOR,
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 52,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: BLUE_COLOR,
    borderRadius: 32,
    width: width * 0.85,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 100,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 114, 255, 0.25)',
    marginBottom: 10,
  },
});