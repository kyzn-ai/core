/**
 * @file Bundles all of the utility functions into a single export for convenience.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo DEPRIORITIZED: Fix the environment variable import leak in the `sendVerificationRequest` utility function.
 */

export * from "./cn"
export * from "./create-display-url"
export * from "./create-sender-identity"
export * from "./format-duration"
export * from "./multi-project-schema"
export * from "./to-title-case"

//  You, sir, are very frustrating (investigate)

// export * from "~/utils/send-verification-request"
