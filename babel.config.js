module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
    plugins: [
      // Must be last in the plugins array
      "react-native-reanimated/plugin",
    ],
  };
};
