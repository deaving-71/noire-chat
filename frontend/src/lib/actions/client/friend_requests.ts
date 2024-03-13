import { fetcher } from "@/lib/fetcher"

export async function getFriendRequests() {
  const response = await fetcher("/friend-requests")

  const result = await response.json()

  if (!response.ok) throw JSON.stringify(result)

  return result
}
