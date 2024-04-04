import { useSuspenseQuery } from "@tanstack/react-query"
import { z } from "zod"

import { fetcher } from "@/lib/fetcher"
import { friendsRequestsValidator } from "@/lib/validators/friend_request"
import { friendsValidator } from "@/lib/validators/friends"

const querySchema = z.object({
  friends: friendsValidator,
  friend_requests: friendsRequestsValidator,
})

export function useGetFriendsQuery() {
  return useSuspenseQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const result = await fetcher("/friends")
      return querySchema.parse(result)
    },
  })
}
