/**
 * @file Types and helpers related to characters and cases.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

/**
 * @description All of the letters in the alphabet.
 */
export type AllLetters = "abcdefghijklmnopqrstuvwxyz"

/**
 * @description All of the numbers from zero to nine.
 */
export type AllNumbers = "1234567890"

/**
 * @description A character set of lowercase letters.
 */
export type LowercaseAlphabeticalCharSet = CharSet<Lowercase<AllLetters>>

/**
 * @description A character set of uppercase letters.
 */
export type UppercaseAlphabeticalCharSet = CharSet<Uppercase<AllLetters>>

/**
 * @description A character set of lowercase and uppercase letters.
 */
export type AlphabeticalCharSet = LowercaseAlphabeticalCharSet | UppercaseAlphabeticalCharSet

/**
 * @description A character set of numbers.
 */
export type NumericCharSet = CharSet<AllNumbers>

/**
 * @description A character set of lowercase letters and numbers.
 */
export type LowercaseAlphanumericCharSet = LowercaseAlphabeticalCharSet | NumericCharSet

/**
 * @description A character set of uppercase letters and numbers.
 */
export type UppercaseAlphanumericCharSet = UppercaseAlphabeticalCharSet | NumericCharSet

/**
 * @description A character set of lowercase letters, uppercase letters, and numbers.
 */
export type AlphanumericCharSet = LowercaseAlphabeticalCharSet | UppercaseAlphabeticalCharSet | NumericCharSet

/**
 * @description A character set of lowercase letters, numbers, and a hyphen.
 */
export type KebabCaseCharSet = LowercaseAlphabeticalCharSet | NumericCharSet | "-"

/**
 * @description Creates a set of characters from a string.
 */
export type CharSet<CharStr> = CharSetHelper<CharStr, never>

/**
 * @description An internal implementation Use `CharSet` instead.
 * @remarks This abstraction is necessary to eliminate tail-recursion caused by the conditional used in this type.
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types
 */
export type CharSetHelper<CharStr, Acc> = CharStr extends `${infer Char}${infer Rest}` ? CharSetHelper<Rest, Char | Acc> : Acc
