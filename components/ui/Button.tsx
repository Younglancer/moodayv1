import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { lightColors, darkColors, theme } from '@/constants/colors';

const BLUE_COLOR = '#0072ff';
const BLUE_COLOR_LIGHT = '#3b91ff';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'gradient',
  size = 'md',
  isLoading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return styles.smallButton;
      case 'md':
        return styles.mediumButton;
      case 'lg':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return styles.smallText;
      case 'md':
        return styles.mediumText;
      case 'lg':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  const renderContent = () => (
    <>
      {isLoading ? (
        <ActivityIndicator color={lightColors.white} />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Text style={[styles.buttonText, getTextSizeStyles(), textStyle]}>
            {title}
          </Text>
          {rightIcon && rightIcon}
        </>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        style={[style, isLoading && styles.disabledButton]}
        disabled={isLoading || props.disabled}
        {...props}
      >
        <LinearGradient
          colors={[BLUE_COLOR, BLUE_COLOR_LIGHT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, getSizeStyles(), theme.shadows.md]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return [styles.primaryButton, theme.shadows.md];
      case 'secondary':
        return [styles.secondaryButton, theme.shadows.sm];
      case 'outline':
        return styles.outlineButton;
      case 'text':
        return styles.textButton;
      default:
        return [styles.primaryButton, theme.shadows.md];
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyles(),
        getSizeStyles(),
        style,
        isLoading && styles.disabledButton,
      ]}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.xl,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: BLUE_COLOR,
  },
  secondaryButton: {
    backgroundColor: lightColors.cardBackground,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: BLUE_COLOR,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: lightColors.white,
    fontWeight: '600',
  },
  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  mediumButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  largeButton: {
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});