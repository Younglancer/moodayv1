import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightColors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';

const BLUE_COLOR = '#0072ff';

export default function PrivacyPolicyScreen() {
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{ 
          headerShown: false, 
        }} 
      />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={BLUE_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.mainTitle}>Mooday Mobile App - Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: May 30, 2025</Text>

        <Text style={styles.paragraph}>
          Your privacy is a top priority at Mooday. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile app (the "Service").
        </Text>

        <Text style={styles.subTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information to provide and improve Mooday:
        </Text>
        <Text style={styles.paragraphBold}>Information You Provide:</Text>
        <Text style={styles.listItem}>
          - Account details: Email/phone number, display name.
        </Text>
        <Text style={styles.listItem}>
          - Your content: Mood entries (with optional notes), milestone details (title, date, notes, sharing settings), reactions, and text responses.
        </Text>
        <Text style={styles.listItem}>
          - Connection data: Information about your accepted connections and how you group them (Family, Friends, etc.).
        </Text>
        <Text style={styles.listItem}>
          - Contact access (for invites): If you use the "Invite Friends & Family" feature, we securely hash contacts on your device to find existing Mooday users or send invites. We do NOT store your raw contact list.
        </Text>
        <Text style={styles.paragraphBold}>Information We Collect Automatically:</Text>
        <Text style={styles.listItem}>
          - Usage data: How you interact with the app (features used, time spent).
        </Text>
        <Text style={styles.listItem}>
          - Device data: Your device type, operating system, IP address.
        </Text>

        <Text style={styles.subTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use your information to:
        </Text>
        <Text style={styles.listItem}>
          - Operate Mooday: Provide core features like mood posting, milestone tracking, and connecting with others.
        </Text>
        <Text style={styles.listItem}>
          - Personalize Your Experience: Show you content from your connections and manage your reminders.
        </Text>
        <Text style={styles.listItem}>
          - Communicate: Send essential service messages and notifications based on your preferences.
        </Text>
        <Text style={styles.listItem}>
          - Ensure Security: Protect against fraud and keep Mooday safe.
        </Text>
        <Text style={styles.listItem}>
          - Improve the App: Understand usage to make Mooday better.
        </Text>
        <Text style={styles.listItem}>
          - Comply with Law: Meet legal obligations.
        </Text>

        <Text style={styles.subTitle}>3. How Your Information Is Shared</Text>
        <Text style={styles.paragraph}>
          Your information is NOT shared for third-party marketing or advertising.
        </Text>
        <Text style={styles.listItem}>
          - With Your Connections: Your mood posts and shared milestones are only visible to the specific connections or groups you choose within the app.
        </Text>
        <Text style={styles.listItem}>
          - With Service Providers: We use trusted third-party services (like Supabase for database and authentication, or SMS/email providers for message delivery) to help operate the app. They only access your data as needed to perform their services for us and are required to keep it confidential.
        </Text>
        <Text style={styles.listItem}>
          - For Legal Reasons: We may disclose information if required by law or to protect our rights or the safety of others.
        </Text>

        <Text style={styles.subTitle}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We use strong security measures (like encryption and secure storage) to protect your data. However, no internet transmission or electronic storage is 100% secure.
        </Text>

        <Text style={styles.subTitle}>5. Your Rights</Text>
        <Text style={styles.paragraph}>
          Depending on where you are, you may have rights regarding your personal data, such as accessing, correcting, or deleting your information. Please contact us to exercise these rights.
        </Text>

        <Text style={styles.subTitle}>6. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Mooday is not for children under 13. If we learn we've collected data from a child under 13 without parental consent, we will remove it.
        </Text>

        <Text style={styles.subTitle}>7. Changes to Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy. We'll notify you of changes by posting the new policy and updating the "Last Updated" date.
        </Text>

        <Text style={styles.subTitle}>8. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about this Privacy Policy, please contact us at [Your Support Email Address].
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
    backgroundColor: lightColors.white,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: lightColors.primaryText,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: lightColors.primaryText,
    marginBottom: 5,
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 14,
    color: lightColors.secondaryText,
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: lightColors.primaryText,
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: lightColors.secondaryText,
    marginBottom: 15,
  },
  paragraphBold: {
    fontSize: 16,
    lineHeight: 24,
    color: lightColors.secondaryText,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: lightColors.secondaryText,
    marginBottom: 8,
    paddingLeft: 10,
  },
});