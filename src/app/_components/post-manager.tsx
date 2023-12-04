/**
 * @file Used to create and deletes posts.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

"use client"

import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function PostManager() {
    //  Get the router so we can refresh the page

    const router = useRouter()

    //  Create some local state for the post content

    const [content, setContent] = useState("")

    //  Define some mutation functions, refreshing the page on success

    const createPost = api.posts.create.useMutation({
        onSuccess: () => {
            router.refresh()

            //  Clear the input field

            setContent("")
        }
    })

    const deleteAllPosts = api.posts.deleteAll.useMutation({
        //  Refresh the page content on success

        onSuccess: () => router.refresh()
    })

    return (
        <form
            onSubmit={e => {
                //  Prevent the page from refreshing

                e.preventDefault()
            }}
            className="flex w-full flex-col items-center justify-center gap-4"
        >
            {/* Input field for post content */}
            <input type="text" placeholder="Post something..." value={content} onChange={e => setContent(e.target.value)} className="w-full rounded-md border border-[#808080] border-opacity-50 bg-transparent px-4 py-2 text-white transition duration-500 ease-out-expo hover:border-opacity-100" />

            {/* Horizontal button container */}

            <div className="flex w-full items-center justify-center gap-2">
                {/* Create post */}

                <button type="submit" onClick={() => createPost.mutate({ content: content })} className="w-full rounded-md bg-gradient-to-tr from-[#DDDDDD] to-white px-4 py-2 text-left text-black no-underline transition duration-500 ease-out-expo hover:opacity-50" disabled={createPost.isLoading}>
                    {createPost.isLoading ? "Submitting..." : "Submit"}
                </button>

                {/* Delete all posts */}

                <button type="submit" onClick={() => deleteAllPosts.mutate()} className="w-full rounded-md bg-gradient-to-tr from-[#DD0000] to-red-500 px-4 py-2 text-left text-white no-underline transition duration-500 ease-out-expo hover:opacity-50" disabled={deleteAllPosts.isLoading}>
                    {!deleteAllPosts.isLoading ? "Delete all" : "Deleting..."}
                </button>
            </div>
        </form>
    )
}
