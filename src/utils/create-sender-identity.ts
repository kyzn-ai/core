/**
 * @file Constructs a `NAME — ORGANIZATION <EMAIL>` identifier for outgoing emails.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { preferences } from "~/preferences"

interface SenderIdentityOptions {
    name?: string
    organization?: string
    email: string
}

export const createSenderIdentity = ({ name, organization = preferences.brand.displayName, email = preferences.brand.emails.support }: SenderIdentityOptions): string => {
    //  Check if the name is missing

    if (!name) {
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

    return `${name} — ${organization} <${email}>`
}
