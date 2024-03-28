import { MutationOptions, useMutation } from "@tanstack/react-query"

import { fetcher } from "@/lib/fetcher"

type Credentials = {
  email: string
  password: string
  remember: boolean
}

export function useSignIn(opts?: MutationOptions<void, Error, Credentials>) {
  return useMutation({
    mutationKey: ["auth", "sign_in"],
    mutationFn: async (credentials: Credentials) => {
      await fetcher("/auth/login", {
        method: "POST",
        body: credentials,
      })
    },
    ...opts,
  })
}

export function useSignOut(opts?: MutationOptions) {
  return useMutation({
    mutationKey: ["auth", "sign_in"],
    mutationFn: async () => {
      await fetcher("/auth/logout", { method: "DELETE" })
    },
    ...opts,
  })
}
