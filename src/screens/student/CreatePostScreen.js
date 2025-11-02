import React, { useState, useRef } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ImageBackground, 
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { fonts } from '../../styles/fonts';
import { supabase } from '../../lib/supabase'; // ← ADD THIS IMPORT

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CreatePostScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(140);
  const [isFocused, setIsFocused] = useState(false);

  const textInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  // ← ADD THIS: categories array definition
  const categories = [
    'Academics',
    'Rant',
    'Support', 
    'Campus',
    'General'
  ];

  // ← ADD THIS: getCategoryIcon function
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Academics': return '📚';
      case 'Rant': return '💬';
      case 'Support': return '🤝';
      case 'Campus': return '🏛️';
      case 'General': return '💭';
      default: return '📝';
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePostPress = async () => {
    if (!selectedCategory || !message.trim()) return;

    try {
      console.log('Submitting post to Supabase...');
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.log('No user logged in');
        return;
      }

      // Extract initials from user email (you can modify this logic)
      const userEmail = userData.user.email;
      const initials = userEmail ? userEmail.substring(0, 3).toUpperCase() : 'USER';

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            content: message.trim(),
            category: selectedCategory,
            author_id: userData.user.id,
            author_initials: initials,
            is_anonymous: true
          }
        ])
        .select();

      if (error) {
        console.log('Error submitting post:', error);
        return;
      }

      console.log('Post submitted successfully:', data);
      
      // Clear form and go back
      setMessage('');
      setSelectedCategory(null);
      navigation.goBack();
      
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const selectCategory = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleContentSizeChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.max(140, Math.min(height + 40, 400));
    setInputHeight(newHeight);
  };

  const focusTextInput = () => {
    textInputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar 
            barStyle="light-content" 
            backgroundColor={colors.homeBackground}
            translucent={false}
          />
          
          {/* Header */}
          <ImageBackground 
            source={require('../../../assets/create_post_screen_icons/createpost_header_bg.png')}
            style={styles.headerBackground}
            resizeMode="cover"
          >
            <View style={styles.headerContent}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <Image 
                  source={require('../../../assets/create_post_screen_icons/back_button_icon.png')}
                  style={styles.backIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>Create Post</Text>
              </View>

              <View style={styles.rightSpacer} />
            </View>
          </ImageBackground>

          {/* User Identity Card */}
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Image 
                source={require('../../../assets/create_post_screen_icons/anon_icon.png')}
                style={styles.anonIcon}
                resizeMode="contain"
              />
              <View style={styles.userText}>
                <Text style={styles.userName}>Blazer01</Text>
                <Text style={styles.userStatus}>Anonymous User</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          </View>

          {/* Category Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image 
                source={require('../../../assets/create_post_screen_icons/category_icon.png')}
                style={styles.sectionIcon}
                resizeMode="contain"
              />
              <Text style={styles.sectionTitle}>Choose Category</Text>
            </View>
            
            {/* Manual ScrollView */}
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScrollView}
              contentContainerStyle={styles.categoriesScrollContent}
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={`${category}-${index}`}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipSelected
                  ]}
                  onPress={() => selectCategory(category)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryIcon}>
                    {getCategoryIcon(category)}
                  </Text>
                  <Text 
                    style={[
                      styles.categoryChipText,
                      selectedCategory === category && styles.categoryChipTextSelected
                    ]}
                    numberOfLines={1}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Message Input */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image 
                source={require('../../../assets/create_post_screen_icons/quil_icon.png')}
                style={styles.sectionIcon}
                resizeMode="contain"
              />
              <Text style={styles.sectionTitle}>What's on your mind?</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.messageInputContainer,
                { height: inputHeight },
                isFocused && styles.messageInputFocused
              ]}
              activeOpacity={1}
              onPress={focusTextInput}
            >
              <TextInput
                ref={textInputRef}
                style={styles.messageInput}
                multiline={true}
                placeholder="Share your thoughts, questions, or experiences..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={message}
                onChangeText={setMessage}
                onContentSizeChange={handleContentSizeChange}
                textAlignVertical="top"
                cursorColor={colors.white}
                selectionColor="rgba(255, 255, 255, 0.3)"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <View style={styles.inputFooter}>
                <Text style={styles.charCount}>
                  {message.length} characters
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Attachment Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image 
                source={require('../../../assets/create_post_screen_icons/attach_icon.png')}
                style={styles.sectionIcon}
                resizeMode="contain"
              />
              <Text style={styles.sectionTitle}>Attach Media</Text>
            </View>
            
            <View style={styles.attachmentButtons}>
              <TouchableOpacity style={styles.mediaButton} activeOpacity={0.7}>
                <View style={styles.mediaButtonIcon}>
                  <Image 
                    source={require('../../../assets/create_post_screen_icons/gallery_icon.png')}
                    style={styles.mediaIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.mediaButtonText}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.mediaButton} activeOpacity={0.7}>
                <View style={styles.mediaButtonIcon}>
                  <Image 
                    source={require('../../../assets/create_post_screen_icons/camera_icon.png')}
                    style={styles.mediaIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.mediaButtonText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Post Button - Clean Design */}
          <View style={styles.postButtonContainer}>
            <TouchableOpacity 
              style={[
                styles.postButton,
                (!selectedCategory || !message.trim()) && styles.postButtonDisabled
              ]}
              onPress={handlePostPress}
              activeOpacity={0.8}
              disabled={!selectedCategory || !message.trim()}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
            
            <Text style={styles.postDisclaimer}>
              Your post will be published anonymously
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.homeBackground,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.homeBackground,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  // Header
  headerBackground: {
    width: '100%',
    height: 140,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 42,
    height: 42,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  rightSpacer: {
    width: 42,
  },
  // User Card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  anonIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  verifiedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: colors.white,
    fontFamily: fonts.bold,
  },
  // Section Styles
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 20, // Reduced from 24
    height: 20, // Reduced from 24
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  // Category Chips
  categoriesScrollView: {
    height: 60,
  },
  categoriesScrollContent: {
    paddingRight: 20,
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    width: 120,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  categoryChipSelected: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    flex: 1,
  },
  categoryChipTextSelected: {
    color: colors.homeBackground,
    fontFamily: fonts.semiBold,
  },
  // Message Input
  messageInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    maxHeight: 350,
  },
  messageInputFocused: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.white,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  charCount: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  // Attachment Section
  attachmentButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mediaButton: {
    alignItems: 'center',
    marginRight: 20,
  },
  mediaButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 6,
  },
  mediaIcon: {
    width: 20, // Reduced from 22
    height: 20, // Reduced from 22
    tintColor: colors.white,
  },
  mediaButtonText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // Post Button - Clean Design
  postButtonContainer: {
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  postButton: {
    backgroundColor: '#FFCC00',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  postButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  postButtonText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.homeBackground,
    letterSpacing: 1,
  },
  postDisclaimer: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 10,
  },
});

export default CreatePostScreen;