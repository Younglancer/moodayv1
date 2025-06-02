import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Asset } from 'expo-asset';
import CircleScreenContent from './CircleScreenContent';

export default function CircleScreenLoader() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    async function preloadImage() {
      try {
        await Asset.loadAsync(require('../../assets/images/circle.png'));
      } catch (error) {
        console.error('Failed to preload circle image:', error);
      }
      setIsImageLoaded(true);
    }
    preloadImage();
  }, []);

  if (!isImageLoaded) {
    return (
      <ActivityIndicator
        size="large"
        color="#0072ff"
        style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }]}
      />
    );
  }

  return <CircleScreenContent />;
}