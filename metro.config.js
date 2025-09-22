const {getDefaultConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // Enable code splitting
  config.resolver.enableCodeSplitting = true;

  // Optimize bundle loading
  config.transformer = {
    ...config.transformer,
    // babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  };

  // Add asset extensions
  config.resolver.assetExts.push('svg');
  config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'svg'];

  return config;
})();
