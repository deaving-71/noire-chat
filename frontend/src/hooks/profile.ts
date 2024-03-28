import { useSuspenseQuery } from "@tanstack/react-query"

import { fetcher } from "@/lib/fetcher"
import { profileValidator } from "@/lib/validators/user"

export function useGetProfileQuery() {
  return useSuspenseQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const result = await fetcher("/profile")
      return profileValidator.parse(result)
    },
  })
}
