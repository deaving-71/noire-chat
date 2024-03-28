import { useSuspenseQuery } from "@tanstack/react-query"

import { fetcher } from "@/lib/fetcher"

export function useInbox() {
  return useSuspenseQuery({
    queryKey: ["private_chats"],
    queryFn: async () => {
      const result = await fetcher("/private-chats")
      return result
    },
  })
}
