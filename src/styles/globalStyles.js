// src/styles/globalStyles.js
import { StyleSheet } from 'react-native';
import { fonts } from './fonts';
import { colors } from './colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  // Text styles
  textRegular: {
    fontFamily: fonts.regular,
    color: colors.black,
  },
  textSemiBold: {
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  textBold: {
    fontFamily: fonts.bold,
    color: colors.black,
  },
});