import { z } from "zod"

import { fetcher } from "@/lib/fetcher"
import {
  channelMembersValidator,
  channelMessageValidator,
  channelValidator,
} from "@/lib/validators/channel"

export const channelQueryDataSchema = z.object({
  channel: channelValidator,
  members: channelMembersValidator,
  messages: z.array(channelMessageValidator),
})

export async function getChannel(slug: string) {
  const response = await fetcher(`/channels/${slug}`)

  const result = await response.json()

  if (!response.ok) throw JSON.stringify(result)

  return channelQueryDataSchema.parse(result)
}
