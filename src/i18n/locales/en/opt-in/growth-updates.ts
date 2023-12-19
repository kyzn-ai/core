/**
 * @file Copy for opting in to updates about the growth of AMNESIA.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

export const growthUpdates = {
    introduction: 'Hey! My name is Riley, and I’m an independent software dev. I’m building an app called AMNESIA that will allow you to communicate with the future version of yourself via SMS (it’s powered by the world’s leading AI). My goal with AMNESIA is to help you reach your potential and achieve your goals by providing motivation, helpful insights, secondary accountability, and infinite knowledge at your fingertips. \n\nIt’s not finished yet, but when it is it will be free to get started. \n\nCan I send you an invite when it’s ready? \n\nReply with “YES” to confirm. \n\nBy opting in, you will also receive updates about new features and launches. If you change your mind, you can reply with "UNSUBSCRIBE" at any time to opt-out.',
    confirmation: {
        success: "Sweet! I will send you an invite when it’s ready. \n\nJust so that I can remember you better, can you provide me your name?",
        failure: "Sorry, I didn’t get that. Please reply with “YES” to opt-in to updates."
    },
    name: {
        success: ({ firstName }: { firstName: string }) => `Thank you ${firstName}. \n\nOne last thing — what’s your email address? I’ll link it to your account so that you have a seamless experience when you first sign in.`,
        failure: "Sorry, I didn’t get anything. Please reply with your name."
    },
    email: {
        success: "Perfect! That’s all I need at the moment. Thanks for your support! 🙏",
        failure: {
            generic: "Sorry, I couldn’t understand that. Please reply with a valid email address.",
            duplicateData: "That email is associated with an existing account. Please provide a different email."
        }
    },
    complete: "You’re locked in! I’ll send you an invite when AMNESIA is ready. That’s all for now.",
    unsubscribe: "Opt-out successful. You will no longer receive updates from AMNESIA.",
    resubscribe: "You have previously unsubscribed from updates from AMNESIA. If you would like to opt back in, please reply with “YES” to confirm."
}
