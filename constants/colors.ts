export const lightColors = {
    // Backgrounds
    background: "#FFFFFF",
    cardBackground: "#F8FAFC",
    surfaceBackground: "#F1F5F9",
    
    // Text
    primaryText: "#0F172A",
    secondaryText: "#475569",
    tertiaryText: "#94A3B8",
    
    // Brand Colors
    primary: "#0072ff",
    primaryLight: "#3b91ff",
    primaryDark: "#0058cc",
    
    secondary: "#EC4899",
    secondaryLight: "#F472B6",
    
    accent: "#10B981",
    accentLight: "#34D399",
    
    // Status Colors
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    
    // Utility
    border: "#E2E8F0",
    borderLight: "#F1F5F9",
    white: "#FFFFFF",
    black: "#000000",
    
    // Gradients
    gradientPrimary: ["#0072ff", "#3b91ff"] as const,
    gradientSecondary: ["#EC4899", "#F97316"] as const,
    gradientAccent: ["#10B981", "#059669"] as const,
    gradientLight: ["#F8FAFC", "#E2E8F0"] as const,
  };
  
  export const darkColors = {
    // Backgrounds
    background: "#0A0A0B",
    cardBackground: "#1A1A1D",
    surfaceBackground: "#2D2D30",
    
    // Text
    primaryText: "#FFFFFF",
    secondaryText: "#A1A1AA",
    tertiaryText: "#71717A",
    
    // Brand Colors
    primary: "#0072ff",
    primaryLight: "#3b91ff",
    primaryDark: "#0058cc",
    
    secondary: "#EC4899",
    secondaryLight: "#F472B6",
    
    accent: "#10B981",
    accentLight: "#34D399",
    
    // Status Colors
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    
    // Utility
    border: "#374151",
    borderLight: "#4B5563",
    white: "#FFFFFF",
    black: "#000000",
    
    // Gradients
    gradientPrimary: ["#0072ff", "#3b91ff"] as const,
    gradientSecondary: ["#EC4899", "#F97316"] as const,
    gradientAccent: ["#10B981", "#059669"] as const,
    gradientDark: ["#1F2937", "#111827"] as const,
  };
  
  // Default to light colors for backward compatibility
  export const colors = lightColors;
  
  export const theme = {
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
      xxxl: 64,
    },
    borderRadius: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      xxl: 24,
      full: 9999,
    },
    typography: {
      fontFamily: {
        regular: 'Inter_400Regular',
        medium: 'Inter_500Medium',
        semiBold: 'Inter_600SemiBold',
        bold: 'Inter_700Bold',
      },
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    shadows: {
      sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      },
      md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
      },
      lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
      },
      xl: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 12,
      },
    },
  };