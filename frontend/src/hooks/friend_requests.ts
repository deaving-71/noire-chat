import type { OutgoingFriendRequest, User } from "@/types"
import { MutationOptions, useMutation } from "@tanstack/react-query"

import { fetcher } from "@/lib/fetcher"
import { outgoingFriendRequest } from "@/lib/validators/friend_request"
import { userValidator } from "@/lib/validators/user"

export function useSendFriendRequest(
  opts?: MutationOptions<OutgoingFriendRequest, Error, string>
) {
  return useMutation({
    mutationKey: ["friend_request", "send"],
    mutationFn: async (receiverUsername) => {
      const result = await fetcher("/friend-requests", {
        method: "POST",
        body: { receiverUsername },
      })

      return outgoingFriendRequest.parse(result)
    },
    ...opts,
  })
}

export function useAcceptFriendRequest(
  opts?: MutationOptions<User, Error, number>
) {
  return useMutation({
    mutationKey: ["friend_request", "accept"],
    mutationFn: async (senderId) => {
      const result = await fetcher("/friends", {
        method: "POST",
        body: { senderId },
      })

      return userValidator.parse(result)
    },
    ...opts,
  })
}

export function useDeleteFriendRequest(
  opts?: MutationOptions<void, Error, { userId: number; isSender: boolean }>
) {
  return useMutation({
    mutationKey: ["friend_request", "delete"],
    mutationFn: async ({ userId, isSender }) => {
      return await fetcher(`/friend-requests/${userId}`, {
        method: "DELETE",
        body: { isSender },
      })
    },
    ...opts,
  })
}
