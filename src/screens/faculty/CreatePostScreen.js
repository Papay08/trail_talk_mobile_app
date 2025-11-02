import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ImageBackground, 
  TouchableOpacity, 
  SafeAreaView,
  Image
} from 'react-native';
import { colors } from '../../styles/colors';
import { fonts } from '../../styles/fonts';

const CreatePostScreen = ({ navigation }) => {
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent"
        translucent={true}
      />
      
      {/* Header Section with Background Image */}
      <ImageBackground 
        source={require('../../../assets/create_post_screen_icons/createpost_header_bg.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.headerSafeArea}>
          {/* Header Content */}
          <View style={styles.headerContent}>
            {/* Back Button - Just the icon without frame */}
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

            {/* Header Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Create Post</Text>
            </View>

            {/* Right Side Spacer for Balance */}
            <View style={styles.rightSpacer} />
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Main Content Area */}
      <View style={styles.content}>
        <Text style={styles.placeholderText}>
          Post creation form will be implemented here
        </Text>
        {/* We'll add the post creation form components here later */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeBackground,
  },
  headerBackground: {
    width: '100%',
    height: 180,
  },
  headerSafeArea: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    // No background, no padding, just the icon
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: fonts.medium, // Inter medium weight
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 1.5, // 5% of 30px = 1.5px letter spacing
  },
  rightSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default CreatePostScreen;