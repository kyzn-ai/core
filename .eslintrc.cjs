/**
 * @file Configures ESLint.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo DEPRIORITIZED: Re-enable `explicit-function-return-type` and fix warnings.
 * @todo DEPRIORITIZED: Go through all eslint rules and configure them.
 * @type { import ( "eslint" ) .Linter.Config }
 */

const config = {
    parser: "@typescript-eslint/parser",
    parserOptions: { project: true },
    plugins: ["@typescript-eslint"],

    extends: ["plugin:@next/next/recommended", "plugin:@typescript-eslint/recommended-type-checked", "plugin:@typescript-eslint/stylistic-type-checked"],

    rules: {
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/consistent-type-definitions": "warn",

        "@typescript-eslint/consistent-type-imports": [
            "warn",

            {
                prefer: "type-imports",
                fixStyle: "inline-type-imports"
            }
        ],

        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

        "@typescript-eslint/require-await": "off",

        "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }],

        "lines-around-comment": ["warn", { beforeBlockComment: true }],
        "comma-dangle": ["warn", "never"],
        quotes: ["warn", "double", { avoidEscape: true }],
        indent: ["warn", 4, { SwitchCase: 1 }],
        "max-len": ["warn", { code: 9999 }]
        // "array-bracket-spacing": ["warn", "always"],
        // "space-in-parens": ["warn", "always"],
        // "space-before-function-paren": ["warn", "always"]
    }
}

module.exports = config
