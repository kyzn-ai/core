/**
 * @file Configures the options for Prettier (that is, the few that exist).
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @see https://prettier.io/docs/en/options.html
 */

/**
 * @type { import ( "prettier" ) .Config & import ( "prettier-plugin-tailwindcss" ) .PluginOptions }
 */
export default {
    singleQuote: false,
    semi: false,
    arrowParens: "avoid",
    trailingComma: "none",
    tabWidth: 4,
    printWidth: 9999,
    plugins: ["prettier-plugin-tailwindcss"]
}
