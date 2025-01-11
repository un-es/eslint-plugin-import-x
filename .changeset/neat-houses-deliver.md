---
"eslint-plugin-import-x": patch
---

Add a default `languageOptions.parserOptions` to the `recommended` flat config presets. This prevents the `sourceType 'module' is not supported when ecmaVersion < 2015` error when no custom parser options are provided.

For existing users who are already using the `recommended` flat config presets while providing custom parser options, make sure your custom parser options come after the presets to prevent yours from being overridden:

```js
// eslint.config.js
import eslintPluginImportX from 'eslint-plugin-import-x'

export default [
  js.configs.recommended,
  eslintPluginImportX.flatConfigs.recommended,
  // Always put your custom language options and parser options after the presets
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
]
```
