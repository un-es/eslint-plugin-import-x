// https://github.com/un-ts/eslint-plugin-import-x/issues/136
// Vite / Rollup might mangle exported functions' original name

function foo() {}

export { foo as default }
