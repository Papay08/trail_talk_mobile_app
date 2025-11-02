const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Simple SVG support for Expo
config.resolver.assetExts.push('svg');
config.resolver.sourceExts.push('svg');

module.exports = config;