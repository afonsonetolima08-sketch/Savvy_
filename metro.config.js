const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;

// Walk up to find the monorepo root (where pnpm-workspace.yaml or the top node_modules lives)
const workspaceRoot = path.resolve(projectRoot, "../../../..");

const config = getDefaultConfig(projectRoot);

// Let Metro watch both the project and the workspace root
config.watchFolders = [workspaceRoot];

// Let Metro resolve packages from both project and workspace node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Required for packages like @supabase/supabase-js that use ESM exports
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
