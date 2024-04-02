import { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { useSocket } from "@/context/socket"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

import logger from "@/lib/logger"
import { useJoinChannel } from "@/hooks/channel"
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

const formSchema = z.object({
  slug: z.string().min(8, "Invalid channel code"),
})

export type ChannelFormAction = {
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function JoinChannelForm({ setOpen }: ChannelFormAction) {
  const { ws } = useSocket()
  const { refetch } = useGetProfileQuery()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
    },
  })

  const router = useRouter()
  const { mutate: joinChannel, isPending } = useJoinChannel({
    onSuccess: async () => {
      await refetch()
      const slug = form.getValues("slug")
      ws?.socket.emit("channel:join-room", slug)
      router.push(`/app/channel/${slug}`)
      toast.success(`Joined ${channel.name}`, { duration: 2000 })
      setOpen(false)
    },
    onError: (error) => {
      errorHandler(error, (parsedError) => {
        parsedError.errors.forEach((err) => {
          const { field, message } = err
          form.setError(field, { message })
        })
      })
    },
  })

  function onSubmit({ slug }: z.infer<typeof formSchema>) {
    if (isPending) return
    joinChannel(slug)
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
        <Button type="submit" className="w-28 font-medium" disabled={isPending}>
          {isPending ? <LoadingSpinner /> : "Join"}
        </Button>
      </form>
    </Form>
  )
}
