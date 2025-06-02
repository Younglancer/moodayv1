import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Text style={[styles.title, { color: colors.primaryText }]}>Notifications</Text>
          
          <View style={[styles.emptyState, { backgroundColor: colors.cardBackground }]}>
            <Ionicons name="notifications-outline" size={48} color={colors.border} />
            <Text style={[styles.emptyStateTitle, { color: colors.primaryText }]}>
              No notifications yet
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.secondaryText }]}>
              When you receive notifications about mood updates, milestones, or friend requests, they'll appear here.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  emptyState: {
    flex: 1,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});