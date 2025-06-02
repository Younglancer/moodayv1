import React from 'react';
import { StyleSheet, View } from 'react-native';
import { darkColors } from '@/constants/colors';

interface ProgressIndicatorProps {
  steps: number;
  currentStep: number;
  activeColor?: string;
  inactiveColor?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  activeColor = '#FFFFFF',
  inactiveColor = '#FFFFFF',
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: steps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentStep
              ? { ...styles.activeDot, backgroundColor: activeColor }
              : { ...styles.inactiveDot, backgroundColor: inactiveColor },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
  },
  inactiveDot: {
    width: 8,
  },
});