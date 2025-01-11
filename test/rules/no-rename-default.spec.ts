import { RuleTester } from '@typescript-eslint/rule-tester'
import type { TestCaseError as TSESLintTestCaseError } from '@typescript-eslint/rule-tester'
import type { AST_NODE_TYPES } from '@typescript-eslint/utils'

import { parsers, createRuleTestCaseFunctions } from '../utils'
import type { GetRuleModuleMessageIds } from '../utils'

import rule from 'eslint-plugin-import-x/rules/no-rename-default'

const ruleTester = new RuleTester()

const { tValid, tInvalid } = createRuleTestCaseFunctions<typeof rule>()

function createRenameDefaultError(
  data: {
    importBasename: string
    defaultExportName: string
    requiresOrImports: string
    importName: string
    suggestion: string
  },
  type: `${AST_NODE_TYPES}`,
): TSESLintTestCaseError<GetRuleModuleMessageIds<typeof rule>> {
  return { messageId: 'renameDefault', data, type: type as AST_NODE_TYPES }
}

// IMPORT
// anonymous-arrow.js
// anonymous-arrow-async.js
// anonymous-class.js
// anonymous-object.js
// anonymous-primitive.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    `import _ from './no-rename-default/anonymous-arrow'`,
    `import _ from './no-rename-default/anonymous-arrow-async'`,
    `import _ from './no-rename-default/anonymous-class'`,
    `import _ from './no-rename-default/anonymous-object'`,
    `import _ from './no-rename-default/anonymous-primitive'`,

    // https://github.com/un-ts/eslint-plugin-import-x/issues/136
    test({
      code: '/** #136 */ import exportDefaultStringAndNamed from "./export-default-as-named-decl"',
    }),
  ],
  invalid: [],
})

// REQUIRE { commonjs: true }
// anonymous-arrow.js
// anonymous-arrow-async.js
// anonymous-class.js
// anonymous-object.js
// anonymous-primitive.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    tValid({
      code: `const _ = require('./no-rename-default/anonymous-arrow')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const _ = require('./no-rename-default/anonymous-arrow-async')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const _ = require('./no-rename-default/anonymous-class')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const _ = require('./no-rename-default/anonymous-object')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const _ = require('./no-rename-default/anonymous-primitive')`,
      options: [{ commonjs: true }],
    }),
  ],
  invalid: [],
})

