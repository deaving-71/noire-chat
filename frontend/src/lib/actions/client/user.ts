import { fetcher } from "@/lib/fetcher"

// TODO: validate data
export async function getUser() {
  const response = await fetcher("/profile")

  const result = await response.json()

  if (!response.ok) throw JSON.stringify(result)

  return result
}
