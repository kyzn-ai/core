/**
 * @file Constructs a `NAME — ORGANIZATION <EMAIL>` identifier for outgoing emails.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { preferences } from "~/preferences"

interface SenderIdentityOptions {
    name?: string | null
    organization?: string | null
    email: string
}

export const createSenderIdentity = ({ name, organization = preferences.brand.displayName, email = preferences.brand.emails.support }: SenderIdentityOptions): string => {
    //  Check if the name is missing

    if (name !== null && !name) {
        name = email

            //  Grab the first part of the email address

            .split("@")[0]!
            //  Split the string into words by non-alphanumeric characters

            .split(/[^a-zA-Z0-9]/)

            //  Capitalize the first letter of each word

            .map(word => word.charAt(0).toUpperCase() + word.slice(1))

            //  Join the words back together

            .join(" ")
    }

    switch (true) {
        //  Name and organization
        case name !== null && organization !== null:
            return `${name} — ${organization} <${email}>`

        //  Name only
        case name !== null:
            return `${name} <${email}>`

        //  Organization only
        case organization !== null:
            return `${organization} <${email}>`

        //  No identifier
        default:
            return `<${email}>`
    }
}
