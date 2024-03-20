import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { createChannel } from "@/lib/actions/client"
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
import { ChannelFormAction } from "./join_channel_form"

const formSchema = z.object({
  name: z.string().min(2, "Channel name must be at least 2 characters"),
})

export function CreateChannelForm({ refetch }: ChannelFormAction) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createChannel,
    onSuccess: () => {
      form.reset()
      refetch()
    },
    onError: (_error) => {
      const error = responseErrorValdiator.parse(_error)
      logger.error(error)
    },
  })

  function onSubmit({ name }: z.infer<typeof formSchema>) {
    mutate(name)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-28 font-medium">
          {isPending ? <LoadingSpinner /> : "Create"}
        </Button>
      </form>
    </Form>
  )
}
