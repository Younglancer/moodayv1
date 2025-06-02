import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Animated } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

// Define the expected props for a mood post
export interface MoodPostCardProps {
  id: string;
  user: {
    name: string;
    profilePhotoUrl?: string;
    initials: string;
    streak?: number;
  };
  mood: {
    emoji: string;
  };
  journalSnippet?: string;
  timestamp: string;
  reactions: {
    count: number;
    userReaction?: string;
    breakdown?: {
      like: number;
      love: number;
      celebrate: number;
      excited: number;
      funny: number;
      support: number;
    };
    users?: {
      [key: string]: {
        name: string;
        reaction: string;
      }[];
    };
  };
  comments: {
    count: number;
  };
}

// Custom celebration emoji (party face)
const CelebrationEmoji = () => (
  <Text style={{ fontSize: 20 }}>🥳</Text>
);

// Custom excited emoji (star-struck)
const ExcitedEmoji = () => (
  <Text style={{ fontSize: 20 }}>🤩</Text>
);

// Custom support emoji (handshake)
const SupportEmoji = () => (
  <Text style={{ fontSize: 20 }}>🤝</Text>
);

// Custom funny emoji (laughing face)
const FunnyEmoji = () => (
  <Text style={{ fontSize: 20 }}>😂</Text>
);

// Reaction types configuration with custom icons
const REACTIONS = [
  {
    type: 'like',
    label: 'Like',
    color: '#1877F2',
    renderIcon: (color: string, size: number = 20) => <Ionicons name="thumbs-up" size={size} color={color} />
  },
  {
    type: 'love',
    label: 'Love',
    color: '#E91E63',
    renderIcon: (color: string, size: number = 20) => <Ionicons name="heart" size={size} color={color} />
  },
  {
    type: 'celebrate',
    label: 'Celebrate',
    color: '#FF9800',
    renderIcon: () => <CelebrationEmoji />
  },
  {
    type: 'excited',
    label: 'Excited',
    color: '#9C27B0',
    renderIcon: () => <ExcitedEmoji />
  },
  {
    type: 'funny',
    label: 'Funny',
    color: '#FFC107',
    renderIcon: () => <FunnyEmoji />
  },
  {
    type: 'support',
    label: 'Support',
    color: '#4CAF50',
    renderIcon: () => <SupportEmoji />
  },
];

