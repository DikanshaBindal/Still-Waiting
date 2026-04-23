import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  { ignores: ["dist/", "node_modules/"] },
  { 
    files: ["**/*.{js,mjs,cjs}"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off"
    },
    languageOptions: { 
      globals: globals.browser 
    }
  }
];
