import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        plugins: {
            js,
            prettier: eslintPluginPrettier,
        },
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
            },
            globals: globals.node,
        },
        extends: [
            'js/recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:prettier/recommended',
        ],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/indent': ['error', 4],
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
            '@typescript-eslint/no-misused-promises': [
                'error',
                {
                    checksVoidReturn: {
                        arguments: false,
                        attributes: false,
                    },
                },
            ],
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/restrict-plus-operands': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-base-to-string': 'off',
            curly: ['error', 'multi'],
            'prettier/prettier': 'error',
        },
    },
    tseslint.configs.recommended,
    {
        files: ['**/*.json'],
        plugins: { json },
        language: 'json/json',
        extends: ['json/recommended'],
    },
    {
        files: ['**/*.jsonc'],
        plugins: { json },
        language: 'json/jsonc',
        extends: ['json/recommended'],
    },
    {
        files: ['**/*.json5'],
        plugins: { json },
        language: 'json/json5',
        extends: ['json/recommended'],
    },
    {
        files: ['**/*.md'],
        plugins: { markdown },
        language: 'markdown/commonmark',
        extends: ['markdown/recommended'],
    },
])
