const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure web platform is supported
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;