/**
 * @file Constructs a `NAME <EMAIL>` identifier for outgoing emails.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { preferences } from "~/preferences"

export const createSenderIdentity = ({ displayName = preferences.brand.displayName, senderEmail = preferences.brand.emails.support }: { displayName?: string; senderEmail: string }): string => `${displayName} <${senderEmail}>`
