module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    ethereum: 'readonly',
    tronLink: 'readonly',
    tronWeb: 'readonly',
    aptos: 'readonly',
    solana: 'readonly',
  },
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': 0,
    'no-unused-vars': 'warn',
    'react/prop-types': 0,
    'no-unused-expressions': 0,
    'no-param-reassign': 0,
    camelcase: 0,
    'no-console': 0,
    'max-len': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
  },
};
