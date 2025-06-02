import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, Animated, Easing, Dimensions, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { lightColors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { AuthButton } from '@/components/auth/AuthButton';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { StatusBar } from 'expo-status-bar';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

const { width, height } = Dimensions.get('window');
const BLUE_COLOR = '#0072ff';

export default function UnifiedAuthScreen() {
  const params = useLocalSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  const arrowPos = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const backgroundFade = useRef(new Animated.Value(0)).current;

  const { setAuthenticated, setUser, setError } = useAuthStore();
  const { hasCompletedOnboarding } = useUserStore();
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleAuth();

  useEffect(() => {
    if (params.mode === 'signup') {
      setIsLogin(false);
    }
  }, [params]);

  useEffect(() => {
    // Start animations on component mount
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)),
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.elastic(1.2),
      }),
      Animated.timing(backgroundFade, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeIn, slideUp, logoScale, backgroundFade]);

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleButtonPress = () => {
    // Button press animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(buttonScale, {
          toValue: 0.92,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(arrowPos, {
          toValue: 8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(arrowPos, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      handleEmailPasswordSubmit();
    });
  };

  const handleEmailPasswordSubmit = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Loading animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonOpacity, {
          toValue: 0.65,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
    
    setTimeout(() => {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      setIsLoading(false);
      setError(null);
      setUser({ id: 'email-user-id', email });
      setAuthenticated(true);
      
      if (isLogin) {
        router.replace(hasCompletedOnboarding ? '/(tabs)' : '/onboarding/intro');
      } else {
        router.push('/onboarding/profile');
      }
    }, 1500);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    signInWithGoogle().catch((error) => {
      console.error('Google auth failed:', error);
      setIsLoading(false);
    });
  };

  const animateOut = () => {
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(slideUp, {
          toValue: 50,
          duration: 350,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start(resolve);
    });
  };

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)),
      }),
    ]).start();
  };

  const toggleAuthMode = async () => {
    await animateOut();
    setIsTransitioning(true);
    setTimeout(() => {
      if (isLogin) {
        setIsLogin(false);
        setErrors({});
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setIsLogin(true);
        setErrors({});
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
      setIsTransitioning(false);
      animateIn();
    }, 250);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false, title: '' }} />
      <View style={styles.content}>
        {isTransitioning ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={BLUE_COLOR} />
          </View>
        ) : (
          <>
            <Animated.View style={[styles.headerContainer, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
              <Animated.Image 
                source={require('@/assets/images/favicon.png')} 
                style={[styles.logo, { transform: [{ scale: logoScale }] }]} 
                resizeMode="contain" 
              />
              <Text style={styles.title}>{isLogin ? 'Come on board!' : 'Create an Account'}</Text>
              <Text style={styles.subtitle}>
                {isLogin ? 'Let\'s sign you in. 😊' : 'Join Mooday to start sharing your moments.'}
              </Text>
            </Animated.View>

            <Animated.View style={[styles.formContainer, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
              <Input
                label=""
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                containerStyle={styles.inputField}
                leftIcon={<MaterialCommunityIcons name="email-outline" size={18} color={BLUE_COLOR} />}
              />
              <Input
                label=""
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                isPassword
                containerStyle={styles.inputField}
                leftIcon={<MaterialCommunityIcons name="lock-outline" size={18} color={BLUE_COLOR} />}
              />
              {!isLogin && (
                <Input
                  label=""
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  error={errors.confirmPassword}
                  isPassword
                  containerStyle={styles.inputField}
                  leftIcon={<MaterialCommunityIcons name="lock-outline" size={18} color={BLUE_COLOR} />}
                />
              )}

              {isLogin && (
                <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/auth/forgot-password')}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              <View style={styles.buttonWrapper}>
                <Animated.View style={{
                  transform: [{ scale: buttonScale }],
                  opacity: buttonOpacity,
                }}>
                  <TouchableOpacity
                    style={styles.mainButton}
                    onPress={handleButtonPress}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.mainButtonText}>
                      {isLogin ? 'Continue' : 'Create Account'}
                    </Text>
                    <Animated.View style={{
                      transform: [{ translateX: arrowPos }]
                    }}>
                      <MaterialCommunityIcons name="arrow-right" size={18} color="white" />
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </Animated.View>
            
            <Animated.View style={[styles.footerSection, { opacity: fadeIn }]}>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              <AuthButton
                title="Continue with Google"
                icon={<MaterialCommunityIcons name="google" size={20} color={BLUE_COLOR} />}
                onPress={handleGoogleAuth}
                variant="google"
                style={styles.googleButton}
              />

              <View style={styles.footer}>
                <TouchableOpacity onPress={toggleAuthMode}>
                  <Text style={styles.footerLinkText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <Text style={styles.link}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
                  </Text>
                </TouchableOpacity>
                <Text style={styles.termsText} selectable={false}>
                  By continuing, you agree to our{' '}
                  <Text 
                    style={styles.link} 
                    onPress={() => router.push('/legal/terms')} 
                    selectable={false}
                    suppressHighlighting={true}
                  >
                    Terms of Service
                  </Text>
                  {' '}and{' '}
                  <Text 
                    style={styles.link} 
                    onPress={() => router.push('/legal/privacy')} 
                    selectable={false}
                    suppressHighlighting={true}
                  >
                    Privacy Policy
                  </Text>.
                </Text>
              </View>
            </Animated.View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: height * 0.05,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: lightColors.primaryText,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: lightColors.secondaryText,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputField: {
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: BLUE_COLOR,
    fontSize: 13,
    fontWeight: '500',
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: BLUE_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.6,
    shadowColor: BLUE_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  mainButtonText: {
    color: lightColors.white,
    fontWeight: '700',
    fontSize: 16,
    marginRight: 10,
    letterSpacing: 0.5,
  },
  footerSection: {
    width: '100%',
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '80%',
  },
  divider: {
    flex: 1,
    height: 0.5,
    backgroundColor: lightColors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: lightColors.secondaryText,
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  googleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: lightColors.border,
    borderWidth: 0.5,
    width: width * 0.8,
    paddingVertical: 14,
    borderRadius: 50,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 16,
  },
  footerLinkText: {
    fontSize: 14,
    color: lightColors.secondaryText,
    marginBottom: 12,
    padding: 8,
  },
  termsText: {
    fontSize: 11,
    color: lightColors.tertiaryText,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  link: {
    color: BLUE_COLOR,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightColors.white,
  },
});