import { Stack } from 'expo-router';
import { darkColors } from '@/constants/colors';
import { ThemeProvider } from '@/contexts/ThemeContext';

function AuthLayoutContent() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: darkColors.background,
        },
        headerShadowVisible: false,
        headerTintColor: darkColors.primaryText,
        headerBackTitle: '',
        contentStyle: {
          backgroundColor: darkColors.background,
        },
      }}
    >
      <Stack.Screen
        name="email"
        options={{
          title: "Email Sign In",
          headerTitleStyle: {
            fontWeight: '600',
            color: darkColors.primaryText,
          },
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot Password",
          headerTitleStyle: {
            fontWeight: '600',
            color: darkColors.primaryText,
          },
        }}
      />
    </Stack>
  );
}

export default function AuthLayout() {
  return (
    <ThemeProvider forceDark>
      <AuthLayoutContent />
    </ThemeProvider>
  );
}