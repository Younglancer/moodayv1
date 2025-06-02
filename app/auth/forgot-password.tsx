import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Animated, Easing, Dimensions, TextInput } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { lightColors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
const BLUE_COLOR = '#0072ff';

export default function ForgotPasswordScreen() {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  const arrowPos = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    ]).start();

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleResendCode = () => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
      alert('A new code has been sent to your email.');
    }
  };

  const handleButtonPress = () => {
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
      handleNext();
    });
  };

  const handleNext = () => {
    if (code.length === 6) {
      setError('');
      alert('Code verified. Proceeding to reset password.');
    } else {
      setError('Please enter a valid 6-digit code.');
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/auth/email'); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false, title: '' }} />
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={BLUE_COLOR} />
        </TouchableOpacity>
        <Animated.View style={[styles.headerContainer, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to your email. Enter it below to reset your password.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.formContainer, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
          <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
            <MaterialCommunityIcons name="email-outline" size={18} color={isFocused ? BLUE_COLOR : lightColors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.codeInput}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#8AA4C8" 
              value={code}
              onChangeText={(text) => {
                setCode(text);
                if (error) setError('');
              }}
              keyboardType="numeric"
              maxLength={6}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus={false}
              editable={true}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity 
            style={styles.resendButton} 
            onPress={handleResendCode} 
            disabled={!canResend}
          >
            <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
              Didn't receive code? {canResend ? 'Send again' : `Send again in ${timer}s`}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonWrapper}>
            <Animated.View style={{
              transform: [{ scale: buttonScale }],
              opacity: buttonOpacity,
            }}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleButtonPress}
                disabled={code.length !== 6 || isLoading}
                activeOpacity={0.9}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <Animated.View style={{ transform: [{ translateX: arrowPos }] }}>
                  <MaterialCommunityIcons name="arrow-right" size={18} color="white" />
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: height * 0.05 + 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: lightColors.primaryText,
    marginBottom: 10,
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
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: lightColors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    backgroundColor: lightColors.white,
    zIndex: 15,
  },
  inputContainerFocused: {
    borderColor: BLUE_COLOR,
    shadowColor: BLUE_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 12,
  },
  codeInput: {
    flex: 1,
    fontSize: 16,
    color: lightColors.primaryText,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  resendText: {
    color: BLUE_COLOR,
    fontSize: 14,
    fontWeight: '500',
  },
  resendTextDisabled: {
    color: lightColors.secondaryText,
    fontWeight: '400',
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  nextButton: {
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
  nextButtonText: {
    color: lightColors.white,
    fontWeight: '700',
    fontSize: 16,
    marginRight: 10,
    letterSpacing: 0.5,
  },
});