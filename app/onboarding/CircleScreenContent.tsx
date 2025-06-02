import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Alert, Animated } from 'react-native';
import { router } from 'expo-router';
import { lightColors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';
import { useUserStore } from '@/stores/userStore';
import * as Contacts from 'expo-contacts';
import * as Linking from 'expo-linking';
import { Image as ExpoImage } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CircleScreenContent() {
  const [isLoading, setIsLoading] = useState(false);
  const { completeOnboarding } = useUserStore();

  // Animation refs
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in title/description, then buttons
    Animated.sequence([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(200),
      Animated.timing(buttonsOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleOpacity, buttonsOpacity]);

  const handleInviteFriends = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your contacts to send invites.');
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (!data.length) {
      Alert.alert('No contacts found', 'You have no contacts with phone numbers.');
      return;
    }

    const contactNames = data
      .filter(c => c.phoneNumbers && c.phoneNumbers.length > 0)
      .map(c => c.name);

    Alert.alert(
      'Select Contact',
      'Who do you want to invite?',
      contactNames.map((name, idx) => ({
        text: name,
        onPress: () => {
          const contact = data[idx];
          const phoneNumber = contact.phoneNumbers?.[0]?.number;
          if (!phoneNumber) return;
          const inviteLink = 'https://yourapp.com/invite';
          const smsUrl = `sms:${phoneNumber}?body=Join me on Mooday! Here's the invite: ${inviteLink}`;
          Linking.openURL(smsUrl);
        },
      }))
    );
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <ProgressIndicator steps={3} currentStep={2} activeColor={lightColors.primaryText} inactiveColor={lightColors.secondaryText} />
        </View>
        <View style={styles.header}>
          <Animated.View style={{ opacity: titleOpacity }}>
            <Text style={styles.title}>Connect Your Circle</Text>
            <Text style={styles.subtitle}>
              Mooday is better with friends and family. Invite them to join your private circle and start sharing meaningful moments together.
            </Text>
          </Animated.View>
        </View>
        <View style={styles.imageContainer}>
          <ExpoImage
            source={require('../../assets/images/circle.png')}
            style={styles.image}
            contentFit="cover"
            transition={100}
          />
        </View>
        <Animated.View style={[styles.buttonContainer, { opacity: buttonsOpacity }]}> 
          <Button
            title="Invite Friends & Family"
            leftIcon={<MaterialCommunityIcons name="account-group" size={20} color={lightColors.white} />}
            onPress={handleInviteFriends}
            isLoading={isLoading}
            style={styles.inviteButton}
          />
          <Button
            title="Skip for now"
            variant="text"
            onPress={handleSkip}
            style={styles.skipButton}
            textStyle={{ color: lightColors.secondaryText }}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  progressContainer: {
    paddingVertical: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: lightColors.primaryText,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: lightColors.secondaryText,
    lineHeight: 24,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    gap: 16,
    paddingBottom: 16,
  },
  inviteButton: {
    marginBottom: 0,
  },
  skipButton: {
    alignSelf: 'center',
  },
}); 