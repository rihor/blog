import { defineConfig } from 'eslint/config'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import importX from 'eslint-plugin-import-x'
import n from 'eslint-plugin-n'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import promise from 'eslint-plugin-promise'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPerf from 'eslint-plugin-react-perf'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import js from '@eslint/js'
import eslintReact from '@eslint-react/eslint-plugin'

export default defineConfig(
  { ignores: ['node_modules/', '.next/', 'next-env.d.ts'] },

  js.configs.recommended,
  n.configs['flat/recommended-module'],
  promise.configs['flat/recommended'],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver()]
    },
    rules: {
      // the bundler resolves imports; eslint-plugin-n can't follow tsconfig resolution
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      camelcase: 'off',
      'import-x/order': [
        'error',
        {
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['builtin'],
          pathGroups: [
            {
              pattern: '@*/**',
              group: 'parent',
              position: 'before'
            }
          ],
          groups: [
            ['builtin', 'external', 'internal'],
            'unknown',
            ['parent', 'sibling', 'index'],
            'object'
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ]
    }
  },

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      eslintReact.configs['recommended-type-checked'],
      reactHooks.configs.flat['recommended-latest'],
      reactPerf.configs.flat.recommended
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      // eslint-plugin-react-hooks (React Compiler rules) is authoritative for these
      '@eslint-react/error-boundaries': 'off',
      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/purity': 'off',
      '@eslint-react/rules-of-hooks': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      '@eslint-react/set-state-in-render': 'off',
      '@eslint-react/static-components': 'off',
      '@eslint-react/use-memo': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/consistent-type-imports': 'error'
    }
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      // plugin packages expose both default and named config exports
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off'
    }
  },
  {
    files: ['**/*.cjs', 'next.config.js'],
    languageOptions: { sourceType: 'commonjs' }
  },

  prettierRecommended,
  { rules: { 'prettier/prettier': 'warn' } }
)
