import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { signOut } = useAuthStore();
  const { displayName, resetOnboarding } = useUserStore();
  
  const handleLogout = () => {
    signOut();
    router.replace('/welcome');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primaryText }]}>Profile</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color={colors.primaryText} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.profileCard, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.profileHeader}>
              <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>{displayName.charAt(0)}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.primaryText }]}>
                  {displayName}
                </Text>
                <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.surfaceBackground }]}>
                  <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>My Circle</Text>
            
            <TouchableOpacity style={[styles.circleCard, { backgroundColor: colors.cardBackground }]}>
              <Ionicons name="people" size={24} color={colors.primary} />
              <Text style={[styles.circleText, { color: colors.primaryText }]}>
                Invite Friends & Family
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Account</Text>
            
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.menuItemText, { color: colors.primaryText }]}>
                Privacy Settings
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.menuItemText, { color: colors.primaryText }]}>
                Notification Preferences
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.menuItemText, { color: colors.primaryText }]}>
                Help & Support
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialIcons name="logout" size={20} color={colors.error} />
              <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
            </TouchableOpacity>
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
  settingsButton: {
    padding: 8,
  },
  profileCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    ...theme.shadows.sm,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  circleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.sm,
  },
  circleText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 8,
  },
});