import { z, ZodError } from "zod"

import { fetcher } from "@/lib/fetcher"
import { channelValidator } from "@/lib/validators/channel"
import { userValidator } from "@/lib/validators/user"

const schema = z.object({
  profile: userValidator,
  channels: z.array(channelValidator.omit({ owner: true })),
})

export async function getUser() {
  const response = await fetcher("/profile")

  const result = await response.json()

  if (!response.ok) throw JSON.stringify(result)

  return schema.parse(result)
}
