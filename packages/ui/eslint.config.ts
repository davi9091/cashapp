import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    ignores: ["eslint.config.ts", "build.ts"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    plugins: { "react-hooks": reactHooks },
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: true,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
])
