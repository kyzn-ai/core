/**
 * @file An email for sending a magic link to a user to sign in.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Tailwind, Text } from "@react-email/components"
import * as React from "react"
import { env } from "~/env"
import { preferences } from "~/preferences"

/**
 * @description Hardcoded env and preferences objects for React Email previews.
 *
 * @remarks Comment out the imports from `~/env` and `~/preferences`, and uncomment the hardcoded `env` and `preferences` objects to use React Email previews.
 *
 * This is necessary since the React Email VSCode extenension's esbuild configuration does not recognize the `~/` alias, and has issues compiling the environment variables.
 *
 * React email is not working yet, so for now it is necessary to send a test email to see the result.
 */
// const env = {
//   BASE_URL: "https://test.com",
// }

// const preferences = {
//   brand: {
//     displayName: "TEST",
//     emails: {
//       support: "test@test.com",
//     },
//   },
// }

interface MagicLinkProps {
    authLink: string
    brandDisplayName?: string
    displayUrl?: string
    logoUrl?: string
    supportEmail?: string
    recipientFirstName?: string
    recipientEmail: string
    expires: Date
}

export function MagicLink({ authLink, brandDisplayName = preferences.brand.displayName, displayUrl = preferences.brand.urls.primary.absolute, logoUrl = `${env.BASE_URL}/logo.png`, supportEmail = preferences.brand.emails.support, recipientFirstName, recipientEmail, expires }: MagicLinkProps): JSX.Element {
    const preview = `Sign in to ${brandDisplayName}`

    return (
        <Html>
            <Head />

            <Preview>{preview}</Preview>

            <Tailwind>
                <Body className="mx-auto my-auto bg-white font-sans">
                    <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
                        <Section className="mt-[32px]">
                            <Img src={logoUrl} width="64" alt={brandDisplayName} className="mx-auto my-0" />
                        </Section>

                        <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
                            Sign in to <strong>{brandDisplayName}</strong>
                        </Heading>

                        <Text className="text-[14px] leading-[24px] text-black">
                            Hello
                            {recipientFirstName && ` ${recipientFirstName}`},
                        </Text>

                        <Text className="text-[14px] leading-[24px] text-black">
                            Your email address (
                            <Link href={`mailto:${recipientEmail}`} className="text-blue-600 no-underline">
                                {recipientEmail}
                            </Link>
                            ) was used to request an authentication link for <strong>{brandDisplayName}</strong>. This link will expire in {Math.floor(Math.max(0, (expires.getTime() - Date.now()) / (1000 * 60)))} minutes.
                        </Text>

                        <Section className="mb-[32px] mt-[32px] text-center">
                            <Button className="rounded bg-[#000000] px-6 py-3 text-center text-[12px] font-semibold text-white no-underline" href={authLink}>
                                Sign me in
                            </Button>
                        </Section>

                        <Text className="text-[14px] leading-[24px] text-black">
                            Or copy and paste this URL into your browser:{" "}
                            <Link href={authLink} className="break-all text-blue-600 no-underline">
                                {authLink}
                            </Link>
                        </Text>

                        <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

                        <Text className="text-[12px] leading-[24px] text-[#666666]">
                            If you were not expecting this request, you can ignore this email. Visit{" "}
                            <Link href={displayUrl} className="text-black no-underline">
                                {displayUrl}
                            </Link>{" "}
                            for more information, or get in touch with us at{" "}
                            <Link href={supportEmail} className="text-black no-underline">
                                {supportEmail}
                            </Link>
                            .
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
