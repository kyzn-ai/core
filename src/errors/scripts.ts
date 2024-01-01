/**
 * @file A custom class for script-related errors.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { CustomError } from "~/utils/custom-error"

/**
 * @description No script name was provided.
 */
type MissingScriptName = "MISSING_SCRIPT_NAME"

/**
 * @description The specified script was not found.
 */
type ScriptNotFound = "SCRIPT_NOT_FOUND"

/**
 * @description Multiple scripts were matched against the script search.
 */
type MultipleScriptsFound = "MULTIPLE_SCRIPTS_FOUND"

/**
 * @description Encountered an unknown error.
 */
type Unknown = "UNKNOWN"

/**
 * @description A union of all script-related error labels.
 */
type ScriptErrorName = MissingScriptName | ScriptNotFound | MultipleScriptsFound | Unknown

/**
 * @description An custom error class for script-related errors.
 */
export class ScriptError extends CustomError<ScriptErrorName> {}