// IMPORT
// assign-arrow.js
// assign-arrow-async.js
// assign-class.js
// assign-class-named.js
// assign-fn.js
// assign-fn-named.js
// assign-generator.js
// assign-generator-named.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    `import arrow from './no-rename-default/assign-arrow'`,
    `import arrowAsync from './no-rename-default/assign-arrow-async'`,
    `import User from './no-rename-default/assign-class'`,
    `import User from './no-rename-default/assign-class-named'`,
    `import fn from './no-rename-default/assign-fn'`,
    `import fn from './no-rename-default/assign-fn-named'`,
    `import generator from './no-rename-default/assign-generator'`,
    `import generator from './no-rename-default/assign-generator-named'`,
  ],
  invalid: [
    tInvalid({
      code: `import myArrow from './no-rename-default/assign-arrow'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-arrow.js',
            defaultExportName: 'arrow',
            requiresOrImports: 'imports',
            importName: 'myArrow',
            suggestion: "import arrow from './no-rename-default/assign-arrow'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import myArrowAsync from './no-rename-default/assign-arrow-async'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-arrow-async.js',
            defaultExportName: 'arrowAsync',
            requiresOrImports: 'imports',
            importName: 'myArrowAsync',
            suggestion:
              "import arrowAsync from './no-rename-default/assign-arrow-async'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import MyUser from './no-rename-default/assign-class'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-class.js',
            defaultExportName: 'User',
            requiresOrImports: 'imports',
            importName: 'MyUser',
            suggestion: "import User from './no-rename-default/assign-class'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import MyUser from './no-rename-default/assign-class-named'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-class-named.js',
            defaultExportName: 'User',
            requiresOrImports: 'imports',
            importName: 'MyUser',
            suggestion:
              "import User from './no-rename-default/assign-class-named'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import myFn from './no-rename-default/assign-fn'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-fn.js',
            defaultExportName: 'fn',
            requiresOrImports: 'imports',
            importName: 'myFn',
            suggestion: "import fn from './no-rename-default/assign-fn'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import myFn from './no-rename-default/assign-fn-named'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-fn-named.js',
            defaultExportName: 'fn',
            requiresOrImports: 'imports',
            importName: 'myFn',
            suggestion: "import fn from './no-rename-default/assign-fn-named'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import myGenerator from './no-rename-default/assign-generator'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-generator.js',
            defaultExportName: 'generator',
            requiresOrImports: 'imports',
            importName: 'myGenerator',
            suggestion:
              "import generator from './no-rename-default/assign-generator'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import myGenerator from './no-rename-default/assign-generator-named'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-generator-named.js',
            defaultExportName: 'generator',
            requiresOrImports: 'imports',
            importName: 'myGenerator',
            suggestion:
              "import generator from './no-rename-default/assign-generator-named'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
  ],
})

// IMPORT { preventRenamingBindings: false }
// assign-arrow.js
// assign-arrow-async.js
// assign-class.js
// assign-class-named.js
// assign-fn.js
// assign-fn-named.js
// assign-generator.js
// assign-generator-named.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    tValid({
      code: `import myArrow from './no-rename-default/assign-arrow'`,
      options: [{ preventRenamingBindings: false }],
    }),
    tValid({
      code: `import myArrowAsync from './no-rename-default/assign-arrow-async'`,
      options: [{ preventRenamingBindings: false }],
    }),
    tValid({
      code: `import MyUser from './no-rename-default/assign-class'`,
      options: [{ preventRenamingBindings: false }],
    }),
    tValid({
      code: `import MyUser from './no-rename-default/assign-class-named'`,
      options: [{ preventRenamingBindings: false }],
    }),
    tValid({
      code: `import myFn from './no-rename-default/assign-fn'`,
      options: [{ preventRenamingBindings: false }],
    }),
    tValid({
      code: `import myFn from './no-rename-default/assign-fn-named'`,
      options: [{ preventRenamingBindings: false }],
    }),
    tValid({
      code: `import myGenerator from './no-rename-default/assign-generator'`,
      options: [{ preventRenamingBindings: false }],
    }),
    tValid({
      code: `import myGenerator from './no-rename-default/assign-generator-named'`,
      options: [{ preventRenamingBindings: false }],
    }),
  ],
  invalid: [],
})

// REQUIRE { commonjs: true }
// assign-arrow.js
// assign-arrow-async.js
// assign-class.js
// assign-class-named.js
// assign-fn.js
// assign-fn-named.js
// assign-generator.js
// assign-generator-named.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    tValid({
      code: `const arrow = require('./no-rename-default/assign-arrow')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const arrowAsync = require('./no-rename-default/assign-arrow-async')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const User = require('./no-rename-default/assign-class')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const User = require('./no-rename-default/assign-class-named')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const fn = require('./no-rename-default/assign-fn')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const fn = require('./no-rename-default/assign-fn-named')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const generator = require('./no-rename-default/assign-generator')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const generator = require('./no-rename-default/assign-generator-named')`,
      options: [{ commonjs: true }],
    }),
  ],
  invalid: [
    tInvalid({
      code: `const myArrow = require('./no-rename-default/assign-arrow')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-arrow.js',
            defaultExportName: 'arrow',
            requiresOrImports: 'requires',
            importName: 'myArrow',
            suggestion:
              "const arrow = require('./no-rename-default/assign-arrow')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `const myArrowAsync = require('./no-rename-default/assign-arrow-async')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-arrow-async.js',
            defaultExportName: 'arrowAsync',
            requiresOrImports: 'requires',
            importName: 'myArrowAsync',
            suggestion:
              "const arrowAsync = require('./no-rename-default/assign-arrow-async')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `const MyUser = require('./no-rename-default/assign-class')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-class.js',
            defaultExportName: 'User',
            requiresOrImports: 'requires',
            importName: 'MyUser',
            suggestion:
              "const User = require('./no-rename-default/assign-class')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `const MyUser = require('./no-rename-default/assign-class-named')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-class-named.js',
            defaultExportName: 'User',
            requiresOrImports: 'requires',
            importName: 'MyUser',
            suggestion:
              "const User = require('./no-rename-default/assign-class-named')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `const myFn = require('./no-rename-default/assign-fn')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-fn.js',
            defaultExportName: 'fn',
            requiresOrImports: 'requires',
            importName: 'myFn',
            suggestion: "const fn = require('./no-rename-default/assign-fn')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `const myFn = require('./no-rename-default/assign-fn-named')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-fn-named.js',
            defaultExportName: 'fn',
            requiresOrImports: 'requires',
            importName: 'myFn',
            suggestion:
              "const fn = require('./no-rename-default/assign-fn-named')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `const myGenerator = require('./no-rename-default/assign-generator')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-generator.js',
            defaultExportName: 'generator',
            requiresOrImports: 'requires',
            importName: 'myGenerator',
            suggestion:
              "const generator = require('./no-rename-default/assign-generator')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `const myGenerator = require('./no-rename-default/assign-generator-named')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'assign-generator-named.js',
            defaultExportName: 'generator',
            requiresOrImports: 'requires',
            importName: 'myGenerator',
            suggestion:
              "const generator = require('./no-rename-default/assign-generator-named')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
  ],
})

