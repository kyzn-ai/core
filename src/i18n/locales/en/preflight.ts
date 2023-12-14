/**
 * @file Copy for the campaigns and content that will be propagated pre-launch.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

export const preflight = {
    optIn: {
        opener: ({ firstName }: { firstName: string }) => `Hey ${firstName}! My name is Riley, and I’m an independent software dev. I’m building an app called AMNESIA that will allow you to communicate with the future version of yourself via SMS (it’s powered by the world’s leading AI). My goal with AMNESIA is to help you reach your truest potential and achieve your goals by providing motivation, helpful insights, secondary accountability, and infinite knowledge at your fingertips. \n\nIt’s not finished yet, but when it is it will be free to get started. \n\nCan I send you an invite when it’s ready? \n\nReply with “YES” to confirm.`,
        confirmation: "Thank you! I will send you an invite when it's ready./n/nIf you change your mind, you can reply with 'STOP' at any time to opt-out."
    },
    optOut: "Opt-out successful. You will no longer receive messages from AMNESIA."
}
