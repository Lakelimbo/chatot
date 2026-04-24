// @ts-check

// module.exports = {
//   env: {
//     es2021: true,
//     node: true,
//   },
//   extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
//   parser: "@typescript-eslint/parser",
//   parserOptions: {
//     ecmaVersion: 13,
//     sourceType: "module",
//   },
//   plugins: ["@typescript-eslint"],
//   rules: {},
// }

// import { defineConfig } from "eslint/config"
import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended
)
