"use client"

import { useSocket } from "@/context/socket"
import { useFriends } from "@/stores/friends"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import logger from "@/lib/logger"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, "Please enter a valid username"),
})

export function AddFriendForm() {
  const { appendOutgoingRequest } = useFriends()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  const { ws } = useSocket()

  async function onSubmit({ username }: z.infer<typeof formSchema>) {
    ws?.sendFriendRequest(username, (res) => {
      if (res.success) {
        logger.info(res.data)
        appendOutgoingRequest(res.data)
      } else {
        logger.error(res.errors)
        logger.error(res.message)
        form.setError("root", { message: res.message })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-2.5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-semibold leading-none tracking-tight">
          Add Friend
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter username to send a friend request.
        </p>
        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl className="flex items-center gap-2">
                <div>
                  <Input {...field} className="flex-1" />
                  <Button
                    type="submit"
                    className="basis-[80px]"
                    size="sm"
                    disabled={!form.formState.isValid}
                  >
                    Send
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
