import type { RuleContext } from '../types'

export default function sourceType(context: RuleContext) {
  if ('languageOptions' in context && context.languageOptions) {
    if (
      'parserOptions' in context.languageOptions &&
      context.languageOptions.parserOptions &&
      context.languageOptions.parserOptions.sourceType
    ) {
      return context.languageOptions.parserOptions.sourceType
    }
    if (context.languageOptions.sourceType) {
      return context.languageOptions.sourceType
    }
  }
  if (context.parserOptions.sourceType) {
    return context.parserOptions.sourceType
  }
}
