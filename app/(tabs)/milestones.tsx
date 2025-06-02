import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

const upcomingMilestones = [
  {
    id: '1',
    title: "Mom's Birthday",
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    type: 'birthday',
  },
  {
    id: '2',
    title: "Wedding Anniversary",
    date: new Date(new Date().setDate(new Date().getDate() + 12)),
    type: 'anniversary',
  },
];

export default function MilestonesScreen() {
  const { colors } = useTheme();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDaysRemaining = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primaryText }]}>Milestones</Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Upcoming</Text>
            
            {upcomingMilestones.map((milestone) => (
              <TouchableOpacity 
                key={milestone.id} 
                style={[styles.milestoneCard, { backgroundColor: colors.cardBackground }]}
              >
                <View style={[styles.milestoneIconContainer, { backgroundColor: colors.surfaceBackground }]}>
                  <MaterialCommunityIcons name="trophy-award" size={24} color={colors.primary} />
                </View>
                <View style={styles.milestoneInfo}>
                  <Text style={[styles.milestoneTitle, { color: colors.primaryText }]}>
                    {milestone.title}
                  </Text>
                  <Text style={[styles.milestoneDate, { color: colors.secondaryText }]}>
                    {formatDate(milestone.date)}
                  </Text>
                </View>
                <View style={styles.daysContainer}>
                  <Text style={[styles.daysNumber, { color: colors.primary }]}>
                    {getDaysRemaining(milestone.date)}
                  </Text>
                  <Text style={[styles.daysLabel, { color: colors.secondaryText }]}>days</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Past Celebrations</Text>
            
            <View style={[styles.emptyState, { backgroundColor: colors.cardBackground }]}>
              <MaterialCommunityIcons name="trophy-award" size={48} color={colors.border} />
              <Text style={[styles.emptyStateTitle, { color: colors.primaryText }]}>
                No past milestones yet
              </Text>
              <Text style={[styles.emptyStateText, { color: colors.secondaryText }]}>
                Add your first milestone to start tracking special moments.
              </Text>
              <TouchableOpacity style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.emptyStateButtonText}>Add Milestone</Text>
              </TouchableOpacity>
            </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...theme.shadows.sm,
  },
  milestoneIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  milestoneDate: {
    fontSize: 14,
  },
  daysContainer: {
    alignItems: 'center',
  },
  daysNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  daysLabel: {
    fontSize: 12,
  },
  emptyState: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
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
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});