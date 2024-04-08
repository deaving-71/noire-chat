"use client"

import { Dispatch, SetStateAction } from "react"
import { FriendRequests, FriendsList } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

import { appendOutgoingFriendRequest } from "@/lib/actions/friend_requests"
import logger from "@/lib/logger"
import { useSendFriendRequest } from "@/hooks/friend_requests"
import { useGetFriendsQuery } from "@/hooks/friends"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { LoadingSpinner } from "../common"

type AddFriendFormProps = {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const formSchema = z.object({
  username: z.string().min(2, "Please enter a valid username"),
})

export function AddFriendForm({ setOpen }: AddFriendFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
  const queryClient = useQueryClient()
  const { data } = useGetFriendsQuery()

  const { mutate: sendFriendRequest, isPending } = useSendFriendRequest({
    onSuccess: (request) => {
      queryClient.setQueryData(
        ["friends"],
        appendOutgoingFriendRequest(data, request)
      )

      toast.success("Friend request sent")
      setOpen(false)
    },
    onError: (error) => {
      logger.error(error)
      form.setError("root", { message: error.message })
    },
  })

  function onSubmit({ username }: z.infer<typeof formSchema>) {
    if (isPending) return

    sendFriendRequest(username)
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
                    disabled={!form.formState.isValid && isPending}
                  >
                    {isPending ? <LoadingSpinner /> : "Send"}
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
