"use client"

import { useFriendsContext } from "@/context/friends_context"
import { useSocket } from "@/context/socket"
import { useStore } from "@/stores"
import { useFriends } from "@/stores/_friends"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { sendFriendRequest } from "@/lib/actions/client"
import logger from "@/lib/logger"
import { responseErrorValdiator } from "@/lib/validators/error"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, "Please enter a valid username"),
})

export function AddFriendForm() {
  const { appendOutgoingRequest } = useFriendsContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  const { mutate } = useMutation({
    mutationKey: ["friend_request", "send"],
    mutationFn: sendFriendRequest,
    onSuccess: appendOutgoingRequest,
    onError: (_error) => {
      const error = responseErrorValdiator.parse(_error)
      logger.error(error)
      form.setError("root", { message: error.message })
    },
  })

  function onSubmit({ username }: z.infer<typeof formSchema>) {
    mutate(username)
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
