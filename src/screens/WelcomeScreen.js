import React from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import CustomButton from '../components/CustomButton';
import { fonts } from '../styles/fonts';
import { colors } from '../styles/colors';

export default function WelcomeScreen({ navigation }) {
  
  const handleSignIn = () => {
    console.log('Sign In button pressed');
    navigation.navigate('SignIn');
  };

  const handleSignUp = () => {
    console.log('Sign Up button pressed');
    navigation.navigate('RoleSelection');
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={colors.white}
        translucent={false}
      />
      
      <View style={styles.content}>
        <Image 
          source={require('../../assets/signing_signup_icons/trail_talk_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>TrailTalk</Text>
        <Text style={styles.subtitle}>A safe space for Trailblazers</Text>
        
        <View style={styles.buttonsContainer}>
          <CustomButton
            title="Sign In"
            onPress={handleSignIn}
            variant="primary"
            style={styles.button}
          />
          
          <CustomButton
            title="Sign Up"
            onPress={handleSignUp}
            variant="secondary"
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: StatusBar.currentHeight,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 109,
    height: 125,
    marginBottom: 40,
  },
  title: {
    fontSize: 45,
    textAlign: 'center',
    marginBottom: 10,
    color: colors.black,
    letterSpacing: 8,
    fontFamily: fonts.bold,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 178,
    color: colors.gray,
    fontFamily: fonts.regular,
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '90%',
    marginBottom: 16,
  },
});