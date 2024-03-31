import {
  MutationOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { z } from "zod"

import { fetcher } from "@/lib/fetcher"

type Credentials = {
  email: string
  password: string
  remember: boolean
}

const authCheckSchema = z.object({
  isAuthenticated: z.boolean(),
})

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
    mutationKey: ["auth", "sign_out"],
    mutationFn: async () => {
      await fetcher("/auth/logout", { method: "DELETE" })
    },
    ...opts,
  })
}

export function useCheckAuthentication() {
  return useQuery({
    queryKey: ["auth", "check"],
    queryFn: async () => {
      const result = await fetcher("/auth")
      return authCheckSchema.parse(result)
    },
  })
}
