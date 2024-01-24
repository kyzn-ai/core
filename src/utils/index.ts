/**
 * @file Bundles all of the utility functions into a single export for convenience.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo: Fix the environment variable import leak in the `sendVerificationRequest` utility function.
 */

export * from "./cn"
export * from "./create-display-url"
export * from "./create-sender-identity"
export * from "./custom-error"
export * from "./format-duration"
export * from "./multi-project-schema"
export * from "./resolve-trpc-error"
export * from "./to-title-case"
export * from "./to-kebab-case"
export * from "./unix-to-mysql-timestamp"
export * from "./validate-request"
export * from "./with-callback"
export * from "./escape-string"
export * from "./encode-multiline-string"
export * from "./parse-boolean-from-string"

//  You, sir, are very frustrating (investigate)

// export * from "~/utils/send-verification-request"
