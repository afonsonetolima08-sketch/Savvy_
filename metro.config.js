const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Required for packages like @supabase/supabase-js that use ESM exports
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
