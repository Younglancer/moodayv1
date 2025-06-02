import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightColors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';

const BLUE_COLOR = '#0072ff';

export default function TermsOfServiceScreen() {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.mainTitle}>Mooday Mobile App - Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last Updated: May 30, 2025</Text>
        
        <Text style={styles.paragraph}>
          Welcome to Mooday! By using our mobile application (the "Service"), you agree to these brief Terms of Service. Please read them carefully.
        </Text>

        <Text style={styles.subTitle}>1. Your Account</Text>
        <Text style={styles.paragraph}>
          When you create a Mooday account, you must provide accurate information. You are responsible for keeping your password secure and for all activity under your account. Notify us immediately if you suspect unauthorized use.
        </Text>

        <Text style={styles.subTitle}>2. Using Mooday</Text>
        <Text style={styles.paragraph}>
          Mooday is designed for private mood sharing and milestone tracking within your trusted connections.
        </Text>
        <Text style={styles.paragraph}>
          - You can post your daily mood and create personal or shared milestones.{`
`}
          - All content is private and visible only to your selected connections or groups. There is no public sharing.{`
`}
          - We do not allow photo or video uploads.{`
`}
          - You are responsible for your content and for choosing who you share with. Do not post anything unlawful, harmful, or inappropriate. We reserve the right to remove content or accounts that violate these terms.
        </Text>

        <Text style={styles.subTitle}>3. Your Privacy</Text>
        <Text style={styles.paragraph}>
          Your privacy matters to us. Our Privacy Policy explains how we collect, use, and protect your information. By using Mooday, you agree to our data practices as described in that policy.
        </Text>

        <Text style={styles.subTitle}>4. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          Mooday, its content (excluding user-generated content), features, and functionality are owned by [Your Company Name/Developer Name]. You retain rights to your own content, but grant us a license to use it to operate the Service for you and your connections.
        </Text>

        <Text style={styles.subTitle}>5. Links to Other Services</Text>
        <Text style={styles.paragraph}>
          Our app may contain links to third-party websites or services. We are not responsible for their content or privacy practices. Please review their terms.
        </Text>

        <Text style={styles.subTitle}>6. Termination</Text>
        <Text style={styles.paragraph}>
          We may end or suspend your account if you violate these Terms. You can also stop using the Service or delete your account at any time.
        </Text>

        <Text style={styles.subTitle}>7. Disclaimers & Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          Mooday is provided "as is" without warranties. We are not liable for any damages arising from your use of the Service. Your use of Mooday is at your own risk.
        </Text>

        <Text style={styles.subTitle}>8. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We may update these Terms. We will notify you of significant changes. By continuing to use Mooday after changes, you agree to the new terms.
        </Text>

        <Text style={styles.subTitle}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          For questions about these Terms, please contact us at [Your Support Email Address].
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
}); 