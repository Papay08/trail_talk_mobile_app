import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { fonts } from '../../styles/fonts';
import HeaderWithTabs from '../../components/HeaderWithTabs';

export default function StudentSupportScreen() {
  const handleFilterPress = () => {
    console.log('Support filter pressed');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.homeBackground} />
      <HeaderWithTabs userRole="student" onFilterPress={handleFilterPress} />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Support</Text>
        <Text style={styles.subtitle}>Get help and assistance</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.homeBackground,
  },
  container: {
    flex: 1,
    backgroundColor: colors.homeBackground,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.tabInactive,
    textAlign: 'center',
  },
});