import { fetcher } from "@/lib/fetcher"
import { UserValidator } from "@/lib/validators"
import { OutgoingFriendRequest } from "@/lib/validators/friend_request"

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

  if (response.status === 400 || response.status === 404) throw result

  return OutgoingFriendRequest.parse(result)
}

export async function acceptFriendRequest(senderId: number) {
  const response = await fetcher("/friends", {
    method: "POST",
    body: { senderId },
  })

  const result = await response.json()

  if (!response.ok) throw JSON.stringify(result)

  if (response.status === 400 || response.status === 404) throw result

  return UserValidator.parse(result)
}

export async function removeFriendRequest(userId: number) {
  const response = await fetcher(`/friend-requests/${userId}`, {
    method: "DELETE",
  })

  if (!response.ok) throw "Internal server error"
}
