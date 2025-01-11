# eslint-plugin-import-x

## 4.7.0

### Minor Changes

- [#214](https://github.com/un-ts/eslint-plugin-import-x/pull/214) [`091d2da`](https://github.com/un-ts/eslint-plugin-import-x/commit/091d2da9ee668e90ac7ee9aeb08437bc96871296) Thanks [@mrginglymus](https://github.com/mrginglymus)! - Improve windows support

## 4.6.1

### Patch Changes

- [#211](https://github.com/un-ts/eslint-plugin-import-x/pull/211) [`be9c3e8`](https://github.com/un-ts/eslint-plugin-import-x/commit/be9c3e8c31426a50ac13f77ec8b797780f004e72) Thanks [@mrginglymus](https://github.com/mrginglymus)! - Fix enhanced-resolve dependency

## 4.6.0

### Minor Changes

- [#209](https://github.com/un-ts/eslint-plugin-import-x/pull/209) [`46d2360`](https://github.com/un-ts/eslint-plugin-import-x/commit/46d2360f5ebfbd79e74a0828ac7e280973510454) Thanks [@SukkaW](https://github.com/SukkaW)! - When `eslint-plugin-import-x` was forked from `eslint-plugin-import`, we copied over the default resolver (which is `eslint-import-resolver-node`) as well. However, this resolver doesn't supports `exports` in the `package.json` file, and the current maintainer of the `eslint-import-resolver-node` (ljharb) doesn't have the time implementing this feature and he locked the issue https://github.com/import-js/eslint-plugin-import/issues/1810.

  So we decided to implement our own resolver that "just works". The new resolver is built upon the [`enhanced-resolve`](https://www.npmjs.com/package/enhanced-resolve) that implements the full Node.js [Resolver Algorithm](https://nodejs.org/dist/v14.21.3/docs/api/esm.html#esm_resolver_algorithm). The new resolver only implements the import resolver interface v3, which means you can only use it with ESLint Flat config. For more details about the import resolver interface v3, please check out [#192](https://github.com/un-ts/eslint-plugin-import-x/pull/192).

  In the next major version of `eslint-plugin-import-x`, we will remove the `eslint-import-resolver-node` and use this new resolver by default. In the meantime, you can try out this new resolver by setting the `import-x/resolver-next` option in your `eslint.config.js` file:

  ```js
  // eslint.config.js
  const eslintPluginImportX = require('eslint-plugin-import-x');
  const { createNodeResolver } = eslintPluginImportX;

  module.exports = {
    plugins: {
      'import-x': eslintPluginImportX,
    },
    settings: {
      'import-x/resolver-next': [
        // This is the new resolver we are introducing
        createNodeResolver({
          /**
           * The allowed extensions the resolver will attempt to find when resolving a module
           * By default it uses a relaxed extension list to search for both ESM and CJS modules
           * You can customize this list to fit your needs
           *
           * @default ['.mjs', '.cjs', '.js', '.json', '.node']
           */
          extensions?: string[];
          /**
           * Optional, the import conditions the resolver will used when reading the exports map from "package.json"
           * By default it uses a relaxed condition list to search for both ESM and CJS modules
           * You can customize this list to fit your needs
           *
           * @default ['default', 'module', 'import', 'require']
           */
          conditions: ['default', 'module', 'import', 'require'],
          // You can pass more options here, see the enhanced-resolve documentation for more details
          // https://github.com/webpack/enhanced-resolve/tree/v5.17.1?tab=readme-ov-file#resolver-options
        }),
        // you can add more resolvers down below
        require('eslint-import-resolver-typescript').createTypeScriptImportResolver(
          /** options of eslint-import-resolver-typescript */
        )
      ],
    },
  };
  ```

  We do not plan to implement reading `baseUrl` and `paths` from the `tsconfig.json` file in this resolver. If you need this feature, please checkout [eslint-import-resolver-typescript](https://www.npmjs.com/package/eslint-import-resolver-typescript) (also powered by `enhanced-resolve`), [eslint-import-resolver-oxc](https://www.npmjs.com/package/eslint-import-resolver-oxc) (powered by `oxc-resolver`), [eslint-import-resolver-next](https://www.npmjs.com/package/eslint-import-resolver-next) (also powered by `oxc-resolver`), or other similar resolvers.

### Patch Changes

- [#206](https://github.com/un-ts/eslint-plugin-import-x/pull/206) [`449738f`](https://github.com/un-ts/eslint-plugin-import-x/commit/449738f4f4b84ff24c2748cdc86185cff5840442) Thanks [@privatenumber](https://github.com/privatenumber)! - insert type prefix without new line

## 4.5.1

### Patch Changes

- [#198](https://github.com/un-ts/eslint-plugin-import-x/pull/198) [`ac6d2e1`](https://github.com/un-ts/eslint-plugin-import-x/commit/ac6d2e1b39e2a0d01b981b98b58aad0eb7939c70) Thanks [@voxpelli](https://github.com/voxpelli)! - Fix [#197](https://github.com/un-ts/eslint-plugin-import-x/issues/197) with missing types

- [#204](https://github.com/un-ts/eslint-plugin-import-x/pull/204) [`32e9b55`](https://github.com/un-ts/eslint-plugin-import-x/commit/32e9b55aea0c8198c5e7f5cbbdb0bfbd3f71ff08) Thanks [@privatenumber](https://github.com/privatenumber)! - fix type-import and value-import merging when import-as is used

## 4.5.0

### Minor Changes

- [#192](https://github.com/un-ts/eslint-plugin-import-x/pull/192) [`fbf639b`](https://github.com/un-ts/eslint-plugin-import-x/commit/fbf639b85a6b22f7668c86c9ceaca5482ffc1045) Thanks [@SukkaW](https://github.com/SukkaW)! - The PR implements the new resolver design proposed in https://github.com/un-ts/eslint-plugin-import-x/issues/40#issuecomment-2381444266

  ### For `eslint-plugin-import-x` users

  Like the ESLint flat config allows you to use js objects (e.g. import and require) as ESLint plugins, the new `eslint-plugin-import-x` resolver settings allow you to use js objects as custom resolvers through the new setting `import-x/resolver-next`:

  ```js
  // eslint.config.js
  import { createTsResolver } from '#custom-resolver';
  const { createOxcResolver } = require('path/to/a/custom/resolver');

  const resolverInstance = new ResolverFactory({});
  const customResolverObject = {
    interfaceVersion: 3,
    name: 'my-custom-eslint-import-resolver',
    resolve(modPath, sourcePath) {
      const path = resolverInstance.resolve(modPath, sourcePath);
      if (path) {
        return {
          found: true,
          path
        };
      }

      return {
        found: false,
        path: null
      }
    };
  };

  module.exports = {
    settings: {
      // multiple resolvers
      'import-x/resolver-next': [
        customResolverObject,
        createTsResolver(enhancedResolverOptions),
        createOxcResolver(oxcOptions),
      ],
      // single resolver:
      'import-x/resolver-next': [createOxcResolver(oxcOptions)]
    }
  }
  ```

  The new `import-x/resolver-next` no longer accepts strings as the resolver, thus will not be compatible with the ESLint legacy config (a.k.a. `.eslintrc`). Those who are still using the ESLint legacy config should stick with `import-x/resolver`.

  In the next major version of `eslint-plugin-import-x` (v5), we will rename the currently existing `import-x/resolver` to `import-x/resolver-legacy` (which allows the existing ESLint legacy config users to use their existing resolver settings), and `import-x/resolver-next` will become the new `import-x/resolver`. When ESLint v9 (the last ESLint version with ESLint legacy config support) reaches EOL in the future, we will remove `import-x/resolver-legacy`.

  We have also made a few breaking changes to the new resolver API design, so you can't use existing custom resolvers directly with `import-x/resolver-next`:

  ```js
  // When migrating to `import-x/resolver-next`, you CAN'T use legacy versions of resolvers directly:
  module.exports = {
    settings: {
      // THIS WON'T WORK, the resolver interface required for `import-x/resolver-next` is different.
      'import-x/resolver-next': [
         require('eslint-import-resolver-node'),
         require('eslint-import-resolver-webpack'),
         require('some-custom-resolver')
      ];
    }
  }
  ```

  For easier migration, the PR also introduces a compat utility `importXResolverCompat` that you can use in your `eslint.config.js`:

  ```js
  // eslint.config.js
  import eslintPluginImportX, { importXResolverCompat } from 'eslint-plugin-import-x';
  // or
  const eslintPluginImportX = require('eslint-plugin-import-x');
  const { importXResolverCompat } = eslintPluginImportX;

  module.exports = {
    settings: {
      // THIS WILL WORK as you have wrapped the previous version of resolvers with the `importXResolverCompat`
      'import-x/resolver-next': [
         importXResolverCompat(require('eslint-import-resolver-node'), nodeResolveOptions),
         importXResolverCompat(require('eslint-import-resolver-webpack'), webpackResolveOptions),
         importXResolverCompat(require('some-custom-resolver'), { option1: true, option2: '' })
      ];
    }
  }
  ```

  ### For custom import resolver developers

  This is the new API design of the resolver interface:

  ```ts
  export interface NewResolver {
    interfaceVersion: 3;
    name?: string; // This will be included in the debug log
    resolve: (modulePath: string, sourceFile: string) => ResolvedResult;
  }

  // The `ResultNotFound` (returned when not resolved) is the same, no changes
  export interface ResultNotFound {
    found: false;
    path?: undefined;
  }

  // The `ResultFound` (returned resolve result) is also the same, no changes
  export interface ResultFound {
    found: true;
    path: string | null;
  }

  export type ResolvedResult = ResultNotFound | ResultFound;
  ```

  You will be able to import `NewResolver` from `eslint-plugin-import-x/types`.

  The most notable change is that `eslint-plugin-import-x` no longer passes the third argument (`options`) to the `resolve` function.

  We encourage custom resolvers' authors to consume the options outside the actual `resolve` function implementation. You can export a factory function to accept the options, this factory function will then be called inside the `eslint.config.js` to get the actual resolver:

  ```js
  // custom-resolver.js
  exports.createCustomResolver = (options) => {
    // The options are consumed outside the `resolve` function.
    const resolverInstance = new ResolverFactory(options);

    return {
      name: 'custom-resolver',
      interfaceVersion: 3,
      resolve(mod, source) {
        const found = resolverInstance.resolve(mod, {});

        // Of course, you still have access to the `options` variable here inside
        // the `resolve` function. That's the power of JavaScript Closures~
      }
    }
  };

  // eslint.config.js
  const { createCustomResolver } = require('custom-resolver')

  module.exports = {
    settings: {
      'import-x/resolver-next': [
         createCustomResolver(options)
      ];
    }
  }
  ```

  This allows you to create a reusable resolver instance to improve the performance. With the existing version of the resolver interface, because the options are passed to the `resolver` function, you will have to create a resolver instance every time the `resolve` function is called:

  ```js
  module.exports = {
    interfaceVersion: 2,
    resolve(mod, source) {
      // every time the `resolve` function is called, a new instance is created
      // This is very slow
      const resolverInstance = ResolverFactory.createResolver({});
      const found = resolverInstance.resolve(mod, {});
    },
  };
  ```

  With the factory function pattern, you can create a resolver instance beforehand:

  ```js
  exports.createCustomResolver = (options) => {
    // `enhance-resolve` allows you to create a reusable instance:
    const resolverInstance = ResolverFactory.createResolver({});
    const resolverInstance = enhanceResolve.create({});

    // `oxc-resolver` also allows you to create a reusable instance:
    const resolverInstance = new ResolverFactory({});

    return {
      name: "custom-resolver",
      interfaceVersion: 3,
      resolve(mod, source) {
        // the same re-usable instance is shared across `resolve` invocations.
        // more performant
        const found = resolverInstance.resolve(mod, {});
      },
    };
  };
  ```

### Patch Changes

- [#184](https://github.com/un-ts/eslint-plugin-import-x/pull/184) [`bc4de89`](https://github.com/un-ts/eslint-plugin-import-x/commit/bc4de89dc425436461e87d7793ba4bc3b9ab386d) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(no-cycle): improves the type declaration of the rule `no-cycle`’s `maxDepth` option

- [#184](https://github.com/un-ts/eslint-plugin-import-x/pull/184) [`bc4de89`](https://github.com/un-ts/eslint-plugin-import-x/commit/bc4de89dc425436461e87d7793ba4bc3b9ab386d) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(first): improves the type declaration of the rule `first`'s option

- [#184](https://github.com/un-ts/eslint-plugin-import-x/pull/184) [`bc4de89`](https://github.com/un-ts/eslint-plugin-import-x/commit/bc4de89dc425436461e87d7793ba4bc3b9ab386d) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(no-unused-modules): improves the type declaration of the rule `no-unused-modules`’s `missingExports` option

- [#184](https://github.com/un-ts/eslint-plugin-import-x/pull/184) [`bc4de89`](https://github.com/un-ts/eslint-plugin-import-x/commit/bc4de89dc425436461e87d7793ba4bc3b9ab386d) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(no-deprecated): improve error message when no description is available

## 4.4.3

### Patch Changes

- [#187](https://github.com/un-ts/eslint-plugin-import-x/pull/187) [`a428f82`](https://github.com/un-ts/eslint-plugin-import-x/commit/a428f82b0663399ca66ac678e6a43a1e6187af2e) Thanks [@SukkaW](https://github.com/SukkaW)! - Attach `ecmaVersion` and `sourceType` to `parserOptions` during parse

## 4.4.2

### Patch Changes

- [#181](https://github.com/un-ts/eslint-plugin-import-x/pull/181) [`cc4ee65`](https://github.com/un-ts/eslint-plugin-import-x/commit/cc4ee650cf98d3d945fc4140483d02e51dcfd47d) Thanks [@SukkaW](https://github.com/SukkaW)! - Fix #144, read proper `sourceType` for both eslint flat config and legacy eslintrc config.

## 4.4.1

### Patch Changes

- [#175](https://github.com/un-ts/eslint-plugin-import-x/pull/175) [`acebd98`](https://github.com/un-ts/eslint-plugin-import-x/commit/acebd98893c78a1454445d868d91568d923297ac) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(extensions): correct `Options` type

- [#174](https://github.com/un-ts/eslint-plugin-import-x/pull/174) [`e01dce0`](https://github.com/un-ts/eslint-plugin-import-x/commit/e01dce016565128d8a78e9cf92ef29aed4c4bb1c) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(no-extraneous-dependencies): correct some `Options` type properties

## 4.4.0

### Minor Changes

- [#169](https://github.com/un-ts/eslint-plugin-import-x/pull/169) [`9c58269`](https://github.com/un-ts/eslint-plugin-import-x/commit/9c582692a1f4c5ed9cb38a6fc7405dd17eb98bdb) Thanks [@teidesu](https://github.com/teidesu)! - Add new rule option `checkTypedImports` for `extensions`, backports https://github.com/import-js/eslint-plugin-import/pull/2817

### Patch Changes

- [#171](https://github.com/un-ts/eslint-plugin-import-x/pull/171) [`9715220`](https://github.com/un-ts/eslint-plugin-import-x/commit/9715220615e9f10d372ac7ad2d2c83b32b44a9eb) Thanks [@SukkaW](https://github.com/SukkaW)! - Perf: avoid regexp during parser choosing

- [#171](https://github.com/un-ts/eslint-plugin-import-x/pull/171) [`9715220`](https://github.com/un-ts/eslint-plugin-import-x/commit/9715220615e9f10d372ac7ad2d2c83b32b44a9eb) Thanks [@SukkaW](https://github.com/SukkaW)! - Add extra guard for rule `no-named-as-default`. A few guards are borrowed from https://github.com/import-js/eslint-plugin-import/pull/3032, but we don't sync the rest of changes from upstream since we have already implemented a way more performant check.

- [#171](https://github.com/un-ts/eslint-plugin-import-x/pull/171) [`9715220`](https://github.com/un-ts/eslint-plugin-import-x/commit/9715220615e9f10d372ac7ad2d2c83b32b44a9eb) Thanks [@SukkaW](https://github.com/SukkaW)! - More test cases for `no-named-export` and `no-defualt-export` rule specifically with non-module `sourceType`

- [#171](https://github.com/un-ts/eslint-plugin-import-x/pull/171) [`9715220`](https://github.com/un-ts/eslint-plugin-import-x/commit/9715220615e9f10d372ac7ad2d2c83b32b44a9eb) Thanks [@SukkaW](https://github.com/SukkaW)! - Fix `export` when there is only one `TSDeclareFunction` (https://github.com/import-js/eslint-plugin-import/pull/3065)

- [#171](https://github.com/un-ts/eslint-plugin-import-x/pull/171) [`9715220`](https://github.com/un-ts/eslint-plugin-import-x/commit/9715220615e9f10d372ac7ad2d2c83b32b44a9eb) Thanks [@SukkaW](https://github.com/SukkaW)! - Prevent `ExportMap`'s cache is being tainted by incompatible parser (e.g. old `babel-eslint`). The cache is now skipped w/ incompatible parsers, which might introduce performance impacts only for those who are using incompatible parsers. (https://github.com/import-js/eslint-plugin-import/pull/3062)

- [#171](https://github.com/un-ts/eslint-plugin-import-x/pull/171) [`9715220`](https://github.com/un-ts/eslint-plugin-import-x/commit/9715220615e9f10d372ac7ad2d2c83b32b44a9eb) Thanks [@SukkaW](https://github.com/SukkaW)! - Docs: fix a few typos here and there

- [#168](https://github.com/un-ts/eslint-plugin-import-x/pull/168) [`5de039c`](https://github.com/un-ts/eslint-plugin-import-x/commit/5de039c5ef7415c529445abcfbcca0494487a7a8) Thanks [@hyoban](https://github.com/hyoban)! - Fixes https://github.com/un-ts/eslint-plugin-import-x/issues/167, the `no-duplicates` rule now allows co-existing inline type imports and namespace imports.

- [#171](https://github.com/un-ts/eslint-plugin-import-x/pull/171) [`9715220`](https://github.com/un-ts/eslint-plugin-import-x/commit/9715220615e9f10d372ac7ad2d2c83b32b44a9eb) Thanks [@SukkaW](https://github.com/SukkaW)! - Properly fix espree parser w/ ESLint Flat Config

## 4.3.1

### Patch Changes

- [#162](https://github.com/un-ts/eslint-plugin-import-x/pull/162) [`38d0081`](https://github.com/un-ts/eslint-plugin-import-x/commit/38d0081a20adb877c77f8a873e7fd4194b86ecc1) Thanks [@AaronMoat](https://github.com/AaronMoat)! - Fix issue where `no-duplicates` rule with `prefer-inline` incorrectly marks default type and named type imports as duplicates

## 4.3.0

### Minor Changes

- [#159](https://github.com/un-ts/eslint-plugin-import-x/pull/159) [`4da5388`](https://github.com/un-ts/eslint-plugin-import-x/commit/4da5388d49ab457d22cb3eb846b0120f1914a0d1) Thanks [@GoodbyeNJN](https://github.com/GoodbyeNJN)! - feat: add support for using resolver object directly in settings

## 4.2.1

### Patch Changes

- [#148](https://github.com/un-ts/eslint-plugin-import-x/pull/148) [`d228129`](https://github.com/un-ts/eslint-plugin-import-x/commit/d228129e21804e35d68af9f3ac18864349f99a6f) Thanks [@SukkaW](https://github.com/SukkaW)! - Fix `newline-after-import`'s `considerComments` options when linting `require`, backports https://github.com/import-js/eslint-plugin-import/pull/2952

- [#147](https://github.com/un-ts/eslint-plugin-import-x/pull/147) [`eca73ed`](https://github.com/un-ts/eslint-plugin-import-x/commit/eca73edf9ce69ca2e07555a7f34702a5c1e2d75a) Thanks [@nchevsky](https://github.com/nchevsky)! - Fix regression in rule `no-unused-modules` which would incorrectly initialize option `src` to `[]` instead of `[process.cwd()]`, breaking file discovery.

- [#148](https://github.com/un-ts/eslint-plugin-import-x/pull/148) [`d228129`](https://github.com/un-ts/eslint-plugin-import-x/commit/d228129e21804e35d68af9f3ac18864349f99a6f) Thanks [@SukkaW](https://github.com/SukkaW)! - Fix `no-duplicates` for TypeScript, backports https://github.com/import-js/eslint-plugin-import/pull/3033

## 4.2.0

### Minor Changes

- [#142](https://github.com/un-ts/eslint-plugin-import-x/pull/142) [`f12447e`](https://github.com/un-ts/eslint-plugin-import-x/commit/f12447e72a1104305c852436577df2eadb4acd44) Thanks [@Zamiell](https://github.com/Zamiell)! - Add new option "whitelist" for rule "no-extraneous-dependencies"

### Patch Changes

- [#146](https://github.com/un-ts/eslint-plugin-import-x/pull/146) [`e5e4580`](https://github.com/un-ts/eslint-plugin-import-x/commit/e5e45805e64ebb49a0331b21785a5f9d03b5cc02) Thanks [@SukkaW](https://github.com/SukkaW)! - Fix https://github.com/nuxt/eslint/issues/494 by avoid importing from `@typescript-eslint/typescript-estree`.

## 4.1.1

### Patch Changes

- [#133](https://github.com/un-ts/eslint-plugin-import-x/pull/133) [`757ffa9`](https://github.com/un-ts/eslint-plugin-import-x/commit/757ffa9d4850d4decac467bf3b5e8c950a8a720e) Thanks [@SukkaW](https://github.com/SukkaW)! - Fix #123 where the rule `no-named-as-default` will confuse TypeScript namespace exports with actual exports.

## 4.1.0

### Minor Changes

- [#122](https://github.com/un-ts/eslint-plugin-import-x/pull/122) [`cd52e86`](https://github.com/un-ts/eslint-plugin-import-x/commit/cd52e86f44754b4dd0c1aae1e9fd5e952e90938f) Thanks [@michaelfaith](https://github.com/michaelfaith)! - Add ESLint flat configuration presets. You can access them with:

  ```ts
  import eslintPluginImportX from "eslint-plugin-import-x";

  eslintPluginImportX.flatConfigs.recommended;
  eslintPluginImportX.flatConfigs.react;
  eslintPluginImportX.flatConfigs.typescript;
  eslintPluginImportX.flatConfigs.electron;
  ```

- [#132](https://github.com/un-ts/eslint-plugin-import-x/pull/132) [`9948c78`](https://github.com/un-ts/eslint-plugin-import-x/commit/9948c7894758dd461f6d75b89c6425fee304789a) Thanks [@SukkaW](https://github.com/SukkaW)! - Added `no-rename-default` that forbid importing a default export by a different name. Originally created by @whitneyit, ported by @SukkaW

## 4.0.0

### Major Changes

- [#112](https://github.com/un-ts/eslint-plugin-import-x/pull/112) [`4ba14da`](https://github.com/un-ts/eslint-plugin-import-x/commit/4ba14daa29100566d468872205c8e5415edb1b69) Thanks [@SukkaW](https://github.com/SukkaW)! - Use typescript-eslint v8. The minimum supported ESLint version is now >= 8.57.0 and the minimum required Node.js version is now 18.18.0.

## 3.1.0

### Minor Changes

- [#116](https://github.com/un-ts/eslint-plugin-import-x/pull/116) [`38aa4cb`](https://github.com/un-ts/eslint-plugin-import-x/commit/38aa4cb8433f24e5772fe1d224265acaedf67343) Thanks [@silverwind](https://github.com/silverwind)! - Add `ignoreUnusedTypeExports` option to `no-unused-modules`

### Patch Changes

- [#118](https://github.com/un-ts/eslint-plugin-import-x/pull/118) [`0307ff2`](https://github.com/un-ts/eslint-plugin-import-x/commit/0307ff2438f9255f95ee4f574f92c1c3b77fda60) Thanks [@SukkaW](https://github.com/SukkaW)! - Reverts #111. The introduction of SCC causes extra overhead that overcomes the early return it introduced.

  A new `no-cycle-next` rule is being implemented using the graph. It won't be backward compatible with the current rule `no-cycle`. The current `no-cycle` rule will become `no-cycle-legacy` in the next major version.

## 3.0.1

### Patch Changes

- [#109](https://github.com/un-ts/eslint-plugin-import-x/pull/109) [`fe3121a`](https://github.com/un-ts/eslint-plugin-import-x/commit/fe3121a2d74db1c2178d1ab189ef59b80c5b90c4) Thanks [@SukkaW](https://github.com/SukkaW)! - Make `eslint-plugin-import-x` overall faster by refactoring the `ExportMap` util

- [#111](https://github.com/un-ts/eslint-plugin-import-x/pull/111) [`5cce946`](https://github.com/un-ts/eslint-plugin-import-x/commit/5cce9461c2863c31af126afb7c59d67deb13a6e7) Thanks [@SukkaW](https://github.com/SukkaW)! - Drastically improve `no-cycle`'s performance by skipping unnecessary BFSes using [Tarjan's SCC](https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm).

- [#109](https://github.com/un-ts/eslint-plugin-import-x/pull/109) [`fe3121a`](https://github.com/un-ts/eslint-plugin-import-x/commit/fe3121a2d74db1c2178d1ab189ef59b80c5b90c4) Thanks [@SukkaW](https://github.com/SukkaW)! - Make `no-cycle` rule faster

## 3.0.0

### Major Changes

- [#106](https://github.com/un-ts/eslint-plugin-import-x/pull/106) [`19f10aa`](https://github.com/un-ts/eslint-plugin-import-x/commit/19f10aac038db3764d2e0af464d7db9821355ea4) Thanks [@SukkaW](https://github.com/SukkaW)! - `eslint-plugin-import-x` is a fork of `eslint-plugin-import` that aims to provide a more performant and more lightweight version of the original plugin.

  Due to the nature of the fork, all `eslint-plugin-import`'s git tags and releases have been copied over to `eslint-plugin-import-x`. This causes version conflicts when publishing new versions of `eslint-plugin-import-x`.

  To prevent this, we have decided to publish a new major version of `eslint-plugin-import-x` that will not conflict with the original `eslint-plugin-import`'s versions.

  See also https://github.com/un-ts/eslint-plugin-import-x/issues/76

### Patch Changes

- [#104](https://github.com/un-ts/eslint-plugin-import-x/pull/104) [`2d45869`](https://github.com/un-ts/eslint-plugin-import-x/commit/2d458695949a3e02792c558dca3caeae7f760fc7) Thanks [@SukkaW](https://github.com/SukkaW)! - Make `no-duplicates` way faster

## 0.5.3

### Patch Changes

- [#101](https://github.com/un-ts/eslint-plugin-import-x/pull/101) [`c0cea7b`](https://github.com/un-ts/eslint-plugin-import-x/commit/c0cea7bd361c02197a9ddfc6cfcf787248df4eda) Thanks [@SukkaW](https://github.com/SukkaW)! - Allow incorrect file path in extraneous deps check

- [#100](https://github.com/un-ts/eslint-plugin-import-x/pull/100) [`293fcf4`](https://github.com/un-ts/eslint-plugin-import-x/commit/293fcf43f30b11b51a6ad320abed23d2139659ba) Thanks [@SukkaW](https://github.com/SukkaW)! - feat: webpack comment regex support `webpackFetchPriority`

- [#85](https://github.com/un-ts/eslint-plugin-import-x/pull/85) [`ded3e80`](https://github.com/un-ts/eslint-plugin-import-x/commit/ded3e80fbf6eb2b4d0211a33c46b63496ddaca07) Thanks [@kosmotema](https://github.com/kosmotema)! - add languageOptions to ChildContext

- [#100](https://github.com/un-ts/eslint-plugin-import-x/pull/100) [`293fcf4`](https://github.com/un-ts/eslint-plugin-import-x/commit/293fcf43f30b11b51a6ad320abed23d2139659ba) Thanks [@SukkaW](https://github.com/SukkaW)! - Allow empty chunk name when webpackMode: 'eager' is set; add suggestions to remove name in eager mode

## 0.5.2

### Patch Changes

- [#93](https://github.com/un-ts/eslint-plugin-import-x/pull/93) [`64bf1a6`](https://github.com/un-ts/eslint-plugin-import-x/commit/64bf1a6be90c54a34115e83894de8b4e57ce6a33) Thanks [@SukkaW](https://github.com/SukkaW)! - fix: enable isolation parsing w/ typescript-eslint v8

## 0.5.1

### Patch Changes

- [#82](https://github.com/un-ts/eslint-plugin-import-x/pull/82) [`e29ba7f`](https://github.com/un-ts/eslint-plugin-import-x/commit/e29ba7fbfadb877b386160d9ecab290ef15fb899) Thanks [@unzico](https://github.com/unzico)! - fix: cannot find module 'tslib'

## 0.5.0

### Minor Changes

- [#66](https://github.com/un-ts/eslint-plugin-import-x/pull/66) [`49418a0`](https://github.com/un-ts/eslint-plugin-import-x/commit/49418a0352e77a88e00c0f4cdb98f87b8d3ab5b1) Thanks [@JounQin](https://github.com/JounQin)! - chore(dep)!: drop eslint <8.56 support

- [#66](https://github.com/un-ts/eslint-plugin-import-x/pull/66) [`49418a0`](https://github.com/un-ts/eslint-plugin-import-x/commit/49418a0352e77a88e00c0f4cdb98f87b8d3ab5b1) Thanks [@JounQin](https://github.com/JounQin)! - feat!: upgrade @typescript-eslint/utils to v7

## 0.4.4

### Patch Changes

- [#67](https://github.com/un-ts/eslint-plugin-import-x/pull/67) [`7a6145c`](https://github.com/un-ts/eslint-plugin-import-x/commit/7a6145c1d6d7fdf8b9610756e6c0bc4aa65ad36d) Thanks [@JounQin](https://github.com/JounQin)! - fix: only add `dependencies` when no `exported` found

## 0.4.3

### Patch Changes

- [#64](https://github.com/un-ts/eslint-plugin-import-x/pull/64) [`b858aee`](https://github.com/un-ts/eslint-plugin-import-x/commit/b858aee6b664be076c2c543543f36e6d9b653497) Thanks [@JounQin](https://github.com/JounQin)! - fix(export-map): incorrect internal `namespaces` info

## 0.4.2

### Patch Changes

- [#62](https://github.com/un-ts/eslint-plugin-import-x/pull/62) [`1dbb323`](https://github.com/un-ts/eslint-plugin-import-x/commit/1dbb323945ffb14332f59c3d17034c11d5ec90fd) Thanks [@JounQin](https://github.com/JounQin)! - feat: use eslint-compat-utils to support eslint v9 (not flat config yet)

## 0.4.1

### Patch Changes

- [#56](https://github.com/un-ts/eslint-plugin-import-x/pull/56) [`843cf49`](https://github.com/un-ts/eslint-plugin-import-x/commit/843cf494e0c58279d310b052c591c6952a024172) Thanks [@JounQin](https://github.com/JounQin)! - fix: known compatibility issues

## 0.4.0

### Minor Changes

- [#54](https://github.com/un-ts/eslint-plugin-import-x/pull/54) [`54d0c95`](https://github.com/un-ts/eslint-plugin-import-x/commit/54d0c95a6543be85094a9d21d07d327dc42e4ab0) Thanks [@JounQin](https://github.com/JounQin)! - chore!: bump node requirement (>=16), enable more lint rules

## 0.3.1

### Patch Changes

- [#51](https://github.com/un-ts/eslint-plugin-import-x/pull/51) [`f4ca4b5`](https://github.com/un-ts/eslint-plugin-import-x/commit/f4ca4b503389ef6aa35bee50452042eee13cf66f) Thanks [@JounQin](https://github.com/JounQin)! - refactor: migrate all remaining rules

- [#48](https://github.com/un-ts/eslint-plugin-import-x/pull/48) [`3d7a551`](https://github.com/un-ts/eslint-plugin-import-x/commit/3d7a551de617188079bf99c9478158adace02fac) Thanks [@JounQin](https://github.com/JounQin)! - refactor: migrate more rules

- [#50](https://github.com/un-ts/eslint-plugin-import-x/pull/50) [`de896f4`](https://github.com/un-ts/eslint-plugin-import-x/commit/de896f46b1e3d3bcc51015d2e0269e6ae80dc87d) Thanks [@JounQin](https://github.com/JounQin)! - refactor: migrate several rules

## 0.3.0

### Minor Changes

- [#42](https://github.com/un-ts/eslint-plugin-import-x/pull/42) [`6ee88e8`](https://github.com/un-ts/eslint-plugin-import-x/commit/6ee88e8b648e6d5b434a5d56d8c04ad41aa3d491) Thanks [@JounQin](https://github.com/JounQin)! - feat!: start TypeScript migration

### Patch Changes

- [#44](https://github.com/un-ts/eslint-plugin-import-x/pull/44) [`bbf46c3`](https://github.com/un-ts/eslint-plugin-import-x/commit/bbf46c302f4f2632e1d4b76c52101c8ed8c469c2) Thanks [@JounQin](https://github.com/JounQin)! - feat: migrate named rule and related usage

- [#45](https://github.com/un-ts/eslint-plugin-import-x/pull/45) [`dc3d48b`](https://github.com/un-ts/eslint-plugin-import-x/commit/dc3d48bb1893d5094c68ed4189029fabe8fe8ef3) Thanks [@JounQin](https://github.com/JounQin)! - refactor: migrate core utils

## 0.2.0

### Minor Changes

- [#38](https://github.com/un-ts/eslint-plugin-import-x/pull/38) [`3a5dab4`](https://github.com/un-ts/eslint-plugin-import-x/commit/3a5dab4b8f79e013016ab51d13b1f220d47fc06b) Thanks [@JounQin](https://github.com/JounQin)! - chore!: bump all upgradable (dev)Dependencies

- [#36](https://github.com/un-ts/eslint-plugin-import-x/pull/36) [`49e3cd2`](https://github.com/un-ts/eslint-plugin-import-x/commit/49e3cd2b1a1448be4db0e645493b5363f9761026) Thanks [@JounQin](https://github.com/JounQin)! - feat!: replace tsconfig-paths with get-tsconfig

### Patch Changes

- [#39](https://github.com/un-ts/eslint-plugin-import-x/pull/39) [`d0d36de`](https://github.com/un-ts/eslint-plugin-import-x/commit/d0d36de6ff4e7a118472eed41c94cef862d1f372) Thanks [@JounQin](https://github.com/JounQin)! - docs: update repository url

## 0.1.1

### Patch Changes

- [#34](https://github.com/un-ts/eslint-plugin-import-x/pull/34) [`a615826`](https://github.com/un-ts/eslint-plugin-import-x/commit/a6158264ce3cba829fe2de51c42a5d5ea042440d) Thanks [@JounQin](https://github.com/JounQin)! - chore: cleanup npm package content

## 0.1.0

### Minor Changes

- [#32](https://github.com/un-ts/eslint-plugin-import-x/pull/32) [`46ee54d`](https://github.com/un-ts/eslint-plugin-import-x/commit/46ee54d04d0eefa3ca0cb15325f547a047172daf) Thanks [@JounQin](https://github.com/JounQin)! - feat!: cleanup deps, remove unnecessary ponyfills
