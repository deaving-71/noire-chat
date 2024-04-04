"use client"

import { useRouter } from "next/navigation"
import { useSocket } from "@/context/socket"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

import { errorHandler } from "@/lib/error_handler"
import { useCreateChannel } from "@/hooks/channel"
import { useGetProfileQuery } from "@/hooks/profile"
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

export function CreateChannelForm({ setOpen }: ChannelFormAction) {
  const { ws } = useSocket()
  const { data: user } = useGetProfileQuery()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `${user.profile.username}'s channel`,
    },
  })

  const router = useRouter()
  const { refetch } = useGetProfileQuery()
  const { mutate: createChannel, isPending } = useCreateChannel({
    onSuccess: async (channel) => {
      await refetch()
      ws?.socket.emit("channel:join-room", channel.slug)
      router.push(`/app/channel/${channel.slug}`)
      toast.success(`${channel.name} created`, { duration: 2000 })
      setOpen(false)
    },
    onError: (error) => {
      errorHandler(error, (parsedError) => {
        parsedError.errors.forEach((err) => {
          const { field, message } = err
          // @ts-ignore
          form.setError(field, { message })
        })
      })
    },
  })

  function onSubmit({ name }: z.infer<typeof formSchema>) {
    if (isPending) return
    createChannel(name)
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
        <Button type="submit" className="w-28 font-medium" disabled={isPending}>
          {isPending ? <LoadingSpinner /> : "Create"}
        </Button>
      </form>
    </Form>
  )
}
