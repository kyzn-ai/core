"use client"

import { createElement, useEffect } from "react"
import { env } from "~/env"

export const StripePricingTable = () => {
    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://js.stripe.com/v3/pricing-table.js"
        script.async = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    return createElement("stripe-pricing-table", {
        "pricing-table-id": "prctbl_1Ob4EiKqrtkGWsyj4pfOVrd8",
        "publishable-key": true ? env.NEXT_PUBLIC_STRIPE_TEST_PK : env.NEXT_PUBLIC_STRIPE_PK
    })
}
