import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, View } from 'react-native';
import { lightColors, darkColors, theme } from '@/constants/colors';

const BLUE_COLOR = '#0072ff';

interface AuthButtonProps {
  title: string;
  icon: React.ReactNode; // Type back to React.ReactNode, parent will handle color
  onPress: () => void;
  variant?: 'google' | 'phone' | 'email';
  style?: ViewStyle;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  icon, // Type back to React.ReactNode, parent will handle color
  onPress,
  variant = 'google',
  style,
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'google':
        return {
          backgroundColor: lightColors.white,
          textColor: BLUE_COLOR,
          borderColor: lightColors.border,
          // iconColor: BLUE_COLOR, // Removed
        };
      case 'phone': // This is our blue button
        return {
          backgroundColor: BLUE_COLOR,
          textColor: lightColors.white,
          borderColor: BLUE_COLOR, 
          // iconColor: lightColors.white, // Removed
        };
      case 'email':
        return {
          backgroundColor: lightColors.cardBackground,
          textColor: lightColors.primaryText,
          borderColor: lightColors.border,
          // iconColor: lightColors.primaryText, // Removed
        };
      default:
        return {
          backgroundColor: lightColors.white,
          textColor: BLUE_COLOR,
          borderColor: lightColors.border,
          // iconColor: BLUE_COLOR, // Removed
        };
    }
  };

  const buttonVariantStyles = getButtonStyles();

  // Simplified rendering, applying variant styles
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonVariantStyles.backgroundColor,
          borderColor: buttonVariantStyles.borderColor,
          borderWidth: (variant === 'google' || variant === 'email') ? 1 : 0, // Border only for non-blue buttons
        },
        variant === 'phone' ? theme.shadows.md : theme.shadows.sm,
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.text, { color: buttonVariantStyles.textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.lg,
    // borderWidth is now conditional in the component style
  },
  iconContainer: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});