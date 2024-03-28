import {
  MutationOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query"

import { channelQueryDataSchema } from "@/lib/actions/_client"
import { fetcher } from "@/lib/fetcher"

export function useGetChannelQuery(slug: string) {
  return useSuspenseQuery({
    queryKey: ["channel", slug],
    queryFn: async () => {
      const result = await fetcher(`/channels/${slug}`)
      return channelQueryDataSchema.parse(result)
    },
  })
}

export function useMarkAsRead(opts?: MutationOptions<any, Error, number>) {
  return useMutation({
    mutationKey: ["channel", "update"],
    mutationFn: async (id) => {
      const result = await fetcher(`/channels/${id}`, { method: "PUT" })
      return result
    },
    ...opts,
  })
}
