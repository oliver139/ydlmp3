module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "arrow-spacing": ["warn", { "before": true, "after": true }],
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "comma-dangle": ["error", "only-multiline"],
    "comma-spacing": "error",
    "comma-style": "error",
    "curly": ["error", "multi-line", "consistent"],
    "dot-notation": "error",
    "eol-last": "error",
    "handle-callback-err": "off",
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "keyword-spacing": "error",
    "max-nested-callbacks": ["warn", { "max": 4 }],
    "max-statements-per-line": ["warn", { "max": 2 }],
    "no-case-declarations": "off",
    "no-console": "off",
    "no-undefined": "off",
    "no-empty-function": "error",
    "no-extra-semi": "error",
    "no-floating-decimal": "error",
    "no-inline-comments": "off",
    "no-lonely-if": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-multi-spaces": ["error", { ignoreEOLComments: true }],
    "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 0, "maxBOF": 0 }],
    "no-shadow": ["error"],
    "no-trailing-spaces": ["error"],
    "no-undef-init": "error",
    "no-undef": "off",
    "no-unused-vars": "warn",
    "no-var": "warn",
    "object-curly-spacing": ["error", "always"],
    "prefer-const": "warn",
    "quotes": ["warn", "double"],
    "semi": ["error", "always"],
    "semi-spacing": ["error", { "before": false, "after": true }],
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    "space-in-parens": "error",
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "spaced-comment": "error",
    "switch-colon-spacing": "error",
    "yoda": "error",
  }
};
