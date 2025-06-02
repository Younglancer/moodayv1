import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { darkColors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = Dimensions.get('window').height * 0.6;

const features = [
  {
    id: '1',
    title: 'A Little Life, Every Day',
    description: 'A private way to express your feelings and let your closest people know how you\'re doing.',
    icon: <MaterialCommunityIcons name="emoticon-excited-outline" size={64} color={darkColors.primary} />,
  },
  {
    id: '2',
    title: "Milestones, Together",
    description: 'Create and track life\'s big moments, cheering each other on towards shared achievements.',
    icon: <MaterialCommunityIcons name="emoticon-wink-outline" size={64} color={darkColors.primary} />,
  },
  {
    id: '3',
    title: 'Your Private Circle',
    description: 'Invite family and best friends to a secure space, free from public social pressure.',
    icon: <MaterialCommunityIcons name="emoticon-cool-outline" size={64} color={darkColors.primary} />,
  },
];

export default function IntroScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < features.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.push('/onboarding/circle');
    }
  };

  const handleSkip = () => {
    router.push('/(tabs)');
  };

  const renderFeatureItem = ({ item }: { item: typeof features[0] }) => (
    <View style={styles.featureItem}>
      <View style={styles.iconContainer}>{item.icon}</View>
      <Text style={styles.featureTitle}>{item.title}</Text>
      <Text style={styles.featureDescription}>{item.description}</Text>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipButtonLeft} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButtonTopRight} onPress={handleNext} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-right" style={styles.continueButtonIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={features}
          renderItem={renderFeatureItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          style={styles.carousel}
          contentContainerStyle={styles.carouselContentContainer}
        />
      </View>
      <View style={styles.paginationContainerBottom}>
        {features.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex ? styles.paginationDotActive : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.primary,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    color: darkColors.secondaryText,
    fontSize: 15,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  carousel: {
    flexGrow: 0,
    height: ITEM_HEIGHT,
  },
  carouselContentContainer: {
    alignItems: 'center',
  },
  featureItem: {
    width: width,
    height: ITEM_HEIGHT,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: darkColors.primaryText,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  featureDescription: {
    fontSize: 16,
    color: '#F5F6FA',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  continueButtonTopRight: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonIcon: {
    fontSize: 20,
    color: darkColors.primary,
  },
  paginationContainerBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    height: 30,
    marginBottom: 32,
  },
  paginationDot: {
    height: 10,
    borderRadius: 5,
  },
  paginationDotInactive: {
    width: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  paginationDotActive: {
    width: 25,
    backgroundColor: '#FFFFFF',
    opacity: 1,
  },
});