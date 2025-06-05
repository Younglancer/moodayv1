import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { lightColors } from '@/constants/colors';

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    // This screen is just a placeholder for the OAuth callback
    // The actual handling is done by expo-auth-session automatically
    // We should redirect back to the main flow
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: lightColors.background,
    }}>
      <ActivityIndicator size="large" color="#0072ff" />
      <Text style={{
        marginTop: 16,
        fontSize: 16,
        color: lightColors.primaryText,
        textAlign: 'center',
      }}>
        Completing sign in...
      </Text>
    </View>
  );
} 