import { NextRequest } from "next/server"

import { env } from "@/env.mjs"

export async function checkAuthentication(requestHeaders: Headers) {
  try {
    const headers = new Headers(requestHeaders)

    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth`, {
      headers,
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Internal server error")
    }

    return (await response.text()) === "true"
  } catch (error) {
    console.error("Error verifying authentication:", error)
    return false // Default to not authenticated for error handling
  }
}
