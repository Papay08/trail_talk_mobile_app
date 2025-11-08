// src/screens/student/CommunityScreen.js
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

export default function CommunityScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [joinedCommunities, setJoinedCommunities] = useState(['2', '4']); // Mock joined communities
  const { user } = useContext(UserContext);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'academic', label: 'Academic' },
    { id: 'social', label: 'Social' },
    { id: 'support', label: 'Support' },
    { id: 'hobbies', label: 'Hobbies' },
    { id: 'sports', label: 'Sports' }
  ];

  // Mock data for communities
  const communitiesData = [
    {
      id: '1',
      name: 'Computer Science Club',
      description: 'For CS students to collaborate and learn programming',
      memberCount: 245,
      category: 'academic',
      isFeatured: true,
      recentActivity: '2 hours ago',
      icon: '💻',
      privacy: 'public',
      rules: 'Be respectful, share knowledge, help each other grow'
    },
    {
      id: '2',
      name: 'Mental Health Support',
      description: 'Safe space for mental health discussions and support',
      memberCount: 150,
      category: 'support',
      isFeatured: true,
      recentActivity: '5 new posts today',
      icon: '💚',
      privacy: 'public',
      rules: 'Confidentiality, respect, no judgment zone'
    },
    {
      id: '3',
      name: 'Campus Sports Club',
      description: 'Join various sports activities and tournaments',
      memberCount: 89,
      category: 'sports',
      isFeatured: false,
      recentActivity: 'Basketball tournament next week',
      icon: '🏀',
      privacy: 'public',
      rules: 'Sportsmanship, teamwork, regular participation'
    },
    {
      id: '4',
      name: 'Art & Creativity Hub',
      description: 'For artists, writers, and creative minds',
      memberCount: 120,
      category: 'hobbies',
      isFeatured: true,
      recentActivity: 'Art exhibition this Friday',
      icon: '🎨',
      privacy: 'public',
      rules: 'Share your work, constructive feedback only'
    },
    {
      id: '5',
      name: 'International Students',
      description: 'Connect with students from around the world',
      memberCount: 300,
      category: 'social',
      isFeatured: false,
      recentActivity: 'Cultural night planning',
      icon: '🌍',
      privacy: 'public',
      rules: 'Cultural respect, language exchange welcome'
    },
    {
      id: '6',
      name: 'Study Buddies Network',
      description: 'Find study partners for different subjects',
      memberCount: 180,
      category: 'academic',
      isFeatured: false,
      recentActivity: 'New study groups forming',
      icon: '📚',
      privacy: 'public',
      rules: 'Academic integrity, regular attendance'
    },
    {
      id: '7',
      name: 'Music Lovers Society',
      description: 'For musicians and music enthusiasts',
      memberCount: 95,
      category: 'hobbies',
      isFeatured: false,
      recentActivity: 'Jam session tomorrow',
      icon: '🎵',
      privacy: 'public',
      rules: 'All skill levels welcome, share your passion'
    },
    {
      id: '8',
      name: 'Entrepreneurship Club',
      description: 'For future entrepreneurs and innovators',
      memberCount: 75,
      category: 'academic',
      isFeatured: false,
      recentActivity: 'Startup pitch competition',
      icon: '💡',
      privacy: 'public',
      rules: 'Innovation focused, collaborative mindset'
    }
  ];

  const filteredCommunities = communitiesData.filter(community => {
    if (activeCategory === 'all') return true;
    return community.category === activeCategory;
  });

  const featuredCommunities = communitiesData.filter(community => community.isFeatured);
  const myCommunities = communitiesData.filter(community => joinedCommunities.includes(community.id));

  const handleSearch = () => {
    console.log('Searching communities for:', searchQuery);
  };

  const handleJoinCommunity = (communityId) => {
    setJoinedCommunities(prev => 
      prev.includes(communityId) 
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId]
    );
    console.log('Toggled join for community:', communityId);
  };

  const handleCreateCommunity = () => {
    console.log('Navigate to create community');
    // navigation.navigate('CreateCommunity');
  };

  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        activeCategory === item.id && styles.categoryChipSelected
      ]}
      onPress={() => setActiveCategory(item.id)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.categoryChipText,
        activeCategory === item.id && styles.categoryChipTextSelected
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderCommunityCard = ({ item }) => {
    const isJoined = joinedCommunities.includes(item.id);
    
    return (
      <TouchableOpacity style={styles.communityCard} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={styles.communityIconContainer}>
            <Text style={styles.communityIcon}>{item.icon}</Text>
          </View>
          <View style={styles.communityInfo}>
            <Text style={styles.communityName}>{item.name}</Text>
            <Text style={styles.communityDescription}>{item.description}</Text>
            <View style={styles.communityStats}>
              <Text style={styles.memberCount}>{item.memberCount} members</Text>
              <Text style={styles.activityText}>• {item.recentActivity}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <TouchableOpacity 
            style={[
              styles.joinButton,
              isJoined && styles.joinedButton
            ]}
            onPress={() => handleJoinCommunity(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.joinButtonText,
              isJoined && styles.joinedButtonText
            ]}>
              {isJoined ? 'Joined' : 'Join'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFeaturedCard = ({ item }) => (
    <TouchableOpacity style={styles.featuredCard} activeOpacity={0.7}>
      <View style={styles.featuredIconContainer}>
        <Text style={styles.featuredIcon}>{item.icon}</Text>
      </View>
      <View style={styles.featuredContent}>
        <Text style={styles.featuredName}>{item.name}</Text>
        <Text style={styles.featuredDescription}>{item.description}</Text>
        <View style={styles.featuredStats}>
          <Text style={styles.featuredMemberCount}>{item.memberCount} members</Text>
          <View style={[
            styles.featuredBadge,
            item.category === 'academic' && styles.academicBadge,
            item.category === 'support' && styles.supportBadge,
            item.category === 'hobbies' && styles.hobbiesBadge
          ]}>
            <Text style={styles.featuredBadgeText}>{item.category}</Text>
          </View>
        </View>
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
          <Text style={styles.headerTitle}>Communities</Text>
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
              placeholder="Search for communities, interests..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Create Community Button */}
        <View style={styles.createSection}>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateCommunity}
            activeOpacity={0.7}
          >
            <Text style={styles.createButtonIcon}>+</Text>
            <Text style={styles.createButtonText}>Create Community</Text>
          </TouchableOpacity>
        </View>

        {/* My Communities Section */}
        {myCommunities.length > 0 && (
          <View style={styles.myCommunitiesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Communities</Text>
              <Text style={styles.sectionSubtitle}>{myCommunities.length} joined</Text>
            </View>
            <FlatList
              data={myCommunities}
              renderItem={renderCommunityCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Featured Communities */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Communities</Text>
            <Text style={styles.sectionSubtitle}>Popular on campus</Text>
          </View>
          <FlatList
            data={featuredCommunities}
            renderItem={renderFeaturedCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Category Chips */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* All Communities */}
        <View style={styles.allCommunitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeCategory === 'all' && 'All Communities'}
              {activeCategory === 'academic' && 'Academic Communities'}
              {activeCategory === 'social' && 'Social Communities'}
              {activeCategory === 'support' && 'Support Communities'}
              {activeCategory === 'hobbies' && 'Hobby Communities'}
              {activeCategory === 'sports' && 'Sports Communities'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {filteredCommunities.length} communities
            </Text>
          </View>
          
          <FlatList
            data={filteredCommunities}
            renderItem={renderCommunityCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
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
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 1.5,
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
    marginBottom: 10,
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
  createSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  createButtonIcon: {
    fontSize: 20,
    color: colors.white,
    marginRight: 8,
    fontFamily: fonts.bold,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  myCommunitiesSection: {
    marginBottom: 25,
  },
  featuredSection: {
    marginBottom: 25,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  allCommunitiesSection: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 200,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featuredIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featuredIcon: {
    fontSize: 24,
  },
  featuredContent: {
    flex: 1,
  },
  featuredName: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    lineHeight: 16,
  },
  featuredStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredMemberCount: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  featuredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  academicBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.5)',
  },
  supportBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  hobbiesBadge: {
    backgroundColor: 'rgba(156, 39, 176, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.5)',
  },
  featuredBadgeText: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
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
  categoryChipSelected: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  categoryChipTextSelected: {
    color: colors.homeBackground,
    fontFamily: fonts.semiBold,
  },
  communityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  communityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  communityIcon: {
    fontSize: 18,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    lineHeight: 18,
  },
  communityStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.5)',
    marginRight: 8,
  },
  activityText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'capitalize',
  },
  joinButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  joinedButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  joinedButtonText: {
    color: colors.white,
  },
  bottomSpacer: {
    height: 20,
  },
});