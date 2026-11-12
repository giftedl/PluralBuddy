import js from "@eslint/js";
import markdown from "@eslint/markdown";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import { configs as seyfert } from '@slipher/eslint-plugin';

console.log(seyfert.recommended)

export default defineConfig([
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    'apps/docs/.next/**',
    'apps/docs/out/**',
    'apps/docs/build/**',
    'apps/docs/next-env.d.ts',
  ]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node }, parserOptions: { projectService: true } },
  },
  tseslint.configs.recommended,
  ...seyfert.recommended,
]);
