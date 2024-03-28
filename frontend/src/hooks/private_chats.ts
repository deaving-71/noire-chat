import {
  MutationOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query"

import { fetcher } from "@/lib/fetcher"

export function useGetPrivateChatQuery(id: string) {
  return useSuspenseQuery({
    queryKey: ["private_chat", id],
    queryFn: async () => {
      const result = await fetcher(`/private-chats/${id}`)
      return result
    },
  })
}

export function useInitiatePrivateChat(
  opts: MutationOptions<string, Error, number>
) {
  return useMutation({
    mutationKey: ["private_chat", "initiate"],
    mutationFn: async (id) => {
      const result = await fetcher(`/private-chats?receiverId=${id}`, {
        method: "POST",
      })
      return result
    },
    ...opts,
  })
}
