import { Channel } from "@/types"
import {
  MutationOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { z } from "zod"

import { fetcher } from "@/lib/fetcher"
import {
  channelMessageValidator,
  channelValidator,
} from "@/lib/validators/channel"
import { userValidator } from "@/lib/validators/user"

export const channelQueryDataSchema = z.object({
  channel: channelValidator,
  members: z.array(userValidator),
  messages: z.array(channelMessageValidator),
})

export function useGetChannelQuery(slug: string) {
  return useQuery({
    queryKey: ["channel", slug],
    queryFn: async () => {
      const result = await fetcher(`/channels/${slug}`)
      return channelQueryDataSchema.parse(result)
    },
  })
}

export function useCreateChannel(
  opts?: MutationOptions<Omit<Channel, "owner">, Error, string>
) {
  return useMutation({
    mutationKey: ["channel", "create"],
    mutationFn: async (name) => {
      const result = await fetcher(`/channels`, {
        method: "POST",
        body: { name },
      })
      return channelValidator.omit({ owner: true }).parse(result)
    },
    ...opts,
  })
}

export function useJoinChannel(
  opts?: MutationOptions<Omit<Channel, "owner">, Error, string>
) {
  return useMutation({
    mutationKey: ["channel", "join"],
    mutationFn: async (slug) => {
      const result = await fetcher(`/channel-member/${slug}`, {
        method: "PUT",
      })
      return channelValidator.omit({ owner: true }).parse(result)
    },
    ...opts,
  })
}

export function useMarkAsRead(opts?: MutationOptions<any, Error, number>) {
  return useMutation({
    mutationKey: ["channel", "update"],
    mutationFn: async (id) => {
      await fetcher(`/channels/${id}`, { method: "PUT" })
    },
    ...opts,
  })
}
