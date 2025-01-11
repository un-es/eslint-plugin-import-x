/**
 * @fileOverview Rule to warn about importing a default export by different name
 * @author James Whitney
 * @author Sukka <https://skk.moe> - Port to TypeScript
 */

import path from 'node:path'

import type { TSESTree } from '@typescript-eslint/utils'

import { createRule, ExportMap, getValue } from '../utils'
import type { ModuleOptions } from '../utils'

type Options = ModuleOptions & {
  preventRenamingBindings?: boolean
}

type MessageId = 'renameDefault'

export = createRule<[Options?], MessageId>({
  name: 'no-rename-default',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid importing a default export by a different name.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          commonjs: {
            default: false,
            type: 'boolean',
          },
          preventRenamingBindings: {
            default: true,
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      renameDefault:
        'Caution: `{{importBasename}}` has a default export `{{defaultExportName}}`. This {{requiresOrImports}} `{{defaultExportName}}` as `{{importName}}`. Check if you meant to write `{{suggestion}}` instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    const { commonjs = false, preventRenamingBindings = true } =
      context.options[0] || {}

    function getDefaultExportName(
      targetNode:
        | TSESTree.ExportSpecifier
        | TSESTree.DefaultExportDeclarations
        | TSESTree.CallExpressionArgument,
    ) {
      if (targetNode == null) {
        return
      }
      switch (targetNode.type) {
        case 'AssignmentExpression': {
          if (!preventRenamingBindings) {
            // Allow assignments to be renamed when the `preventRenamingBindings`
            // option is set to `false`.
            //
            // export default Foo = 1;
            return
          }
          if (targetNode.left.type !== 'Identifier') {
            return
          }
          return targetNode.left.name
        }
        case 'CallExpression': {
          const [argumentNode] = targetNode.arguments
          return getDefaultExportName(argumentNode)
        }
        case 'ClassDeclaration': {
          if (targetNode.id && typeof targetNode.id.name === 'string') {
            return targetNode.id.name
          }
          // Here we have an anonymous class. We can skip here.
          return
        }
        case 'ExportSpecifier': {
          return getValue(targetNode.local)
        }
        case 'FunctionDeclaration': {
          return targetNode.id?.name
        }
        case 'Identifier': {
          if (!preventRenamingBindings) {
            // Allow identifier to be renamed when the `preventRenamingBindings`
            // option is set to `false`.
            //
            // const foo = 'foo';
            // export default foo;
            return
          }
          return targetNode.name
        }
        default:
        // This type of node is not handled.
        // Returning `undefined` here signifies this and causes the check to
        // exit early.
      }
    }

    function getExportMap(source: TSESTree.StringLiteral | null) {
      if (!source) {
        return
      }
      const exportMap = ExportMap.get(source.value, context)
      if (exportMap == null) {
        return
      }
      if (exportMap.errors.length > 0) {
        exportMap.reportErrors(context, { source })
        return
      }
      return exportMap
    }

    function handleImport(
      node: TSESTree.ImportDefaultSpecifier | TSESTree.ImportSpecifier,
    ) {
      const exportMap = getExportMap(node.parent.source)
      if (exportMap == null) {
        return
      }

      const defaultExportNode = getDefaultExportNode(exportMap)
      if (defaultExportNode == null) {
        return
      }

      const defaultExportName = getDefaultExportName(defaultExportNode)
      if (defaultExportName === undefined) {
        return
      }

      // Some packages have a default export that is meant to be renamed. For example,
      // "typescript-eslint" has a default export of "_default" and "eslint-plugin-jsdoc" has a
      // default export of "index".
      const defaultExportNameTrimmed = defaultExportName.replace(/^_+/, '') // Trim leading underscores.
      if (
        defaultExportNameTrimmed === 'default' ||
        defaultExportNameTrimmed == 'index'
      ) {
        return
      }

      const importTarget = node.parent.source?.value
      const importBasename = path.basename(exportMap.path)

      if (node.type === 'ImportDefaultSpecifier') {
        const importName = node.local.name

        if (importName === defaultExportName) {
          return
        }

        context.report({
          node,
          messageId: 'renameDefault',
          data: {
            importBasename,
            defaultExportName,
            importName,
            requiresOrImports: 'imports',
            suggestion: `import ${defaultExportName} from '${importTarget}'`,
          },
        })

        return
      }

      if (node.type !== 'ImportSpecifier') {
        return
      }

      if (getValue(node.imported) !== 'default') {
        return
      }

      const actualImportedName = node.local.name

      if (actualImportedName === defaultExportName) {
        return
      }

      context.report({
        node,
        messageId: 'renameDefault',
        data: {
          importBasename,
          defaultExportName,
          importName: actualImportedName,
          requiresOrImports: 'imports',
          suggestion: `import { default as ${defaultExportName} } from '${importTarget}'`,
        },
      })
    }

    function handleRequire(node: TSESTree.VariableDeclarator) {
      if (
        !commonjs ||
        node.type !== 'VariableDeclarator' ||
        !node.id ||
        !(node.id.type === 'Identifier' || node.id.type === 'ObjectPattern') ||
        !node.init ||
        node.init.type !== 'CallExpression'
      ) {
        return
      }

      let defaultDestructure
      if (node.id.type === 'ObjectPattern') {
        defaultDestructure = findDefaultDestructure(node.id.properties)
        if (defaultDestructure === undefined) {
          return
        }
      }

      const call = node.init
      const [source] = call.arguments

      if (
        call.callee.type !== 'Identifier' ||
        call.callee.name !== 'require' ||
        call.arguments.length !== 1 ||
        source.type !== 'Literal' ||
        typeof source.value !== 'string'
      ) {
        return
      }

      const exportMap = getExportMap(source)
      if (exportMap == null) {
        return
      }

      const defaultExportNode = getDefaultExportNode(exportMap)
      if (defaultExportNode == null) {
        return
      }

      const defaultExportName = getDefaultExportName(defaultExportNode)
      const requireTarget = source.value
      const requireBasename = path.basename(exportMap.path)

      let requireName
      if (node.id.type === 'Identifier') {
        requireName = node.id.name
      } else if (defaultDestructure?.value?.type === 'Identifier') {
        requireName = defaultDestructure.value.name
      } else {
        requireName = ''
      }

      if (defaultExportName === undefined) {
        return
      }

      if (requireName === defaultExportName) {
        return
      }

      if (node.id.type === 'Identifier') {
        context.report({
          node,
          messageId: 'renameDefault',
          data: {
            importBasename: requireBasename,
            defaultExportName,
            importName: requireName,
            requiresOrImports: 'requires',
            suggestion: `const ${defaultExportName} = require('${requireTarget}')`,
          },
        })
        return
      }

      context.report({
        node,
        messageId: 'renameDefault',
        data: {
          importBasename: requireBasename,
          defaultExportName,
          importName: requireName,
          requiresOrImports: 'requires',
          suggestion: `const { default: ${defaultExportName} } = require('${requireTarget}')`,
        },
      })
    }

    return {
      ImportDefaultSpecifier: handleImport,
      ImportSpecifier: handleImport,
      VariableDeclarator: handleRequire,
    }
  },
})

function findDefaultDestructure(
  properties: Array<TSESTree.Property | TSESTree.RestElement>,
) {
  const found = properties.find(property => {
    if (
      'key' in property &&
      'name' in property.key &&
      property.key.name === 'default'
    ) {
      return property
    }
  })
  return found
}

function getDefaultExportNode(
  exportMap: ExportMap,
): TSESTree.DefaultExportDeclarations | TSESTree.ExportSpecifier | undefined {
  const defaultExportNode = exportMap.exports.get('default')
  if (defaultExportNode == null) {
    return
  }
  switch (defaultExportNode.type) {
    case 'ExportDefaultDeclaration': {
      return defaultExportNode.declaration
    }
    case 'ExportNamedDeclaration': {
      return defaultExportNode.specifiers.find(
        specifier => getValue(specifier.exported) === 'default',
      )
    }
    default: {
      return
    }
  }
}
