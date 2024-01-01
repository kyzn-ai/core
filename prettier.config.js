/**
 * @file A formatting configuration for Prettier.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @see https://prettier.io/docs/en/options.html
 */

/**
 * @type { import ( "prettier" ) .Config & import ( "prettier-plugin-tailwindcss" ) .PluginOptions }
 */
export default {
    arrowParens: "avoid",
    plugins: ["prettier-plugin-tailwindcss"],
    printWidth: 9999,
    semi: false,
    singleQuote: false,
    tabWidth: 4,
    trailingComma: "none"
}
