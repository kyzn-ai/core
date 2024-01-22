/**
 * @file Defines a MySQL Drizzle schema for authentication-related data (using Auth.js).
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo: Consolidate database column name casing and conventions. Auth.js uses camelCase for its database rows while respecting the conventional snake_case formatting for OAuth-related values. The Drizzle adapter does not yet support forced casing conventions.
 * @todo: Extract each table into its own file.
 * @todo: Consider renaming all schema names to be singular, which would uphold the expressiveness of the table names.
 */

import { flows, llmConfigurations, messages, threads, usersToCampaigns } from "."
import { mysqlTable } from "~/utils"
import { relations } from "drizzle-orm"
import { index, int, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core"
import { type AdapterAccount } from "next-auth/adapters"
import { v4 as uuid } from "uuid"

//  A table for storing user data (required by Auth.js)

export const users = mysqlTable(
    //  The name of the table

    "user",

    {
        //  A column named "id" of type varchar with a maximum length of 255 characters, that is a primary key, defaults to a UUID string, and cannot be null (required by Auth.js)

        id: varchar("id", { length: 255 }).notNull().$defaultFn(uuid).primaryKey(),

        //  

        stripeId: varchar("stripe_id", { length: 255 }),

        //  A column named "name" of type varchar with a maximum length of 255 characters (required by Auth.js)

        name: varchar("name", { length: 255 }),

        //  A column named "email" of type varchar with a maximum length of 255 characters (required by Auth.js)

        email: varchar("email", { length: 255 }).unique(),

        //  A column named "phone" of type varchar with a maximum length of 255 characters

        phone: varchar("phone", { length: 15 }).unique(),

        //  A column named "emailVerified" of type timestamp with a default value of the current time (with fractional seconds precision of 3) (required by Auth.js)

        emailVerified: timestamp("emailVerified", {
            mode: "date",
            fsp: 3
        }),

        //  A column named "image" of type varchar with a maximum length of 255 characters (required by Auth.js)

        image: varchar("image", { length: 255 })
    },

    //  Accepts the user schema, and returns an object containing the table's indices

    user => ({
        //  An index named "email_idx" on the "email" column

        emailIdx: index("email_idx").on(user.email),

        //  An index named "phone_idx" on the "phone" column

        phoneIdx: index("phone_idx").on(user.phone)
    })
)

//  The relations for the "user" table

export const usersRelations = relations(users, ({ many }) => ({
    //  A many relation named "accounts" between the "user" and "account" tables — meaning that one user can have many associated accounts

    accounts: many(accounts),

    //  A many relation named "sessions" between the "user" and "session" tables — meaning that one user can have many associated sessions

    sessions: many(sessions),

    //  A many relation named "flows" between the "user" and "flow" tables — meaning that one user can have many associated flows

    flows: many(flows),

    //  A many relation named "usersToCampaigns" between the "user" and "user_to_campaign" tables — meaning that one user can have many associated campaigns, and one campaign can have many associated users

    campaigns: many(usersToCampaigns),

    //  One user can have many associated LLM configurations

    llmConfigurations: many(llmConfigurations),

    //

    threads: many(threads),

    //

    messages: many(messages)
}))

//  A table for storing account data (required by Auth.js)

export const accounts = mysqlTable(
    //  The name of the table

    "account",

    {
        //  A column named "userId" of type varchar with a maximum length of 255 characters, that cannot be null (required by Auth.js)

        userId: varchar("userId", { length: 255 }).notNull(),

        //  A column named "type" of type varchar with a maximum length of 255 characters, that cannot be null (required by Auth.js)

        type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),

        //  A column named "provider" of type varchar with a maximum length of 255 characters, that cannot be null (required by Auth.js)

        provider: varchar("provider", { length: 255 }).notNull(),

        //  A column named "providerAccountId" of type varchar with a maximum length of 255 characters, that cannot be null (required by Auth.js)

        providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),

        //  A column named "refresh_token" of type text (required by Auth.js)

        refresh_token: text("refresh_token"),

        //  A column named "access_token" of type text (required by Auth.js)

        access_token: text("access_token"),

        //  A column named "expires_at" of type int (required by Auth.js)

        expires_at: int("expires_at"),

        //  A column named "token_type" of type varchar with a maximum length of 255 characters (required by Auth.js)

        token_type: varchar("token_type", { length: 255 }),

        //  A column named "scope" of type varchar with a maximum length of 255 characters (required by Auth.js)

        scope: varchar("scope", { length: 255 }),

        //  A column named "id_token" of type text (required by Auth.js)

        id_token: text("id_token"),

        //  A column named "session_state" of type varchar with a maximum length of 255 characters (required by Auth.js)

        session_state: varchar("session_state", { length: 255 })
    },

    //  Accepts the account schema, and returns an object containing the table's indices

    account => ({
        //  A primary key named "compoundKey" on the "provider" and "providerAccountId" columns (required by Auth.js)

        compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),

        //  An index named "userId_idx" on the "userId" column

        userIdIdx: index("userId_idx").on(account.userId)
    })
)

//  The relations for the "account" table

export const accountsRelations = relations(accounts, ({ one }) => ({
    //  A one relation named "user" between the "account" and "user" tables — meaning that one account is associated with one user

    user: one(users, { fields: [accounts.userId], references: [users.id] })
}))

//  A table for storing session data (required by Auth.js)

export const sessions = mysqlTable(
    //  The name of the table

    "session",

    {
        //  A column named "sessionToken" of type varchar with a maximum length of 255 characters, that is a primary key and cannot be null (required by Auth.js)

        sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),

        //  A column named "userId" of type varchar with a maximum length of 255 characters, that cannot be null (required by Auth.js)

        userId: varchar("userId", { length: 255 }).notNull(),

        //  A column named "expires" of type timestamp, that cannot be null (required by Auth.js)

        expires: timestamp("expires", { mode: "date" }).notNull()
    },

    //  Accepts the session schema, and returns an object containing the table's indices

    session => ({
        //  An index named "userId_idx" on the "userId" column

        userIdIdx: index("userId_idx").on(session.userId)
    })
)

//  The relations for the "session" table

export const sessionsRelations = relations(sessions, ({ one }) => ({
    //  A one relation named "user" between the "session" and "user" tables — meaning that one session is associated with one user

    user: one(users, { fields: [sessions.userId], references: [users.id] })
}))

//  A table for storing verification token data (required by Auth.js)

export const verificationTokens = mysqlTable(
    //  The name of the table

    "verificationToken",

    {
        //  A column named "identifier" of type varchar with a maximum length of 255 characters, that cannot be null (required by Auth.js)

        identifier: varchar("identifier", { length: 255 }).notNull(),

        //  A column named "token" of type varchar with a maximum length of 255 characters, that cannot be null (required by Auth.js)

        token: varchar("token", { length: 255 }).notNull(),

        //  A column named "expires" of type timestamp, that cannot be null (required by Auth.js)

        expires: timestamp("expires", { mode: "date" }).notNull()
    },
    verificationToken => ({
        //  A primary key named "compoundKey" on the "identifier" and "token" columns (required by Auth.js)

        compoundKey: primaryKey({ columns: [verificationToken.identifier, verificationToken.token] })
    })
)
