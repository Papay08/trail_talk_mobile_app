// src/screens/student/MessagesScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { fonts } from '../../styles/fonts';
import { UserContext } from '../../contexts/UserContext';

export default function MessagesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useContext(UserContext);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'groups', label: 'Groups' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'students', label: 'Students' }
  ];

  // Mock data for conversations
  const conversations = [
    {
      id: '1',
      type: 'direct',
      name: 'Alex Johnson',
      lastMessage: 'Hey, are you going to the study session tomorrow?',
      timestamp: '2 mins ago',
      unreadCount: 3,
      isOnline: true,
      isPinned: true,
      avatar: require('../../../assets/profile_page_icons/default_profile_icon.png'),
      role: 'student'
    },
    {
      id: '2',
      type: 'group',
      name: 'CS Study Group',
      lastMessage: 'Sarah: Meeting moved to room 205',
      timestamp: '1 hour ago',
      unreadCount: 0,
      memberCount: 8,
      isPinned: true,
      avatar: require('../../../assets/profile_page_icons/default_profile_icon.png'),
      role: 'group'
    },
    {
      id: '3',
      type: 'direct',
      name: 'Dr. Sarah Wilson',
      lastMessage: 'Your project submission was excellent!',
      timestamp: '3 hours ago',
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      avatar: require('../../../assets/profile_page_icons/default_profile_icon.png'),
      role: 'faculty'
    },
    {
      id: '4',
      type: 'group',
      name: 'Campus Events',
      lastMessage: 'New event: Career Fair next week',
      timestamp: '5 hours ago',
      unreadCount: 1,
      memberCount: 45,
      isPinned: false,
      avatar: require('../../../assets/profile_page_icons/default_profile_icon.png'),
      role: 'community'
    },
    {
      id: '5',
      type: 'direct',
      name: 'Mike Rodriguez',
      lastMessage: 'Thanks for the notes from yesterday!',
      timestamp: '1 day ago',
      unreadCount: 0,
      isOnline: true,
      isPinned: false,
      avatar: require('../../../assets/profile_page_icons/default_profile_icon.png'),
      role: 'student'
    },
    {
      id: '6',
      type: 'group',
      name: 'Mental Health Support',
      lastMessage: 'Weekly check-in reminder',
      timestamp: '2 days ago',
      unreadCount: 0,
      memberCount: 12,
      isPinned: false,
      avatar: require('../../../assets/profile_page_icons/default_profile_icon.png'),
      role: 'support'
    },
    {
      id: '7',
      type: 'direct',
      name: 'Emily Davis',
      lastMessage: 'Can you help me with the assignment?',
      timestamp: '2 days ago',
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      avatar: require('../../../assets/profile_page_icons/default_profile_icon.png'),
      role: 'student'
    },
    {
      id: '8',
      type: 'group',
      name: 'Art Club',
      lastMessage: 'Exhibition preparations starting',
      timestamp: '3 days ago',
      unreadCount: 0,
      memberCount: 15,
      isPinned: false,
      avatar: require('../../../assets/profile_page_icons/default_profile_icon.png'),
      role: 'community'
    }
  ];

  const filteredConversations = conversations.filter(conversation => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return conversation.unreadCount > 0;
    if (activeFilter === 'groups') return conversation.type === 'group';
    if (activeFilter === 'faculty') return conversation.role === 'faculty';
    if (activeFilter === 'students') return conversation.role === 'student';
    return true;
  });

  const pinnedConversations = conversations.filter(conv => conv.isPinned);
  const unreadCount = conversations.filter(conv => conv.unreadCount > 0).length;

  const handleSearch = () => {
    console.log('Searching messages for:', searchQuery);
  };

  const handleNewMessage = () => {
    console.log('Navigate to new message');
    // navigation.navigate('NewMessage');
  };

  const handleConversationPress = (conversationId) => {
    console.log('Open conversation:', conversationId);
    // navigation.navigate('Chat', { conversationId });
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'student': return '#4ECDC4';
      case 'faculty': return '#45B7D1';
      case 'group': return '#96CEB4';
      case 'community': return '#A882DD';
      case 'support': return '#FF6B6B';
      default: return '#8A8A8A';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'student': return '🎓';
      case 'faculty': return '👨‍🏫';
      case 'group': return '👥';
      case 'community': return '🏛️';
      case 'support': return '💚';
      default: return '💬';
    }
  };

  const renderFilterChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        activeFilter === item.id && styles.filterChipSelected
      ]}
      onPress={() => setActiveFilter(item.id)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.filterChipText,
        activeFilter === item.id && styles.filterChipTextSelected
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderConversationCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationCard}
      onPress={() => handleConversationPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.conversationContent}>
        {/* Avatar with Online Indicator */}
        <View style={styles.avatarContainer}>
          <Image source={item.avatar} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineIndicator} />}
          <View style={[styles.roleIcon, { backgroundColor: getRoleColor(item.role) }]}>
            <Text style={styles.roleIconText}>{getRoleIcon(item.role)}</Text>
          </View>
        </View>

        {/* Conversation Details */}
        <View style={styles.conversationDetails}>
          <View style={styles.nameRow}>
            <Text style={styles.conversationName}>{item.name}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          
          <View style={styles.messageRow}>
            <Text 
              style={[
                styles.lastMessage,
                item.unreadCount > 0 && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            
            {/* Group member count */}
            {item.memberCount && (
              <View style={styles.memberBadge}>
                <Text style={styles.memberText}>{item.memberCount}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Unread Count Badge */}
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.homeBackground} />
      
      {/* Header Background */}
      <ImageBackground 
        source={require('../../../assets/create_post_screen_icons/createpost_header_bg.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Messages</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </ImageBackground>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Field */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Image 
              source={require('../../../assets/bottom_navigation_icons/search_icon_fill.png')}
              style={styles.searchIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* New Message Button */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.newMessageButton}
            onPress={handleNewMessage}
            activeOpacity={0.7}
          >
            <Text style={styles.newMessageIcon}>✉️</Text>
            <Text style={styles.newMessageText}>New Message</Text>
          </TouchableOpacity>
          
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {unreadCount} unread • {conversations.length} conversations
            </Text>
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Filter Conversations</Text>
          <FlatList
            data={filters}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        </View>

        {/* Pinned Conversations */}
        {pinnedConversations.length > 0 && (
          <View style={styles.pinnedSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pinned</Text>
              <View style={styles.pinnedIcon}>
                <Text style={styles.pinnedIconText}>📌</Text>
              </View>
            </View>
            <FlatList
              data={pinnedConversations}
              renderItem={renderConversationCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* All Conversations */}
        <View style={styles.conversationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeFilter === 'all' && 'All Conversations'}
              {activeFilter === 'unread' && 'Unread Messages'}
              {activeFilter === 'groups' && 'Group Chats'}
              {activeFilter === 'faculty' && 'Faculty Messages'}
              {activeFilter === 'students' && 'Student Messages'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {filteredConversations.length} conversations
            </Text>
          </View>
          
          {filteredConversations.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyTitle}>No conversations</Text>
              <Text style={styles.emptyDescription}>
                {activeFilter === 'unread' 
                  ? 'You\'re all caught up! No unread messages.'
                  : 'No conversations match your current filter.'
                }
              </Text>
              <TouchableOpacity style={styles.emptyActionButton}>
                <Text style={styles.emptyActionText}>Start a Conversation</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredConversations}
              renderItem={renderConversationCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.homeBackground,
  },
  headerBackground: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.homeBackground,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: 'rgba(255, 255, 255, 0.6)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.white,
    padding: 0,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  newMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  newMessageIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  newMessageText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  statsText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  filtersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  filtersList: {
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipSelected: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  filterChipTextSelected: {
    color: colors.homeBackground,
    fontFamily: fonts.semiBold,
  },
  pinnedSection: {
    marginBottom: 25,
  },
  conversationsSection: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  pinnedIcon: {
    backgroundColor: 'rgba(255, 209, 102, 0.2)',
    padding: 6,
    borderRadius: 8,
  },
  pinnedIconText: {
    fontSize: 14,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  conversationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: colors.homeBackground,
  },
  roleIcon: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.homeBackground,
  },
  roleIconText: {
    fontSize: 10,
  },
  conversationDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: colors.white,
    fontFamily: fonts.medium,
  },
  memberBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  memberText: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyActionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  emptyActionText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  bottomSpacer: {
    height: 20,
  },
});