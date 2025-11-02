import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Correct import
import { colors } from '../styles/colors';
import { fonts } from '../styles/fonts';

export default function RoleSelectionScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={colors.white}
        translucent={false}
      />
      
      <View style={styles.container}>
        {/* Header with Logo and Title */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/signing_signup_icons/trail_talk_logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Who are you?</Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subPrompt}>Choose your role to continue</Text>

        {/* Role Cards */}
        <View style={styles.cardsContainer}>
          {/* Student Card */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('SignUp', { role: 'student' })}
          >
            <View style={styles.iconContainer}>
              <Image 
                source={require('../../assets/signing_signup_icons/student_avatar_icon.png')}
                style={styles.roleIcon}
              />
            </View>
            <Text style={styles.roleText}>Student</Text>
          </TouchableOpacity>

          {/* Faculty Card */}
          <TouchableOpacity
            style={[styles.card, styles.secondCard]}
            onPress={() => navigation.navigate('SignUp', { role: 'faculty' })}
          >
            <View style={styles.iconContainer}>
              <Image 
                source={require('../../assets/signing_signup_icons/faculty_avatar_icon.png')}
                style={styles.roleIcon}
              />
            </View>
            <Text style={styles.roleText}>Faculty</Text>
          </TouchableOpacity>
        </View>

        {/* Cancel Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 8,
    position: 'relative',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    position: 'absolute',
    left: 0,
  },
  title: {
    fontSize: 24,
    color: colors.black,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  subPrompt: {
    fontSize: 16,
    color: colors.gray,
    fontFamily: fonts.normal,
    textAlign: 'center',
    marginBottom: 30,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  secondCard: {
    marginTop: 16,
  },
  iconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  roleText: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fonts.medium,
    letterSpacing: 0.5,
  },
  footer: {
    paddingBottom: 24,
  },
  cancelButton: {
    paddingVertical: 16,
    backgroundColor: '#8E2929',
    borderRadius: 12,
    width: '100%',
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: fonts.medium,
  },
});