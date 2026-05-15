const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
const defaultBlockList = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : config.resolver.blockList
    ? [config.resolver.blockList]
    : [];

config.resolver.blockList = [
  /(^|[/\\])node_modules[/\\]\.next\.corrupt-[^/\\]*(?:[/\\].*)?$/,
  /(^|[/\\])apps[/\\]web[/\\]\.next[/\\].*$/,
  /(^|[/\\])output[/\\].*$/,
  ...defaultBlockList
];

module.exports = withNativewind(config, {
  inlineVariables: false,
  globalClassNamePolyfill: false
});
