/**
 * @file Matches a string against the trailing end of all of the files in a directory (with and without their extensions), and returns an array of matched file paths.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import fs from "fs"
import path from "path"

/**
 * @description The options for the `matchFiles` function.
 */
export interface MatchFilesOptions {
    /**
     * @description The file name or path to match the files against.
     */
    against: string

    /**
     * @description The search directory path.
     */
    in: string
}

/**
 * @description Recursively scans all possible file paths in a directory, matching each against the provided comparison string. `matchFiles` is filetype insensitive, meaning an extension is not neccessary on the trailing end of the match string, but can be included for specificity.
 */
export function matchFiles({ against: matcher, in: searchDir }: MatchFilesOptions): string[] {
    //  Nested implementation to handle recursive calls

    function matchFiles(currentDir: string): string[] {
        //  Get all of the files in the current directory

        const files: string[] = fs.readdirSync(currentDir)

        //  Loop over all of the files, then filters out falsy values

        return files
            .flatMap(file => {
                //  Construct the full path to the file, and get the path stats

                const filePath = path.join(currentDir, file)
                const filePathWithoutExtension = path.join(currentDir, path.basename(file, path.extname(file)))
                const stats = fs.statSync(filePath)

                //  Check if the path is a directory

                if (stats.isDirectory()) {
                    //  Recursively scan nested directories, and return the result

                    return matchFiles(filePath)
                } else {
                    //  Check if the match path matches the file path, otherwise return undefined

                    if (filePath.endsWith(matcher) || filePathWithoutExtension.endsWith(matcher)) return [path.relative(searchDir, filePath)]
                    else return undefined
                }
            })
            .filter(Boolean) as string[]
    }

    // Call the nested function

    return matchFiles(searchDir)
}
