import { fetcher } from "@/lib/fetcher"

export async function getFriendsList() {
  const response = await fetcher("/friends-list")

  const result = await response.json()

  if (!response.ok) throw JSON.stringify(result)

  return result
}