// REQUIRE { commonjs: true, preventRenamingBindings: false }
// assign-arrow.js
// assign-arrow-async.js
// assign-class.js
// assign-class-named.js
// assign-fn.js
// assign-fn-named.js
// assign-generator.js
// assign-generator-named.js
ruleTester.run('no-renamed-default', rule, {
  valid: [
    tValid({
      code: `const myArrow = require('./no-rename-default/assign-arrow')`,
      options: [{ commonjs: true, preventRenamingBindings: false }],
    }),
    tValid({
      code: `const myArrowAsync = require('./no-rename-default/assign-arrow-async')`,
      options: [{ commonjs: true, preventRenamingBindings: false }],
    }),
    tValid({
      code: `const MyUser = require('./no-rename-default/assign-class')`,
      options: [{ commonjs: true, preventRenamingBindings: false }],
    }),
    tValid({
      code: `const MyUser = require('./no-rename-default/assign-class-named')`,
      options: [{ commonjs: true, preventRenamingBindings: false }],
    }),
    tValid({
      code: `const myFn = require('./no-rename-default/assign-fn')`,
      options: [{ commonjs: true, preventRenamingBindings: false }],
    }),
    tValid({
      code: `const myFn = require('./no-rename-default/assign-fn-named')`,
      options: [{ commonjs: true, preventRenamingBindings: false }],
    }),
    tValid({
      code: `const myGenerator = require('./no-rename-default/assign-generator')`,
      options: [{ commonjs: true, preventRenamingBindings: false }],
    }),
    tValid({
      code: `const myGenerator = require('./no-rename-default/assign-generator-named')`,
      options: [{ commonjs: true, preventRenamingBindings: false }],
    }),
  ],
  invalid: [],
})

