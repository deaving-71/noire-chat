import {
  MutationOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"

import { fetcher } from "@/lib/fetcher"
import {
  allPrivateChatsValidator,
  privateChatValidator,
} from "@/lib/validators/private-chat"

export function useGetAllPrivateChats() {
  return useSuspenseQuery({
    queryKey: ["all_private_chats"],
    queryFn: async () => {
      const result = await fetcher("/private-chats")
      return allPrivateChatsValidator.parse(result)
    },
  })
}

export function useGetPrivateChatQuery(id: string) {
  return useQuery({
    queryKey: ["private_chat", id],
    queryFn: async () => {
      const result = await fetcher(`/private-chats/${id}`)
      return privateChatValidator.parse(result)
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
