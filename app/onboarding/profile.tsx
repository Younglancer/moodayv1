import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Animated, Easing, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { darkColors, lightColors } from '@/constants/colors';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';
import { useUserStore } from '@/stores/userStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function ProfileSetupScreen() {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setDisplayName: storeSetDisplayName } = useUserStore();

  // Animation for avatar
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const handleNext = () => {
    if (!displayName.trim()) {
      setError('Please enter a username');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      storeSetDisplayName(displayName);
      router.push('/onboarding/intro');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <ProgressIndicator steps={3} currentStep={0} />
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>What should we call you?</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <MaterialCommunityIcons name="emoticon-neutral-outline" size={120} color="#fff" style={styles.avatarIcon} />
          </Animated.View>
        </View>
        <View style={styles.inputSpacer} />
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#fff9"
              value={displayName}
              onChangeText={setDisplayName}
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={handleNext}
            />
          </View>
          <TouchableOpacity
            style={styles.goButton}
            onPress={handleNext}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="arrow-right" size={28} color={darkColors.primary} />
          </TouchableOpacity>
        </View>
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={18} color="#FFD6D6" style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <View style={styles.flexGrow} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  progressContainer: {
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 0,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 12,
  },
  avatarIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  inputSpacer: {
    height: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#fff2',
    borderRadius: 32,
    padding: 2,
    minHeight: 44,
  },
  inputWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  input: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
    paddingVertical: 14,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 48,
  },
  goButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  flexGrow: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 0,
  },
  errorText: {
    color: '#FFD6D6',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});