// IMPORT
// class-user.js
ruleTester.run('no-rename-default', rule, {
  valid: [`import User from './no-rename-default/class-user'`],
  invalid: [
    tInvalid({
      code: `import MyUser from './no-rename-default/class-user'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'class-user.js',
            defaultExportName: 'User',
            requiresOrImports: 'imports',
            importName: 'MyUser',
            suggestion: "import User from './no-rename-default/class-user'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
  ],
})

// REQUIRE { commonjs: true }
// class-user.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    tValid({
      code: `const User = require('./no-rename-default/class-user')`,
      options: [{ commonjs: true }],
    }),
  ],
  invalid: [
    tInvalid({
      code: `const MyUser = require('./no-rename-default/class-user')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'class-user.js',
            defaultExportName: 'User',
            requiresOrImports: 'requires',
            importName: 'MyUser',
            suggestion:
              "const User = require('./no-rename-default/class-user')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
  ],
})

// IMPORT
// const-bar.js
// const-foo.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    `import foo from './no-rename-default/const-foo'`,
    `import { fooNamed1 } from './no-rename-default/const-foo'`,
    `import { fooNamed1, fooNamed2 } from './no-rename-default/const-foo'`,
    `import { default as foo } from './no-rename-default/const-foo'`,
    `import { default as foo, fooNamed1 } from './no-rename-default/const-foo'`,
    `import foo, { fooNamed1 } from './no-rename-default/const-foo'`,
    `
      import bar from './no-rename-default/const-bar'
      import foo from './no-rename-default/const-foo'
    `,
    `
      import bar, { barNamed1 } from './no-rename-default/const-bar'
      import foo, { fooNamed1 } from './no-rename-default/const-foo'
    `,
  ],
  invalid: [
    tInvalid({
      code: `import bar from './no-rename-default/const-foo'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'imports',
            importName: 'bar',
            suggestion: "import foo from './no-rename-default/const-foo'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import { default as bar } from './no-rename-default/const-foo'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'imports',
            importName: 'bar',
            suggestion:
              "import { default as foo } from './no-rename-default/const-foo'",
          },
          'ImportSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import { default as bar, fooNamed1 } from './no-rename-default/const-foo'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'imports',
            importName: 'bar',
            suggestion:
              "import { default as foo } from './no-rename-default/const-foo'",
          },
          'ImportSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import bar, { fooNamed1 } from './no-rename-default/const-foo'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'imports',
            importName: 'bar',
            suggestion: "import foo from './no-rename-default/const-foo'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import foo from './no-rename-default/const-bar'
        import bar from './no-rename-default/const-foo'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-bar.js',
            defaultExportName: 'bar',
            requiresOrImports: 'imports',
            importName: 'foo',
            suggestion: "import bar from './no-rename-default/const-bar'",
          },
          'ImportDefaultSpecifier',
        ),
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'imports',
            importName: 'bar',
            suggestion: "import foo from './no-rename-default/const-foo'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import findUsers from './no-rename-default/fn-get-users'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'fn-get-users.js',
            defaultExportName: 'getUsers',
            requiresOrImports: 'imports',
            importName: 'findUsers',
            suggestion:
              "import getUsers from './no-rename-default/fn-get-users'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import findUsersSync from './no-rename-default/fn-get-users-sync'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'fn-get-users-sync.js',
            defaultExportName: 'getUsersSync',
            requiresOrImports: 'imports',
            importName: 'findUsersSync',
            suggestion:
              "import getUsersSync from './no-rename-default/fn-get-users-sync'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import foo, { barNamed1 } from './no-rename-default/const-bar'
        import bar, { fooNamed1 } from './no-rename-default/const-foo'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-bar.js',
            defaultExportName: 'bar',
            requiresOrImports: 'imports',
            importName: 'foo',
            suggestion: "import bar from './no-rename-default/const-bar'",
          },
          'ImportDefaultSpecifier',
        ),
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'imports',
            importName: 'bar',
            suggestion: "import foo from './no-rename-default/const-foo'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
  ],
})

// REQUIRE { commonjs: true }
// const-bar.js
// const-foo.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    tValid({
      code: `const foo = require('./no-rename-default/const-foo')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const { fooNamed1 } = require('./no-rename-default/const-foo')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const { fooNamed1, fooNamed2 } = require('./no-rename-default/const-foo')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const { default: foo } = require('./no-rename-default/const-foo')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const { default: foo, fooNamed1 } = require('./no-rename-default/const-foo')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const foo = require('./no-rename-default/const-foo')
        const { fooNamed1 } = require('./no-rename-default/const-foo')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const getUsers = require('./no-rename-default/fn-get-users')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const getUsersSync = require('./no-rename-default/fn-get-users-sync')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `
        const bar = require('./no-rename-default/const-bar')
        const { barNamed1 } = require('./no-rename-default/const-bar')
        const foo = require('./no-rename-default/const-foo')
        const { fooNamed1 } = require('./no-rename-default/const-foo')
      `,
      options: [{ commonjs: true }],
    }),
  ],
  invalid: [
    tInvalid({
      code: `const bar = require('./no-rename-default/const-foo')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'requires',
            importName: 'bar',
            suggestion: "const foo = require('./no-rename-default/const-foo')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `const bar = require('./no-rename-default/const-foo')
        const { fooNamed1 } = require('./no-rename-default/const-foo')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'requires',
            importName: 'bar',
            suggestion: "const foo = require('./no-rename-default/const-foo')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `const { default: bar } = require('./no-rename-default/const-foo')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'requires',
            importName: 'bar',
            suggestion:
              "const { default: foo } = require('./no-rename-default/const-foo')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `const { default: bar, fooNamed1 } = require('./no-rename-default/const-foo')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'requires',
            importName: 'bar',
            suggestion:
              "const { default: foo } = require('./no-rename-default/const-foo')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `
        const foo = require('./no-rename-default/const-bar')
        const bar = require('./no-rename-default/const-foo')
      `,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-bar.js',
            defaultExportName: 'bar',
            requiresOrImports: 'requires',
            importName: 'foo',
            suggestion: "const bar = require('./no-rename-default/const-bar')",
          },
          'VariableDeclarator',
        ),
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'requires',
            importName: 'bar',
            suggestion: "const foo = require('./no-rename-default/const-foo')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `
        const foo = require('./no-rename-default/const-bar')
        const { barNamed1 } = require('./no-rename-default/const-bar')
        const bar = require('./no-rename-default/const-foo')
        const { fooNamed1 } = require('./no-rename-default/const-foo')
      `,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'const-bar.js',
            defaultExportName: 'bar',
            requiresOrImports: 'requires',
            importName: 'foo',
            suggestion: "const bar = require('./no-rename-default/const-bar')",
          },
          'VariableDeclarator',
        ),
        createRenameDefaultError(
          {
            importBasename: 'const-foo.js',
            defaultExportName: 'foo',
            requiresOrImports: 'requires',
            importName: 'bar',
            suggestion: "const foo = require('./no-rename-default/const-foo')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
  ],
})

// IMPORT
// fn-get-users.js
// fn-get-users-sync.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    `import getUsers from './no-rename-default/fn-get-users'`,
    `import getUsersSync from './no-rename-default/fn-get-users-sync'`,
  ],
  invalid: [
    tInvalid({
      code: `import findUsers from './no-rename-default/fn-get-users'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'fn-get-users.js',
            defaultExportName: 'getUsers',
            requiresOrImports: 'imports',
            importName: 'findUsers',
            suggestion:
              "import getUsers from './no-rename-default/fn-get-users'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
    tInvalid({
      code: `import findUsersSync from './no-rename-default/fn-get-users-sync'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'fn-get-users-sync.js',
            defaultExportName: 'getUsersSync',
            requiresOrImports: 'imports',
            importName: 'findUsersSync',
            suggestion:
              "import getUsersSync from './no-rename-default/fn-get-users-sync'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
  ],
})

// REQUIRE { commonjs: true }
// fn-get-users.js
// fn-get-users-sync.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    tValid({
      code: `const getUsers = require('./no-rename-default/fn-get-users')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const getUsersSync = require('./no-rename-default/fn-get-users-sync')`,
      options: [{ commonjs: true }],
    }),
  ],
  invalid: [
    tInvalid({
      code: `const findUsers = require('./no-rename-default/fn-get-users')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'fn-get-users.js',
            defaultExportName: 'getUsers',
            requiresOrImports: 'requires',
            importName: 'findUsers',
            suggestion:
              "const getUsers = require('./no-rename-default/fn-get-users')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
    tInvalid({
      code: `const findUsersSync = require('./no-rename-default/fn-get-users-sync')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'fn-get-users-sync.js',
            defaultExportName: 'getUsersSync',
            requiresOrImports: 'requires',
            importName: 'findUsersSync',
            suggestion:
              "const getUsersSync = require('./no-rename-default/fn-get-users-sync')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
  ],
})

// IMPORT
// generator-reader.js
ruleTester.run('no-rename-default', rule, {
  valid: [`import reader from './no-rename-default/generator-reader'`],
  invalid: [
    tInvalid({
      code: `import myReader from './no-rename-default/generator-reader'`,
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'generator-reader.js',
            defaultExportName: 'reader',
            requiresOrImports: 'imports',
            importName: 'myReader',
            suggestion:
              "import reader from './no-rename-default/generator-reader'",
          },
          'ImportDefaultSpecifier',
        ),
      ],
    }),
  ],
})

// REQUIRE { commonjs: true }
// generator-reader.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    tValid({
      code: `const reader = require('./no-rename-default/generator-reader')`,
      options: [{ commonjs: true }],
    }),
  ],
  invalid: [
    tInvalid({
      code: `const myReader = require('./no-rename-default/generator-reader')`,
      options: [{ commonjs: true }],
      errors: [
        createRenameDefaultError(
          {
            importBasename: 'generator-reader.js',
            defaultExportName: 'reader',
            requiresOrImports: 'requires',
            importName: 'myReader',
            suggestion:
              "const reader = require('./no-rename-default/generator-reader')",
          },
          'VariableDeclarator',
        ),
      ],
    }),
  ],
})

//------------------------------------------------------------------------------
// PR_FEEDBACK
//------------------------------------------------------------------------------

// IMPORT
// binding-const-rename-fn.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    `import foo from './no-rename-default/pr-3006-feedback/binding-const-rename-fn'`,
  ],
  invalid: [],
})

// REQUIRE { commonjs: true }
// binding-const-rename-fn.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    tValid({
      code: `const foo = require('./no-rename-default/pr-3006-feedback/binding-const-rename-fn')`,
      options: [{ commonjs: true, preventRenamingBindings: false }],
    }),
  ],
  invalid: [],
})

// IMPORT
// binding-hoc-with-logger-for-foo.js
// binding-hoc-with-logger-for-get-users.js
// binding-hoc-with-logger-with-auth-for-get-users.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    `import foo from './no-rename-default/pr-3006-feedback/binding-hoc-with-logger-for-foo'`,
    `import getUsers from './no-rename-default/pr-3006-feedback/binding-hoc-with-logger-for-get-users'`,
    `import getUsers from './no-rename-default/pr-3006-feedback/binding-hoc-with-logger-with-auth-for-get-users'`,
  ],
  invalid: [],
})

// REQUIRE { commonjs: true }
// binding-hoc-with-logger-for-foo.js
// binding-hoc-with-logger-for-get-users.js
// binding-hoc-with-logger-with-auth-for-get-users.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    tValid({
      code: `const foo = require('./no-rename-default/pr-3006-feedback/binding-hoc-with-logger-for-foo')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const getUsers = require('./no-rename-default/pr-3006-feedback/binding-hoc-with-logger-for-get-users')`,
      options: [{ commonjs: true }],
    }),
    tValid({
      code: `const getUsers = require('./no-rename-default/pr-3006-feedback/binding-hoc-with-logger-with-auth-for-get-users')`,
      options: [{ commonjs: true }],
    }),
  ],
  invalid: [],
})

// IMPORT { preventRenamingBindings: false }
// binding-fn-rename.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    tValid({
      code: `import _ from './no-rename-default/pr-3006-feedback/binding-fn-rename'`,
      options: [{ preventRenamingBindings: false }],
    }),
  ],
  invalid: [],
})

// REQUIRE { commonjs: true, preventRenamingBindings: false }
// binding-fn-rename.js
ruleTester.run('no-rename-default', rule, {
  valid: [
    tValid({
      code: `const _ = require('./no-rename-default/pr-3006-feedback/binding-fn-rename')`,
      options: [{ commonjs: true, preventRenamingBindings: false }],
    }),
  ],
  invalid: [],
})

describe('TypeScript', function () {
  ruleTester.run('no-rename-default', rule, {
    valid: [
      tValid({
        code: `import foo from './no-rename-default/typescript-default'`,
        settings: {
          'import-x/parsers': { [parsers.TS]: ['.ts'] },
          'import-x/resolver': { 'eslint-import-resolver-typescript': true },
        },
      }),
    ],
    invalid: [],
  })
})
