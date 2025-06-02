import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, FlatList, TextInput, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import MoodPostCard, { MoodPostCardProps } from '@/components/feed/MoodPostCard';

const AppLogo = () => {
  return (
    <Image 
      source={require('@/assets/images/bluelogo.png')} 
      style={styles.logoImage} 
      resizeMode="contain" 
    />
  );
}

const sampleMoodPosts: MoodPostCardProps[] = [
  {
    id: '1',
    user: {
      name: 'Ashwin',
      initials: 'A',
      profilePhotoUrl: undefined,
      streak: 7,
    },
    mood: { emoji: '😊' },
    journalSnippet: 'Had a really productive day today! Finished a big project and feeling accomplished. It feels great to check things off the list.',
    timestamp: '2h ago',
    reactions: { count: 15 },
    comments: { count: 3 },
  },
  {
    id: '2',
    user: {
      name: 'Pravallika',
      initials: 'P',
      streak: 12,
    },
    mood: { emoji: '🎉' },
    journalSnippet: 'Celebrating a small win today! It is important to acknowledge the little steps.',
    timestamp: '5h ago',
    reactions: { count: 22 },
    comments: { count: 5 },
  },
  {
    id: '3',
    user: {
      name: 'Niharika',
      initials: 'N',
      profilePhotoUrl: undefined,
    },
    mood: { emoji: '😔' },
    journalSnippet: 'Feeling a bit down today, trying to stay positive. Sometimes it is hard, but I will get through this.',
    timestamp: '1d ago',
    reactions: { count: 8 },
    comments: { count: 1 },
  },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const [sortAsc, setSortAsc] = React.useState(true);
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [posts, setPosts] = React.useState(sampleMoodPosts);
  const searchAnimation = React.useRef(new Animated.Value(0)).current;

  // Helper to parse timestamp for sorting (example: '2h ago', '1d ago')
  const parseTimestamp = (timestamp: string) => {
    if (timestamp.includes('h')) {
      return parseInt(timestamp) * 60; // hours to minutes
    } else if (timestamp.includes('d')) {
      return parseInt(timestamp) * 24 * 60; // days to minutes
    } else {
      return 0;
    }
  };

  // Filter and sort posts - now only filters by username
  const getFilteredSortedPosts = () => {
    let filtered = posts;
    if (searchText.trim() !== '') {
      const lower = searchText.toLowerCase();
      filtered = posts.filter(
        (p) => p.user.name.toLowerCase().includes(lower)
      );
    }
    filtered = filtered.slice().sort((a, b) => {
      const aTime = parseTimestamp(a.timestamp);
      const bTime = parseTimestamp(b.timestamp);
      return sortAsc ? aTime - bTime : bTime - aTime;
    });
    return filtered;
  };

  const navigateToPostMood = () => {
    console.log('Navigate to Post Mood Screen');
  };

  const navigateToNotifications = () => {
    console.log('Navigate to Notifications Screen for post interactions');
  };

  const handleSearch = () => {
    setShowSearch(true);
    Animated.timing(searchAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSort = () => {
    setSortAsc((prev) => !prev);
  };

  const handleCloseSearch = () => {
    Animated.timing(searchAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowSearch(false);
      setSearchText('');
    });
  };

  const renderItem = ({ item }: { item: MoodPostCardProps }) => (
    <MoodPostCard {...item} />
  );

  const searchWidth = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const searchOpacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <AppLogo />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {showSearch && (
            <Animated.View 
              style={[
                styles.searchContainer,
                { 
                  width: searchWidth,
                  opacity: searchOpacity,
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  marginLeft: 16
                }
              ]}
            >
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search Username"
                placeholderTextColor={colors.secondaryText}
                style={[styles.searchInput, { color: colors.primaryText }]}
                autoFocus
              />
            </Animated.View>
          )}
          <TouchableOpacity 
            onPress={showSearch ? handleCloseSearch : handleSearch} 
            style={{ marginRight: 8 }}
          >
            {showSearch ? (
              <Feather name="x" size={20} color={colors.primaryDark} />
            ) : (
              <Feather name="search" size={20} color={colors.primaryDark} />
            )}
          </TouchableOpacity>
          {!showSearch && (
            <TouchableOpacity onPress={handleSort} style={{ marginRight: 8 }}>
              <MaterialCommunityIcons 
                name="sort" 
                size={20} 
                color={colors.primaryDark}
                style={{ transform: [{ rotate: sortAsc ? '0deg' : '180deg' }] }} 
              />
            </TouchableOpacity>
          )}
          {!showSearch && (
            <TouchableOpacity onPress={navigateToNotifications}>
              <Ionicons name="heart-outline" size={20} color={colors.primaryDark} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.moodPromptCard, { backgroundColor: colors.cardBackground }]}
        onPress={navigateToPostMood}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.primaryText, marginBottom: 2 }}>What is your mood now?</Text>
          <Text style={{ color: colors.secondaryText, fontSize: 13 }}>Share your current vibe with connections.</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
          <Feather name="chevron-right" size={28} color={colors.primaryDark} />
        </View>
      </TouchableOpacity>

      <FlatList
        data={getFilteredSortedPosts()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.feedList}
        contentContainerStyle={styles.feedContentContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  searchContainer: {
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
    flexGrow: 0,
  },
  searchInput: {
    fontSize: 14,
    flex: 1,
  },
  moodPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 8,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  feedList: {
    flex: 1,
  },
  feedContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
});