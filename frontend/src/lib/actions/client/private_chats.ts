import { fetcher } from "@/lib/fetcher"
import { privateChatValidator } from "@/lib/validators"

export async function initiateChat(id: number) {
  const response = await fetcher(`/private-chats?receiverId=${id}`, {
    method: "POST",
  })

  if (!response.ok) throw JSON.stringify(await response.json())

  const result = await response.text()
  return result
}

export async function getPrivateChats() {
  const response = await fetcher("/private-chats")

  const result = await response.json()

  if (!response.ok) throw JSON.stringify(result)

  return result
}

export async function getPrivateChat(id: string) {
  const response = await fetcher(`/private-chats/${id}`)

  const result = await response.json()

  if (!response.ok) throw JSON.stringify(result)

  return result
  // return privateChatValidator.parse(result)
}
