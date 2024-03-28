import { Notifications } from "@/types"
import {
  MutationOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query"

import { fetcher } from "@/lib/fetcher"
import { notificationsValidator } from "@/lib/validators/notifcations"

export function useGetNotificationsQuery() {
  return useSuspenseQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const result = await fetcher("/notifications")
      return notificationsValidator.parse(result)
    },
  })
}

export function useUpdateNotificationsMutation(
  opts?: MutationOptions<Notifications, Error, number>
) {
  return useMutation({
    mutationKey: ["notifications", "update"],
    mutationFn: async (private_chat_id) => {
      const result = await fetcher("/notifications", {
        method: "PUT",
        body: { private_chat_id },
      })
      return notificationsValidator.parse(result)
    },
    ...opts,
  })
}
