// src/screens/student/SearchScreen.js
import React from 'react';
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
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { fonts } from '../../styles/fonts';
import { useSearch } from '../../hooks/useSearch';

export default function SearchScreen({ navigation }) {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestedAccounts,
    isLoading,
    error,
    activeCategory,
    setActiveCategory,
    followUser,
    unfollowUser,
    clearSearch,
    loadSuggestedContent
  } = useSearch();

  const [refreshing, setRefreshing] = React.useState(false);
  const [hiddenUsers, setHiddenUsers] = React.useState(new Set());

  // Categories including Communities
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'students', label: 'Students' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'communities', label: 'Communities' }
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    setHiddenUsers(new Set()); // Clear hidden users on refresh
    await loadSuggestedContent();
    setRefreshing(false);
  };

  // Filter out hidden users from results
  const filteredSearchResults = searchResults.filter(user => !hiddenUsers.has(user.id));
  const filteredSuggestedAccounts = suggestedAccounts.filter(user => !hiddenUsers.has(user.id));

  const handleDeleteUser = (userId) => {
    setHiddenUsers(prev => new Set(prev).add(userId));
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

  const renderUserCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userIdentity}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../../assets/profile_page_icons/default_profile_icon.png')} 
              style={styles.avatar} 
            />
            <View style={[
              styles.initialsBadge,
              item.user_type === 'student' ? styles.studentBadge : styles.facultyBadge
            ]}>
              <Text style={styles.initialsText}>{item.initials}</Text>
            </View>
          </View>
          <View style={styles.userMainInfo}>
            <Text style={styles.userName}>{item.displayName}</Text>
            <View style={[
              styles.roleBadge,
              item.user_type === 'student' ? styles.studentRoleBadge : styles.facultyRoleBadge
            ]}>
              <Text style={styles.roleText}>
                {item.user_type === 'student' ? 'Student' : 'Faculty'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.userStats}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{item.postCount || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{item.followersCount || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[
            styles.followButton,
            item.isFollowing && styles.followingButton
          ]}
          onPress={() => item.isFollowing ? unfollowUser(item.id) : followUser(item.id)}
        >
          <Text style={[
            styles.followButtonText,
            item.isFollowing && styles.followingButtonText
          ]}>
            {item.isFollowing ? '✓ Following' : '+ Follow'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteUser(item.id)}
        >
          <Text style={styles.deleteButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const hasSearchResults = filteredSearchResults.length > 0;
  const hasSuggestedContent = filteredSuggestedAccounts.length > 0;
  const showSuggestedContent = !searchQuery.trim() && !hasSearchResults;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.homeBackground} />
      
      {/* Fixed Header Section */}
      <View style={styles.fixedHeader}>
        <ImageBackground 
          source={require('../../../assets/create_post_screen_icons/createpost_header_bg.png')}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Discover People</Text>
          </View>
        </ImageBackground>

        {/* Search and Categories Section */}
        <View style={styles.searchCategoriesContainer}>
          {/* Search Field */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Image 
                source={require('../../../assets/bottom_navigation_icons/search_icon_fill.png')}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search people..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
              <View style={styles.searchRightContent}>
                {searchQuery ? (
                  <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>✕</Text>
                  </TouchableOpacity>
                ) : (
                  isLoading && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={colors.white} />
                    </View>
                  )
                )}
              </View>
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Category Chips */}
          <View style={styles.categoriesSection}>
            <FlatList
              data={categories}
              renderItem={renderCategoryChip}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
        </View>
      </View>

      {/* Scrollable Content Section */}
      <View style={styles.scrollableContent}>
        <FlatList
          data={showSuggestedContent ? filteredSuggestedAccounts : filteredSearchResults}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.white}
              colors={[colors.white]}
            />
          }
          ListHeaderComponent={
            hasSearchResults && (
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>
                  {filteredSearchResults.length} {filteredSearchResults.length === 1 ? 'person' : 'people'} found
                </Text>
              </View>
            )
          }
          ListEmptyComponent={
            !isLoading && searchQuery ? (
              <View style={styles.emptyState}>
                <Image 
                  source={require('../../../assets/bottom_navigation_icons/search_icon_fill.png')}
                  style={styles.emptyStateIcon}
                />
                <Text style={styles.emptyStateTitle}>No results found</Text>
                <Text style={styles.emptyStateText}>
                  No results for "{searchQuery}"
                </Text>
              </View>
            ) : !searchQuery && !hasSuggestedContent && !isLoading ? (
              <View style={styles.welcomeState}>
                <Image 
                  source={require('../../../assets/bottom_navigation_icons/search_icon_fill.png')}
                  style={styles.welcomeIcon}
                />
                <Text style={styles.welcomeTitle}>Find Students & Faculty</Text>
                <Text style={styles.welcomeText}>
                  Search by name or student ID to connect with others
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.homeBackground,
  },
  fixedHeader: {
    backgroundColor: colors.homeBackground,
    zIndex: 10,
    elevation: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerBackground: {
    width: '100%',
    height: 100, // Reduced height
    justifyContent: 'center',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24, // Smaller font
    fontFamily: fonts.bold,
    color: colors.white,
    textAlign: 'center',
  },
  searchCategoriesContainer: {
    backgroundColor: colors.homeBackground,
    paddingTop: 20,
    paddingBottom: 20, // Reduced padding
  },
  scrollableContent: {
    flex: 1,
    backgroundColor: colors.homeBackground,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10, // Reduced padding
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20, // Reduced margin
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12, // Slightly smaller
    paddingHorizontal: 12, // Reduced padding
    paddingVertical: 10, // Reduced padding
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    tintColor: 'rgba(255, 255, 255, 0.6)',
  },
  searchInput: {
    flex: 1,
    fontSize: 15, // Slightly smaller
    fontFamily: fonts.normal,
    color: colors.white,
    padding: 0,
  },
  searchRightContent: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    padding: 2,
  },
  clearButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  loadingContainer: {
    padding: 2,
  },
  categoriesSection: {
    paddingHorizontal: 20,
  },
  categoriesList: {
    gap: 6, // Reduced gap
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16, // Smaller
    paddingHorizontal: 16, // Reduced padding
    paddingVertical: 8, // Reduced padding
    marginRight: 6, // Reduced margin
  },
  categoryChipSelected: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  categoryChipText: {
    fontSize: 13, // Smaller
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  categoryChipTextSelected: {
    color: colors.homeBackground,
    fontFamily: fonts.semiBold,
  },
  // Card Styles
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 12, // Reduced margin
    padding: 16, // Reduced padding
    borderRadius: 16, // Smaller
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12, // Reduced margin
  },
  userIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60, // Smaller
    height: 60, // Smaller
    borderRadius: 30,
  },
  initialsBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderRadius: 12, // Smaller
    width: 24, // Smaller
    height: 24, // Smaller
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.homeBackground,
  },
  studentBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  facultyBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
  },
  initialsText: {
    fontSize: 10, // Smaller
    fontFamily: fonts.bold,
    color: colors.white,
  },
  userMainInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16, // Smaller
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 6, // Reduced margin
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, // Reduced padding
    paddingVertical: 4, // Reduced padding
    borderRadius: 10, // Smaller
  },
  studentRoleBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.4)',
  },
  facultyRoleBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.4)',
  },
  roleText: {
    fontSize: 11, // Smaller
    fontFamily: fonts.medium,
    color: colors.white,
  },
  userStats: {
    alignItems: 'flex-end',
  },
  statRow: {
    flexDirection: 'row',
    gap: 12, // Reduced gap
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 14, // Smaller
    fontFamily: fonts.bold,
    color: colors.white,
  },
  statLabel: {
    fontSize: 10, // Smaller
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10, // Reduced gap
  },
  followButton: {
    flex: 1,
    backgroundColor: 'rgba(58, 140, 130, 0.8)',
    paddingVertical: 10, // Reduced padding
    borderRadius: 10, // Smaller
    borderWidth: 1,
    borderColor: 'rgba(133, 255, 229, 0.8)',
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  followButtonText: {
    fontSize: 13, // Smaller
    fontFamily: fonts.medium,
    color: colors.white,
  },
  followingButtonText: {
    color: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    paddingHorizontal: 14, // Reduced padding
    paddingVertical: 10, // Reduced padding
    borderRadius: 10, // Smaller
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70, // Smaller
  },
  deleteButtonText: {
    fontSize: 13, // Smaller
    fontFamily: fonts.medium,
    color: '#f44336',
  },
  // Results Header
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 12, // Reduced margin
  },
  resultsTitle: {
    fontSize: 18, // Smaller
    fontFamily: fonts.bold,
    color: colors.white,
  },
  // Empty States
  emptyState: {
    padding: 30, // Reduced padding
    alignItems: 'center',
    marginTop: 30, // Reduced margin
  },
  emptyStateIcon: {
    width: 60, // Smaller
    height: 60, // Smaller
    tintColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 15, // Reduced margin
  },
  emptyStateTitle: {
    fontSize: 18, // Smaller
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: 8, // Reduced margin
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14, // Smaller
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  // Welcome State
  welcomeState: {
    padding: 30, // Reduced padding
    alignItems: 'center',
    marginTop: 20, // Reduced margin
  },
  welcomeIcon: {
    width: 60, // Smaller
    height: 60, // Smaller
    tintColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 15, // Reduced margin
  },
  welcomeTitle: {
    fontSize: 20, // Smaller
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 8, // Reduced margin
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14, // Smaller
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    marginHorizontal: 20,
    marginBottom: 12, // Reduced margin
    padding: 10, // Reduced padding
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  errorText: {
    fontSize: 13, // Smaller
    fontFamily: fonts.normal,
    color: '#f44336',
    textAlign: 'center',
  },
});