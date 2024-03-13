import { z } from "zod"

import { env } from "@/env.mjs"

type Credentials = {
  email: string
  password: string
  remember: boolean
}

const signInValidator = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export function useAuth() {
  async function signIn(credentials: Credentials) {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    })

    const data = await response.json()

    if (response.status !== 200) throw data

    return signInValidator.parse(data)
  }

  return { signIn }
}