const MoodPostCard: React.FC<MoodPostCardProps> = (props) => {
  const { colors } = useTheme();
  const { user, mood, journalSnippet, timestamp, reactions, comments } = props;

  // State management with explicit initial values
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showReactionDetails, setShowReactionDetails] = useState(false);
  const [currentUserReaction, setCurrentUserReaction] = useState<string>(reactions.userReaction || '');

  // Initialize reaction counts
  type ReactionType = 'like' | 'love' | 'celebrate' | 'excited' | 'funny' | 'support';

  const [reactionCounts, setReactionCounts] = useState<Record<ReactionType, number>>(() => ({
    like: reactions.breakdown?.like || 0,
    love: reactions.breakdown?.love || 0,
    celebrate: reactions.breakdown?.celebrate || 0,
    excited: reactions.breakdown?.excited || 0,
    funny: reactions.breakdown?.funny || 0,
    support: reactions.breakdown?.support || 0
  }));

  // Initialize reaction users with mock data for now, but make it updatable
  const [reactionUsers, setReactionUsers] = useState<MoodPostCardProps['reactions']['users']>(() => reactions.users || {
    like: [{ name: 'John Doe', reaction: 'like' }, { name: 'Jane Smith', reaction: 'like' }],
    love: [{ name: 'Alice Johnson', reaction: 'love' }],
    celebrate: [],
    excited: [],
    funny: [],
    support: []
  });

  const [reactionButtonLayout, setReactionButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Animation refs - Initialize with proper values for crisp appearance
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(10)).current;

  const renderProfilePhoto = useCallback(() => {
    if (user.profilePhotoUrl) {
      return <Image source={{ uri: user.profilePhotoUrl }} style={styles.profilePhoto} />;
    }
    return (
      <View style={[styles.profilePhotoInitials, { backgroundColor: colors.primary }]}>
        <Text style={styles.profileInitialsText}>{user.initials}</Text>
      </View>
    );
  }, [user.profilePhotoUrl, user.initials, colors.primary]);

  // handleReactionPress - only handles simple like toggle
  const handleReactionPress = useCallback(() => {
    setCurrentUserReaction((prevReaction) => {
      setReactionCounts((prevCounts) => {
        const newReactionCounts = { ...prevCounts };
        if (prevReaction) {
          const prevKey = prevReaction as ReactionType;
          newReactionCounts[prevKey] = Math.max(0, newReactionCounts[prevKey] - 1);
        } else {
          newReactionCounts.like = newReactionCounts.like + 1;
        }
        return newReactionCounts;
      });
      setReactionUsers((prevUsers) => {
        const newReactionUsers = { ...prevUsers };
        const currentUserName = user.name;
        if (prevReaction) {
          const prevKey = prevReaction as ReactionType;
          if (newReactionUsers[prevKey]) {
            newReactionUsers[prevKey] = newReactionUsers[prevKey]?.filter(
              (rUser) => rUser.name !== currentUserName
            );
          }
        } else {
          if (!newReactionUsers.like) {
            newReactionUsers.like = [];
          }
          newReactionUsers.like.push({ name: currentUserName, reaction: 'like' });
        }
        return newReactionUsers;
      });
      return prevReaction ? '' : 'like';
    });
  }, [user.name]);

  const handleReactionLongPress = useCallback(() => {
    // Start with crisp, visible values
    scaleAnim.setValue(1);
    opacityAnim.setValue(0);
    translateYAnim.setValue(10);

    setShowReactionPicker(true);

    // Animate only opacity and translateY for smooth appearance
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
    ]).start();
  }, [opacityAnim, translateYAnim]);

  const closeReactionPicker = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 10,
        useNativeDriver: true,
        tension: 200,
        friction: 15,
      }),
    ]).start(() => {
      setShowReactionPicker(false);
    });
  }, [opacityAnim, translateYAnim]);

  const handleReactionSelect = useCallback((reactionType: string) => {
    setCurrentUserReaction((prevReaction) => {
      setReactionCounts((prevCounts) => {
        const newReactionCounts = { ...prevCounts };
        if (prevReaction) {
          const prevKey = prevReaction as ReactionType;
          newReactionCounts[prevKey] = Math.max(0, newReactionCounts[prevKey] - 1);
        }
        if (prevReaction !== reactionType) {
          const newKey = reactionType as ReactionType;
          newReactionCounts[newKey] += 1;
        }
        return newReactionCounts;
      });
      setReactionUsers((prevUsers) => {
        const newReactionUsers = { ...prevUsers };
        const currentUserName = user.name;
        if (prevReaction) {
          const prevKey = prevReaction as ReactionType;
          if (newReactionUsers[prevKey]) {
            newReactionUsers[prevKey] = newReactionUsers[prevKey]?.filter(
              (rUser) => rUser.name !== currentUserName
            );
          }
        }
        if (prevReaction !== reactionType) {
          const newKey = reactionType as ReactionType;
          if (!newReactionUsers[newKey]) {
            newReactionUsers[newKey] = [];
          }
          if (!newReactionUsers[newKey]?.some(rUser => rUser.name === currentUserName)) {
            newReactionUsers[newKey]?.push({ name: currentUserName, reaction: reactionType });
          }
        }
        return newReactionUsers;
      });
      closeReactionPicker();
      return prevReaction === reactionType ? '' : reactionType;
    });
  }, [user.name, closeReactionPicker]);

  const handleReactionCountPress = useCallback(() => {
    setShowReactionDetails(true);
  }, []);

  // Computed values
  const getCurrentReaction = useCallback(() => {
    return REACTIONS.find(r => r.type === currentUserReaction);
  }, [currentUserReaction]);

  const getTotalReactions = useCallback(() => {
    return Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  }, [reactionCounts]);

  const getTopReactions = useCallback(() => {
    return Object.entries(reactionCounts)
      .filter(([_, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => REACTIONS.find(r => r.type === type))
      .filter(Boolean);
  }, [reactionCounts]);

  const currentReaction = getCurrentReaction();
  const totalReactions = getTotalReactions();
  const topReactions = getTopReactions();

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      {/* Top Section */}
      <View style={styles.topSection}>
        {renderProfilePhoto()}
        <View style={styles.userInfo}>
          <View style={styles.userNameStreak}>
            <Text style={[styles.userName, { color: colors.primaryText }]}>{user.name}</Text>
            {user.streak && (
              <Text style={[styles.streakText, { color: colors.secondaryText }]}>
                🔥 {user.streak} Day Streak
              </Text>
            )}
          </View>
          <Text style={[styles.timestamp, { color: colors.secondaryText }]}>{timestamp}</Text>
        </View>
      </View>

      {/* Middle Section (Mood & Journal) */}
      <View style={styles.middleSection}>
        {journalSnippet && (
          <Text style={[styles.journalSnippet, { color: colors.primaryText }]}>
            {journalSnippet}
          </Text>
        )}
      </View>

      {/* Reaction Summary - Facebook Style */}
      {totalReactions > 0 && (
        <TouchableOpacity
          style={styles.reactionSummary}
          onPress={handleReactionCountPress}
          activeOpacity={0.6}
        >
          <View style={styles.reactionEmojis}>
            {topReactions.map((reaction, index) => (
              <View key={reaction?.type} style={[styles.reactionEmojiContainer, { marginLeft: index > 0 ? -8 : 0, zIndex: topReactions.length - index }]}>
                {reaction?.renderIcon(reaction.color, 16)}
              </View>
            ))}
          </View>
          <Text style={[styles.reactionCount, { color: colors.secondaryText }]}>
            {totalReactions}
          </Text>
        </TouchableOpacity>
      )}

      {/* Bottom Section (Interactions) */}
      <View style={[styles.bottomSection, { borderTopColor: colors.border, justifyContent: 'flex-start' }]}> 
        <TouchableOpacity
          style={styles.interactionItem}
          onPress={handleReactionPress}
          onLongPress={handleReactionLongPress}
          delayLongPress={400}
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setReactionButtonLayout({ x, y, width, height });
          }}
        >
          {currentReaction ? (
            <>
              {currentReaction.renderIcon(currentReaction.color, 18)}
            </>
          ) : (
            <>
              <Ionicons name="thumbs-up-outline" size={18} color={colors.secondaryText} />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.interactionItem}>
          <MaterialCommunityIcons name="message-outline" size={18} color={colors.secondaryText} />
        </TouchableOpacity>
      </View>

      {/* Reaction Picker - Fixed positioning and animation */}
      {showReactionPicker && (
        <>
          {/* Backdrop as a full-screen TouchableOpacity */}
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, styles.modalBackdrop]}
            onPress={closeReactionPicker}
            activeOpacity={1}
          />
          <View style={styles.reactionPickerContainer}>
            <Animated.View
              style={[
                styles.reactionPicker,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  transform: [
                    { scale: scaleAnim },
                    { translateY: translateYAnim }
                  ],
                  opacity: opacityAnim,
                  position: 'absolute',
                  bottom: 70,
                  left: Math.max(10, reactionButtonLayout.x - 60),
                  zIndex: 2000,
                }
              ]}
            >
              {REACTIONS.map((reaction, index) => (
                <View
                  key={reaction.type}
                  style={styles.reactionOption}
                >
                  <TouchableOpacity
                    style={styles.reactionTouchable}
                    onPress={() => handleReactionSelect(reaction.type)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.reactionOptionIcon}>
                      {reaction.renderIcon(reaction.color, 24)}
                    </View>
                    <Text style={[styles.reactionOptionLabel, { color: colors.primaryText }]}>
                      {reaction.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </Animated.View>
          </View>
        </>
      )}

      {/* Reaction Details Modal */}
      <Modal
        visible={showReactionDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReactionDetails(false)}
      >
        <View style={styles.reactionDetailsModalContainer}>
          <View style={[styles.reactionDetailsModal, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.reactionDetailsHeader}>
              <Text style={[styles.reactionDetailsTitle, { color: colors.primaryText }]}>
                Reactions
              </Text>
              <TouchableOpacity
                onPress={() => setShowReactionDetails(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: colors.secondaryText }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.reactionTabs}>
              <View style={[styles.reactionTab, styles.activeTab]}>
                <Text style={[styles.reactionTabText, { color: colors.primaryText }]}>
                  All {totalReactions}
                </Text>
              </View>
              {REACTIONS.filter(r => reactionCounts[r.type as keyof typeof reactionCounts] > 0).map(reaction => (
                <View key={reaction.type} style={styles.reactionTab}>
                  {reaction.renderIcon(reaction.color, 16)}
                  <Text style={[styles.reactionTabCount, { color: colors.secondaryText }]}>
                    {reactionCounts[reaction.type as keyof typeof reactionCounts]}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.reactionUsersList}>
              {Object.entries(reactionUsers ?? {}).map(([reactionType, users]) =>
                users.map((user, index) => {
                  const reaction = REACTIONS.find(r => r.type === reactionType);
                  return (
                    <View key={`${reactionType}-${index}`} style={styles.reactionUserItem}>
                      <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
                        <Text style={styles.userAvatarText}>{user.name.charAt(0)}</Text>
                      </View>
                      <Text style={[styles.reactionUserName, { color: colors.primaryText }]}>
                        {user.name}
                      </Text>
                      <View style={styles.reactionUserReaction}>
                        {reaction?.renderIcon(reaction.color, 16)}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  profilePhotoInitials: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitialsText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userNameStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  streakText: {
    fontSize: 10,
    marginLeft: 6,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 10,
  },
  middleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  journalSnippet: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'left',
  },
  reactionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  reactionEmojis: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reactionEmojiContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  reactionCount: {
    fontSize: 12,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  reactionPickerContainer: {
    position: 'relative',
  },
  reactionPicker: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    zIndex: 1000,
  },
  reactionOption: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  reactionTouchable: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  reactionOptionIcon: {
    marginBottom: 2,
  },
  reactionOptionLabel: {
    fontSize: 9,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Reaction Details Modal Styles
  reactionDetailsModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  reactionDetailsModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  reactionDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  reactionDetailsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  reactionTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  reactionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  reactionTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reactionTabCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  reactionUsersList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  reactionUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reactionUserName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  reactionUserReaction: {
    marginLeft: 10,
  },
});

export default MoodPostCard;