import { MutationOptions, useMutation, useQuery } from "@tanstack/react-query"
import { z } from "zod"

import { fetcher } from "@/lib/fetcher"
import { formSchema as signupFormSchema } from "@/app/auth/sign-up/page"

type Credentials = {
  email: string
  password: string
  remember: boolean
}

const authCheckSchema = z.object({
  isAuthenticated: z.boolean(),
})

export function useSignUp(
  opts?: MutationOptions<void, Error, z.infer<typeof signupFormSchema>>
) {
  return useMutation({
    mutationKey: ["auth", "sign_up"],
    mutationFn: async (values) => {
      await fetcher("/auth/register", {
        method: "POST",
        body: values,
      })
    },
    ...opts,
  })
}

export function useSignIn(opts?: MutationOptions<void, Error, Credentials>) {
  return useMutation({
    mutationKey: ["auth", "sign_in"],
    mutationFn: async (credentials) => {
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
    refetchInterval: 1000 * 60 * 13.8, //? set refetch interval earlier than the expiry duration of the session
  })
}
