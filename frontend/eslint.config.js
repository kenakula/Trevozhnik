import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';


export default [
    {
        languageOptions: { globals: globals.browser },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    { files: ['**/*.jsx'], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
    pluginReactConfig,
    {
        settings: { react: { version: 'detect' } },
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single', { allowTemplateLiterals: true }],
            'max-len': ['error', { code: 124 }],
            'no-console': ['warn', { allow: ['error'] }],
            'object-curly-spacing': ['warn', 'always'],
        },
    }
];
