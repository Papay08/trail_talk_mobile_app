// src/screens/faculty/NotificationsScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { fonts } from '../../styles/fonts';
import { UserContext } from '../../contexts/UserContext';

export default function FacultyNotificationsScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'student_post',
      title: 'New post from Computer Science class',
      description: 'Student posted about the upcoming project deadline',
      time: '15 mins ago',
      isRead: false,
      userAvatar: require('../../../assets/profile_page_icons/default_profile_icon.png'),
      postPreview: 'Working on the final project - any tips for the database design?',
      icon: '📚'
    },
    {
      id: '2',
      type: 'department',
      title: 'Department Meeting Reminder',
      description: 'Monthly faculty meeting scheduled for tomorrow',
      time: '1 hour ago',
      isRead: false,
      icon: '🏛️'
    },
    {
      id: '3',
      type: 'research',
      title: 'Research Collaboration Request',
      description: 'Dr. Chen wants to collaborate on AI research project',
      time: '3 hours ago',
      isRead: true,
      userAvatar: require('../../../assets/profile_page_icons/default_profile_icon.png'),
      actionText: 'View Request',
      icon: '🔬'
    },
    {
      id: '4',
      type: 'system',
      title: 'Grade Submission Deadline',
      description: 'Final grades due by Friday 5:00 PM',
      time: '5 hours ago',
      isRead: true,
      isImportant: true,
      icon: '📝'
    },
    {
      id: '5',
      type: 'faculty_community',
      title: 'New discussion in Faculty Forum',
      description: 'Curriculum development topic gaining attention',
      time: '1 day ago',
      isRead: true,
      communityName: 'Faculty Development',
      icon: '👥'
    },
    {
      id: '6',
      type: 'student_question',
      title: 'Student question in your post',
      description: 'Emily Davis asked about the assignment requirements',
      time: '1 day ago',
      isRead: true,
      userAvatar: require('../../../assets/profile_page_icons/default_profile_icon.png'),
      postPreview: 'Could you clarify the submission format for the research paper?',
      icon: '❓'
    },
    {
      id: '7',
      type: 'announcement',
      title: 'Campus-wide Announcement',
      description: 'New library resources available for faculty',
      time: '2 days ago',
      isRead: true,
      icon: '📢'
    },
    {
      id: '8',
      type: 'professional',
      title: 'Professional Development Opportunity',
      description: 'Teaching excellence workshop next month',
      time: '3 days ago',
      isRead: true,
      icon: '💼'
    }
  ]);

  const { user } = useContext(UserContext);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'department', label: 'Department' },
    { id: 'research', label: 'Research' },
    { id: 'students', label: 'Students' },
    { id: 'system', label: 'System' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.isRead;
    return notification.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'student_post': return '#4ECDC4';
      case 'department': return '#45B7D1';
      case 'research': return '#96CEB4';
      case 'system': return '#FFD166';
      case 'faculty_community': return '#A882DD';
      case 'student_question': return '#6A8EAE';
      case 'announcement': return '#FF9F1C';
      case 'professional': return '#FF6B6B';
      default: return '#8A8A8A';
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

  const renderNotificationCard = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadNotification,
        item.isImportant && styles.importantNotification
      ]}
      onPress={() => handleMarkAsRead(item.id)}
      activeOpacity={0.7}
    >
      {/* Notification Indicator */}
      {!item.isRead && <View style={styles.unreadIndicator} />}
      
      <View style={styles.notificationContent}>
        {/* Icon and Main Content */}
        <View style={styles.notificationHeader}>
          <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(item.type) }]}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>
          
          <View style={styles.notificationText}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationDescription}>{item.description}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
            
            {/* Post Preview or Additional Info */}
            {item.postPreview && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewText}>"{item.postPreview}"</Text>
              </View>
            )}
            
            {item.communityName && (
              <View style={styles.communityBadge}>
                <Text style={styles.communityText}>{item.communityName}</Text>
              </View>
            )}
          </View>
        </View>

        {/* User Avatar (if applicable) */}
        {item.userAvatar && (
          <Image source={item.userAvatar} style={styles.userAvatar} />
        )}

        {/* Action Button (if applicable) */}
        {item.actionText && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>{item.actionText}</Text>
          </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Faculty Notifications</Text>
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
        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButtonLarge}
            onPress={handleMarkAllAsRead}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonLargeText}>Mark All as Read</Text>
          </TouchableOpacity>
          
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {unreadCount} unread • {notifications.length} total
            </Text>
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Filter Notifications</Text>
          <FlatList
            data={filters}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        </View>

        {/* Notifications List */}
        <View style={styles.notificationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeFilter === 'all' && 'All Faculty Notifications'}
              {activeFilter === 'unread' && 'Unread Notifications'}
              {activeFilter === 'department' && 'Department Updates'}
              {activeFilter === 'research' && 'Research Opportunities'}
              {activeFilter === 'students' && 'Student Interactions'}
              {activeFilter === 'system' && 'System Alerts'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {filteredNotifications.length} notifications
            </Text>
          </View>
          
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptyDescription}>
                {activeFilter === 'unread' 
                  ? 'You\'re all caught up! No unread notifications.'
                  : 'No notifications match your current filter.'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredNotifications}
              renderItem={renderNotificationCard}
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
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  actionButtonLarge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonLargeText: {
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
  notificationsSection: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  importantNotification: {
    borderColor: '#FFD166',
    backgroundColor: 'rgba(255, 209, 102, 0.1)',
  },
  unreadIndicator: {
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: [{ translateY: -4 }],
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
  },
  previewContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
  },
  previewText: {
    fontSize: 13,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  communityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(150, 206, 180, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  communityText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: '#96CEB4',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
    alignSelf: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: fonts.medium,
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
  },
  bottomSpacer: {
    height: 20,
  },
});