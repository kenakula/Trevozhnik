import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';


export default [
    ...tseslint.configs.recommended,
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single', { allowTemplateLiterals: true }],
            'max-len': ['error', { code: 124 }],
            'no-console': ['warn', { allow: ['error'] }],
            'object-curly-spacing': ['warn', 'always'],
            'no-undef': 'off',
        },
    }
];
