// eslint.config.mjs
export default [
  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
    },

    rules: {
      "no-unused-vars": "warn",   // warn if a variable is declared but not used
      "no-console": "warn",       // warn if console.log is used
      "eqeqeq": "error",          // enforce === instead of ==
      "quotes": ["error", "double"], // enforce double quotes
      "camelcase": "warn" 
    },
  },
];
