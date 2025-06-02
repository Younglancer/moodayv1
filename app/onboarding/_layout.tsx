import { Stack } from 'expo-router';
import { darkColors } from '@/constants/colors';
import { ThemeProvider } from '@/contexts/ThemeContext';

function OnboardingLayoutContent() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: darkColors.background,
        },
      }}
    />
  );
}

export default function OnboardingLayout() {
  return (
    <ThemeProvider forceDark>
      <OnboardingLayoutContent />
    </ThemeProvider>
  );
}