const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.resolver.unstable_conditionNames = ['browser'];
config.resolver.unstable_enablePackageExports = false;

module.exports = config; 