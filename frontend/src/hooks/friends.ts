import { useSuspenseQuery } from "@tanstack/react-query"

import { fetcher } from "@/lib/fetcher"

export function useGetFriendsQuery() {
  return useSuspenseQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const result = await fetcher("/friends")
      return result
    },
  })
}
