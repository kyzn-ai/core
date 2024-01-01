/**
 * @file Facilitates the running of script files from the CLI with the "pnpm use <PATH_TO_FILE>" command.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { ScriptError } from "~/errors/scripts"
import { matchFiles } from "~/utils/match-files"
import path from "path"

//  Get the script name from the command args

const script: string | undefined = process.argv[2]

try {
    //  If the script name is missing, throw an error

    if (!script)
        throw new ScriptError({
            name: "MISSING_SCRIPT_NAME",
            message: "Please provide a script name"
        })

    //  Get the file paths that match the script name in the current directory

    const matchedFiles: string[] = matchFiles({ against: script, in: path.dirname(new URL(import.meta.url).pathname) })

    //  Throw an error if no script was found, or if multiple conflicting script paths were found

    if (!matchedFiles.length)
        throw new ScriptError({
            name: "SCRIPT_NOT_FOUND",
            message: `No scripts were found matching the name "${script}"`
        })
    else if (matchedFiles.length !== 1)
        throw new ScriptError({
            name: "MULTIPLE_SCRIPTS_FOUND",
            message: `The script name "${script}" matched multiple files, please provide a more specific name or resolve the name conflict(s)`,
            cause: matchedFiles
        })

    //  Dynamically import & run the script

    await import("./" + matchedFiles[0])
} catch (error) {
    //  Log the error if known, else log an unknown error

    if (error instanceof ScriptError) console.error(error)
    else
        console.error(
            new ScriptError({
                name: "UNKNOWN",
                message: "Encountered an unknown error while executing the script",
                cause: error
            })
        )

    //  Exit the process

    process.exit(1)
}
