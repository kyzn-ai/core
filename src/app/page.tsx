/**
 * @file The home page for the app. This is the first thing that users will see when they navigate to our site.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { PostManager } from "~/app/_components/post-manager"
import { preferences } from "~/preferences"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"
import Image from "next/image"
import Link from "next/link"

export default async function Home() {
    //  Returns the current user's session if they are logged in

    const session = await getServerAuthSession()

    //  Some example tRPC queries to the experimental router

    const testQuery = await api.experimental.test.query({ fromClient: "request from client" + " | " })
    const protectedTestQuery = session?.user ? await api.experimental.protectedTest.query() : null

    return (
        <>
            {/* Default to "flex w-full flex-col items-center justify-center" on all divs */}

            <main className="flex min-h-screen w-full flex-col items-center justify-center">
                {/* Hero section */}

                <section className="flex w-full flex-col items-center justify-center gap-8 p-16">
                    {/* Logo image */}

                    <Image src={"/logo.png"} width={256} height={0} alt={`${preferences.brand.displayName} logo`} />

                    {/* Divider */}

                    <div className="flex h-px w-full max-w-[64px] flex-col items-center justify-center bg-[#808080] bg-opacity-25" />

                    {/* Test query wrapper */}

                    <div className="flex w-full flex-col items-center justify-center gap-4">
                        {/* Public query */}

                        <p className="rounded-md border border-[#808080] border-opacity-25 bg-gradient-to-tr from-black to-[#222222] px-4 py-2 font-mono">{testQuery?.fromServer ?? "Loading..."}</p>

                        {/* Protected query */}

                        <p className={`rounded-md border border-[#808080] border-opacity-25 bg-gradient-to-tr from-black to-[#222222] px-4 py-2 font-mono ${!!protectedTestQuery ? "text-[#0080FF]" : "text-red-500"}`}>
                            <span className="text-[#808080]">Secret message: </span>
                            {protectedTestQuery ?? "not authenticated"}
                        </p>
                    </div>

                    {/* Button + auth status container */}

                    <div className="flex w-full flex-col items-center justify-center gap-4">
                        {/* Authentication status */}

                        <p>{session && <span>Logged in as {session.user?.name}</span>}</p>

                        {/* Sign in button */}

                        <Link href={session ? "/api/auth/signout" : "/api/auth/signin"} className="rounded-md bg-gradient-to-tr from-[#DDDDDD] to-white px-8 py-2 text-black no-underline transition duration-500 ease-out-expo hover:opacity-50">
                            {session ? "Sign out" : "Sign in"}
                        </Link>
                    </div>

                    {/* Post creation example */}

                    <PostDemo />
                </section>
            </main>
        </>
    )
}

async function PostDemo() {
    //  Get auth session, returning null if the user is not logged in

    const session = await getServerAuthSession()
    if (!session?.user) return null

    //  Get the user's latest post

    const mostRecentPost = await api.posts.getMostRecent.query()

    return (
        <>
            {/* Divider */}

            <div className="flex h-px w-full max-w-[64px] flex-col items-center justify-center bg-[#808080] bg-opacity-25" />

            {/* Card */}

            <div className="flex w-full max-w-xs flex-col items-center justify-center gap-4 rounded-md border border-[#808080] border-opacity-25 p-4">
                {/* User's latest post */}

                <p className="w-full truncate py-2">
                    {!!mostRecentPost ? (
                        <>
                            <span className="font-bold">Recently: </span>
                            {mostRecentPost.content}
                        </>
                    ) : (
                        "No posts yet."
                    )}
                </p>

                {/* Create post form */}

                <PostManager />
            </div>
        </>
    )
}
