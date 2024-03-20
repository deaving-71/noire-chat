import { zodResolver } from "@hookform/resolvers/zod"
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { joinChannel } from "@/lib/actions/client"
import logger from "@/lib/logger"
import { responseErrorValdiator } from "@/lib/validators/error"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { LoadingSpinner } from "../common"

const formSchema = z.object({
  slug: z.string().min(8, "Invalid channel code"),
})

export type ChannelFormAction = {
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>
}

export function JoinChannelForm({ refetch }: ChannelFormAction) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: joinChannel,
    onSuccess: () => {
      form.reset()
      refetch()
    },
    onError: (_error) => {
      const error = responseErrorValdiator.parse(_error)
      logger.error(error)
    },
  })

  function onSubmit({ slug }: z.infer<typeof formSchema>) {
    mutate(slug)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-28 font-medium">
          {isPending ? <LoadingSpinner /> : "Join"}
        </Button>
      </form>
    </Form>
  )
}
