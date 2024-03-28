import { z } from "zod"

import { fetcher } from "@/lib/fetcher"
import { outgoingFriendRequest } from "@/lib/validators/friend_request"
import { userValidator } from "@/lib/validators/user"

export async function getFriendRequests() {
  const response = await fetcher("/friend-requests")

  const result = await response.json()

  if (!response.ok) throw JSON.stringify(result)

  return result
}

export async function sendFriendRequest(receiverUsername: string) {
  const response = await fetcher("/friend-requests", {
    method: "POST",
    body: { receiverUsername },
  })

  const result = await response.json()

  if (!response.ok) throw JSON.stringify(result)

  return outgoingFriendRequest.parse(result)
}

export async function acceptFriendRequest(senderId: number) {
  const response = await fetcher("/friends", {
    method: "POST",
    body: { senderId },
  })

  const result = await response.json()

  if (!response.ok) throw JSON.stringify(result)

  return userValidator.parse(result)
}

export async function removeFriendRequest(userId: number, isSender: boolean) {
  const response = await fetcher(`/friend-requests/${userId}`, {
    method: "DELETE",
    body: { isSender },
  })

  if (!response.ok) throw "Internal server error"
}
